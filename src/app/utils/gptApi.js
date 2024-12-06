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

    let compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    let base64 = await FileSystem.readAsStringAsync(compressed.uri, {
      encoding: FileSystem.EncodingType.Base64
    });

    if (base64.length > 1000000) { // ~1MB
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
  let systemPrompt = "";
  let userPrompt = "";

  // Custom prompts for each assignment
  switch (assignment.name) {
    case "SAT Practice Test":
      systemPrompt = "You are an expert SAT paper grader providing feedback on student answers.";
      userPrompt = `
        The student answered the following SAT questions. Here are their answers:
        1. Answer: A
        2. Answer: A
        3. Answer: A
        4. Answer: A

        Correct answers are:
        1. D
        2. B
        3. D
        4. A

        Provide detailed feedback on each question, explaining why the student's answer is correct or incorrect.
      `;
      break;

    case "Handwritten Essay":
      systemPrompt = "You are an experienced teacher grading handwritten essays.";
      userPrompt = `
        Here is a transcription of the student's handwritten essay:
        Essay is an essay on the benefits and drawbacks of cursive handwriting. 

        Provide feedback focusing on grammar, structure, coherence, and creativity. Highlight areas where the student excels and areas needing improvement.
      `;
      break;

    case "Typed Essay":
      systemPrompt = "You are an experienced teacher grading typed essays.";
      userPrompt = `
        Here is the student's typed essay:
        ctive Essay:
The process of researching and writing my essay "The Peace-Loving Preachers of War:
Understanding the American Clergy's Shift to Interventionism in the First World War" provided
me with a valuable opportunity to not just learn about a specific topic in history but to develop a
unique contribution to that topic. My project began with the broad desire to learn more about the
way in which the Christian religion interacted with and influenced the First World War. Over the
course of a semester, that spark of interest led me to discover the fascinating subject of the
American clergy's evolving support for their nation's intervention and to develop my own
original arguments on the nature of this ideological development.
As typical for any project, the research for this paper involved a long process of
elimination and rejection. Due to the broad focus with which I started, I spent dozens of hours
reading through letters, poems, and memoirs from soldiers in the hope that I could discover
patterns and trends pertaining to the spiritual convictions of those serving on the front lines
during the Great War. Likewise, I scoured collections of wartime posters and propaganda in
search of religious themes and iconography. Although both searches yielded interesting
discoveries, I ultimately concluded that the lack of secondary sources available for these topics
made them too impenetrable for a single semester-long study. For two weeks, I also
experimented with a cross-cultural comparison of Christianity as a motivating factor in the
United States and England during the war. Through discussions with Dr. Barnwell, who oversaw
my research, I eventually concluded that broadening my focus beyond America would create too
m a n y c h a l l e n g e s f o r t h i s l e n g t h o f p r o j e c t .

        Provide detailed feedback on grammar, structure, coherence, and style. Offer suggestions for improvement and praise for strengths in the essay.
      `;
      break;

    default:
      throw new Error("Unknown assignment type");
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    onProgress?.("Sending request to Chat API...");
    console.log("Making Chat API request with payload:", {
      model: payload.model,
      messageCount: payload.messages.length,
      temperature: payload.temperature,
      max_tokens: payload.max_tokens,
    });
    
    const response = await api.post('/chat/completions', payload);
    console.log("Chat API response received");
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Chat API error:", {
      message: error.message,
      code: error.code,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : "No response",
    });
    throw error;
  }
};
