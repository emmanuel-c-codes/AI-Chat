// Service file to handle direct file uploads to ImgBB API
const IMGBB_API_KEY = 'c92716e18fa6b65e124fac58dbfc6751'; 

export const uploadImageToImgBB = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      // Returns the direct, high-speed CDN hosting URL string
      return data.data.url; 
    } else {
      throw new Error(data.error.message || 'ImgBB upload failed');
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    return null;
  }
};