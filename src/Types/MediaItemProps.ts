interface MediaItemProps {
  id: string; // Identificador único del mensaje
  senderName: string; // Nombre de quien envía
  recievedAt: string; // Fecha y hora de envío (formato de cadena legible)
  media: MediaData;
  // Nuevo campo para determinar la posición (burbuja de chat)
  senderType: "Client" | "Genesys";
}
