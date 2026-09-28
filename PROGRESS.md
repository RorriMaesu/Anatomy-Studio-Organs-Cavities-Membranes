# Anatomy Studio — saved progress

Updated September 25, 2026. The original ZIP preserves the earlier checkpoint; this working repository has since been published and improved.

Live studio: https://rorrimaesu.github.io/Anatomy-Studio-Organs-Cavities-Membranes/

## Implemented

- Eight learning sections: organs and systems, cavities, membranes, abdominal regions and quadrants, body planes, directions and position, Chapter 1 essentials, and Chapter 2 chemistry.
- Extracted OpenStax textbook illustrations, an openly licensed online organ diagram, and source credits.
- Study labels, numbered anatomical targets, diagram zoom, explanations, mnemonics, and common mistakes.
- Section practice with multiple choice, typed labels, location questions, hints, and assisted-answer accounting.
- Full exams, answer review, section scores, and retries of missed or assisted questions.
- Browser-local learning history and preferences.
- Seven automated checks passed, covering assets and targets, typed aliases, scoring, balanced exams, question banks, unavailable storage, preserved drafts, and diagram context in results.
- A complete 40-question browser exam reached the expected score and kept feedback hidden until submission. Retrying its 39 missed questions produced a 39-question practice session.
- Phone checks at 390px covered all eight sections and 22 diagrams. Crowded organ and pleural markers were separated. Diagram zoom scrolls inside its panel without widening the page.
- Results now include the original diagram and the correct structure marker. Typed answers survive zoom and hint requests.
- Dorsal, ventral and abdominopelvic cavity targets bring the atlas to 92 labeling targets, plus 95 concept questions.

## Publication

### Original callout lines — September 24, 2026

- Removed added connectors from all textbook diagrams. Organ-system labels use the original leader ownership and source coordinates; membrane, cavity and plane labels have explicitly mapped printed paths.
- Close-up labels follow the visible portion of the original line, including bent and branched paths. Added connectors remain only on the unlabeled online torso composite.
- Adjusted membrane crops to retain printed pointers without fragments of neighboring labels. Compact desktop cavity diagrams place the key beneath the figure to preserve marker spacing.
- Thirteen automated checks cover source-line anchors, crop intersections, no duplicate strokes, quiz scoring and previous regression cases. Browser checks covered atlas label spacing at 1366×768 and 1024×768, plus a three-question membrane location session with correct scoring.

### Desktop and diagram clarity update — September 23, 2026

- Replaced scrolling/zoomed desktop figures with fitted SVG viewports. Teaching cards use tabs; concepts, sources and answer review use pagination.
- Added a dedicated testis/epididymis image from textbook Figure 27.4. Added enlarged membrane views and enabled individual small-organ crops from the original geometry.
- Marker leader lines end in open rings so narrow layers remain visible. Shared location-quiz crops preserve every answer candidate.
- Moved sagittal/frontal markers to separate visible portions of their planes and added cutting-surface outlines. Definitions and plane orientation were checked against OpenStax §1.6; the original source definitions were already correct.
- Added selectable close-up panels for directional and surface-region reference figures.
- Ten automated tests pass, including crop coverage, no premature answer highlighting in location quizzes, pagination and quiz regression checks.
- Browser verification: all 22 atlas views at 1366×768 and 1280×720; section navigation, all Chapter 1/2 essentials recall cards, sources, membrane practice and a complete 40-question exam at 1024×768. Compact 1280×600 checks covered the longest label keys and teaching cards. Mobile detail controls checked at 390px.

- The saved checkpoint was committed and pushed to https://github.com/RorriMaesu/Anatomy-Studio-Organs-Cavities-Membranes.
- GitHub Pages is enabled for the main branch at the repository root; its initial deployment returned HTTP 200.
- Subsequent improvements are published through the same branch. See the Git history for each version.

## Run the saved studio

Extract the ZIP, open a terminal in the extracted project folder, and run:

