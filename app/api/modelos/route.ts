import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, Number(searchParams.get("page"))  || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 8);
  const skip  = (page - 1) * limit;

  // Query 1: total de modelos distintos
  const totalResult = await prisma.videos.groupBy({
    by: ["modelo"],
  });
  const total = totalResult.length;

  // Query 2: modelos paginados com contagem
  const grupos = await prisma.videos.groupBy({
    by: ["modelo"],
    orderBy: { modelo: "asc" },
    skip,
    take: limit,
    _count: { id: true },
  });

  const nomes = grupos.map((g) => g.modelo).filter(Boolean) as string[];

  // Query 3: pega o primeiro vídeo de cada modelo de uma vez só (sem loop)
  const capas = await prisma.$queryRaw<
    { modelo: string; capa_id: string; modelo_slug: string }[]
  >`
    SELECT DISTINCT ON (modelo) modelo, capa_id, modelo_slug
    FROM videos
    WHERE modelo = ANY(${nomes}::text[])
    ORDER BY modelo, id ASC
  `;

  // Monta mapa para lookup O(1)
  const capaMap = new Map(capas.map((c) => [c.modelo, c]));

  const items = grupos.map((g) => {
    const info = capaMap.get(g.modelo ?? "");
    return {
      modelo:       g.modelo,
      modelo_slug:  info?.modelo_slug ?? "",
      capa_id:      info?.capa_id     ?? "",
      total_videos: g._count.id,
    };
  });

  return NextResponse.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  });
}