import React from "react";
import { Image, Card, Typography } from "antd";

const { Text } = Typography;

interface MediaData {
  type: string;
  url: string;
}

const MediaContent: React.FC<{ media: MediaData }> = ({ media }) => {
  const isWebp = media.url.toLowerCase().endsWith(".webp");
  const imagePlaceholderText = isWebp ? "Error Carga Imagen WebP" : "Error Carga Imagen";

  switch (media.type) {
    case "image":
    case "sticker":
      return (
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          className="rounded-lg overflow-hidden shadow-sm"
        >
          <Image
            src={media.url}
            alt="media"
            height={200}
            width={300}
            style={{
              objectFit: "cover",
              borderRadius: "8px",
            }}
            fallback={`https://placehold.co/300x200/374151/FFFFFF?text=${encodeURIComponent(
              imagePlaceholderText
            )}`}
            placeholder={
              <div className="flex items-center justify-center h-48 text-gray-400">
                Cargando imagen...
              </div>
            }
          />
        </Card>
      );

    case "video":
      return (
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          className="rounded-lg overflow-hidden shadow-sm"
        >
          <video
            controls
            height={200}
            style={{
              width: "100%",
              borderRadius: "8px",
              background: "#000",
            }}
          >
            <source src={media.url} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        </Card>
      );

    case "audio":
      return (
        <Card
          bordered
          size="small"
          className="rounded-lg overflow-hidden flex items-center gap-2 shadow-sm"
        >
          <svg
            className="w-5 h-5 text-gray-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.899a9 9 0 010 12.728M5.586 15H5a2 2 0 01-2-2V9a2 2 0 012-2h.586l3.634 3.634c.188.188.293.441.293.707v1.328c0 .266-.105.519-.293.707L5.586 15z"
            />
          </svg>
          <audio controls src={media.url} className="flex-grow" />
        </Card>
      );

    case "file":
      return (
        <Card
          hoverable
          className="rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm"
          bodyStyle={{ display: "flex", alignItems: "center", padding: "10px" }}
        >
          <svg
            className="w-6 h-6 text-gray-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m-5 5h-1a2 2 0 01-2-2V7a2 2 0 012-2h4l4 4v10a2 2 0 01-2 2h-1.5"
            />
          </svg>
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow text-blue-600 hover:underline truncate"
          >
            Descargar archivo
          </a>
        </Card>
      );

    default:
      return (
        <Card
          className="bg-red-50 border border-red-300 text-red-700 rounded-lg"
          size="small"
        >
          <Text strong>Tipo de medio no soportado</Text>
        </Card>
      );
  }
};

export default MediaContent;
