# Soma · Inside the Body

[Open the live study studio](https://rorrimaesu.github.io/Anatomy-Studio-Organs-Cavities-Membranes/)

An interactive companion to OpenStax *Anatomy and Physiology 2e*, inspired by [Soma Anatomy Studio](https://github.com/RorriMaesu/Soma-Anatomy-Studio).

## Study and practice

The course home organizes available content by textbook chapter. Each chapter has an overview, numbered sections, contextual textbook links, and a consistent Learn / Explore / Practice / Review pattern. Coverage is labeled: Chapters 1–2 have focused essentials and the anatomical atlas; Chapter 3 has lessons, diagrams, comparisons, process labs, flashcards and reviewed quizzes.

- Animated orbital artwork, chapter cards, transitions, an Effects switch, and reduced-motion support.
- Chapter-specific exams and custom chapter selection; Chapter 3 custom-exam coverage is concepts, while its dedicated exam includes diagrams and terms.
- Stable section/activity links, exact lesson and diagram resume locations, and unfinished reviewed quiz drafts.
- Reviewed progress and backup/restore across the atlas, Chapter 3 and AI history. Legacy scores are preserved without pretending old totals establish a latest correct answer.
- Chapter 3 concept answers in custom exams also update their canonical Cell Studio records.
- The original diagram labeling, original printed callouts, body-plane 3D model and six process labs remain available.
- Optional local AI currently supports Chapter 3. AI-generated feedback and practice remain separate from reviewed assessments.

Progress stays on the current browser/device. Desktop and browser storage do not automatically synchronize. The website uses the current course design; installed desktop releases contain their packaged frontend and need a separate release to gain website changes.

See [the experience plan](source/STUDENT-EXPERIENCE-PLAN.md). Public `/dist/chapter3/` links lead to the Chapter 3 overview. The atlas workspace remains at `/dist/atlas.html`.

## Run locally

From this folder, with Python installed:

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/dist/. A web server is required for JavaScript modules; opening the HTML as a local file is insufficient. All anatomical images are bundled; fonts optionally load from Google Fonts with local fallbacks.

With Node.js installed, run `npm test`. There are no package dependencies or build steps.

## Publishing

GitHub Pages publishes `main` from the repository root. The root HTML redirects to `dist/`. Push changes to `main` to update the live studio. Update the version query in `dist/index.html` and the data import in `dist/app.js` when publishing changed assets so returning browsers receive them together.

## Sources and license

- OpenStax *Anatomy and Physiology 2e*, supplied 2026 PDF, © Rice University, CC BY-NC-SA 4.0. Figures 1.4, 1.5, 1.12–1.17, 13.17, 22.14, 23.4 and 27.4 were extracted or cropped; removable label covers, anatomical markers, leader lines and plane highlights were added. Access for free at [openstax.org](https://openstax.org/details/books/anatomy-and-physiology-2e).
- [Man shadow with organs](https://commons.wikimedia.org/wiki/File:Man_shadow_with_organs.png), Mikael Häggström, CC0. Used as the transparent organ overview with added markers.
- [Female shadow anatomy without labels](https://commons.wikimedia.org/wiki/File:Female_shadow_anatomy_without_labels.png), Mikael Häggström, public domain. Included as a supplemental source asset.
- [Numbered serous membrane diagram](https://commons.wikimedia.org/wiki/File:112_Serous_Membrane_labeled.jpg), OpenStax, CC BY 3.0. Available through Sources & help as an extra worksheet.
- System illustration coordinates, extracted images and related teaching content adapted from the user's Soma Anatomy Studio under CC BY-NC-SA 4.0.

Code and educational adaptations are distributed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Third-party images retain their respective licenses. No OpenStax endorsement is implied.

## Chapter 3: Cell Studio

[Open Cell Studio](https://rorrimaesu.github.io/Anatomy-Studio-Organs-Cavities-Membranes/dist/chapter3/)

Chapter 3 has a separate page, navigation, question bank, chapter exam, and local progress record. The six modules cover sections 3.1–3.6 of the supplied textbook. Features include 53 concise lessons, 10 original interactive schematics with 78 label targets, 10 original labeled textbook figures, 152 contextual vocabulary entries, and 6 process labs. The 404-question practice bank includes 96 applied multiple-choice questions plus typed definitions and diagram identification/location.

The labs cover tonicity, secretion routing, DNA complementarity, transcription/translation, chromosome accounting through division, and stem-cell potency. Lessons include memory cues and common mistakes. Exams offer 30/60/all questions, balanced across modules; feedback waits until submission. Assisted responses are separate from independent recall, and missed questions can be retried. Unfinished sessions are not restored after a reload.

Source review and stage plan: [DEVELOPMENT](source/chapter3/DEVELOPMENT.md). Detailed curriculum mapping: [COVERAGE](source/chapter3/COVERAGE.md). Figure sources and schematic simplifications: [FIGURES](source/chapter3/FIGURES.md). Artwork and text are educational adaptations under CC BY-NC-SA 4.0. Ten reference figures retain their original labels; no new connector lines are added to them.

Chapter 3 is served directly from `dist/chapter3/`; there is no build step. The entry module is `studio.js`, with `content.js`, `diagrams.js`, `engine.js`, and `labs.js`. Chapter 3 browser storage uses `soma-cell-studio-v1`, separate from the older atlas. Run `npm test` for the complete suite.

## Local desktop companion

The Local AI page is linked from both studios. The Windows desktop edition adds a Chapter 3 Socratic tutor, generated quizzes and written-answer feedback through local Ollama models. It detects whether Ollama is installed and running, and provides a background-launch button, hardware suggestions, model downloads and library selection.

[Download Soma for Windows](https://github.com/RorriMaesu/Anatomy-Studio-Organs-Cavities-Membranes/releases/latest/download/Soma-Setup.exe), then choose **Set up my tutor**. Version 0.2.1 adds guided installation, existing-model reuse, automatic background startup, direct textbook links, and signed in-app updates. See [the desktop guide](source/local-ai/README.md) for setup, storage behavior, limitations, and build instructions. The website itself does not inspect your computer or run a local model.
