interface MediaData {
  // El tipo se refiere a la categoría principal (image, video, audio)
  type: 'image' | 'video' | 'audio'; 
  url: string; // URL del recurso multimedia
  altText: string; // Texto alternativo para imágenes/videos
}