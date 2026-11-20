import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

// Машины зургийг public/models/<slug>.(webp|jpg|png) гэж хийхэд автоматаар гарна.
// Зөвхөн өөрийн авсан эсвэл ашиглах эрхтэй зураг тавина.
const EXTS = ["webp", "jpg", "jpeg", "png"];

export function getModelImage(slug: string): string | null {
  for (const ext of EXTS) {
    if (existsSync(path.join(process.cwd(), "public", "models", `${slug}.${ext}`))) return `/models/${slug}.${ext}`;
  }
  return null;
}
