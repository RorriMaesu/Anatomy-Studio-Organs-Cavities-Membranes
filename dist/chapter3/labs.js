// Chapter 3 process labs. All drawings are original, simplified learning models.
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dnaPairs = {A:'T', T:'A', C:'G', G:'C'};
const rnaPairs = {A:'U', T:'A', C:'G', G:'C'};
const codonTable = {AUG:'Met', CCU:'Pro', GAA:'Glu', UAA:'Stop'};
const template = 'TACGGACTTATT';
const replicationTemplate = 'ATGCCA';
export function complementaryDNA(strand) {
  if (!/^[ATCG]*$/i.test(strand)) throw new Error('DNA uses A, T, C and G only.');
  return [...strand.toUpperCase()].map(base => dnaPairs[base]).join('');
}
// Input is a template read 3′→5′; output is the complementary RNA written 5′→3′.
export function transcribeTemplate(strand) {
  if (!/^[ATCG]*$/i.test(strand)) throw new Error('DNA uses A, T, C and G only.');
  return [...strand.toUpperCase()].map(base => rnaPairs[base]).join('');
}
export function translateExample(rna) {
  if (rna.length % 3) throw new Error('Use complete triplets.');
  const peptide = [];
  for (let index = 0; index < rna.length; index += 3) {
    const amino = codonTable[rna.slice(index,index+3)];
    if (!amino) throw new Error('This short example supports AUG, CCU, GAA and UAA.');
    if (amino === 'Stop') break;
    peptide.push(amino);
  }
  return peptide;
}
export function tonicityEffect(outside, inside = 300) {
  if (!(outside > 0 && inside > 0)) throw new Error('Concentrations must be positive.');
  if (outside < inside) return {kind:'hypotonic', direction:'in', change:'swells', scale:1.24, explanation:'Net water enters the cell toward the higher concentration of nonpenetrating solute. The cell swells; enough water entry can cause lysis.'};
  if (outside > inside) return {kind:'hypertonic', direction:'out', change:'shrinks', scale:.72, explanation:'Net water leaves the cell toward the higher concentration of nonpenetrating solute outside. The cell shrinks (crenates).'};
  return {kind:'isotonic', direction:'balanced', change:'stays the same', scale:1, explanation:'Water still crosses in both directions, but there is no net movement. Average cell volume stays the same.'};
}
export const divisionStages = [
  {id:'g1', name:'G₁', group:'Interphase', chromosomes:4, dna:4, count:'4 chromosomes · 4 DNA molecules', human:'Human model: 46 chromosomes, 46 DNA molecules.', text:'Grow, perform normal functions, and make cellular components. Each chromosome contains one DNA molecule. Chromatin is loose, not X-shaped.', cue:'G = growth. The cell is active during interphase.'},
  {id:'s', name:'S', group:'Interphase', chromosomes:4, dna:8, count:'4 chromosomes · 4 → 8 DNA molecules', human:'Human model: 46 chromosomes; DNA molecules increase from 46 to 92.', text:'Copy the DNA. Each chromosome acquires two sister chromatids, joined at the centromere. DNA amount doubles; chromosome number does not.', cue:'S = synthesis of DNA. This picture shows the end of S phase.'},
  {id:'g2', name:'G₂', group:'Interphase', chromosomes:4, dna:8, count:'4 chromosomes · 8 DNA molecules', human:'Human model: 46 chromosomes, 92 DNA molecules.', text:'Continue growing and prepare for division. The copied DNA is still uncondensed chromatin. The cell checks readiness before entering mitosis.', cue:'A copied chromosome is still one chromosome while its sisters are joined.'},
  {id:'prophase', name:'Prophase', group:'Mitosis', chromosomes:4, dna:8, count:'4 chromosomes · 8 DNA molecules', human:'Human model: 46 chromosomes, 92 DNA molecules.', text:'Chromatin condenses into visible chromosomes. The spindle forms; the nuclear envelope breaks down by late prophase. Spindle fibers attach at kinetochores.', cue:'Prophase = prepare. Each X is one copied chromosome, not two.'},
  {id:'metaphase', name:'Metaphase', group:'Mitosis', chromosomes:4, dna:8, count:'4 chromosomes · 8 DNA molecules', human:'Human model: 46 chromosomes, 92 DNA molecules.', text:'Chromosomes line up individually at the metaphase plate. Each sister chromatid is attached to spindle fibers from the opposite pole.', cue:'Metaphase = middle. Homologous pairs do not pair up in mitosis.'},
  {id:'anaphase', name:'Anaphase', group:'Mitosis', chromosomes:8, dna:8, count:'8 chromosomes in one cell · 4 toward each pole', human:'Human model: briefly 92 chromosomes in one cell; 46 move toward each pole.', text:'Sister chromatids separate. Each separated chromatid is now a chromosome. The total number briefly doubles within the still-undivided cell.', cue:'Anaphase = apart. No new DNA is made here.'},
  {id:'telophase', name:'Telophase', group:'Mitosis', chromosomes:8, dna:8, count:'4 chromosomes per nucleus · 2 nuclei', human:'Human model: 46 chromosomes in each new nucleus.', text:'Nuclear envelopes reform around the two chromosome sets. Chromosomes uncoil, nucleoli return, and the spindle disassembles. Cytokinesis can overlap this stage.', cue:'Telophase = two nuclei. Nuclear division is completing.'},
  {id:'cytokinesis', name:'Cytokinesis', group:'Cytoplasmic division', chromosomes:4, dna:4, count:'4 chromosomes · 4 DNA molecules per daughter cell', human:'Human model: each daughter has 46 chromosomes, 46 DNA molecules.', text:'An actin-containing contractile ring creates a cleavage furrow and divides the cytoplasm. The two daughter cells each receive a complete chromosome set.', cue:'Mitosis divides nuclear contents; cytokinesis divides the cell.'}
];
const shipment = [
  {id:'nucleus', name:'Nucleus', short:'Transcribe DNA to mRNA; export the processed message through a nuclear pore.'},
  {id:'ribosome', name:'Rough-ER ribosome', short:'A ribosome makes a protein destined for secretion; the growing chain enters the rough ER.'},
  {id:'er', name:'Rough ER', short:'The protein folds and begins processing in the ER lumen.'},
  {id:'transport', name:'Transport vesicle', short:'A vesicle buds from the ER and delivers its cargo to the cis side of the Golgi.'},
  {id:'golgi', name:'Golgi apparatus', short:'Modify, sort, and package the protein; cargo leaves from the trans side.'},
  {id:'secretory', name:'Secretory vesicle', short:'Carry the packaged protein toward the plasma membrane.'},
  {id:'membrane', name:'Plasma membrane', short:'The vesicle fuses with the membrane; exocytosis releases the protein outside.'}
];
export const secretionRoute = shipment.map(step => step.id);
const destinations = [
  {id:'red', name:'Red blood cell', symbol:'◉'}, {id:'b', name:'B lymphocyte', symbol:'B'},
  {id:'t', name:'T lymphocyte', symbol:'T'}, {id:'nk', name:'Natural killer cell', symbol:'NK'},
  {id:'neuron', name:'Neuron', symbol:'⌁'}, {id:'muscle', name:'Skeletal muscle', symbol:'≋'},
  {id:'placental', name:'Placental trophoblast', symbol:'✧'}
];
export const potencyModels = {
  totipotent:{name:'Totipotent', example:'Early embryonic cell', allowed:['red','b','t','nk','neuron','muscle','placental'], explanation:'Toti = total potential: embryonic body cells plus extraembryonic support tissues, including trophoblast.'},
  pluripotent:{name:'Pluripotent', example:'Pluripotent stem cell', allowed:['red','b','t','nk','neuron','muscle'], explanation:'Pluri = many: all body-cell types, but not the full extraembryonic tissues required to form an organism.'},
  multipotent:{name:'Multipotent', example:'Hematopoietic stem cell', allowed:['red','b','t','nk'], explanation:'This blood-forming stem cell produces several types within the blood/immune lineage, not neurons or muscle.'},
  oligopotent:{name:'Oligopotent', example:'Lymphoid progenitor (simplified model)', allowed:['b','t','nk'], explanation:'Oligo = few: this lymphoid example can form B, T, and natural killer cells. Its options are narrower than the blood-forming stem cell.'},
  unipotent:{name:'Unipotent', example:'Muscle-restricted progenitor (model)', allowed:['muscle'], explanation:'Uni = one: this model is restricted to the skeletal-muscle lineage. Unipotent stem/progenitor cells can still self-renew.'}
};
export function lineageAllowed(potency, destination) { return !!potencyModels[potency]?.allowed.includes(destination); }

