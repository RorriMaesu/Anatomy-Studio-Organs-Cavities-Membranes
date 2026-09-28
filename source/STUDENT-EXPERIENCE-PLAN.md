# Soma student experience review and migration plan

Reviewed September 28, 2026. Planning only; this document does not change the interface.

## Decision

Organize Soma around the textbook: course → chapter → textbook section → activity. Keep one application identity and a consistent layout. Cell Studio and the body atlas remain valuable collections of activities, but should not feel like separate applications with different navigation rules.

Preserve the successful elements: anatomical labeling, original textbook figures, 3D rotation, short lessons, memory cues, misconception explanations, reviewed quizzes, missed-question practice, and optional local tutoring. Change how students find and move between them.

## 1. Current journey and critique

| Student task | Current behavior | Consequence | Proposed correction |
| --- | --- | --- | --- |
| Begin studying | Main page restores a prior atlas section or opens Organs & systems | No clear course overview or first-time starting point | Course home with chapter library and explicit Continue studying card |
| Find a chapter | Sidebar mixes six anatomy topics with Chapter 1, 2, and 3 essentials, numbered 01–09 | Sidebar numbers can be mistaken for textbook chapters; adding chapters will make this list unwieldy | Chapter selector plus sidebar containing only the current chapter's numbered textbook sections |
| Study Chapter 3 | Main atlas has 96 concept cards; Cell Studio has six modules, diagrams, labs, and a broader question bank | Two apparent versions of Chapter 3; unclear which is complete or authoritative | One Chapter 3 home and one section-based learning flow; quick review becomes a mode of the same bank |
| Change activities | Atlas uses Study atlas/Practice/Full exam; Cell Studio has seven activity tabs; AI has another menu | Students repeatedly relearn controls and vocabulary | Reuse Learn, Explore, Practice, Review in the same positions |
| Return to another chapter | Cell Studio links say Chapters 1–2 and Organs & body atlas; companion logo returns to Cell Studio | Inaccurate or surprising destinations; no universal Home | Logo always opens course home; Chapters always opens the chapter library |
| Open a section from a bookmark | Selection is mostly JavaScript state rather than the URL | Copying links loses topic/activity; browser Back does not retrace section selection | Stable chapter/section/activity URLs and normal browser history |
| Resume work | Stores selected section and stats, but not the complete lesson position or unfinished reviewed quiz | Students must reconstruct their place; interrupted attempts are lost | Resume explicit lesson/activity and save reviewed-quiz drafts with clear discard/continue options |
| Understand progress | Atlas, Cell Studio, and AI have independent storage; a latest correct answer can be presented as recalled/mastered | Counts disagree; duplicate questions can look like separate learning accomplishments | Shared reviewed-question IDs and progress definitions; AI results labeled separately |
| Find textbook material | Sources, footer links, original-figure tab, and AI source cards use different locations | A footer may open the chapter introduction rather than the exact section | Consistent Read textbook control, labeled with section number, plus figure-level credits |
| Choose an exam | Full exam currently means a mix of the atlas's nine sections; Chapter exam means Cell Studio only | Scope depends on which interface the student entered | Explicit Section practice, Chapter exam, Custom exam; show included chapters before starting |
| Install AI | Installation page, guide, desktop readiness, and study home are separate experiences | Students may infer installation is required for ordinary studying | Contextual optional tutor action; preserve study location throughout setup |
| Use a smaller display | Fixed desktop cards reduce scrolling but accumulate controls and lengthy content | Added navigation risks clipping, tiny type, or multiple scroll areas | Fit the core study task at normal desktop size; allow accessible reflow on small screens and zoom |

Evidence: inspected atlas source and live local preview, Chapter 3 map and section 3.1 controls, companion landing/home/setup code, question banks, saved-state keys and navigation handlers. This is an expert review, not a completed student usability study.

## 2. Information architecture

Course home: Continue studying; Find a chapter; Review previous work. Do not make a decorative hero consume the main working area.

Chapter library: numbered chapters using official textbook names, searchable by number, title, and topic. Group into textbook units when populated. Show coverage honestly: available, partial, or planned. Planned chapters are informative, not empty clickable lessons. Do not claim Chapter 2 is complete merely because it has essentials cards. No list of every section from every chapter in the persistent sidebar.

