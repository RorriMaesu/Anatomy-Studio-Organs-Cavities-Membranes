import { catalog } from "./core.js";

export function setupStep(state, installed = [], checked = false) {
  if (!state) return "welcome";
  if (!state.installed) return "install";
  if (!state.libraryExists && state.librarySource !== "Ollama default")
    return "storage";
  if (!state.ready) return "start";
  if (!installed.length) return "model";
  return checked ? "ready" : "verify";
}
export function preferredModel(models, saved, hardware) {
  const eligible = models.filter((m) => !/cloud|embed|rerank/i.test(m.name));
  if (eligible.some((m) => m.name === saved)) return saved;
  // Prefer a familiar, modest existing model; never download over an existing choice.
  const ram = hardware?.ramBytes || 8 * 2 ** 30;
  const fits = eligible.filter((m) => m.size < ram * 0.55);
  return (
    (
      fits.find((m) =>
        /qwen.*[248]b[:\-]|llama.*[38]b[:\-]/i.test(m.name + ":"),
      ) ||
      fits.sort((a, b) => b.size - a.size)[0] ||
      eligible.sort((a, b) => a.size - b.size)[0]
    )?.name || ""
  );
}
export function freeSpace(hardware, folder) {
  const path = String(folder || "")
    .replaceAll("\\", "/")
    .toLowerCase();
  return [...(hardware?.disks || [])]
    .sort((a, b) => b.mount.length - a.mount.length)
    .find((d) => path.startsWith(d.mount.replaceAll("\\", "/").toLowerCase()))
    ?.freeBytes;
}
export function recovery(error) {
  const raw = String(error?.message || error);
  if (/cancel/i.test(raw))
    return {
      title: "Stopped. Your existing work is safe.",
      action: "You can try again whenever you are ready.",
    };
  if (/space|disk full|os error 112/i.test(raw))
    return {
      title: "There is not enough space.",
      action: "Choose another drive in Storage, then try again.",
    };
  if (/folder|drive|writab|library|path/i.test(raw))
    return {
      title: "Soma cannot use that storage location.",
      action: "Reconnect the drive or choose an available folder in Storage.",
    };
  if (/signature|publisher/i.test(raw))
    return {
      title: "The installer could not be verified.",
      action:
        "Soma did not run it. Retry the official download; do not use an unverified copy.",
    };
  if (/memory|out of|load model|allocate/i.test(raw))
    return {
      title: "This model could not run on your computer.",
      action:
        "Close other demanding apps or choose a smaller model in AI settings.",
    };
  if (/connect|network|dns|download|request|timed out|timeout/i.test(raw))
    return {
      title: "The connection or response was interrupted.",
      action:
        "For downloads, check your internet connection. For the tutor, retry or choose a smaller model.",
    };
  return {
    title: "That step did not finish.",
    action:
      "Try again. Your saved lessons, answers, and existing models are still available.",
  };
}
export function downloadEstimate(tag) {
  return catalog.find((m) => m.tag === tag)?.gb;
}
