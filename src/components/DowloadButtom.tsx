const DownloadButton: React.FC<MediaData> = ({ url, name }) => {
  // Función para extraer el nombre del archivo de la URL si 'name' no está disponible
  const getFileName = () => {
    if (name) return name;
    // Esto es un fallback, extrae el nombre después del último '/'
    const parts = url.split('/');
    return parts.pop() || 'archivo_descargado'; 
  };
  
  // Estilo simple para el botón (puedes usar un componente Button de antd si lo prefieres)
  return (
    <a
      href={url}
      download={getFileName()} // <--- ¡FORZAMOS LA DESCARGA AQUÍ!
      target="_blank" 
      rel="noopener noreferrer"
      className="ml-auto flex-shrink-0 p-1 rounded-full hover:bg-gray-300 transition-colors"
      title={`Descargar ${getFileName()}`}
    >
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
};

export default DownloadButton
