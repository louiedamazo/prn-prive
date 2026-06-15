import ModeloClient from "./ModeloClient";

async function getVideos(nome: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/modelos/${encodeURIComponent(nome)}`,
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
  const videos = await getVideos(nome);

  const slug = nome.toLowerCase().replace(/ /g, "-");
  const bannerUrl = `/modelos/${slug}.png`;

  return (
    <ModeloClient
      nome={nome}
      videos={videos}
      bannerUrl={bannerUrl}
    />
  );
}