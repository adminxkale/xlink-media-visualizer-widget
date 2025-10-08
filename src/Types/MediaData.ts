interface MediaData {
  // El tipo se refiere a la categoría principal (image, video, audio)
  type: 'image' | 'video' | 'audio' | 'sticker' | 'file'; 
  url: string; // URL del recurso multimedia
}