Chapter home: chapter number/title, a concise purpose, outcomes, numbered section list, coverage indicators, Continue/Start chapter, Chapter exam, and Read textbook. Show the student's last location explicitly, for example Continue 3.2 · Golgi apparatus, rather than Enter the studio. Exams remain available without forced sequential completion.

Section workspace: breadcrumb, section title, textbook link, activity controls, primary activity, concise supporting explanation, and unambiguous Previous/Next controls. On the last lesson, Next lesson becomes Continue to section 3.2 rather than silently wrapping.

Example journey: Chapters → 3 The Cellular Level of Organization → 3.1 The Cell Membrane → Explore → Osmosis activity → Practice this section → Review missed answers → Return to 3.1.

## 3. Shared layout contract

- Global header: Soma logo → course home; chapter selector; Review & progress; Help. App/model configuration belongs in Settings, not the main learning path.
- Desktop sidebar: Chapter overview, current chapter's textbook sections, Chapter exam. Official section numbers and titles remain visible. Friendly subtitles may supplement textbook names.
- Main heading: breadcrumb such as Chapters / Chapter 3 / 3.1, official section title, contextual Read textbook link.
- Activity row, always ordered: Learn | Explore | Practice | Review. For an unavailable activity, explain its coverage on chapter home; do not open an empty panel. Chapters may add capabilities within Explore without creating new top-level navigation.
- Main workspace: large diagram or lesson on the left; the currently relevant explanation on the right. On mobile, stack in reading order and keep controls close to their content.
- Footer controls: Previous lesson, Lesson 2 of 11, Next lesson; distinguish changing a card, diagram, and textbook section. Avoid several unlabeled Next buttons on one screen.
- Tutor: Ask about this topic opens an optional contextual companion. Show chapter/section and support status; currently only Chapter 3 has a reviewed AI corpus. Do not imply whole-book AI grounding before it exists.

## 4. Activity organization

Learn: short explanations, objectives, key terms, memory cues, and common mistakes. Put analogies next to the relevant idea, rather than forcing tab switching for every paragraph.

Explore: gallery of clearly named diagrams and interactive activities. Each tile says Label diagram, Compare concepts, 3D model, or Process activity. Diagram view offers Labels on/off, Select structure, Reset view, and a reference-figure option. Keep original textbook figures near the matching interactive diagram. Provide keyboard alternatives, visible selected-target state, clear anatomical orientation, and stable fit-to-view behavior.

Practice: default Start 10-question practice for the current section. Offer Flashcards as a clearly ungraded recall mode. Place format, count, topic filter, and missed/untried choices under Customize. State when questions use diagrams and when a chapter has concept-only coverage. Keep reviewed questions and AI-generated practice visibly distinct; AI-generated scores are not an authoritative chapter exam score.

Review: missed, assisted, and not-yet-attempted reviewed questions; explanations and links back to the exact lesson/figure. Show answered correctly without a hint, rather than a mastery claim based on one attempt. Let students retry a small set with one action.

Chapter exam: includes only that chapter and states scope, available formats, number of questions, and when feedback appears. Custom exam: explicit chosen chapters/sections and an inclusion summary. Preserve a shortcut for the existing Chapters 1–3 combined assessment.

## 5. Progress and navigation rules

Give each reviewed concept, diagram target, and question a stable ID. Both quick review and deeper practice reference the same content; formats remain distinct where they test different skills. Preserve legacy records and expose migration limitations rather than guessing equivalence or fabricating attempt history.

Separate lesson visits/completion, independent answers, assisted answers, and AI practice history. A lesson visit is not mastery. Save current chapter, section, activity, lesson/diagram, and reviewed-quiz draft. Do not store unfinished AI generation as if it were a completed quiz. Offer backup/restore across all progress areas.

Use GitHub Pages-compatible routes, for example /dist/#/chapter/3/section/3-1/explore. Routes must survive refresh, support browser Back/Forward, and open the exact section from results or textbook-reference actions. Keep existing /dist/chapter3/ and /dist/local-ai/ links working through redirects or adapters. Warn only for actual unsaved work. Preserve previous study location when opening a tutor or installer help.

