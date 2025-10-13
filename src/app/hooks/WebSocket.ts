import { useEffect, useRef, useState } from "react";

interface WebSocketOptions {
  businessNumber: string | null;
  customerNumber: string| null;
}

export function useWebSocket({ businessNumber, customerNumber}: WebSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<MediaItemProps | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Solo conectar cuando ambas variables existan
    if (!businessNumber || !customerNumber) return;

    const url = `wss://586bco3lvf.execute-api.us-east-1.amazonaws.com/production?business=${businessNumber}&client=${customerNumber}`;
    console.log("[WebSocket] Intentando conectar:", url);

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WebSocket] Conectado");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as MediaItemProps;
        console.log("[WebSocket] Mensaje recibido:", data);
        setMessage(data);
      } catch (error) {
        console.error("[WebSocket] Error al parsear mensaje:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
    };

    socket.onclose = () => {
      console.warn("[WebSocket] 🔌 Conexión cerrada");
      setIsConnected(false);
    };

    // 🧹 Cerrar la conexión anterior al desmontar o al cambiar business/client
    return () => {
      console.log("[WebSocket] Cerrando conexión...");
      socket.close();
    };
  }, [businessNumber, customerNumber]); // Se reconecta automáticamente si cambian

  // Función para enviar mensajes (opcional)
  const sendMessage = (message: MediaItemProps) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("[WebSocket] No se pudo enviar, conexión no abierta");
    }
  };

  return { message, sendMessage, isConnected };
}
