# Anatomy Studio — saved progress

Updated September 23, 2026. The original ZIP preserves the earlier checkpoint; this working repository has since been published and improved.

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
- Stage 3: six interactive labs, separate 404-question bank, balanced chapter exams, assisted scoring, answer review and retry, common typed-answer aliases, and persistent chapter-only scores. Validated before publication.
- Browser checks: diagram alignment, original image loading, all six labs, full practice and 30-question exam walkthroughs, compact desktop and mobile layouts. Unit tests cover model biology, lab actions, question-bank coverage, grading and quiz concealment.

## Review phase 1 — September 25, 2026

- Corrected a transcription schematic that used U in a DNA template; added strand-direction labels.
- Restored the original diagram and correct highlighted marker in Chapter 3 answer review.
- Unified early-ending skip records with regular answer history; prevented duplicate records.
- Added common singular/plural and RNA-name aliases, preserved keyboard focus on repeated controls, and added unfinished-session navigation warnings.
- 35 automated tests pass, including new regression cases. Corrected diagram visually verified locally.
