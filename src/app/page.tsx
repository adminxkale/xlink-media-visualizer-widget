'use client';

import React, { useEffect, useRef } from 'react';
import xlinkLogo from "@/assets/images/xlink_logo_v2.png";
import Image from "next/image";
import MediaItem from '@/components/MediaItem';
import { useWebSocket } from '@/app/hooks/WebSocket';
import { Spin } from 'antd';


export default function ChatInterface() {
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [retryKey, setRetryKey] = React.useState(0);
  const [mediaItems, setMediaItems] = React.useState<MediaItemProps[]>([]);
  const [customerNumber, setCustomerNumber] = React.useState<string | null>(null);
  const [businessNumber, setBusinessNumber] = React.useState<string | null>(null); // Número de la empresa (fijo)
  const [loadingData, setLoadingData] = React.useState(true);
  const { message, sendMessage, isConnected } = useWebSocket({
    businessNumber,
    customerNumber,
  });

  const environment = process.env.NEXT_PUBLIC_GENESYS_ENVIRONMENT || "mypurecloud.com";
  // Referencia al contenedor del chat
  const chatContainerRef = useRef<HTMLDivElement>(null);



  //  Scroll automático al final cuando cambia mediaItems
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [mediaItems]);

  async function fetchQueueData() {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    let accessToken = '';

    if (hash.includes('access_token=')) {
      accessToken = hash.split('access_token=')[1].split('&')[0];
      window.localStorage.setItem('genesys_access_token', accessToken);
    } else {
      accessToken = window.localStorage.getItem('genesys_access_token') || '';
    }

    const queueRes = await fetch(
      `https://api.${environment}/api/v2/conversations/${conversationId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!queueRes.ok) {
      throw new Error('No se pudo obtener la conversación de Genesys Cloud');
    }

    const queueData = await queueRes.json();
    const participantWithQueue = queueData.participants.find(
      (p: any) => p.attributes
    );
    return participantWithQueue
    // Buscar en participants el primero que tenga queueId y queueName

  }

  useEffect(() => {
    fetchQueueData().then((data) => {
      console.log("data", data)
      setBusinessNumber(data.attributes.business_phone_number)
      setCustomerNumber(data.attributes.customer_phone_number)
    })
  }, [conversationId]);


  const fetchMedia = async () => {
    try {
      const res = await fetch(`/api/proxy-media/?bussinesNumber=${businessNumber}&clientNumber=${customerNumber}`);
      if (!res.ok) throw new Error(`Error fetching media: ${res.statusText}`);
      const data = await res.json();
      console.log("Fetched media items:", data);
      return data;
    } catch (error) {
      console.error("Fetch media error:", error);
    }
  };

  useEffect(() => {
    if (message) {
      console.log("Nuevo mensaje recibido via WebSocket:", message);
      setMediaItems((prevItems) => (prevItems ? [...prevItems, message] : [message]));
    }
  }, [message]);

  useEffect(() => {
    fetchMedia().then((res) => {
      setMediaItems(res.data.medias);
      setLoadingData(false);
    }).catch((err) => {
      setLoadingData(false);
      console.error("Error fetching media on loadasdad:", err);
    });
  }, [customerNumber, businessNumber]);


  useEffect(() => {
    async function authenticateGenesys() {
      setAuthLoading(true);
      setAuthError(null);

      //const org = getOrgFromUrl();
      const clientId = process.env.NEXT_PUBLIC_GENESYS_CLIENT_ID;
      //const clientSecret = process.env.NEXT_PUBLIC_GENESYS_CLIENT_SECRET;
      const environment = process.env.NEXT_PUBLIC_GENESYS_ENVIRONMENT;
      try {
        // 1 Buscar conversationId en hash (#)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        let conversationId = hashParams.get("conversationId");
        // 2 bBuscar en query string (?)
        if (!conversationId) {
          const queryParams = new URLSearchParams(window.location.search.substring(1));
          conversationId = queryParams.get("conversationId");
        }
        // 3 Si aún no está, revisar localStorage (lo guardamos antes del redirect)
        if (!conversationId) {
          conversationId = localStorage.getItem("genesys_conversation_id") || "";
        }
        // 4️Si lo encontramos, guardarlo en localStorage para persistirlo
        if (conversationId) {
          localStorage.setItem("genesys_conversation_id", conversationId);
          setConversationId(conversationId);
        } else {
          console.warn("⚠️ No se encontró conversationId en la URL ni en storage");
        }
        // 5️ Revisar si ya hay access_token en la URL
        const hash = window.location.hash;
        let accessToken = "";
        if (hash.includes("access_token=")) {
          accessToken = hash.split("access_token=")[1].split("&")[0];
          localStorage.setItem("genesys_access_token", accessToken);
        } else {
          accessToken = localStorage.getItem("genesys_access_token") || "";
        }

        // 6️ Si no hay token, redirigir a OAuth (pero antes guardar conversationId)
        if (!accessToken) {
          if (conversationId) {
            localStorage.setItem("genesys_conversation_id", conversationId);
          }
          const redirectUri = `${window.location.origin}/`;

          const authUrl = `https://login.${environment}/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
          window.location.replace(authUrl);
          return;
        }

      } catch (e: any) {
        setAuthError(e?.message || "Error desconocido de autenticación");
        localStorage.removeItem("genesys_access_token");
      }

      setAuthLoading(false);
    }

    authenticateGenesys();
  }, [retryKey]);


  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</div>
          <div className="text-base text-gray-700 mb-6 text-center max-w-xs">{authError}</div>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => {
              setRetryKey((k) => k + 1);
              setAuthError(null);
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="flex items-center justify-center gap-6">
        <Image src={xlinkLogo} alt="Xlink Logo" width={40} height={40} className="rounded-lg" />
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Xlink media visualizer
        </h1>
      </header>



      {/* Contenedor del chat con referencia */}
      <div
        ref={chatContainerRef}
        className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-6 h-[80vh] overflow-y-auto border border-gray-200"
      >
        {loadingData && (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        )}
        {mediaItems?.map((item) => (
          <MediaItem key={crypto.randomUUID()} {...item} />
        ))}
      </div>
    </div>
  );
}