import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for retries
api.interceptors.response.use(null, async error => {
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    console.log('Request timed out, retrying...');
    const config = error.config;
    try {
      return await api.request(config);
    } catch (retryError) {
      return Promise.reject(retryError);
    }
  }
  return Promise.reject(error);
});

const getFileType = (file) => {
  if (file.mimeType) return file.mimeType;
  if (file.type) return file.type;
  
  const extension = file.uri.split('.').pop().toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

const compressImage = async (uri, onProgress) => {
  try {
    onProgress?.('Compressing image...');
    console.log('Starting image compression');

    // First try with moderate compression
    let compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Get base64
    let base64 = await FileSystem.readAsStringAsync(compressed.uri, {
      encoding: FileSystem.EncodingType.Base64
    });

    // If still too large, compress more aggressively
    if (base64.length > 1000000) { // If larger than ~1MB
      onProgress?.('Image still large, applying additional compression...');
      compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 600 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      base64 = await FileSystem.readAsStringAsync(compressed.uri, {
        encoding: FileSystem.EncodingType.Base64
      });
    }

    console.log('Compressed image size:', Math.round(base64.length / 1024), 'KB');
    return base64;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const generateFeedback = async (file, student, assignment, onProgress) => {
  try {
    onProgress?.('Starting file processing...');
    console.log('Processing file:', file.name);

    if (!file.uri) {
      throw new Error('No file URI provided');
    }

    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    const fileType = getFileType(file);
    console.log('File type:', fileType);
    console.log('File size:', fileInfo.size, 'bytes');

    // For images and PDFs, use GPT-4 Vision API
    if (fileType.startsWith('image/') || fileType === 'application/pdf') {
      onProgress?.('Processing document...');
      console.log('Using GPT-4 Vision API');
      try {
        let finalBase64;
        
        if (fileType.startsWith('image/')) {
          finalBase64 = await compressImage(file.uri, onProgress);
        } else {
          // For PDFs, read directly as base64
          onProgress?.('Reading PDF content...');
          try {
            finalBase64 = await FileSystem.readAsStringAsync(file.uri, {
              encoding: FileSystem.EncodingType.Base64
            });
          } catch (error) {
            console.error('Error reading PDF:', error);
            throw new Error('Unable to read PDF file. The file might be corrupted or inaccessible.');
          }
        }
        
        onProgress?.('Preparing API request...');
        const payload = {
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `Please analyze this student submission and provide feedback. This is ${student?.name}'s work for ${assignment?.name}. ${fileType === 'application/pdf' ? 'This is a PDF document' : 'This is an image'}. Please read the content and provide detailed feedback on the writing, focusing on: 
                  1. Content clarity and organization
                  2. Main arguments or points made
                  3. Areas for improvement
                  4. Specific suggestions for enhancement`
                },
                { 
                  type: "image_url", 
                  url: `data:${fileType};base64,${finalBase64}` 
                }
              ]
            }
          ],
          max_tokens: 500
        };

        onProgress?.('Sending request to Vision API...');
        console.log('Making Vision API request...');
        const response = await api.post('/chat/completions', payload);
        console.log('Vision API response received');
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error('Vision API error:', error);
        
        if (error.response?.status === 413) {
          throw new Error('Document is too large. Please try with a smaller file.');
        } else if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
        } else if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else if (error.message.includes('Unable to read PDF')) {
          throw error;
        }
        throw new Error('Error processing document. Please try again or use a different format.');
      }
    } else {
      // For text files, use Chat API
      onProgress?.('Processing document...');
      console.log('Using Chat API');
      try {
        let fileContent = await FileSystem.readAsStringAsync(file.uri);
        
        if (fileContent.length > 4000) {
          console.log('Text content too large, truncating...');
          onProgress?.('Truncating large text content...');
          fileContent = fileContent.substring(0, 4000) + '\n[Content truncated due to length...]';
        }

        const payload = {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful teaching assistant that provides detailed feedback on student submissions. Focus on content clarity, organization, main arguments, and specific suggestions for improvement."
            },
            {
              role: "user",
              content: `Please analyze this student submission and provide feedback. This is ${student?.name}'s work for ${assignment?.name}. Here is the content:\n\n${fileContent}\n\nPlease provide detailed feedback focusing on:
              1. Content clarity and organization
              2. Main arguments or points made
              3. Areas for improvement
              4. Specific suggestions for enhancement`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        };

        onProgress?.('Sending request to Chat API...');
        console.log('Making Chat API request...');
        const response = await api.post('/chat/completions', payload);
        console.log('Chat API response received');
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error('Chat API error:', error);
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
        } else if (error.response?.status === 413) {
          throw new Error('Document is too large. Please try with a smaller file or a different format.');
        } else if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error('Error processing document. Please try again or use a different format.');
      }
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.response.config?.url
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};