```text
python -m http.server 8766 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8766/dist/ in a browser. JavaScript modules require this local web server; opening the HTML directly from the filesystem is insufficient.

With Node.js installed, run `npm test` to run the automated checks. No package installation is needed.

## Files and scope

`dist/` contains the application, learning content, and image assets. `tests/` contains automated checks. The root HTML forwards visitors to `dist/`.

This ZIP saves the project files. Browser-only quiz history and any in-progress quiz are not included. Git internals and temporary working files are excluded. The full source textbook PDF is not bundled; the extracted figures used by the studio are included.

The atlas covers major introductory structures, not every named organ or membrane in the human body. Meninges and additional membrane concepts are marked as extensions. See Sources & help in the application for attribution and licensing; OpenStax-derived adaptations use CC BY-NC-SA 4.0.


## Chapter 3 Cell Studio (2026-09-25)

- Stage 1 (`bcf0935`): separate chapter page, six-module map, development plan and link from the original atlas. Published successfully.
- Stage 2 (`d90feca`): 53 lessons, 10 schematic diagrams/78 targets, 10 textbook figures, 152 vocabulary entries and recall cards. Published successfully.
- Stage 3 (`0362a68`, published): six interactive labs, separate 404-question bank, balanced chapter exams, assisted scoring, answer review and retry, common typed-answer aliases, and persistent chapter-only scores. Validated before publication.
- Browser checks: diagram alignment, original image loading, all six labs, full practice and 30-question exam walkthroughs, compact desktop and mobile layouts. Unit tests cover model biology, lab actions, question-bank coverage, grading and quiz concealment.

## Review phase 1 — September 25, 2026

- Corrected a transcription schematic that used U in a DNA template; added strand-direction labels.
- Restored the original diagram and correct highlighted marker in Chapter 3 answer review.
- Unified early-ending skip records with regular answer history; prevented duplicate records.
- Added common singular/plural and RNA-name aliases, preserved keyboard focus on repeated controls, and added unfinished-session navigation warnings.
- 35 automated tests pass, including new regression cases. Corrected diagram visually verified locally.


## Review phase 2 — September 25, 2026

- Six Compare activities pair concise distinctions with revealable reasoning checks.
- Focused practice can revisit saved misses/assisted answers or select untried questions; matching counts and empty-state guidance update immediately.
- Diagram markers stay legible when disabled for quiz/review.
- 37 automated checks pass. All six modules' updated panels fit at 1024×768; phone comparisons stack cleanly. A complete focused location session and empty retry state were verified.
- See `source/chapter3/REVIEW.md` for findings, verification, and remaining scope limits.

## Local AI phase 1 — September 27, 2026

- Added a Windows Tauri desktop shell, hardware inventory, distinct installed/running/ready states, and a hidden local-only Ollama session launcher.
- Added native folder/executable selection, official installer guidance with signature verification, model downloads with progress/cancellation, and verified library copying that preserves originals.
- Added a public Local AI entry page linked from both study studios. Native controls are disabled on the website; desktop distribution follows in phase 3.
- 40 JavaScript checks and 2 native checks pass. End-to-end desktop verification is pending the completed learning interface.

## Local AI phase 2 — September 27, 2026

- Added a source-grounded Chapter 3 Socratic tutor with hints, direct explanations, and the existing verified diagrams.
- Added structured quiz generation, frozen answer keys/rubrics, deterministic choice grading, criterion-based written-answer feedback, and review flags for unsupported evidence.
- Added local conversation/quiz history, reassessment history, and JSON backup import/export.
- 44 JavaScript checks pass, covering source validation, malformed quizzes, retrieval, grading evidence and legacy studios. Native/live-model verification follows before the desktop release.

## Local AI phase 3 — September 27, 2026

- Hardened unavailable-drive handling and added discovery of common existing libraries without changing global Ollama settings.
- Confirmed the background launch button starts a local-only session; installed model detection, conversation, quiz scoring, persistence, and backup export were exercised in the desktop app.
- Added independent structured-output constraints, bounded repair, guaranteed mixed-format batches, saved answer drafts, visible navigation and assessment history.
- 46 JavaScript checks and 2 Rust checks pass. Live local-model checks cover valid written-question generation and correct/partial/wrong/injected/negated answers.
- Built the Windows x64 NSIS installer. Installer and checksum will be distributed through GitHub Releases; models and local data are not published.
- Documented setup, data storage, model migration, source grounding and verification limits in source/local-ai/README.md.

Phase 4 — Guided setup and student navigation (2026-09-27)
- Replaced the technical dashboard with a guided setup and study home.
- Website uses a direct Windows installer download and browser-study alternative.
- Tutor starters, simpler quiz defaults, and prominent topic-specific OpenStax links.
- Existing model reuse, hardware suggestions, optional storage settings, and actionable errors.
- Native installation automation follows in the next desktop release; published installer remains 0.1.0 until that release is ready.
- Validation: all 46 existing JavaScript checks pass.

Phase 5 — Native guided installation and update delivery (2026-09-27)
- Official Ollama download, disk preflight, publisher verification, custom install folder, completion monitoring and cancellation.
- Existing models reused; explicit download choice; model readiness check; remembered setup and automatic background startup.
- Separate study windows keep setup operations alive, and native textbook links open in the user's browser.
- Signed updater support with an explicit Update and restart action. Windows Authenticode signing remains unconfigured.
- 50 JavaScript and 3 Rust checks passed. Existing-user desktop flow visually checked; clean-machine installation and future-version update require additional coverage.

Phase 6 — Desktop 0.2.0 published (2026-09-28)
- Published Soma-Setup.exe, updater signature, and SHA-256 checksum in desktop-v0.2.0.
- Website now uses a stable direct installer link; update manifest points to the exact versioned asset.
- Live readiness check passed with the existing qwen3:8b model; reopening the release build automatically reconnects and opens Study home.
- Tutor controls and textbook entry points visually reviewed at desktop size.

Release correction — 0.2.1 (2026-09-28)
- Final native UI testing exposed a blank secondary study window caused by creating a Windows WebView inside a synchronous command.
- Moved study-window creation into an asynchronous Tauri command to avoid blocking the Windows message loop.
- The 0.2.0 release is marked prerelease; 0.2.1 supersedes it after a live secondary-window verification.
- Desktop update check successfully read the published feed; external textbook navigation opened OpenStax 3.1 in the system browser.

Desktop 0.2.1: packaged secondary-window test passed with the full chapter map visible. Installer, signature and checksum published; stable download and updater feed now select 0.2.1.


## 2026-09-28 · Free installation guide
Four-step guide with Edge, Chrome, Firefox and Windows guidance, source checks, a real supplied Edge screenshot, clearly labeled illustrations elsewhere, and an online-study alternative. No security settings changed. Fresh browser screenshots remain to be captured where available.

## 2026-09-28 · Chapter 3 in the main atlas
Added Chapter 3 essentials as section 09, sharing all 96 reviewed Cell Studio questions across six textbook topics. Recall cards link directly to their OpenStax section; practice grades answers; full exams balance all nine sections. Existing Cell Studio diagrams remain one click away. All 51 JavaScript checks pass; browser preview confirms the section fits the desktop viewport. Website changes do not replace the previously packaged desktop installer.

