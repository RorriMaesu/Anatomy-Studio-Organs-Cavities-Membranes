export const catalog = [
  {
    tag: "qwen3.5:2b-q4_K_M",
    gb: 1.9,
    minVram: 4,
    minRam: 8,
    label: "Compact · 2B",
  },
  {
    tag: "qwen3.5:4b-q4_K_M",
    gb: 3.4,
    minVram: 6,
    minRam: 12,
    label: "Quick study · 4B",
  },
  {
    tag: "qwen3.5:9b-q4_K_M",
    gb: 6.6,
    minVram: 11,
    minRam: 16,
    label: "Deeper explanations · 9B",
  },
];
export function recommendation(h) {
  if (!h) return null;
  const ram = h.ramBytes / 2 ** 30;
  const free = Math.max(
    0,
    ...(h.gpus || []).map((g) => (g.freeMiB ?? 0) / 1024),
  );
  return (
    [...catalog].reverse().find((m) => ram >= m.minRam && free >= m.minVram) ||
    catalog.find((m) => ram >= m.minRam) ||
    null
  );
}
export function statusLabel(s) {
  if (!s) return "Not checked";
  if (s.ready) return "Ready · local-only session";
  if (s.running) return "Running · start Soma session";
  return s.installed ? "Installed · not running" : "Installation not found";
}
export const escapeHtml = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
