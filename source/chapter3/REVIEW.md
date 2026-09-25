# Studio review — September 25, 2026

## Scope

Reviewed the Chapter 3 content model, original schematics, all six process labs, assessment generation and grading, browser-local history, navigation and responsive layouts. Compared terminology with the supplied chapter's key-term pages and checked the DNA/RNA distinction against OpenStax §3.4. Ran the original Chapters 1–2 regression suite, including figure anchors, crops, exam balance, storage fallback, and the Blender plane orientations/depth behavior covered by the existing checks.

## Phase 1: corrections (03e287d)

- The transcription drawing used U in the DNA template. Replaced it with T and added 5′/3′ orientation to distinguish DNA from the growing RNA.
- Chapter 3 results lacked the diagram for a missed location/label answer. Review now restores that figure and highlights the correct marker; its controls cannot submit another answer.
- Early session termination previously marked questions skipped only in the result, leaving their saved history inconsistent. Both paths now share answer recording, without double-counting an already submitted answer.
- Accepted common equivalent RNA names and singular/plural anatomy terms. Empty normalized input cannot be correct.
- Retained keyboard focus across lesson pagination and tab/label controls. Chapter links and reloads warn before discarding an unfinished quiz.

## Phase 2: learning improvements

- Added a Compare activity in all six modules. Three concise cards and a revealable reasoning question distinguish commonly confused processes and structures.
- Added practice filters for previously missed/assisted and not-yet-attempted questions. Counts follow both the selected focus and format; an empty pool explains what to change and disables starting.
- Kept informational diagram markers at full contrast when their buttons are disabled.
- Clarified source/help text and corrected the stale progress-document date.

## Verification

- 37 automated checks pass, including new regression cases for early termination, inert diagram review, grading aliases, the corrected DNA drawing, focused practice, and hidden comparison answers.
- At 1024×768, all six modules' Compare (answer revealed), Practice, Diagram atlas, Textbook and Experiment panels had no measured vertical/horizontal overflow.
- A saved-mistake location practice finished with the expected 1/1 score and correct diagram marker. Reopening its retry pool correctly showed zero questions and disabled Start.
- At 390×844, the comparison cards stacked without horizontal overflow or clipped text.
- The corrected transcription diagram and diagram-answer review were visually inspected.

## Scope limits and useful future work

The 404-question bank includes different formats for the same structures, not 404 unique biological concepts. The schematics intentionally simplify processes; the original figures remain available for comparison. Scores are browser-local, and unfinished sessions still cannot resume after a reload. A future resume/export feature and additional varied DNA sequences would be useful enhancements; this review does not claim exhaustive anatomical coverage beyond the stated introductory scope.

Sources: supplied OpenStax PDF, Chapter 3, printed pp. 85–128; [protein synthesis](https://openstax.org/books/anatomy-and-physiology-2e/pages/3-4-protein-synthesis); [Chapter 3 key terms](https://openstax.org/books/anatomy-and-physiology-2e/pages/3-key-terms).