Browser and desktop storage are different contexts. Explain that progress remains on this browser/device and does not automatically sync. A shared schema is not automatic synchronization.

## 6. Display and accessibility rules

At ordinary desktop sizes, the active diagram, essential explanation, and next action should fit together without alternating vertical scrolling. Do not meet this goal by shrinking text to illegibility or hiding content. Use shorter paged lesson segments and expandable optional detail.

At 200% zoom, small windows, or mobile sizes, permit natural vertical scrolling and reflow. Avoid forced viewport locking, clipped controls, horizontal scrolling, and nested scroll traps. Apply the same principle to the installation tutorial: one clear step, visible progress, expandable background details, readable screenshots, and clear Previous/Next.

Keep typography, spacing, button wording, active states, and keyboard focus behavior consistent. Use color as a supplemental signal only. Topic themes can change accent colors/artwork while navigation stays fixed. Respect reduced motion and bundle essential fonts/assets for the offline desktop experience.

## 7. Staged implementation

1. Inventory and navigation foundation. Map every existing lesson, figure, lab, quiz, and AI reference to a chapter and textbook section. Create the chapter registry and shared route vocabulary; identify partial coverage. Correct misleading chapter labels and stale README counts. Exit check: no content is lost or assigned silently to the wrong textbook section.
2. Course and chapter entry points. Build course home, searchable chapter library, shared header, breadcrumbs, and chapter overview template. Keep existing activities reachable while migrating. Exit check: a new student can identify available chapters and open 3.1 without knowing what Cell Studio means.
3. Pilot the section template in Chapter 3. Consolidate the atlas's Chapter 3 cards and Cell Studio under one chapter flow; organize all existing features into Learn/Explore/Practice/Review. Keep diagrams, lab controls, and source attribution intact. Exit check: all six sections have the same layout and no duplicated/conflicting progress display.
4. Migrate Chapters 1 and 2. Map the topical atlas into textbook sections while retaining a useful optional diagram-library index. Mark later-chapter extensions visibly and exclude them from ordinary chapter exams by default. Chapter 2's missing activity types remain honestly labeled. Exit check: chapter changes never require students to relearn navigation.
5. Unify assessment, progress, and resume. Add stable IDs, migrate historical state conservatively, restore unfinished reviewed attempts, implement Chapter/Custom exams, contextual answer review, and backup/restore. Exit check: refresh, return visits, and cross-entry practice retain truthful scores and position.
6. Contextual tutor and setup. Carry supported chapter/section into tutor and AI quiz prompts. Keep the selected study topic visible through install/readiness flows. Use an explicit unsupported-topic state until further reviewed corpora exist. Exit check: ordinary studying remains available regardless of AI readiness.
7. Usability and release validation. Test first-time and returning journeys, mobile/reflow, keyboard operation, labels, deep links, old URLs, exam boundaries, and browser/desktop differences. Publish each completed phase to GitHub Pages. Package and test desktop updates separately before promising feature parity.

## 8. Acceptance tasks

- From course home, open Chapter 3 section 3.1 in no more than three intentional selections.
- From any activity, identify current chapter, section, activity, and how to return to chapter overview.
- Switch chapters without returning through another studio's branded home.
- Open the exact textbook section with one action.
- Start reviewed section practice without setting model or installation options.
- Move from a missed question to its matching concept/diagram and back to review.
- Refresh a lesson or reviewed quiz and resume the same place with accurate recorded answers.
- Confirm Chapter 3-only exams contain no Chapter 1–2 questions; custom exams state their included chapters.
- Confirm the same concept cannot gain misleading duplicate completion just by entering through a second page.
- Complete the main journeys at 1366×768, 1920×1080, a 390-pixel mobile viewport, and 200% zoom; keyboard focus remains visible and controls reachable.
- Open legacy public URLs, copy deep links, use Back/Forward, and use the native desktop's textbook/window links successfully.
- Add a future chapter through the registry and its content package without inventing another navigation system.

## Implementation boundaries

This review recommends phased reorganization, not a wholesale rewrite or removal of existing learning tools. No paid service is required. Genuine Chrome/Firefox/Windows installation screenshots are still a separate outstanding asset task; existing illustrations must remain labeled until replaced with real captures. UI changes and desktop binaries must be validated and released separately.
