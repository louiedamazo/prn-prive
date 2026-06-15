import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const rows = await sql`SELECT * FROM videos ORDER BY id`;
  return NextResponse.json(rows);
}
