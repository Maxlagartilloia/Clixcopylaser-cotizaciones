import { CATALOGO_BASE } from "./sinonimos";

export const quitarAcentos = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const normalizarEntrada = (s: string) =>
  quitarAcentos(s.toLowerCase())
    .replace(/\s+/g, " ")
    .replace(/[,.;:]/g, "")
    .trim();

// Reglas específicas: unificar “100h”, “100 hojas”, “100-hojas”
const reglasExpresiones: Array<[RegExp, string]> = [
  [/\b(\d+)\s*h(ojas)?\b/g, "$1 hojas"],
  [/\buna\s*linea\b/g, "rayado"],
  [/\blineas?\b/g, "rayado"],
  [/\bcuadros?\b/g, "cuadriculado"],
  [/\b0[,\.]?5\b/g, "0.5"],
  [/\ba\s*4\b/g, "a4"],
  [/\boficio\b/g, "oficio"],
  [/\bmicroporoso\b/g, "foamy"]
];

function aplicarReglas(texto: string): string {
  let t = normalizarEntrada(texto);
  reglasExpresiones.forEach(([re, rep]) => (t = t.replace(re, rep)));
  return t;
}

function indiceJaccard(a: string, b: string) {
  const A = new Set(a.split(" "));
  const B = new Set(b.split(" "));
  const inter = new Set([...A].filter(x => B.has(x))).size;
  const uni = new Set([...A, ...B]).size || 1;
  return inter / uni;
}

export type MatchResult = {
  id: keyof typeof CATALOGO_BASE;
  canonico: string;
  score: number;
};

export function matchProducto(entradaUsuario: string): MatchResult | null {
  const t = aplicarReglas(entradaUsuario);

  let mejor: MatchResult | null = null;
  for (const [id, item] of Object.entries(CATALOGO_BASE)) {
    const candidatos = [item.canonico, ...(item.sinonimos || [])]
      .map(aplicarReglas);

    for (const cand of candidatos) {
      const score = indiceJaccard(t, cand);
      if (!mejor || score > mejor.score) {
        mejor = { id: id as keyof typeof CATALOGO_BASE, canonico: item.canonico, score };
      }
    }
  }

  // Umbral configurable: 0.45 suele funcionar bien en listas de útiles
  return (mejor && mejor.score >= 0.45) ? mejor : null;
}
