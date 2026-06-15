import sharp from "sharp";
import { readdir, stat, rename } from "fs/promises";
import { join, extname, basename } from "path";

const formatBytes = (b) => {
  if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB";
  if (b >= 1e3) return (b / 1e3).toFixed(1) + " KB";
  return b + " B";
};

const ICONS = [
  { src: "public/icon-192.png", width: 192, height: 192 },
  { src: "public/icon-512.png", width: 512, height: 512 },
];

const MODELOS_DIR = "public/modelos";

async function optimizeIcon({ src, width, height }) {
  const before = (await stat(src)).size;
  await sharp(src).resize(width, height, { fit: "cover" }).png({ compressionLevel: 9, palette: true }).toFile(src + ".tmp");
  await rename(src + ".tmp", src);
  const after = (await stat(src)).size;
  console.log(`✓ ${src}: ${formatBytes(before)} → ${formatBytes(after)} (-${(((before-after)/before)*100).toFixed(1)}%)`);
}

async function optimizeModelos() {
  const files = await readdir(MODELOS_DIR);
  for (const file of files.filter(f => /\.(png|jpg|jpeg)$/i.test(f))) {
    const src = join(MODELOS_DIR, file);
    const before = (await stat(src)).size;
    const webpPath = src.replace(/\.(png|jpg|jpeg)$/i, ".webp");
    await sharp(src).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(webpPath);
    const after = (await stat(webpPath)).size;
    console.log(`✓ ${file} → ${basename(webpPath)}: ${formatBytes(before)} → ${formatBytes(after)} (-${(((before-after)/before)*100).toFixed(1)}%)`);
  }
}

console.log("🔧 Otimizando ícones PWA...");
for (const icon of ICONS) await optimizeIcon(icon);
console.log("\n🖼️  Otimizando modelos...");
await optimizeModelos();
console.log("\n✅ Pronto!");
