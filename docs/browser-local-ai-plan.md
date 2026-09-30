# Browser-based local AI for every chapter

Reviewed 2026-09-29. This is the implementation design, not a claim that the current desktop-only AI page has already been converted. Chapter 4 itself is published separately.

## Decision

Keep Soma on GitHub Pages. The student's browser connects directly to the student's Ollama API at `http://127.0.0.1:11434`. Only Ollama is installed. No Soma executable, browser extension, Docker, Python server, public tunnel, paid API or proxy service is required.

The website supplies the interface and authored lesson references; Ollama supplies local inference and model downloads. GitHub Pages never receives the student's AI prompt or answer through this design. Ordinary site and model downloads still require internet. Offline website availability would require a separate, tested cache feature and is not implied.

This is not zero configuration: the public website must be authorized in Ollama's CORS settings, and supported browsers may require a local-network/loopback permission. A hosted page cannot silently change those settings.

## Student journey

1. Each chapter has the same **Ask a tutor** and **Generate practice** entry points. Entering from a section carries its chapter, section and current lesson. The student never has to find the topic again.
2. First visit shows **Connect to Ollama on this computer**. Explain before the click that the browser may ask to connect locally. Do not probe local services automatically on every course page.
3. Try `/api/version`, then `/api/tags`. If successful, show **Connected**, populate the model selector and continue to the learning activity. An empty model list is a successful connection, not an installation error.
4. If unreachable, say **Soma cannot connect yet**, with three clear actions: **Open Ollama**, **Install Ollama**, **Check again**. Do not falsely distinguish missing software, a stopped server, CORS rejection and browser denial from a generic fetch error.
5. **Open Ollama** can use `ollama://` when the installed desktop app has registered that protocol. Ollama v0.35.0's Windows installer registers it and its application handles the bare URL. The browser may ask permission to open the app. Offer Start-menu/Applications instructions if unsupported. This is an app-opening request, not a promise of silent background launch or proof the API is ready; recheck connection afterward.
6. **Install Ollama** opens the official download page. Installation location and app installation remain in the vendor installer. No second Soma installer is offered as a prerequisite.
7. A one-time **Allow this website** walkthrough explains setting `OLLAMA_ORIGINS` to `https://rorrimaesu.github.io`, quitting Ollama, and opening it again. Windows uses user environment variables; macOS/Linux use the documented platform-specific configuration. Show simple, real screenshots for supported operating systems; keep copyable commands in an optional advanced disclosure.
8. If a browser permission was denied, show browser-specific recovery steps and **Check again**. Start release testing with current Windows Edge and Chrome. Do not claim Safari, Firefox or school-managed browser support until tested on those environments.
9. Choose an existing local model, or explicitly download a listed local model through Ollama. Explain size before starting; stream download progress. The download uses Ollama's configured model folder. There is no fake browser folder picker.
10. Run a short connection/model check on request, then return to the originating lesson with the chosen model remembered.

## What changes from the desktop design

| Capability | Browser implementation |
| --- | --- |
| Tutor, quiz generation, rubric feedback | Direct local `/api/chat`; no companion process |
| List models | `/api/tags`; validate selected model details with `/api/show` |
| Download model | `/api/pull` with progress and explicit user action |
| Identify running API | Successful version response; model loading is a separate state |
| Launch Ollama | User-clicked registered `ollama://` link where supported; manual fallback |
| Detect installation while stopped | Not reliably available; use “not connected,” not “not installed” |
| Full GPU / free VRAM detection | Not available through the documented browser/Ollama endpoints |
| Model recommendation | Installed-model metadata plus optional hardware input and an explicit performance check |
| VRAM display | `/api/ps` reports memory used by loaded models; never label it total/free VRAM |
| Choose or move model storage | Guided Ollama `OLLAMA_MODELS` instructions; website cannot inspect or move the library |
| Installation directory | Chosen in the official installer, not controlled by Soma |
| Phone access to PC model | Outside this first release; localhost on a phone refers to the phone |

CORS allows an **origin**, not a repository path: authorizing `https://rorrimaesu.github.io` applies to pages under that origin. Do not use `*`, change the bind address to `0.0.0.0`, disable browser protections, or create a public tunnel as a setup shortcut. Keep Ollama on loopback. The student can remove the origin permission later. Optional local-only Ollama mode is documented through `OLLAMA_NO_CLOUD=1`.

## One reusable tutor across the course

The current `dist/local-ai/app.js` stops at a desktop-download screen unless Tauri is present. Replace that browser branch with a browser connection adapter while retaining the desktop adapter for already installed users. The native companion currently uses port 11435; browser mode should use the normal Ollama service on 11434, not assume that private companion instance exists.

The current `learning-engine.js` imports only Chapter 3 and hard-codes Chapter 3 in the tutor instructions. `learning.js` assumes every topic has a Chapter 3 diagram. Refactor these into shared content adapters, not a tutor copy in every chapter:

- Chapter registry fields: AI availability, coverage description, section IDs, authored reference provider, lesson route and optional diagram provider.
- Preserve existing Chapter 3 source IDs, conversations and saved quiz identifiers. Give new sources stable chapter/section/lesson IDs; provide a migration/alias layer for topic links.
- Chapter 1: authored foundations, systems, cavities, membranes, regions, planes and directions; retain exact canonical textbook labels and accepted synonyms separately.
- Chapter 2: authored chemistry essentials grouped by official section. Disclose limited coverage rather than infer an entire textbook chapter from a small card bank.
- Chapter 3: reuse the existing reviewed lesson corpus.
- Chapter 4: use the 24 authored Tissue Studio lessons, terms and exact section links. Never assume a text-only model can inspect a micrograph. Give verified figure descriptions and link to the actual figure; image-capable tutoring would need its own validation.
- Future chapters add a content provider with the same contract, without duplicating transport, setup, conversation or grading code.

