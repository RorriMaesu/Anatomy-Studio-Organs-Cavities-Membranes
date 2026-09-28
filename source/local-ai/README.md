# Soma Desktop · local AI companion

## Student setup

1. Download the Windows x64 installer from this repository's Releases page and open Soma Desktop.
2. Local setup distinguishes installation discovery, an already-running Ollama server, and a ready Soma session.
3. If needed, download Ollama from its official website. The guided installer flow lets you choose an installation folder, then select the downloaded signed installer.
4. Check the model library. If its drive is unavailable, open Installation & storage and select a detected library or browse to a folder. Choose **Use this library**.
5. Click **Launch Ollama in background** (or **Start Soma session** if another server is already running). No console window is opened.
6. Select an installed model, or choose a catalog model and download it. No model is downloaded automatically.
7. Open the tutor or quiz workshop and choose a Chapter 3 topic.

## Architecture and local behavior

The existing static site remains on GitHub Pages. The desktop app embeds that same `dist/` frontend using Tauri 2. Native Rust commands perform hardware detection, configuration, directory selection, Ollama requests and verified library copying. Remote websites receive no native permissions. Model output is rendered as escaped text, never executable HTML.

Soma starts an owned `ollama serve` process on 127.0.0.1:11435 with OLLAMA_NO_CLOUD=1 and a selected OLLAMA_MODELS folder. It probes the usual 11434 endpoint separately. Existing Ollama servers are never killed or reconfigured. The owned server ends when Soma exits normally. If another process occupies 11435, startup reports an error rather than taking it over. A stale unowned server after a crash must be closed before relaunching.

Settings are per-user in the app configuration directory. The global Ollama environment is not changed. A configured model path is not advertised as verified active until the owned session starts. Common library folders on mounted drives and the default user library are checked; the whole disk is not recursively searched. Other/custom/WSL/Docker locations require manual selection. One library is active at a time.

NVIDIA VRAM is measured through nvidia-smi. Other Windows GPU names and system RAM are detected, but unmeasured VRAM remains unknown. Model recommendations are estimates with headroom, not accuracy guarantees. Context is explicitly capped at 8192 tokens. Windows is the supported desktop target for this release.

## Learning and grading

The first reference corpus contains all 53 reviewed Chapter 3 studio lessons, with section links, common misconceptions and memory cues. These are adaptations, not verbatim textbook excerpts or page-level quotations. Relevant lessons are selected locally by lexical retrieval. Structured model responses must cite identifiers actually supplied in the request. Citation existence is checked; factual entailment still requires human review.

The tutor asks one useful next question and supports hints or direct explanations. Existing studio schematics are available alongside it, with verified structure highlighting.

Generated quizzes contain 3 or 5 choice/short-answer questions. Questions, keys, references and rubrics are saved before attempting them. Choice scores use deterministic key comparison. Written answers are graded against individual criteria. The application calculates totals; the model cannot specify them directly. Claimed supporting quotes must occur in the student's answer, or the grade is flagged. Students may flag any grade for review or reassess an answer; previous assessments are retained. Flagged grades are excluded from totals. This is practice feedback, not a validated high-stakes assessment system.

Quiz/conversation records remain in the desktop WebView's local storage. Export backups from Saved work. This is separate from browser storage. Keys are stored locally and are not intended as an anti-cheating system.

## Storage management

Switching libraries changes only Soma's preference. **Copy current library here** requires an empty separate destination and asks users to close other Ollama servers. Every file is hash-verified, and originals are preserved. No cleanup/delete operation is offered. After copying, start Soma's session and test a model. If anything is wrong, choose the original library again. Interrupted or failed copies may leave a partial destination; choose another empty folder for a retry.

The application installer and Ollama installer are separate. Models are obtained from Ollama, never bundled or committed to Git. Model licenses remain applicable. Soma's installer is currently unsigned; no publisher certificate has been configured.

## Development

- `npm ci`
- `npm test`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `npm run desktop:dev`
- `npm run desktop:build`

Prerequisites: Windows Rust/MSVC toolchain, Node.js, and WebView2. Installers are produced under `src-tauri/target/release/bundle/nsis/`. Publish source changes to main for Pages; upload the installer to GitHub Releases.

## Primary implementation references

- https://docs.ollama.com/windows
- https://docs.ollama.com/faq
- https://docs.ollama.com/api/tags
- https://docs.ollama.com/api/ps
- https://docs.ollama.com/api/chat
- https://docs.ollama.com/capabilities/structured-outputs
- https://docs.ollama.com/context-length
- https://ollama.com/library/qwen3.5/tags
- https://v2.tauri.app/security/

Checked September 27, 2026.

## Live validation (September 27, 2026)

- 46 JavaScript unit/regression checks and 2 native checks passed.
- Desktop UI: detected an existing Ollama installation and separate running server; started an owned background session, found installed models, and preserved the other server on exit.
- Desktop UI: a tutor response corrected a hypertonic-solution misconception and cited an existing lesson; generated choice quiz scored a correct answer; history survived restart; exported backup was parsed and validated.
- Real local `qwen3:8b`: generated 3 valid written questions. Rubric checks returned 2/2 for a correct paraphrase, 1/2 for a partial response, and 0/2 for opposite-direction, negated, and grading-instruction answers. These are focused regression cases, not broad educational model certification.
- Native migration test verifies preserved source, copied content, and rejection of nested/nonempty destinations. No existing personal model library was moved for testing.
- Official Ollama installer flow and non-NVIDIA hardware require additional machine coverage. The existing Ollama installation was reused, not replaced.

Optional live regression: start Soma's local session, then run `node tests/local-ai-live.mjs`. It uses the already-installed model named by SOMA_TEST_MODEL (default qwen3:8b) and never downloads one. Results go to ignored work/local-ai/.

- UI regression fixture verifies mixed-format generation, fixed keys, deterministic choice scoring, written grading, draft restoration, and backup validation. Packaged Windows executable startup and setup layout were inspected.
