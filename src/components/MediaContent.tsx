import React from "react";


const MediaContent: React.FC<{ media: MediaData }> = ({ media }) => {

    // Función auxiliar para determinar si la URL parece ser WebP. 
    const isWebp = media.url.toLowerCase().endsWith('.webp');
    const imagePlaceholderText = isWebp ? 'Error Carga Imagen WebP' : 'Error Carga Imagen';

    switch (media.type) {
        case 'image':
            return (
                // El tag <img> soporta WebP de forma nativa en la mayoría de los navegadores.
                <img
                    src={media.url}
                    alt={media.altText}
                    // El tamaño se ajusta al contenido de la burbuja, no al 100% de la pantalla
                    className={`h-48 object-cover rounded-md`}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        // Usamos un placeholder genérico que incluye el texto de WebP si aplica
                        target.src = `https://placehold.co/400x200/374151/FFFFFF?text=${encodeURIComponent(imagePlaceholderText)}`;
                        target.alt = 'Error al cargar imagen';
                    }}
                />
            );
        case 'video':
            return (
                <video controls className={`h-48 rounded-md`} style={{ maxWidth: '300px' }}>
                    <source src={media.url} type="video/mp4" />
                    Tu navegador no soporta la etiqueta de video.
                </video>
            );
        case 'audio':
            return (
                <div className="p-2 flex items-center justify-between">
                    <svg className="w-5 h-5 text-current mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.899a9 9 0 010 12.728M5.586 15H5a2 2 0 01-2-2V9a2 2 0 012-2h.586l3.634 3.634c.188.188.293.441.293.707v1.328c0 .266-.105.519-.293.707L5.586 15z" />
                    </svg>
                    <audio controls src={media.url} className="flex-grow"></audio>
                </div>
            );
        default:
            return (
                <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                    Tipo de medio no soportado.
                </div>
            );
    }
};


export default MediaContent;