"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface Video {
  id: number;
  titulo: string;
  duracao: string;
  thumb_id: string;
  video_id: string;
  descricao?: string;
}

const PER_PAGE = 12;

export default function ModeloClient({
  nome,
  videos,
  bannerUrl,
}: {
  nome: string;
  videos: Video[];
  bannerUrl: string;
}) {
  const [page, setPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(videos.length / PER_PAGE);
  const paged = videos.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".thumb-card", {
        opacity: 0, y: 28, scale: 0.92,
        duration: 0.45, stagger: 0.07, delay: 0.5,
        ease: "power2.out"
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, [page]);

  useEffect(() => {
    if (activeVideo && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0, scale: 0.92, duration: 0.3, ease: "power3.out"
      });
      gsap.from(".modal-inner", {
        scale: 0.88, opacity: 0, duration: 0.35, ease: "back.out(1.4)"
      });
    }
  }, [activeVideo]);

  function closeVideo() {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0, scale: 0.96, duration: 0.2, ease: "power2.in",
        onComplete: () => setActiveVideo(null)
      });
    } else {
      setActiveVideo(null);
    }
  }

  return (
    <div style={{ background: "#0e0e0e", minHeight: "100vh", position: "relative" }}>

      <div ref={bannerRef} style={{ width: "100%", position: "relative", zIndex: 2 }}>
        <img
          src={bannerUrl}
          alt={nome}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, transparent 60%, #0e0e0e 100%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to right, #0e0e0e 0%, rgba(14,14,14,0.9) 15%, transparent 45%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to left, #0e0e0e 0%, rgba(14,14,14,0.9) 15%, transparent 45%)" }} />
      </div>

      <div ref={wrapperRef} style={{ maxWidth: 1300, margin: "0 auto", padding: "0 56px", position: "relative", zIndex: 2, boxSizing: "border-box" as const }}>
        <div style={{ padding: "20px 0" }}>
          {paged.length === 0 ? (
            <p style={{ color: "#555", textAlign: "center", marginTop: 60 }}>Nenhum vídeo encontrado.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {paged.map((v) => (
                <div key={v.id} className="thumb-card" style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setActiveVideo(v)}
                    style={{ borderRadius: 10, overflow: "hidden", position: "relative", aspectRatio: "16/9", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.2s, box-shadow 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.6)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="rgba(232,30,94,0.15)" />
                        <polygon points="15,12 30,20 15,28" fill="#e81e5e" opacity="0.8" />
                      </svg>
                    </div>
                    <img src={`https://drive.google.com/thumbnail?id=${v.thumb_id}&sz=w800`} alt={v.titulo} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0)", transition: "background 0.2s", zIndex: 2 }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0)")}>
                      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: 0.9 }}>
                        <circle cx="22" cy="22" r="22" fill="rgba(0,0,0,0.5)" />
                        <polygon points="17,13 34,22 17,31" fill="#fff" />
                      </svg>
                    </div>
                    <span style={{ position: "absolute", bottom: 8, right: 10, zIndex: 3, background: "rgba(0,0,0,0.82)", color: "#fff", fontSize: 12, padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>{v.duracao}</span>
                  </div>

                  {v.descricao && (
                    <p
                      style={{
                        margin: "8px 4px 0",
                        color: "#aaa",
                        fontSize: 13,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget;
                        el.style.webkitLineClamp = "unset";
                        el.style.overflow = "visible";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget;
                        el.style.webkitLineClamp = "2";
                        el.style.overflow = "hidden";
                      }}
                    >
                      {v.descricao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28 }}>
              <PageBtn label="‹" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <PageBtn key={n} label={String(n)} active={n === page} onClick={() => setPage(n)} />
              ))}
              <PageBtn label="›" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
            </div>
          )}
        </div>
      </div>

      {activeVideo && (
        <div ref={modalRef} onClick={closeVideo} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="modal-inner" onClick={e => e.stopPropagation()} style={{ width: "min(1100px, 96vw)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", background: "#000", boxShadow: "0 8px 60px rgba(0,0,0,0.8)" }}>
            <iframe src={`https://drive.google.com/file/d/${activeVideo.video_id}/preview?autoplay=1`} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}

function PageBtn({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 32, height: 32, borderRadius: 7, border: active ? "1px solid #e81e5e" : "1px solid rgba(255,255,255,0.12)", background: active ? "#e81e5e" : "rgba(255,255,255,0.05)", color: active ? "#fff" : disabled ? "#444" : "#ccc", fontSize: 13, fontWeight: active ? 700 : 400, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
      {label}
    </button>
  );
}