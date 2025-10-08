import React from "react";
import MediaContent from "./MediaContent";

/**
 * El componente principal `MediaItem` que muestra el contenido y metadatos, con estilo de burbuja.
 */
const MediaItem: React.FC<MediaItemProps> = ({ senderName, recievedAt, media, senderType }) => {
  const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Extrae el último segmento de la ruta, que es generalmente el nombre del archivo.
    const path = urlObj.pathname;
    // Decodifica para manejar caracteres especiales y toma el último segmento.
    const fileName = decodeURIComponent(path.substring(path.lastIndexOf('/') + 1));
    // Limpia parámetros de consulta si están presentes (ej: ?text=...)
    return fileName.split('?')[0];
  } catch (e) {
    // Si la URL es inválida o falla la extracción, retorna un placeholder.
    return 'Archivo adjunto';
  }
};
    // 1. Definir estilos de posicionamiento (izquierda/derecha)
  const isClient = senderType === 'Client'; // Ajusta según tu lógica real
  const bubbleContainerClasses = isClient ? 'justify-start' : 'justify-end';

  // 2. Definir estilos de la burbuja (color y esquinas)
  const bubbleClasses = isClient
    ? 'bg-gray-100 text-gray-800 rounded-br-xl rounded-tl-xl' // Burbuja izquierda (cliente)
    : 'bg-indigo-500 text-white rounded-bl-xl rounded-tr-xl'; // Burbuja derecha (agente)

  // 3. Clases para metadatos (alineación del texto)
  const metaClasses = isClient ? 'text-left' : 'text-right';

  // 4. Extracción del nombre del archivo
  const fileName = getFileNameFromUrl(media.url);

  return (
    // Contenedor principal para la burbuja, controla la alineación (start/end)
    <div className={`flex w-full ${bubbleContainerClasses} my-4`}>
      {/* La burbuja en sí, con un ancho máximo y padding */}
      <div className={`max-w-xs md:max-w-md shadow-lg p-3 ${bubbleClasses}`}>

        {/* Nombre del Remitente */}
        <p className={`font-semibold mb-2 ${isClient ? 'text-indigo-600' : 'text-white'}`}>
          {senderName}
        </p>

        {/* NOMBRE DEL ARCHIVO (NUEVO) */}
        <div className={`flex items-center text-sm font-medium mb-2 ${isClient ? 'text-gray-600' : 'text-indigo-200'}`}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{fileName}</span>
        </div>

        {/* Contenido Multimedia */}
        <div className="mb-2">
          <MediaContent media={media} />
        </div>
        {/* Fecha de Envío (Metadatos) */}
        <div className={`text-xs opacity-75 ${metaClasses}`}>
          {recievedAt}
        </div>
      </div>
    </div>
  );
};

export default MediaItem;