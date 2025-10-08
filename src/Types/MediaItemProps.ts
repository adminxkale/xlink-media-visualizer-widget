interface MediaItemProps {
  senderName: string; // Nombre de quien envía
  receivedAt: string; // Fecha y hora de envío (formato de cadena legible)
  media: MediaData;
  // Nuevo campo para determinar la posición (burbuja de chat)
  senderType: "Client" | "Genesys";
  delivered?: boolean;
}
