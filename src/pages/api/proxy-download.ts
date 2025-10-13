import { NextResponse } from "next/server";

export default async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "Falta el parámetro 'url'" }, { status: 400 });
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json({ error: response.statusText }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "attachment",
      },
    });
  } catch (error) {
    console.error("Error en proxy-download:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
