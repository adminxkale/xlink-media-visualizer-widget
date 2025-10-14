interface MediaItemProps {
  senderName: string; // Nombre de quien envía
  receivedAt: string; // Fecha y hora de envío (formato de cadena legible)
  senderType: "Client" | "Genesys";
  delivered?: boolean;
  media: MediaData;
}
