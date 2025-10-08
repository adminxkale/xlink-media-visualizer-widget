// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<MediaItemProps | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WebSocket] Conectado");
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
      console.warn("[WebSocket] Conexión cerrada");
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: MediaItemProps) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("[WebSocket] No se pudo enviar, conexión no abierta");
    }
  };

  return { message, sendMessage };
}
