# Section 3.4 · Protein synthesis animation

The original narrated Soma animation is embedded in Chapter 3, section 3.4, under **Explore → Watch animation**. A discovery card also appears beside the protein-synthesis lessons.

Direct lesson link: `dist/chapter3/#module/protein/video`.

The activity accompanies [OpenStax Anatomy and Physiology 2e, 3.4 Protein Synthesis](https://openstax.org/books/anatomy-and-physiology-2e/pages/3-4-protein-synthesis). This animation is original project material, not an OpenStax video. It follows the repository’s CC BY-NC-SA 4.0 distribution terms; no OpenStax endorsement is implied.

## Media and teaching example

- `dist/chapter3/assets/protein-synthesis.mp4`: the approved final narrated export, unchanged; 119.5 seconds, 1920 × 1080, 30 fps, H.264 video with stereo AAC narration. Approximately 39 MB. The ordinary Git-tracked file is served directly by GitHub Pages.
- `protein-synthesis-poster.webp`: a full-resolution still from translation elongation.
- `protein-synthesis.en.vtt`: 28 timed English captions converted from the approved SRT without changing timing or narration.
- `protein-synthesis.chapters.vtt`: 12 scenes matching the final animation’s timing. `protein-video.js` carries the same scene boundaries and transcript.

DNA template: 3′–TAC CCG AAA ACT–5′. RNA: 5′–AUG GGC UUU UGA–3′. Anticodons, shown 3′ → 5′, are UAC, CCG and AAA. The peptide is Met–Gly–Phe. UGA recruits a release factor and adds no amino acid. The longer chain shown later illustrates folding; it is not the three-residue product. The existing process lab retains its different Met–Pro–Glu example.

## Player behavior

Playback is user initiated. Native controls provide pause, volume, captions, playback speed where supported, and full screen. Metadata is preloaded rather than requesting playback on page load. Caption and chapter tracks are same-origin assets with relative URLs, including under the GitHub Pages repository prefix. Scene buttons seek without starting paused playback. The current scene is announced only when it changes. Leaving the activity pauses the player and removes its event listeners.

The transcript, ungraded stop-codon question, scene list and lab link remain available without playing the video. The activity follows normal page scrolling on desktop and mobile; it does not clip the player or require a fixed-height viewport. Watching does not alter quiz scores or mastery records.

## Updating the export

Replace the MP4 and poster, update both WebVTT tracks and the scene metadata/transcript, then bump `protein-video-1` in the Chapter 3 entry HTML and the media import in `studio.js`. Run `npm test` and check playback, caption loading, scene seeking, route changes, narrow screens and zoomed layouts before publishing.
