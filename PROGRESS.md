# Anatomy Studio — saved progress

Snapshot saved September 23, 2026.

## Implemented

- Eight learning sections: organs and systems, cavities, membranes, abdominal regions and quadrants, body planes, directions and position, Chapter 1 essentials, and Chapter 2 chemistry.
- Extracted OpenStax textbook illustrations, an openly licensed online organ diagram, and source credits.
- Study labels, numbered anatomical targets, diagram zoom, explanations, mnemonics, and common mistakes.
- Section practice with multiple choice, typed labels, location questions, hints, and assisted-answer accounting.
- Full exams, answer review, section scores, and retries of missed or assisted questions.
- Browser-local learning history and preferences.
- Six automated checks passed in the last test run, covering assets and targets, typed aliases, scoring, balanced exams, question banks, and unavailable storage.
- Desktop browser checks covered section navigation, hidden labels, typed-answer grading, hints, and starting an exam.

## Remaining before publication

- Finish browser testing of full-exam completion, missed-question retry, and small-screen layouts.
- Complete a final visual check of diagram targets and label covers at different sizes.
- Commit and push the project to https://github.com/RorriMaesu/Anatomy-Studio-Organs-Cavities-Membranes.
- Enable GitHub Pages and verify the published site. The project has not yet been published.

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
