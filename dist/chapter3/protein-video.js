export const proteinVideo = {
  src: './assets/protein-synthesis.mp4',
  poster: './assets/protein-synthesis-poster.webp',
  captions: './assets/protein-synthesis.en.vtt',
  chapterTrack: './assets/protein-synthesis.chapters.vtt',
  duration: 119.5,
  chapters: [
    {start: 0, end: 7, title: 'The big picture', text: 'From genetic instructions to protein: copy, read, fold. Let’s follow one tiny gene.'},
    {start: 7, end: 15, title: 'DNA in the nucleus', text: 'Inside the nucleus, DNA stores the instructions. Its paired strands separate only where one gene needs to be copied.'},
    {start: 15, end: 21, title: 'Start transcription', text: 'RNA polymerase binds a promoter, opening a small bubble to expose the template.'},
    {start: 21, end: 33.5, title: 'Build messenger RNA', text: 'During transcription, complementary bases build messenger RNA. T pairs with A, A with U, C with G, and G with C. RNA grows five prime to three prime.'},
    {start: 33.5, end: 38.5, title: 'Release the RNA', text: 'At the gene’s end, the RNA is released and the DNA closes.'},
    {start: 38.5, end: 46, title: 'Process the RNA', text: 'Processing removes the noncoding intron and joins the exons. The mature RNA keeps the same coding sequence.'},
    {start: 46, end: 53.5, title: 'Leave the nucleus', text: 'Messenger RNA travels through a nuclear pore into the cytoplasm. Each three-base group is a codon.'},
    {start: 53.5, end: 65.75, title: 'AUG: start translation', text: 'Translation begins at AUG. An initiator transfer RNA pairs its UAC anticodon with that start codon, bringing methionine. The ribosome assembles around them.'},
    {start: 65.75, end: 89, title: 'GGC + UUU: build the chain', text: 'GGC matches CCG, bringing glycine. Peptide bond: methionine joins glycine. Empty adapter out; ribosome forward. Then UUU pairs with AAA, bringing phenylalanine. The growing chain transfers onto phenylalanine. The ribosome advances again.'},
    {start: 89, end: 98.5, title: 'UGA: stop and release', text: 'UGA means stop. A release factor frees the chain. No amino acid is added. The ribosomal subunits separate.'},
    {start: 98.5, end: 109.5, title: 'Folding and function', text: 'Our tiny product is just three amino acids. The longer chain here illustrates protein folding: shape helps determine function.'},
    {start: 109.5, end: 119.5, title: 'Copy. Read. Fold.', text: 'DNA stores the recipe. Transcription copies it. Translation reads it. Folding shapes a functional protein. Copy, read, fold.'}
  ]
};

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const videoTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export function videoChapterAt(seconds) {
  return Math.max(0, proteinVideo.chapters.findLastIndex(chapter => seconds >= chapter.start));
}

export function renderProteinVideo() {
  return `<section class="protein-video" aria-labelledby="protein-video-title">
    <div class="panel video-feature">
      <div class="video-heading"><div><p class="eyebrow">WATCH THE PROCESS</p><h2 id="protein-video-title">Copy. Read. Fold.</h2><p>Follow one gene from DNA to messenger RNA to a growing amino acid chain.</p></div><span class="pill">1:59 · narrated animation</span></div>
      <figure class="video-figure">
        <video data-protein-player controls playsinline preload="metadata" poster="${proteinVideo.poster}" aria-label="Protein synthesis: narrated animation" aria-describedby="protein-video-help">
          <source src="${proteinVideo.src}" type="video/mp4">
          <track kind="captions" src="${proteinVideo.captions}" srclang="en" label="English">
          <track kind="chapters" src="${proteinVideo.chapterTrack}" srclang="en" label="Scenes">
          Your browser cannot play this video. <a href="${proteinVideo.src}">Open the MP4</a> or read the transcript below.
        </video>
        <figcaption id="protein-video-help">Press play when you’re ready. Use CC for captions and full screen for a closer look at the labels.</figcaption>
      </figure>
      <div class="video-meta"><p data-video-status role="status">Ready to watch · The big picture</p><a href="${proteinVideo.src}" download="Protein_Synthesis_Animation.mp4">Download video <span class="small">(39 MB)</span></a></div>
    </div>
    <ol class="video-memory" aria-label="Three steps to remember"><li><b>01 · Copy</b><span>Transcription copies DNA into RNA.</span></li><li><b>02 · Read</b><span>Translation reads codons to build a chain.</span></li><li><b>03 · Fold</b><span>A protein’s shape helps determine its function.</span></li></ol>
    <div class="video-support">
      <section class="panel video-scenes" aria-labelledby="video-scenes-title"><h3 id="video-scenes-title">Revisit a moment</h3><p class="muted small">Choose a scene to jump there. Press play to continue.</p><div class="video-chapters">${proteinVideo.chapters.map((chapter, index) => `<button data-video-chapter="${index}" aria-label="Jump to ${escape(chapter.title)}, ${videoTime(chapter.start)}"><span>${videoTime(chapter.start)}</span>${escape(chapter.title)}</button>`).join('')}</div></section>
      <aside class="panel video-check"><p class="eyebrow">PAUSE &amp; EXPLAIN · UNGRADED</p><h3>Why does UGA end the chain?</h3><p>Track AUG → GGC → UUU → UGA. Which codon doesn’t add an amino acid?</p><details><summary>Check your reasoning</summary><p>UGA is a stop codon. A release factor releases the Met–Gly–Phe chain; no amino acid is added at UGA.</p></details><button data-tab="lab" class="primary">Try another sequence in the lab →</button><p class="small muted">The lab uses a different example so you can test the same rules.</p></aside>
    </div>
    <details class="panel video-transcript"><summary>Read the narration transcript</summary><div>${proteinVideo.chapters.map(chapter => `<section><h3><span>${videoTime(chapter.start)}</span> ${escape(chapter.title)}</h3><p>${escape(chapter.text)}</p></section>`).join('')}</div></details>
    <p class="video-credit small muted">Original Soma animation and narration · Companion to OpenStax Anatomy and Physiology 2e, section 3.4. The short gene is a teaching example; the longer chain illustrates folding.</p>
  </section>`;
}

export function bindProteinVideo(root) {
  const player = root.querySelector('[data-protein-player]');
  if (!player) return () => {};
  const buttons = [...root.querySelectorAll('[data-video-chapter]')];
  const status = root.querySelector('[data-video-status]');
  let active = -1;
  const update = () => {
    const index = videoChapterAt(player.currentTime);
    if (index === active) return;
    active = index;
    buttons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    status.textContent = `Current scene · ${proteinVideo.chapters[index].title}`;
  };
  const showError = () => { status.textContent = 'Video unavailable. Try the download link or read the transcript below.'; };
  const listeners = buttons.map((button, index) => {
    const seek = () => {
      player.currentTime = proteinVideo.chapters[index].start;
      active = -1;
      update();
    };
    button.addEventListener('click', seek);
    return [button, seek];
  });
  player.addEventListener('timeupdate', update);
  player.addEventListener('loadedmetadata', update);
  player.addEventListener('error', showError);
  update();
  return () => {
    player.pause();
    player.removeEventListener('timeupdate', update);
    player.removeEventListener('loadedmetadata', update);
    player.removeEventListener('error', showError);
    listeners.forEach(([button, seek]) => button.removeEventListener('click', seek));
  };
}
