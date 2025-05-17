import axios from 'axios';
import { getUserData } from '../auth/authApi';

export interface ImageGenerationInput {
  prompt: string;
  negative_prompt?: string;
  seed?: number;
  cfg_scale?: number;
  sampler_index?: string;
  num_inference_steps?: number;
  restore_faces?: boolean;
  override_settings?: {
    sd_model_checkpoint?: string;
  };
}

export interface MediaGenerationResponse {
  success: boolean;
  data?: {
    url: string;
    title: string;
    description?: string;
  };
  error?: string;
  id?: string;
  status?: string;
}

const api = axios.create({
  baseURL: 'https://api.runpod.ai/v2/btcnkr38yjxlmu',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { isAuthenticated } = getAuthState();
  
  if (isAuthenticated) {
    config.headers['X-Authenticated'] = 'true';
  }
  
  return config;
});

export const getAuthState = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false };
  
  try {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    return { isAuthenticated };
  } catch (error) {
    console.error('Failed to parse auth state:', error);
    return { isAuthenticated: false };
  }
};

const base64ToUrl = (base64: string, mediaType: 'image' | 'video'): string => {
  const prefix = mediaType === 'image' ? 'data:image/png;base64,' : 'data:video/mp4;base64,';
  return base64.startsWith('data:') ? base64 : `${prefix}${base64}`;
};
const generateTitle = (prompt: string): string => {
  const words = prompt.split(' ');
  if (words.length <= 3) return prompt;
  
  return words.slice(0, Math.min(5, Math.ceil(words.length / 3)))
    .join(' ')
    .replace(/[,.!?;:]$/, '')
    + '...';
};

export async function generateImage(
  prompt: string | undefined,
  settings: {
    style?: string;
    aspectRatio?: string;
    autoTitle?: boolean;
    autoDescription?: boolean;
    guidanceScale?: number;
    inferenceSteps?: number;
    excludeText?: string;
  } = {}
): Promise<MediaGenerationResponse> {
  try {
    if (!prompt) {
      return {
        success: false,
        error: 'Prompt is required for image generation',
      };
    }

    const userData = getUserData();
    const email = userData?.email || '';

    if (!email) {
      return {
        success: false,
        error: 'User authentication required',
      };
    }

    const payload = {
      input: {
        api_name: 'txt2img',
        prompt,
        restore_faces: true,
        negative_prompt: settings.excludeText || '',
        seed: Math.floor(Math.random() * 4294967295),
        override_settings: {
          sd_model_checkpoint: ''
        },
        cfg_scale: settings.guidanceScale || 4,
        sampler_index: 'DDIM',
        num_inference_steps: settings.inferenceSteps || 50,
        email
      }
    };

    const response = await api.post('/runsync', payload);
    
    if (response.data.status === 'IN_QUEUE') {
      return {
        success: true,
        id: response.data.id,
        status: 'pending',
        data: {
          url: '/placeholder-image.png',
          title: 'Generating image...',
          description: 'Your image is being generated. Please wait.'
        }
      };
    } else if (response.data.output && response.data.output.images && response.data.output.images.length > 0) {
      const base64Image = response.data.output.images[0];
      const imageUrl = base64ToUrl(base64Image, 'image');
      
      return {
        success: true,
        data: {
          url: imageUrl,
          title: settings.autoTitle ? generateTitle(prompt) : 'Generated Image',
          description: settings.autoDescription ? prompt : undefined
        }
      };
    } else {
      console.error('Unexpected API response format:', response.data);
      return {
        success: false,
        error: 'Unexpected API response format'
      };
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function checkGenerationStatus(id: string): Promise<MediaGenerationResponse> {
  try {
    const response = await api.get(`/status/${id}`);
    
    if (response.data.status === 'COMPLETED' && 
        response.data.output && 
        response.data.output.images && 
        response.data.output.images.length > 0) {
      
      const base64Image = response.data.output.images[0];
      const imageUrl = base64ToUrl(base64Image, 'image');
      
      return {
        success: true,
        data: {
          url: imageUrl,
          title: 'Generated Image',
          description: 'Image generated successfully'
        }
      };
    } else if (response.data.status === 'IN_PROGRESS' || response.data.status === 'IN_QUEUE') {
      return {
        success: true,
        status: 'pending',
        id: id
      };
    } else {
      return {
        success: false,
        error: `Generation failed with status: ${response.data.status}`
      };
    }
  } catch (error) {
    console.error('Error checking generation status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
