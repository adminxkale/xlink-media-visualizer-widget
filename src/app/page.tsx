'use client';

import React, { use, useEffect } from 'react';
import xlinkLogo from "@/assets/images/xlink_logo_v2.png";
import Image from "next/image";
import MediaItem from '@/components/MediaItem';


// --- Componente Principal de la Aplicación (para demostración de chat) ---
/*
const demoMediaItems: MediaItemProps[] = [
  {
    id: '1',
    senderName: 'Ana García (Cliente)',
    recievedAt: '2024-10-01 10:30',
    media: {
      type: 'image',
      url: 'https://hips.hearstapps.com/hmg-prod/images/el-despertar-de-la-fuerza-1575448990.jpg?crop=1xw:1xh;center,top',
    },
    senderType: 'Client', // Cliente: Izquierda
  },
  {
    id: '2',
    senderName: 'Agente Soporte',
    recievedAt: '2024-10-01 11:15',
    media: {
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Ejemplo de video

    },
    senderType: 'Genesys', // Agente: Derecha
  },
  {
    id: '3',
    senderName: 'Ana García (Cliente)',
    recievedAt: '2024-10-01 12:45',
    media: {
      type: 'audio',
      url: 'https://www.w3schools.com/html/horse.mp3', // Ejemplo de audio

    },
    senderType: 'Client', // Cliente: Izquierda
  },
  {
    id: '4',
    senderName: 'Agente Soporte',
    recievedAt: '2024-10-01 14:00',
    media: {
      type: 'image',
      url: 'https://xlink-multimedia-files.s3.us-east-1.amazonaws.com/APLatam/Inbound/Image/20369_17_1074214594594053.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZTNJ2CTVPZCJXW4F%2F20251008%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251008T172042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECkaCXVzLWVhc3QtMSJHMEUCIDXG8QIN4NPZ7yQ9fiu1jwsB58dy0SnYvjmPFFyMma0fAiEAk%2FFpPrT2jViuzfG49qMHsXXrpSRsLIFomclEbaEBKuAqiQMIwv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2NjAxNzA0Nzg4MjYiDG0dJ9CwGdcLZR%2FhUCrdAgM6nWjnleEdhHJSOP1W%2FZczSA4ddxGKNsztN15hH4LmpVNpVrD2aOze5nNp7HpKDYsNTHNpqQrsNLzXYAf6Db5UXMOlpjmDtHQuKnp5Of1JKSanMU4RTyS4%2BaFhjb5qwBI1LVnLq0TwEJFP8%2BjcBf8W4%2BsXni35O8qkHwtH3ymqQtyWPdaln31WD5JwQISjUG4QRm394N%2BmsSxjiF0uf4XHDVpZle5oUqq0eDGFggYNE%2Bfx4d1MsgRhsbAEqiv4KoGmoHVUOl%2F5HRZwL1VVgprXhpra%2BNk98YpIOE2CrUoLtBxgWD%2FnU9CRJvk%2FKjOWHchz7FP2aJeNXFZLpTvhz0J88IQrgRGmmIQ4ttLjc1F3ciOr5L5PgPhDYaGdWV5%2FnoWIaTCTXIewM65LENiM077cm3P%2BQajn6DYe%2BqNTk3oYfEoUy6xebl7PTKC%2BFa1mxI07M7DafBtjxyMusokwo7GaxwY6ngGd9IUqJgsT62wFWuM%2Ffpc0CJ9YRXYYW7AZP9FRwL%2FMkF99xI6bAY%2B5uCGahxUFxLA7rpf%2F3SuTw19Cxoi4HGWlXnf%2FQg4kQzPFh2W%2BfE09l7A%2FOMrM2tWLCvD9dt1%2Bp3ugRsyK1T10KhHwP9TKvyp3mbdLeou6d%2BwXUPNU4c84lx8K1MgztxY9frF9kMhi7IFj1X5KKeXlgaLvP%2BqwGg%3D%3D&X-Amz-Signature=0ce626b811ebf01d6142474e2b7f259bcd9a2858e5c06a757d0490721dd43129&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject',
    },
    senderType: 'Genesys', // Agente: Derecha
  },
];
*/

/**
 * Componente principal que actúa como contenedor de la aplicación de chat.
 * Debe ser el componente exportado por defecto en un entorno de archivo único React.
 */
