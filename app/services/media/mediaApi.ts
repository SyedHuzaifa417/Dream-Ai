import axios from 'axios';
import { getCurrentUserEmail, getAuthHeaders } from '../auth/authApi';

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

export interface ImageToImageInput {
  image: File;
  prompt: string;
  go_fast?: boolean;
  guidance?: number;
  megapixels?: string;
  num_outputs?: number;
  aspect_ratio?: string;
  output_format?: string;
  output_quality?: number;
  prompt_strength?: number;
  num_inference_steps?: number;
}

export interface ImageToVideoInput {
  image: File;
  prompt: string;
  max_area?: string;
  fast_mode?: 'Balanced' | 'Speed' | 'Quality';
  lora_scale?: number;
  num_frames?: number;
  sample_shift?: number;
  sample_steps?: number;
  frames_per_second?: number;
  sample_guide_scale?: number;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    Object.keys(headers).forEach(key => {
      config.headers[key] = headers[key];
    });

    // Don't override content-type for FormData
    if (config.data instanceof FormData) {
      // Remove content-type to let the browser set it with boundary
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    aspectRatio?: string;
    autoTitle?: boolean;
    autoDescription?: boolean;
    num_inference_steps?: number;
    seed?: number;
  } = {}
): Promise<MediaGenerationResponse> {
  try {
    const email = getCurrentUserEmail();
    if (!email) {
      console.error('User not authenticated');
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!prompt) {
      return {
        success: false,
        error: 'Prompt is required for image generation',
      };
    }

    const payload = {
      prompt,
      aspect_ratio: settings.aspectRatio || '1:1',
      num_inference_steps: settings.num_inference_steps || 4,
      seed: settings.seed || Math.floor(Math.random() * 4294967295)
    };

    const response = await api.post('/api/generate-image', payload);
    
    if (response.data.status === 'success' && response.data.image_url) {
      return {
        success: true,
        data: {
          url: response.data.image_url,
          title: settings.autoTitle ? generateTitle(prompt) : 'Generated Image',
          description: settings.autoDescription ? prompt : undefined
        }
      };
    } else {
      console.error('Unexpected API response format:', response.data);
      return {
        success: false,
        error: response.data.message || 'Unexpected API response format'
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

export async function generateVideo(
  prompt: string | undefined,
  settings: {
    fast_mode?: 'Balanced' | 'Speed' | 'Quality';
    num_frames?: number;
    aspect_ratio?: string;
    sample_shift?: number;
    sample_steps?: number;
    frames_per_second?: number;
    sample_guide_scale?: number;
    autoTitle?: boolean;
    autoDescription?: boolean;
  } = {}
): Promise<MediaGenerationResponse> {
  try {
    if (!prompt) {
      return {
        success: false,
        error: 'Prompt is required for video generation',
      };
    }


    const email = getCurrentUserEmail();
    if (!email) {
      console.error('User not authenticated');
      return {
        success: false,
        error: 'User authentication required',
      };
    }

    const payload = {
      prompt,
      fast_mode: settings.fast_mode || 'Balanced',
      num_frames: settings.num_frames || 81,
      aspect_ratio: settings.aspect_ratio || '16:9',
      sample_shift: settings.sample_shift || 5,
      sample_steps: settings.sample_steps || 30,
      frames_per_second: settings.frames_per_second || 16,
      sample_guide_scale: settings.sample_guide_scale || 5
    };


    const response = await api.post('/api/generate-video', payload);
    
    if (response.data.status === 'success' && response.data.video_url) {
      return {
        success: true,
        data: {
          url: response.data.video_url,
          title: settings.autoTitle ? generateTitle(prompt) : 'Generated Video',
          description: settings.autoDescription ? prompt : undefined
        }
      };
    } else {
      console.error('Unexpected API response format:', response.data);
      return {
        success: false,
        error: response.data.message || 'Unexpected API response format'
      };
    }
  } catch (error) {
    console.error('Error generating video:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateImageToImage(
  image: File | null,
  prompt: string,
  settings: {
    aspectRatio?: string;
    autoTitle?: boolean;
    autoDescription?: boolean;
    go_fast?: boolean;
    guidance?: number;
    megapixels?: string;
    num_outputs?: number;
    output_format?: string;
    output_quality?: number;
    prompt_strength?: number;
    num_inference_steps?: number;
  } = {}
): Promise<MediaGenerationResponse> {
  try {
    const email = getCurrentUserEmail();
    if (!email) {
      console.error('User not authenticated');
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!image) {
      return {
        success: false,
        error: 'Image is required for image-to-image generation',
      };
    }

    if (!prompt) {
      return {
        success: false,
        error: 'Prompt is required for image-to-image generation',
      };
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);
    formData.append('go_fast', (settings.go_fast !== undefined ? settings.go_fast : true).toString());
    formData.append('guidance', String(settings.guidance || 3.5));
    formData.append('megapixels', settings.megapixels || '1');
    formData.append('num_outputs', String(settings.num_outputs || 1));
    
    let aspectRatio = '1:1';
    if (settings.aspectRatio) {
      switch (settings.aspectRatio.toLowerCase()) {
        case 'square':
          aspectRatio = '1:1';
          break;
        case 'landscape':
          aspectRatio = '16:9';
          break;
        case 'portrait':
          aspectRatio = '9:16';
          break;
        case 'wide':
          aspectRatio = '4:3';
          break;
        case 'tall':
          aspectRatio = '3:4';
          break;
        default:
          if (/^\d+:\d+$/.test(settings.aspectRatio)) {
            aspectRatio = settings.aspectRatio;
          }
      }
    }
    formData.append('aspect_ratio', aspectRatio);
    
    formData.append('output_format', settings.output_format || 'webp');
    formData.append('output_quality', String(settings.output_quality || 80));
    formData.append('prompt_strength', String(settings.prompt_strength || 0.8));
    formData.append('num_inference_steps', String(settings.num_inference_steps || 28));

    
    const response = await api.post('/api/image-to-image', formData, {
      headers: {
        'X-User-Email': email
      }
    });
    
    if (response.data.status === 'success' && response.data.image_url) {
      return {
        success: true,
        data: {
          url: response.data.image_url,
          title: settings.autoTitle ? generateTitle(prompt) : 'Generated Image',
          description: settings.autoDescription ? prompt : undefined
        }
      };
    } else {
      console.error('Unexpected API response format:', response.data);
      return {
        success: false,
        error: response.data.message || 'Unexpected API response format'
      };
    }
  } catch (error) {
    console.error('Error generating image-to-image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateImageToVideo(
  image: File | null,
  prompt: string,
  settings: {
    max_area?: string;
    fast_mode?: 'Balanced' | 'Speed' | 'Quality';
    lora_scale?: number;
    num_frames?: number;
    sample_shift?: number;
    sample_steps?: number;
    frames_per_second?: number;
    sample_guide_scale?: number;
    autoTitle?: boolean;
    autoDescription?: boolean;
    aspect_ratio?: string;
  } = {}
): Promise<MediaGenerationResponse> {
  try {
    const email = getCurrentUserEmail();
    if (!email) {
      console.error('User not authenticated');
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!image) {
      return {
        success: false,
        error: 'Image is required for image-to-video generation',
      };
    }

    if (!prompt) {
      return {
        success: false,
        error: 'Prompt is required for image-to-video generation',
      };
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);
    formData.append('max_area', settings.max_area || '720x1280');
    formData.append('fast_mode', settings.fast_mode || 'Balanced');
    formData.append('lora_scale', String(settings.lora_scale || 1));
    formData.append('num_frames', String(settings.num_frames || 81));
    formData.append('sample_shift', String(settings.sample_shift || 5));
    formData.append('sample_steps', String(settings.sample_steps || 30));
    formData.append('frames_per_second', String(settings.frames_per_second || 16));
    formData.append('sample_guide_scale', String(settings.sample_guide_scale || 5));

    
    const response = await api.post('/api/image-to-video', formData, {
      headers: {
        'X-User-Email': email
      }
    });
    
    if (response.data.status === 'success' && response.data.video_url) {
      return {
        success: true,
        data: {
          url: response.data.video_url,
          title: settings.autoTitle ? generateTitle(prompt) : 'Generated Video',
          description: settings.autoDescription ? prompt : undefined
        }
      };
    } else {
      console.error('Unexpected API response format:', response.data);
      return {
        success: false,
        error: response.data.message || 'Unexpected API response format'
      };
    }
  } catch (error) {
    console.error('Error generating image-to-video:', error);
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
