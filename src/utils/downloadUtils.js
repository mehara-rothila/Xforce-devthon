// /app/utils/downloadUtils.js
import api from './api';

/**
 * Helper function to download a resource using the API
 * 
 * @param {string} resourceId - ID of the resource to download
 * @param {string} defaultFilename - Fallback filename if none provided by server
 * @returns {Promise<boolean>} - Whether download was successful
 */
export const downloadResource = async (resourceId, defaultFilename = 'download') => {
  try {
    // Use the API method that handles authentication automatically
    const response = await api.resources.download(resourceId);
    
    // Create a blob URL from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    
    // Get the filename from the Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
      : defaultFilename;
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    link.remove();
    
    console.log('Download successful:', fileName);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};