export default function ChatInterface() { // Renombrado de App a ChatInterface

  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [agent, setAgent] = React.useState<{ name: string; id: string } | null>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [retryKey, setRetryKey] = React.useState(0);
  const [mediaItems, setMediaItems] = React.useState<MediaItemProps[]>();

    const fetchMedia = async () => {
    try {
      const res = await fetch(`/api/proxy-media/?bussinesNumber=12053505800&clientNumber=593990302992`);
      if (!res.ok) throw new Error(`Error fetching media: ${res.statusText}`);
      const data = await res.json();
      console.log("Fetched media items:", data);
      // Aquí podrías actualizar el estado con los nuevos items de media
      return data;
    } catch (error) {
      console.error("Fetch media error:", error);
    }
  }



  useEffect(() => {
   fetchMedia().then((res)=>{
    console.log("hola",res.data.medias)
    setMediaItems(res.data.medias);
   })
  }, []);



  // --- OAuth Genesys Cloud ---
  // Obtiene el parámetro org de la URL (?org=...)
  function getOrgFromUrl() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let org = params.get('org');
      return org || 'Xkale';
    }
    return 'Xkale';
  }

/*
  useEffect(() => {
    async function authenticateGenesys() {
      setAuthLoading(true);
      setAuthError(null);

      //const org = getOrgFromUrl();
      const clientId = process.env.NEXT_PUBLIC_GENESYS_CLIENT_ID;
      //const clientSecret = process.env.NEXT_PUBLIC_GENESYS_CLIENT_SECRET;
      const environment = process.env.NEXT_PUBLIC_GENESYS_ENVIRONMENT;



      try {
        const url = window.location.href;

        // 1️⃣ Buscar conversationId primero en hash (#)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        let conversationId = hashParams.get("conversationId");

        // 2️⃣ Si no está en hash, buscar en query string (?)
        if (!conversationId) {
          const queryParams = new URLSearchParams(window.location.search.substring(1));
          conversationId = queryParams.get("conversationId");
        }

        // 3️⃣ Si aún no está, revisar localStorage (lo guardamos antes del redirect)
        if (!conversationId) {
          conversationId = localStorage.getItem("genesys_conversation_id") || "";
        }

        // 4️⃣ Si lo encontramos, guardarlo en localStorage para persistirlo
        if (conversationId) {

          localStorage.setItem("genesys_conversation_id", conversationId);
          setConversationId(conversationId);

        } else {
          console.warn("⚠️ No se encontró conversationId en la URL ni en storage");

        }

        // 5️⃣ Revisar si ya hay access_token en la URL
        const hash = window.location.hash;
        let accessToken = "";
        if (hash.includes("access_token=")) {
          accessToken = hash.split("access_token=")[1].split("&")[0];
          localStorage.setItem("genesys_access_token", accessToken);
        } else {
          accessToken = localStorage.getItem("genesys_access_token") || "";
        }

        // 6️⃣ Si no hay token, redirigir a OAuth (pero antes guardar conversationId)
        if (!accessToken) {
          if (conversationId) {
            localStorage.setItem("genesys_conversation_id", conversationId);
          }
          const redirectUri = `${window.location.origin}/`;

          const authUrl = `https://login.${environment}/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
          window.location.replace(authUrl);
          return;
        }

        // 7️⃣ Llamar al API para obtener datos del agente
        const userRes = await fetch(`https://api.${environment}/api/v2/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userRes.ok) throw new Error("No se pudo obtener el usuario de Genesys Cloud");

        const userData = await userRes.json();
        setAgent({ name: userData.name, id: userData.id });

        // 8️⃣ Obtener grupos del agente
        const userGroupsRes = await fetch(
          `https://api.${environment}/api/v2/users/${userData.id}?expand=groups`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (userGroupsRes.ok) {
          const userGroupsData = await userGroupsRes.json();
          const groupIds = (userGroupsData.groups || []).map((g: any) => g.id);
        } else {

        }

      } catch (e: any) {
        setAuthError(e?.message || "Error desconocido de autenticación");
        localStorage.removeItem("genesys_access_token");
      }

      setAuthLoading(false);
    }

    authenticateGenesys();
  }, [retryKey]);
*/
  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</div>
          <div className="text-base text-gray-700 mb-6 text-center max-w-xs">{authError}</div>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => {
              setRetryKey(k => k + 1);
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
      <header className="mb-10 flex items-center justify-center gap-6">
        {/* Logo con efecto cuadrado con bordes redondeados */}

        <Image
          src={xlinkLogo}
          alt="Xlink Logo"
          width={90}
          height={90}
          className="rounded-lg"
        />

        {/* Título con estilos llamativos */}
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          Xlink media visualizer
        </h1>
      </header>


      {/* Contenedor simulando el historial de chat */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-6 h-[70vh] overflow-y-auto border border-gray-200">
        {mediaItems?.map((item) => (
          <MediaItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
