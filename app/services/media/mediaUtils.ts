
interface MediaActionResult {
  success: boolean;
  error?: string;
}

export const downloadMedia = async (
  url: string,
  type: 'image' | 'video'
): Promise<MediaActionResult> => {
  try {
    if (url.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `dream-ai-${type}-${Date.now()}.${type === 'image' ? 'png' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return { success: true };
    }
    
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `dream-ai-${type}-${Date.now()}.${type === 'image' ? 'png' : 'mp4'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(objectUrl);
    
    return { success: true };
  } catch (error) {
    console.error(`Error downloading ${type}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
export const shareMedia = async (
  url: string,
  platform: string
): Promise<MediaActionResult> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Check out my Dream AI creation!',
        text: 'Created with Dream AI',
        url: url.startsWith('data:') ? window.location.href : url,
      });
      return { success: true };
    }
    
    if (url.startsWith('data:')) {
      alert('This image is generated locally and cannot be shared directly. Please download it first.');
      return { success: true };
    }
    
    await navigator.clipboard.writeText(url);
    alert('URL copied to clipboard! You can now paste it to share.');
    return { success: true };
  } catch (error) {
    console.error('Error sharing media:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const postMedia = async (
  url: string,
  type: 'image' | 'video',
  platforms: string[]
): Promise<MediaActionResult> => {
  try {
    const downloadResult = await downloadMedia(url, type);
    
    if (!downloadResult.success) {
      throw new Error(downloadResult.error || 'Failed to prepare media for posting');
    }
    
    console.log(`Media prepared for posting to: ${platforms.join(', ')}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error posting media:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
