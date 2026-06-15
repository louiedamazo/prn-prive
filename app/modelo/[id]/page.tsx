import ModeloClient from "./ModeloClient";

async function getModelo(nome: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${base}/api/modelos/${encodeURIComponent(nome)}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function ModeloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const nome = decodeURIComponent(id);
  const data = await getModelo(nome);
  const videos = data?.videos ?? [];
  const banner_id = data?.banner_id ?? null;

  return (
    <ModeloClient
      nome={nome}
      videos={videos}
      banner_id={banner_id}
    />
  );
}