import test from "node:test";
import assert from "node:assert/strict";
import {
  setupStep,
  preferredModel,
  freeSpace,
  recovery,
} from "../dist/local-ai/setup-flow.js";

test("setup routes missing software, disconnected storage, stopped service and downloaded models", () => {
  assert.equal(setupStep(null), "welcome");
  assert.equal(setupStep({ installed: false }), "install");
  assert.equal(
    setupStep({
      installed: true,
      libraryExists: false,
      librarySource: "Soma preference",
    }),
    "storage",
  );
  assert.equal(
    setupStep({
      installed: true,
      libraryExists: false,
      librarySource: "Ollama default",
    }),
    "start",
  );
  const s = { installed: true, libraryExists: true, ready: true };
  assert.equal(setupStep(s), "model");
  assert.equal(setupStep(s, [{ name: "qwen3:8b" }]), "verify");
  assert.equal(setupStep(s, [{ name: "qwen3:8b" }], true), "ready");
});
test("existing model choices survive recommendations; non-chat models are excluded", () => {
  const models = [
    { name: "qwen3:8b", size: 5e9 },
    { name: "embedding:small", size: 1e8 },
    { name: "large:70b", size: 45e9 },
  ];
  assert.equal(
    preferredModel(models, "qwen3:8b", { ramBytes: 32 * 2 ** 30 }),
    "qwen3:8b",
  );
  assert.equal(
    preferredModel(models, "", { ramBytes: 32 * 2 ** 30 }),
    "qwen3:8b",
  );
  assert.equal(preferredModel([{ name: "embedding:small", size: 1e8 }]), "");
});
test("space checks prefer the most specific drive and errors offer recovery", () => {
  assert.equal(
    freeSpace(
      {
        disks: [
          { mount: "C:/", freeBytes: 100 },
          { mount: "C:/Models/", freeBytes: 200 },
        ],
      },
      "c:\\Models\\AI",
    ),
    200,
  );
  assert.match(recovery("Not enough disk space").action, /another drive/);
  assert.match(recovery("publisher signature invalid").action, /did not run/);
  assert.match(recovery("download cancelled").title, /safe/);
});
test("first-run journey installs once, downloads by explicit click, checks a model and remembers completion", async () => {
  const store = new Map(),
    handlers = {},
    calls = [];
  let status = {
    installed: false,
    ready: false,
    library: "C:/Models",
    libraryExists: true,
    librarySource: "Ollama default",
    candidates: [],
  };
  let models = [];
  const panel = {
    innerHTML: "",
    prepend() {},
    querySelector() {
      return null;
    },
  };
  const nodes = {
    "#panel": panel,
    "#message": { textContent: "", classList: { toggle() {} } },
    ".tabs": {},
    "#web-note": {},
  };
  globalThis.document = {
    body: { dataset: {} },
    querySelector: (s) => nodes[s],
    querySelectorAll: () => [],
    createElement: () => ({}),
    addEventListener: (name, fn) => (handlers[name] = fn),
  };
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, v),
  };
  globalThis.window = {
    addEventListener() {},
    __TAURI__: {
      event: { listen() {} },
      core: {
        async invoke(cmd, args) {
          calls.push([cmd, args]);
          if (cmd === "status") return { ...status };
          if (cmd === "hardware")
            return {
              ramBytes: 16 * 2 ** 30,
              gpus: [],
              disks: [{ mount: "C:/", freeBytes: 100e9 }],
            };
          if (cmd === "install_ollama") {
            status.installed = true;
            return;
          }
          if (cmd === "launch") {
            status.ready = true;
            return;
          }
          if (cmd === "models") return { models };
          if (cmd === "pull_model") {
            models = [{ name: args.model, size: 2e9 }];
            return;
          }
          if (cmd === "chat") return { message: { content: "Ready" } };
          throw Error("Unexpected command " + cmd);
        },
      },
    },
  };
  await import("../dist/local-ai/app.js?setup-test");
  await new Promise((r) => setTimeout(r, 10));
  const click = (id) =>
    handlers.click({
      target: {
        closest: (selector) =>
          selector === "a" ? null : { id, dataset: {}, disabled: false },
      },
    });
  assert.ok(!calls.some(([c]) => c === "install_ollama"));
  await click("begin");
  assert.match(panel.innerHTML, /Download and install Ollama/);
  await click("install");
  assert.match(panel.innerHTML, /Choose a model/);
  assert.ok(!calls.some(([c]) => c === "pull_model"));
  await click("download");
  assert.match(panel.innerHTML, /Your tutor is ready/);
  assert.equal(store.get("soma-ai-setup-complete"), "1");
  assert.equal(calls.filter(([c]) => c === "install_ollama").length, 1);
  assert.equal(calls.filter(([c]) => c === "chat").length, 1);
});