Retrieval is constrained to the selected chapter/section by default. A cross-chapter question can explicitly broaden scope and show which sources were used. Supply only relevant authored excerpts, not the complete PDF. Every response cites validated reference IDs mapped by our code to real textbook/lesson links. A valid citation identifier is not proof the model's statement is correct; retain clear AI labeling.

## Tutor and generated practice behavior

Reuse the existing Socratic flow: one useful question at a time, small hints on request, a direct explanation when requested, and correction of misconceptions without rewarding them. Include an **Explain this lesson** entry from every section and keep its learning context visible in the tutor.

Reuse and strengthen the existing structured-output validators:

1. Generate a short quiz from the selected references using Ollama JSON Schema output.
2. Validate question count, option uniqueness, source IDs, answer consistency and rubric structure before showing it. Reject malformed output with a friendly retry; do not present partial broken JSON.
3. Freeze the answer key and rubric before the student answers.
4. Grade multiple choice deterministically in the browser.
5. Grade written explanations against the frozen rubric, requiring evidence quoted from the student's answer. Show strengths, a specific misconception, a useful next question and exact reading links.
6. Mark AI-written-answer feedback provisional; retain the original answer and rubric for inspection or reassessment. Keep AI practice separate from reviewed chapter exam scores.
7. Save conversations, generated quizzes, drafts and model identity locally. Shared backup/reset behavior must explicitly distinguish reviewed chapter progress from saved AI conversations, as the current UI already does.

## Browser transport and failure handling

Add a small fetch-based adapter with a fixed loopback endpoint, bounded response sizes, timeouts, one active job and AbortController cancellation. Do not accept arbitrary remote model endpoints through a query parameter. Use the existing transport-shaped `invoke('chat', …)` interface or replace it with a typed common interface; do not fork the learning logic.

- `/api/version`: quick connectivity check.
- `/api/tags`: downloaded model inventory.
- `/api/show`: capabilities and remote-model metadata before use.
- `/api/chat`: schema-constrained tutor/quiz/assessment generation.
- `/api/pull`: streamed NDJSON progress; handle split JSON chunks, per-layer progress, errors and completion.
- `/api/ps`: optional loaded-model information after a user-requested check.

Use actual remote metadata (`remote_host`, `remote_model`) as well as model naming to exclude cloud-backed models; a local API URL alone does not guarantee local inference. Check capabilities rather than treating all installed embedding or reranker models as chat models. Never silently fall back to a cloud service. Display cancellation honestly: the browser can stop waiting, but must not promise every server-side operation has stopped without verification.

States should read **Not connected**, **Connecting**, **Permission needed / connection blocked**, **Connected — choose a model**, **Downloading**, **Loading model**, **Ready**, **Generating**, and **Needs attention**. Generic browser fetch failures can be ambiguous: present a short ordered checklist rather than a false diagnosis. Separate first model load time from generation speed; use a measured “worked on this computer” result, not an invented VRAM recommendation.

## Delivery phases and acceptance

1. Implement browser connection/setup and transport behind the existing AI route. Test from the real HTTPS Pages origin with current Edge and Chrome; localhost preview alone cannot validate local-network permissions. Verify CORS preflight and allowed/denied recovery. Publish.
2. Generalize the chapter corpus and UI, preserve Chapter 3 saved work, add contextual entry points to Chapters 1–4. Verify chapter-bound retrieval, missing-diagram fallback and exact textbook links. Publish.
3. Connect tutor, question generator and grading; test schema failures, invented references, CPU-only/slow models, insufficient memory, service stop/restart, empty model inventory, cloud rejection and cancellation. Publish.
4. Complete screenshot-led setup instructions and usability pass. Verify no Soma installer is required, no public network exposure, no page load probing, no answer-key leaks and no inaccurate installation/hardware claims. Publish.

No changes to the student's Ollama environment or browser permissions were made during this planning review. A read-only check of port 11434 on this computer found no reachable service at that moment; that is not evidence Ollama is uninstalled.

## Verified primary references

- Ollama FAQ — origins, environment variables, loopback binding, model directories and local-only mode: https://docs.ollama.com/faq
- API overview: https://docs.ollama.com/api/introduction
- Model inventory: https://docs.ollama.com/api/tags
- Loaded-model memory fields: https://docs.ollama.com/api/ps
- Chat / JSON Schema response format: https://docs.ollama.com/api/chat
- Structured outputs: https://docs.ollama.com/capabilities/structured-outputs
- Model downloads: https://docs.ollama.com/api/pull
- Chrome local network access: https://developer.chrome.com/blog/local-network-access
- Edge local network access (updated March 9, 2026): https://learn.microsoft.com/en-us/deployedge/ms-edge-local-network-access
- Ollama v0.35.0 application URL handling: https://github.com/ollama/ollama/blob/v0.35.0/app/cmd/app/app.go
- Windows protocol registration in that release: https://github.com/ollama/ollama/blob/v0.35.0/app/ollama.iss
- Model remote-host/capability fields: https://github.com/ollama/ollama/blob/v0.35.0/api/types.go
