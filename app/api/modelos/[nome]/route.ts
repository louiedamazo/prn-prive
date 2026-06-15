import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params;

  const slug = decodeURIComponent(nome)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const rows = await sql`
    SELECT * FROM videos
    WHERE modelo_slug = ${slug}
    ORDER BY id
  `;

  const banner_id = rows.find((r: any) => r.banner_id)?.banner_id ?? null;

  return NextResponse.json({ videos: rows, banner_id });
}