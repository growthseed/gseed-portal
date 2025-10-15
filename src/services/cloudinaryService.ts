const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsgqx6ouw';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'gseed_uploads';

export async function uploadToCloudinary(file: File, folder = 'avatars'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  
  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

export function getImageUrl(url: string, options: { width?: number; height?: number; quality?: number } = {}) {
  if (!url) return '';
  
  const { width = 400, height = 400, quality = 80 } = options;
  
  // Se já for uma URL do Cloudinary, adicionar transformações
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = `w_${width},h_${height},c_fill,q_${quality}`;
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
  }
  
  return url;
}

// Exportar como objeto para manter compatibilidade com os componentes
export const cloudinaryService = {
  uploadImage: uploadToCloudinary,
  uploadAvatar: uploadToCloudinary, // Alias para compatibilidade
  getImageUrl
};