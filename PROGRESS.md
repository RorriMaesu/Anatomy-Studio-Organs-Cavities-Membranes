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
