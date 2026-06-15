// app/api/modelos/[nome]/route.ts
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params;
  const slug = decodeURIComponent(nome);
  const rows = await sql`SELECT * FROM videos WHERE modelo_slug = ${slug} ORDER BY id`;
  return NextResponse.json(rows);
}