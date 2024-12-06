import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000,
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
api.interceptors.request.use(config => {
  console.log('API Request Config:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    hasAuthHeader: !!config.headers['Authorization']
  });
  return config;
});

// Add response interceptor for retries
api.interceptors.response.use(null, async error => {
  console.log('API Error Details:', {
    message: error.message,
    code: error.code,
    isNetworkError: error.message === 'Network Error',
    config: error.config ? {
      url: error.config.url,
      method: error.config.method,
      baseURL: error.config.baseURL,
      hasAuthHeader: !!error.config?.headers?.['Authorization']
    } : 'No config'
  });

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
  let content = "hello";
  if (assignment.name === "SAT Practice Test") {
    content = "According to botanists, a viburnum plant experiencing insect damage may develop erineum—adiscolored, felty growth—on its leaf blades. A ______viburnum plant, on the other hand, will have leaveswith smooth surfaces and uniformly greencoloration.Which choice completes the text with the mostlogical and precise word or phrase?A) strugglingB) beneficialC) simpleD) healthy2Nigerian American author Teju Cole’s ______ hitwo passions—photography and the writtenword—culminates in his 2017 book, Blind Spot,which evocatively combines his original photographsfrom his travels with his poetic prose.Which choice completes the text with the mostlogical and precise word or phrase?A) indifference toB) enthusiasm forC) concern aboutD) surprise at Novelist N. K. Jemisin declines to ______ the conventions of the science fiction genre in which she writes, and she has suggested that her readers appreciate her work precisely because of this willingness to thwart expectations and avoid formulaic plots and themes. Which choice completes the text with the most logical and precise word or phrase? A) question B) react to C) perceive D) conform to In Nature Poem (2017), Kumeyaay poet Tommy Pico portrays his ______ the natural world by honoring the centrality of nature within his tribe’s traditional beliefs while simultaneously expressing his distaste for being in wilderness settings himself. Which choice completes the text with the most logical and precise word or phrase? A) responsiveness to B) ambivalence toward C) renunciation of D) mastery over. Assume the student answered A to all questions the correct answers are D, B, D, A. Give a breakdown of wrong and right answers and feedback for each.";
  }
  console.log("assignment",assignment);
  try {
    // Check if API key is present
    console.log(process.env.OPENAI_API_KEY);
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert SAT paper grader providing feedback on student answers."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      };
    

    onProgress?.('Sending request to Chat API...');
    console.log('Making Chat API request with payload:', {
      model: payload.model,
      messageCount: payload.messages.length,
      temperature: payload.temperature,
      max_tokens: payload.max_tokens
    });
    
    const response = await api.post('/chat/completions', payload);
    console.log('Chat API response received');
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Chat API error:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      isNetworkError: error.message === 'Network Error'
    });
    throw error;
  }
};