const header = (tag,title,intro) => `<div class="lab-heading"><span>${tag}</span><h3>${title}</h3><p>${intro}</p></div>`;
const button = (label,action,value,selected=false,extra='') => `<button type="button" data-lab-action="${action}" data-lab-value="${esc(value)}"${selected?' aria-pressed="true" class="lab-active"':' aria-pressed="false"'} ${extra}>${label}</button>`;
const feedback = (text,kind='info') => `<p class="lab-feedback lab-${kind}" role="status" aria-live="polite">${text}</p>`;
function freshState(id) {
  if (id === 'membrane') return {outside:300,prediction:'',applied:false};
  if (id === 'organelles') return {route:[],checked:false};
  if (id === 'nucleus') return {bases:[],message:''};
  if (id === 'protein') return {rna:[],peptide:[],phase:'transcription',message:''};
  if (id === 'division') return {step:0};
  if (id === 'differentiation') return {potency:'multipotent',selected:[],checked:false};
  return {};
}
function membrane(s) {
  const result = tonicityEffect(s.outside), radius = 58 * (s.applied ? result.scale : 1);
  const dots = Array.from({length:s.outside/25},(_,i) => {const x = 22 + (i*83)%416, y = 24+(i*61)%144; return Math.hypot(x-230,y-97)>80 ? `<circle cx="${x}" cy="${y}" r="3" fill="#c39cff"/>`:'';}).join('');
  const arrow = (from,to,y) => `<path d="M${from} ${y}H${to}" stroke="#7ee8f2" stroke-width="3" fill="none"/><path d="M${to+(to>from?-8:8)} ${y-5}L${to} ${y}l${to>from?-8:8} 5" stroke="#7ee8f2" stroke-width="3" fill="none"/>`;
  const arrows = !s.applied ? '' : result.direction==='in' ? arrow(105,167,97)+arrow(355,293,97) : result.direction==='out' ? arrow(167,105,97)+arrow(293,355,97) : arrow(105,163,86)+arrow(163,105,108)+arrow(297,355,86)+arrow(355,297,108);
  return `${header('OSMOSIS EXPERIMENT','Water follows the gradient','Choose the outside solution, predict the result, then apply it.')}<div class="lab-options">${[[150,'Hypotonic'],[300,'Isotonic'],[600,'Hypertonic']].map(([value,name])=>button(name,'solution',value,s.outside===value)).join('')}</div><div class="lab-osmosis"><svg viewBox="0 0 460 190" role="img" aria-label="${s.applied?esc(result.kind+' solution: net water movement '+result.direction+'. The cell '+result.change):'Animal cell before applying the selected solution'}"><rect x="5" y="5" width="450" height="180" rx="18" fill="#101e2e" stroke="#2c4560"/>${dots}<circle class="lab-cell" cx="230" cy="97" r="${radius}" fill="#173c50" stroke="#77e5eb" stroke-width="3"/><circle cx="230" cy="97" r="20" fill="#7e62a6"/>${Array.from({length:8},(_,i)=>`<circle cx="${230+Math.cos(i*Math.PI/4)*radius*.7}" cy="${97+Math.sin(i*Math.PI/4)*radius*.7}" r="3" fill="#c39cff"/>`).join('')}${arrows}<text x="230" y="102" text-anchor="middle" fill="#fff" font-size="12">CELL</text><text x="21" y="173" fill="#d3b4ff" font-size="11">● Nonpenetrating solute</text><text x="438" y="173" text-anchor="end" fill="#7ee8f2" font-size="11">${result.direction==="balanced"?"Equal water exchange; net = 0":"Arrows: net water movement"}</text></svg><p>Initial inside: <b>300</b> · Outside: <b>${s.outside}</b> relative concentration units</p></div><div class="lab-predict"><span>I predict the cell…</span><div class="lab-options">${['swells','stays the same','shrinks'].map(v=>button(v,'predict',v,s.prediction===v)).join('')}${button('Apply solution →','apply','',false,!s.prediction?'disabled':'')}</div></div>${s.applied?feedback(`<b>${s.prediction===result.change?'Correct.':'Recheck the gradient.'}</b> The cell ${result.change}. ${result.explanation}`,s.prediction===result.change?'good':'retry'):feedback('Tonicity depends on solutes that cannot cross this membrane. Water can cross; the solute particles cannot.')}<p class="lab-note">Idealized animal cell; outside solution is a large reservoir. Size changes are illustrative, not a quantitative or medical simulation.</p>`;
}
function organelles(s) {
  const complete = s.route.length===shipment.length, correct = complete && s.route.every((v,i)=>v===secretionRoute[i]);
  return `${header('PROTEIN SHIPPING CHALLENGE','Build the secretion route','Tap the locations in order, beginning with the message in the nucleus.')}<div class="lab-route" aria-label="Your selected route">${shipment.map((_,i)=>{const step=shipment.find(x=>x.id===s.route[i]);return `<div class="lab-route-stop ${step?'lab-filled':''}"><b>${i+1}</b><span>${step?esc(step.name):'—'}</span></div>`;}).join('')}</div><div class="lab-shipping-map" aria-hidden="true"><svg viewBox="0 0 600 115"><path d="M40 60H560" stroke="#2e5065" stroke-width="3" stroke-dasharray="5 6"/><circle cx="62" cy="58" r="32" fill="#322957" stroke="#ad94ed" stroke-width="2"/><circle cx="62" cy="58" r="12" fill="#ab8dea"/><path d="M146 31h48v15h-39v15h43v15h-49v15" stroke="#71d9e2" fill="none" stroke-width="5"/><circle cx="222" cy="59" r="14" fill="#244c5b" stroke="#74d9e3" stroke-width="2"/><path d="M286 30q40 20 75 0M286 44q40 20 75 0M286 58q40 20 75 0M286 72q40 20 75 0" fill="none" stroke="#c29bec" stroke-width="6"/><circle cx="415" cy="59" r="19" fill="#3a3151" stroke="#c29bec" stroke-width="3"/><path d="M504 10v35q-35 15 0 30v27" fill="none" stroke="#bde983" stroke-width="5"/><circle cx="552" cy="58" r="5" fill="#bde983"/><circle cx="571" cy="44" r="5" fill="#bde983"/><circle cx="577" cy="72" r="5" fill="#bde983"/></svg></div><div class="lab-options lab-route-choices">${[4,1,6,0,5,2,3].map(i=>button(shipment[i].name,'route-add',shipment[i].id,s.route.includes(shipment[i].id),s.route.includes(shipment[i].id)?'disabled':'')).join('')}</div><div class="lab-actions">${button('Undo','route-undo','',false,!s.route.length?'disabled':'')}${button('Reset','reset','')}${button('Check route','route-check','',false,!complete?'disabled':'')}</div>${s.checked?feedback(correct?'<b>Delivery complete.</b> Nucleus → rough-ER ribosome → rough ER → transport vesicle → Golgi → secretory vesicle → plasma membrane. This is the route for a secreted protein.':`<b>One or more stops need rearranging.</b> First mismatch: stop ${s.route.findIndex((v,i)=>v!==secretionRoute[i])+1}. The message leaves the nucleus before translation; ER comes before Golgi.`,correct?'good':'retry'):feedback(s.route.length?`<b>Selected stop:</b> ${shipment.find(x=>x.id===s.route.at(-1)).short}`:'mRNA carries instructions out of the nucleus. The DNA stays behind. Free cytosolic ribosomes make many proteins that stay within the cell.')}<p class="lab-note">The route separates translation from ER processing for practice; in a cell these steps overlap.</p>`;
}
const baseRow = (sequence,filled,dna=true) => `<div class="lab-strand"><b>${dna?'3′':'5′'}</b>${[...sequence].map((base,i)=>`<span class="lab-base lab-base-${filled?base:'blank'}">${filled?base:'?'}</span>`).join('')}<b>${dna?'5′':'3′'}</b></div>`;
function nucleus(s) {
  const complete=s.bases.length===replicationTemplate.length;
  return `${header('DNA REPLICATION BENCH','Be the DNA polymerase','Read the parental template 3′ → 5′ and build a new strand 5′ → 3′.')}<div class="lab-dna"><p>Parental template <span>retained strand</span></p>${baseRow(replicationTemplate,true)}<div class="lab-bonds" aria-hidden="true">${[...replicationTemplate].map((b,i)=>`<span>${i<s.bases.length?(b==='A'||b==='T'?'Ⅱ':'Ⅲ'):'·'}</span>`).join('')}</div><div class="lab-strand"><b>5′</b>${[...replicationTemplate].map((_,i)=>`<span class="lab-base lab-base-${s.bases[i]||'blank'} ${i===s.bases.length?'lab-current':''}">${s.bases[i]||'?'}</span>`).join('')}<b>3′</b></div><p>New complementary strand <span>${s.bases.length} / 6 nucleotides added</span></p></div><div class="lab-options lab-base-choices">${['A','T','C','G'].map(b=>button(b,'dna-add',b,false,complete?'disabled':'')).join('')}${button('Start again','reset','')}</div>${feedback(s.message||(complete?'<b>One daughter DNA molecule is complete.</b> It contains one old strand and one new strand: semiconservative replication. The other original strand serves as a template for a second daughter molecule.':`Next template base: <b>${replicationTemplate[s.bases.length]}</b>. A pairs with T; C pairs with G. DNA polymerase adds to the new strand’s 3′ end.`),complete?'good':'info')}<p class="lab-note">Helicase separates the original strands first. A–T has two hydrogen bonds; C–G has three. This short model omits primers and leading/lagging strand details.</p>`;
}
function protein(s) {
  const transcript = transcribeTemplate(template).match(/.{3}/g), dnaCodons=template.match(/.{3}/g), translation=s.phase!=='transcription', done=s.phase==='done';
  const index=translation?s.peptide.length:s.rna.length;
  const choices=translation?['Met','Pro','Glu','Stop']:['AUG','CCU','GAA','UAA'];
  return `${header('FROM GENE TO PROTEIN','Write the message. Build the chain.',translation?'Translation · A ribosome reads mRNA codons 5′ → 3′.':'Transcription · RNA polymerase reads this DNA template 3′ → 5′.')}<div class="lab-protein-workbench"><div class="lab-molecule"><span>DNA template</span><b>3′</b>${dnaCodons.map((v,i)=>`<em class="${!translation&&i===index?'lab-current':''}">${v}</em>`).join('')}<b>5′</b></div><div class="lab-process-arrow">${translation?'Processed mRNA moves into the cytoplasm ↓':'RNA polymerase builds complementary RNA ↓'}</div><div class="lab-molecule lab-rna"><span>mRNA</span><b>5′</b>${transcript.map((v,i)=>`<em class="${translation&&i===index&&!done?'lab-current':''}">${s.rna[i]||'???'}</em>`).join('')}<b>3′</b></div><div class="lab-peptide" aria-label="Amino acid chain">${s.peptide.length?s.peptide.map((v,i)=>`<span>${v}</span>${i<s.peptide.length-1?'<i>—</i>':''}`).join(''):'<span class="lab-peptide-empty">Amino acid chain will appear here</span>'}${done?'<b>✓ Released</b>':''}</div></div><div class="lab-options">${choices.map(v=>button(v,translation?'translate':'transcribe',v,false,done?'disabled':'')).join('')}${button('Restart','reset','')}</div>${feedback(s.message||(done?'<b>Protein released: Met–Pro–Glu.</b> UAA is a stop signal, not an amino acid. A release factor ends translation.':translation?`Read <b>${transcript[index]}</b>. ${index===0?'AUG begins translation and codes for methionine (Met).':'Use the mini codon key below; add the next amino acid or release the chain.'}`:`Copy <b>${dnaCodons[index]}</b> into mRNA. DNA A pairs with RNA U; T with A; C with G; G with C.`),done?'good':'info')}<p class="lab-note">Mini codon key: AUG → Met/start · CCU → Pro · GAA → Glu · UAA → stop.<br>This short coding-region model omits RNA processing, untranslated regions, and most codons. tRNAs deliver amino acids; a stop codon has no matching amino-acid-bearing tRNA.</p>`;
}
const chromosomeColors=['#78e4ed','#ca9ffd','#78e4ed','#ca9ffd'];
function chromosome(x,y,index,copied=false,loose=false,flip=false) {
  const len=index<2?17:11,color=chromosomeColors[index];
  if(loose) return `<path d="M${x-8} ${y-len}q22 5 3 11t6 12t-8 9${copied?'m8 -34q22 5 3 11t6 12t-8 9':''}" stroke="${color}" stroke-width="3" fill="none"/>`;
  if(copied) return `<path d="M${x-8} ${y-len}L${x+8} ${y+len}M${x+8} ${y-len}L${x-8} ${y+len}" stroke="${color}" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3" fill="#f7efd3"/>`;
  return `<path d="M${x+(flip?-8:8)} ${y-len}L${x} ${y}l${flip?-8:8} ${len}" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
}
function divisionSVG(step) {
  let shapes='',outline='<ellipse cx="290" cy="105" rx="223" ry="89" fill="#122d3d" stroke="#66c8d6" stroke-width="2"/>';
  if(step<3) {
    shapes='<ellipse cx="290" cy="105" rx="104" ry="70" fill="#272849" stroke="#997bbe" stroke-width="2"/>';
    [0,1,2,3].forEach(i=>{shapes+=chromosome(245+i%2*80,76+Math.floor(i/2)*60,i,step>0,true);});
  } else if(step<6) {
    const coords=step===3?[[245,61],[320,75],[252,132],[333,145]]:step===4?[[290,46],[290,87],[290,125],[290,163]]:[];
    shapes+='<circle cx="98" cy="105" r="7" fill="#d3ef86"/><circle cx="482" cy="105" r="7" fill="#d3ef86"/>';
    if(step<5) coords.forEach(([x,y],i)=>{shapes+=`<path d="M98 105L${x} ${y}L482 105" fill="none" stroke="#789992" stroke-width="1"/>`+chromosome(x,y,i,true);});
    else [0,1,2,3].forEach(i=>{const y=49+i*37;shapes+=`<path d="M98 105L185 ${y}M482 105L395 ${y}" fill="none" stroke="#789992"/>`+chromosome(185,y,i,false,false,false)+chromosome(395,y,i,false,false,true);});
    if(step===3)shapes+='<ellipse cx="290" cy="105" rx="103" ry="74" fill="none" stroke="#997bbe" stroke-dasharray="6 10"/>';
    if(step===4)shapes+='<path d="M290 22v166" stroke="#cae8a7" opacity=".5" stroke-dasharray="3 5"/>';
  } else {
    outline=step===7?'<ellipse cx="177" cy="105" rx="98" ry="83" fill="#122d3d" stroke="#66c8d6" stroke-width="2"/><ellipse cx="403" cy="105" rx="98" ry="83" fill="#122d3d" stroke="#66c8d6" stroke-width="2"/>':'<path d="M70 105C70 -20 230 7 290 54C350 7 510 -20 510 105C510 230 350 203 290 156C230 203 70 230 70 105Z" fill="#122d3d" stroke="#66c8d6" stroke-width="2"/>';
    [177,403].forEach(cx=>{shapes+=`<ellipse cx="${cx}" cy="105" rx="67" ry="63" fill="#272849" stroke="#997bbe" stroke-width="2"/>`;[0,1,2,3].forEach(i=>{shapes+=chromosome(cx-28+i%2*48,76+Math.floor(i/2)*54,i,false,true);});});
  }
  return `<svg viewBox="0 0 580 210" role="img" aria-label="${esc(divisionStages[step].name+': '+divisionStages[step].count)}">${outline}${shapes}</svg>`;
}
function division(s) {
  const stage=divisionStages[s.step];
  return `${header('CELL-CYCLE EXPLORER','Follow the chromosomes','A simplified diploid cell with 2n = 4. Colors distinguish homologs; lengths distinguish chromosome types.')}<div class="lab-options lab-cycle-tabs">${divisionStages.map((v,i)=>button(v.name,'cycle',i,i===s.step)).join('')}</div><div class="lab-division">${divisionSVG(s.step)}<span>${stage.group}</span><strong>${stage.count}</strong></div><div class="lab-actions"><button type="button" data-lab-action="cycle" data-lab-value="${Math.max(0,s.step-1)}" ${s.step===0?'disabled':''}>← Previous</button><b>${s.step+1} / 8</b><button type="button" data-lab-action="cycle" data-lab-value="${Math.min(7,s.step+1)}" ${s.step===7?'disabled':''}>Next →</button></div>${feedback(`<b>${stage.name}.</b> ${stage.text}`)}<p class="lab-note"><strong>${stage.cue}</strong><br>${stage.human} Drawings show chromosome identities schematically, not their literal shape or location during interphase.</p>`;
}
function differentiation(s) {
  const model=potencyModels[s.potency],correct=model.allowed.length===s.selected.length&&model.allowed.every(v=>s.selected.includes(v));
  return `${header('CELL-FATE CHALLENGE','How many futures are possible?','Choose a potency, then select every reachable destination in this model.')}<div class="lab-options lab-potencies">${Object.entries(potencyModels).map(([key,v])=>button(v.name,'potency',key,key===s.potency)).join('')}</div><div class="lab-lineage-source"><span class="lab-stem-symbol">✧</span><div><b>${model.example}</b><span>${model.name} potential</span></div><span class="lab-lineage-arrow">↘ ↓ ↙</span></div><div class="lab-destinations">${destinations.map(v=>{const reveal=s.checked?`<small>${lineageAllowed(s.potency,v.id)?'Reachable':'Outside this potential'}</small>`:'';return button(`<b>${v.symbol}</b><span>${v.name}</span>${reveal}`,'lineage',v.id,s.selected.includes(v.id),`aria-label="${esc(v.name)}${s.checked?(lineageAllowed(s.potency,v.id)?', reachable':', outside this potential'):''}"`);}).join('')}</div><div class="lab-actions">${button('Check possibilities','lineage-check','')}${button('Clear selections','lineage-clear','')}</div>${s.checked?feedback(`<b>${correct?'Exactly right.':'Compare your choices with the revealed destinations.'}</b> ${model.explanation}`,correct?'good':'retry'):feedback('Potency describes possible fates, not what a cell must become. The examples narrow from broad embryonic potential to one lineage.')}<p class="lab-note">Differentiation changes gene expression through signals and transcription factors. Most nucleated body cells retain essentially the same genome; specialization does not mean deleting all unused genes.</p>`;
}
const views={membrane,organelles,nucleus,protein,division,differentiation};
export function renderLab(moduleId) {
  return `<section class="lab-root" data-lab="${esc(moduleId)}" aria-label="Interactive learning lab">${views[moduleId]?views[moduleId](freshState(moduleId)):'<p>This lab is not available.</p>'}</section>`;
}
export function bindLab(container,moduleId) {
  const root=container.matches?.('.lab-root')?container:container.querySelector('.lab-root');
  if(!root||!views[moduleId])return ()=>{};
  let state=freshState(moduleId);
  const onClick=event=>{
    const control=event.target.closest('[data-lab-action]');
    if(!control||!root.contains(control)||control.disabled)return;
    const {labAction:action,labValue:value}=control.dataset;
    if(action==='reset')state=freshState(moduleId);
    if(action==='solution'){state.outside=Number(value);state.applied=false;state.prediction='';}
    if(action==='predict'){state.prediction=value;state.applied=false;}
    if(action==='apply'&&state.prediction)state.applied=true;
    if(action==='route-add'&&!state.route.includes(value)){state.route.push(value);state.checked=false;}
    if(action==='route-undo'){state.route.pop();state.checked=false;}
    if(action==='route-check')state.checked=true;
    if(action==='dna-add'){
      const next=complementaryDNA(replicationTemplate)[state.bases.length];
      if(value===next){state.bases.push(value);state.message='';}
      else state.message=`<b>Try another base.</b> The template is ${replicationTemplate[state.bases.length]}. DNA pairs are A–T and C–G.`;
    }
    if(action==='transcribe'){
      const expected=transcribeTemplate(template).match(/.{3}/g)[state.rna.length];
      if(value===expected){state.rna.push(value);state.message='';if(state.rna.length===4)state.phase='translation';}
      else state.message='<b>Check the base pairs.</b> Read the template 3′ → 5′. Use U instead of T when building RNA.';
    }
    if(action==='translate'){
      const expected=['Met','Pro','Glu','Stop'][state.peptide.length];
      if(value===expected){state.message='';if(value==='Stop')state.phase='done';else state.peptide.push(value);}
      else state.message='<b>Use the current mRNA codon.</b> AUG → Met, CCU → Pro, GAA → Glu, UAA → stop. Stop is a release signal, not an amino acid.';
    }
    if(action==='cycle')state.step=Math.max(0,Math.min(7,Number(value)));
    if(action==='potency'){state.potency=value;state.selected=[];state.checked=false;}
    if(action==='lineage'){state.selected=state.selected.includes(value)?state.selected.filter(v=>v!==value):[...state.selected,value];state.checked=false;}
    if(action==='lineage-check')state.checked=true;
    if(action==='lineage-clear'){state.selected=[];state.checked=false;}
    root.innerHTML=views[moduleId](state);
    // Keep keyboard focus in the lab after replacing its controls.
    const target=[...root.querySelectorAll('[data-lab-action]')].find(el=>el.dataset.labAction===action&&el.dataset.labValue===value&&!el.disabled);
    if(target)target.focus({preventScroll:true});
    else root.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
  };
  root.addEventListener('click',onClick);
  return ()=>root.removeEventListener('click',onClick);
}
