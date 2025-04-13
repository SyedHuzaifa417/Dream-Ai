// Sample media data
import { sampleImages } from "@/components/Main/modules/ImageGeneration/utlis/Data_tbr";
import { sampleVideos } from "@/components/Main/modules/VideoGeneration/utlis/Data_tbr";

export interface GenerationSettings {
  style?: string;
  aspectRatio?: string;
  autoTitle?: boolean;
  autoDescription?: boolean;
  guidanceScale?: number;
  inferenceSteps?: number;
  excludeText?: string;
}

export interface MediaGenerationResponse {
  success: boolean;
  data?: {
    url: string;
    title: string;
    description?: string;
  };
  error?: string;
}

// here we call an AI image generation API

export const generateImage = async (
  prompt: string,
  settings: GenerationSettings
): Promise<MediaGenerationResponse> => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For now, return sample image data
    // In production, this would call an actual AI service API
    const sampleImage = sampleImages[0];

    return {
      success: true,
      data: {
        url: sampleImage.url,
        title: settings.autoTitle
          ? `Generated from: ${prompt.substring(0, 30)}...`
          : sampleImage.title || "Generated Image",
        description: settings.autoDescription
          ? `AI generated image based on prompt: ${prompt}`
          : sampleImage.description || "Generated image description",
      },
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error: "Failed to generate image. Please try again.",
    };
  }
};

// here we call an AI video generation API

export const generateVideo = async (
  prompt: string,
  settings: GenerationSettings
): Promise<MediaGenerationResponse> => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const sampleVideo = sampleVideos[0];

    return {
      success: true,
      data: {
        url: sampleVideo.thumbnailUrl,
        title: settings.autoTitle
          ? `Generated from: ${prompt.substring(0, 30)}...`
          : sampleVideo.title || "Generated Video",
        description: settings.autoDescription
          ? `AI generated video based on prompt: ${prompt}`
          : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating video:", error);
    return {
      success: false,
      error: "Failed to generate video. Please try again.",
    };
  }
};

export const shareMedia = async (
  mediaUrl: string,
  platform: string
): Promise<{ success: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: `Successfully shared to ${platform}`,
  };
};

export const downloadMedia = async (
  mediaUrl: string,
  mediaType: string
): Promise<{ success: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: `${
      mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
    } downloaded successfully`,
  };
};

export const postMedia = async (
  mediaUrl: string,
  mediaType: string,
  platforms: string[]
): Promise<{ success: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: `${
      mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
    } scheduled for posting to ${platforms.join(", ")}`,
  };
};
