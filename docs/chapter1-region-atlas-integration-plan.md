# Chapter 1 Region Atlas integration plan

Status: website integration implemented, with shared Chapter 1 navigation and assessment. Desktop installer release remains separate.

## Delivered
- All 52 original worksheet targets, stable regional IDs and source credits.
- Anterior/posterior study views, head close-ups, area filters, search, paged labels, memory/spelling cards and eight orientation recall cards.
- Shared naming/location practice, area/view scope, exact-alias grading, separate spelling feedback, targeted answer review and balanced chapter/custom exams.
- Existing Soma progress, backups, reset protection and draft resume; explicit optional import from the original same-origin atlas, preserving the original data and marking imported answers assisted.
- Keyboard marker activation and desktop fit checks; source worksheet bundled locally.

The detailed plan below records the design decisions. “Learn” currently uses orientation recall cards rather than a separate long-form lesson sequence. Both-view display was omitted to prioritize legibility; anterior/posterior switching remains one control. Spelling feedback is shown on submitted answers and review, without a separate spelling mastery score.


## Sources reviewed
- Live atlas: https://rorrimaesu.github.io/Anatomy-Physiology-Notes/Anatomy-Atlas/
- Source: https://github.com/RorriMaesu/Anatomy-Physiology-Notes/tree/main/Anatomy-Atlas
- Existing Soma chapter registry, atlas navigation, progress/reset implementation.

The source contains 52 worksheet targets (34 anterior, 18 posterior), including repeated regions seen from different views. It supplies the modified OpenStax Figure 1.12 worksheet, original callout anchors, accepted aliases, spelling suggestions, memory hooks, location notes, front/back/head-detail study views, typed answers and missed-question review.

## Integration decision
Port the worksheet, reviewed data and useful interactions into Soma's existing shell and assessment engine. Do not embed the entire external application in an iframe: duplicate headers, independent scores, competing motion settings and nested scrolling would fragment the learning experience. Bundle assets in this repository for predictable Pages and eventual desktop/offline use. Preserve source attribution, modifications notice and CC BY-NC-SA 4.0 information.

Primary location: Chapters > Chapter 1 > 1.6 Anatomical Terminology > Body regions.
Keep the official six textbook sections. Under 1.6 offer clearly named topics: Anatomical position & directions; Body regions; Body planes; Body cavities & membranes; Abdominal regions & quadrants. Avoid calling both surface regions and abdominal subdivisions simply “Regions.” Add a Body regions shortcut to the Chapter 1 overview. Keep organ systems under 1.2.

## Student workflow
- Learn: short orientation to regional terminology, anatomical position, anterior/posterior views and common-name versus regional-adjective forms. Link directly to OpenStax 1.6.
- Explore: front/back selector, optional both-view overview, labels toggle and head detail. Select a number or search a term to show location, terminology, mnemonic and spelling cue. Default to a fitted single body view for legibility.
- Practice: default ten questions; scope head/neck, trunk, upper limb, lower limb or all; front/back filters. Offer name-the-region and locate-the-region formats, with immediate explanation after an answer.
- Review: missed, assisted and spelling-needs-work results, each linking to the precise marker. Offer a focused retry and a fresh independent attempt.
- Chapter exam: sample regional questions alongside the other Chapter 1 topics so 52 targets do not overwhelm the exam. No labels, hints or answer-bearing accessible text until submission.

## Improvements required before import
1. Treat anatomical terms, common names and aliases as distinct data fields, not the first alias as the display title. Use original worksheet labels as the primary display and answer key (Frons, Cranium, Brachium, etc.); accept regional adjectives as alternatives. Verify every term and marker against Figure 1.12 before publication.
2. Assign stable semantic IDs to regions, views and question formats. Preserve source marker numbers for worksheet cross-reference; do not use array positions as permanent learning IDs. Repeated anterior/posterior targets must not inflate the count of distinct concepts.
3. Retain the original printed callout lines; add no duplicate connectors. Provide targeted crops and an optional detail overlay. At ordinary desktop sizes the diagram, answer and navigation must fit without scrolling; paginate/filter long term lists and use short detail tabs rather than a long side rail. Deliberate zoom may pan inside the image.
4. Keep exact accepted aliases separate from spelling suggestions. A valid answer naming another region is incorrect, not a typo. Close spelling should offer a correction without silently awarding full credit; distinguish identification confidence from spelling work.
5. Fix assistance tracking on import. The original labelsUsed flag is in memory and is not restored with answers. Persist assistance per attempt/question and separate study from a fresh test so reloading cannot make assisted work appear independent.
6. Replace automatic celebration on every grading action with restrained, meaningful completion feedback. Honor Soma's Effects setting and reduced motion.
7. Replace the source application's separate home links, score model and reset controls with Soma navigation and progress conventions. Keep the original atlas and Notes links in Sources.

## Progress and existing atlas attempts
Use Soma's existing reviewed-progress, draft, backup and reset paths. Preserve selected view/marker and in-progress answers. Ensure stale-tab reset protection covers the imported activity.
Both public projects currently share the rorrimaesu.github.io origin, so the old anatomy-atlas-progress-v1 record may be readable from the new site. Offer an explicit one-time import when found; never delete or rewrite the original. Import answers as an ungraded draft because the old record does not prove whether labels were used. Localhost and installed desktop storage remain separate. Do not claim automatic cross-device sync.

## Development and publication phases
1. Content and navigation foundation: extract data, audit all 52 anchors/aliases/notes, record source revision and credit, define stable IDs, add the 1.6 topic entry. Publish a functional first slice with explicit coverage.
2. Study experience: fitted views, labels, search/group filters, head detail and concise teaching cards in the shared shell. Verify keyboard, desktop and mobile layout. Push and verify Pages.
3. Practice and review: adapt the shared question bank, grading, spelling feedback and target-specific remediation. Verify no answer leakage in exams and no duplicate score accounting. Push and verify Pages.
4. Progress and assessment integration: optional old-draft import, resume, backup/restore, reset and balanced chapter/custom exams. Test cancellation, corrupt storage, reload after hint/labels, reset from another tab and desktop offline assets. Push and verify Pages.

Acceptance: every source target is accounted for; chapter numbering remains stable; navigation never traps students in another app; no desktop scrolling is needed for the default question/figure; all label controls work by keyboard; exam answers remain hidden; progress/reset/backup behavior is consistent; links and attribution survive publication. The desktop installer requires a separate release to receive the new bundled content.
