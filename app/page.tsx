// app/page.tsx
import Link from "next/link";

async function getModelos(page: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${base}/api/modelos?page=${page}&limit=8`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, totalPages } = await getModelos(page);

  return (
    <main className="min-h-screen bg-[#0c0c0d] text-[#f2ede4] px-6 py-12 md:px-12">
      <header className="mb-12 border-b border-[#2a2826] pb-6">
        <p className="font-mono-ui text-sm md:text-xl uppercase tracking-[0.3em] text-[#b08d57] mb-2 text-center">
          PRN PRIVÉ
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {items.map((m: any, i: number) => (
          <Link
            key={m.modelo_slug}
            href={`/modelo/${encodeURIComponent(m.modelo_slug)}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#161616] mb-3 border border-transparent group-hover:border-[#b08d57] transition-colors duration-300">
              <img
                src={`https://drive.google.com/thumbnail?id=${m.capa_id}&sz=w600`}
                alt={m.modelo}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 font-mono-ui text-xs text-[#b08d57] tracking-widest">
                Nº {String((page - 1) * 8 + i + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-display text-lg leading-tight group-hover:text-[#b08d57] transition-colors">
              {m.modelo}
            </h2>
            <p className="font-mono-ui text-xs text-[#8a8580] mt-1 uppercase tracking-wider">
              {m.total_videos} vídeo{m.total_videos > 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="font-mono-ui mt-16 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}`}
              className="px-3 py-1 border border-[#2a2826] hover:border-[#b08d57] transition-colors"
            >
              ←
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}`}
              className={`px-3 py-1 border transition-colors ${
                p === page
                  ? "border-[#b08d57] text-[#b08d57]"
                  : "border-[#2a2826] hover:border-[#b08d57]"
              }`}
            >
              {String(p).padStart(2, "0")}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/?page=${page + 1}`}
              className="px-3 py-1 border border-[#2a2826] hover:border-[#b08d57] transition-colors"
            >
              →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}