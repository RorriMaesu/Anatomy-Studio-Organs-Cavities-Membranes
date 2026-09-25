// Original educational schematics based on OpenStax A&P 2e, Chapter 3.
// All positions use an 800 x 520 drawing space. Targets are percentages.
// Figures intentionally omit answer labels so the same artwork supports recall.
const C={cyan:'#6ee7e7',blue:'#66adff',violet:'#b89bff',coral:'#ff927d',gold:'#f8d977',ink:'#0b1728',muted:'#527188',light:'#d9e8ee'};
const path=(d,color=C.cyan,width=4,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const txt=(x,y,s,color=C.light,size=16)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="middle" font-family="system-ui,sans-serif">${s}</text>`;
const panel=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#112339" stroke="#2b455d" stroke-width="2"/>`;
const arrow=(x1,y1,x2,y2,col=C.muted)=>{const n=Math.hypot(x2-x1,y2-y1),dx=(x2-x1)/n,dy=(y2-y1)/n;return path(`M${x1} ${y1}L${x2} ${y2}`,col,3)+path(`M${x2-dx*9-dy*7} ${y2-dy*9+dx*7}L${x2} ${y2}L${x2-dx*9+dy*7} ${y2-dy*9-dx*7}`,col,3);};
const target=(id,name,x,y,description)=>({id,name,x:x/8,y:y/5.2,description});
const wrap=body=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img" aria-label="Interactive cellular schematic"><rect width="800" height="520" fill="${C.ink}"/>${body}</svg>`;
const fig=(id,title,description,source,body,targets)=>({id,title,description,source,svg:wrap(body),targets});
const dotChain=(pts,col=C.coral,r=7)=>pts.map(([x,y])=>circle(x,y,r,col)).join('');
const chromosome=(x,y,s=1,col=C.violet)=>`<g transform="translate(${x} ${y}) scale(${s})">${path('M-17 -32Q-5 -8 0 0Q5 8 17 32',col,12)}${path('M17 -32Q5 -8 0 0Q-5 8 -17 32',col,12)}${circle(0,0,5,C.gold)}</g>`;
const mitochondrion=(x,y,angle=0)=>`<g transform="translate(${x} ${y}) rotate(${angle})">${ellipse(0,0,61,31,'#653c38',`stroke="${C.coral}" stroke-width="4"`)}${ellipse(0,0,53,23,'none',`stroke="${C.coral}" stroke-width="2"`)}${path('M-42 0L-32 -15L-21 15L-10 -15L2 15L14 -15L25 15L38 -11',C.coral,3)}</g>`;
const cellMembrane=path('M105 104C176 31 295 27 392 59C490 27 625 53 687 117C747 174 751 300 696 390C645 479 513 482 398 459C286 505 161 470 95 404C26 334 31 188 105 104Z',C.cyan,9)+path('M114 113C181 43 295 39 392 71C491 39 617 64 678 125C733 180 737 298 686 384C637 464 513 469 398 447C288 489 172 459 104 394C42 330 45 192 114 113Z','#385569',3);

let membrane='';
for(let x=54;x<=746;x+=29){
  if((x>314&&x<391)||(x>526&&x<608))continue;
  membrane+=path(`M${x-5} 245l-3 26M${x+5} 245l4 12l-7 14`,C.coral,4)+path(`M${x-5} 295l-3 -23M${x+5} 295l5 -12l-7 -11`,C.coral,4)+circle(x,230,13,C.cyan)+circle(x,310,13,C.cyan);
}
membrane+=`<path d="M330 200Q308 196 309 224L309 311Q310 343 337 337L339 206Z" fill="${C.violet}"/><path d="M366 200Q390 196 391 225L391 311Q390 341 363 337L361 206Z" fill="${C.violet}"/>`;
membrane+=path('M350 187V348',C.light,2,'stroke-dasharray="5 7"');
membrane+=`<path d="M536 214C518 191 550 171 572 187C597 169 617 202 595 221L594 320Q566 345 540 320Z" fill="${C.blue}"/>`;
membrane+=path('M571 190V147L548 127M571 148L601 127L614 103M601 127L629 131',C.gold,5)+dotChain([[548,127],[601,127],[614,103],[629,131]],C.gold,8);
membrane+=path('M690 216V178L711 158M690 180L672 161',C.gold,4)+dotChain([[711,158],[672,161]],C.gold,8);
membrane+=`<g fill="${C.gold}" stroke="#bfa34e" stroke-width="2"><path d="M208 259l10 -6l10 6v12l-10 6l-10 -6Z"/><path d="M218 277l10 -6l10 6v12l-10 6l-10 -6Z"/></g>`;
membrane+=ellipse(126,351,43,22,C.violet)+path('M65 408Q185 362 286 410T480 410T735 410',C.muted,7);
membrane+=txt(132,103,'OUTSIDE THE CELL',C.muted,15)+txt(643,460,'INSIDE THE CELL',C.muted,15);

let cell=cellMembrane;
cell+=`<ellipse cx="280" cy="222" rx="101" ry="91" fill="#30264b" stroke="${C.violet}" stroke-width="8"/><ellipse cx="280" cy="222" rx="91" ry="81" fill="none" stroke="#725b96" stroke-width="3"/>`;
cell+=path('M220 184Q241 157 262 189T317 194T327 250Q299 274 277 245T219 250',C.violet,4)+circle(285,211,25,C.violet);
for(let a=0;a<Math.PI*2;a+=1.12){cell+=ellipse(280+99*Math.cos(a),222+89*Math.sin(a),7,5,C.ink,`transform="rotate(${a*180/Math.PI} ${280+99*Math.cos(a)} ${222+89*Math.sin(a)})" stroke="${C.violet}" stroke-width="2"`);}
for(let i=0;i<4;i++){cell+=path(`M${151-i*3} ${236+i*23}Q${128-i*7} ${328+i*15} ${305+i*25} ${326+i*20}Q${365+i*13} ${318+i*8} ${387+i*5} ${272+i*15}`,C.blue,9);for(let j=0;j<7;j++)cell+=circle(168+j*31,311+i*20+Math.sin(j)*6,3.5,C.gold);}
cell+=path('M390 181C437 174 426 102 471 151S491 220 456 221S400 198 426 240S514 248 502 195M473 151Q518 99 537 166M455 223Q433 271 491 278',C.cyan,10);
for(let i=0;i<4;i++)cell+=path(`M${527-i*3} ${293+i*18}Q584 ${316+i*18} ${620+i*4} ${282+i*16}`,C.coral,9);
cell+=circle(634,263,13,C.coral)+circle(643,344,11,C.coral);
cell+=mitochondrion(173,393,-15)+mitochondrion(585,194,25);
cell+=circle(637,397,25,'#655322',`stroke="${C.gold}" stroke-width="3"`)+dotChain([[629,389],[645,398],[635,408]],C.gold,4);
cell+=circle(612,97,22,'#27483f',`stroke="${C.cyan}" stroke-width="3"`)+path('M603 96h18M612 87v18',C.cyan,3);
cell+=`<g transform="translate(409 100) rotate(22)"><rect x="-26" y="-9" width="48" height="18" rx="5" fill="#294961" stroke="${C.blue}" stroke-width="2"/>${path('M-19 -4h32M-19 3h32',C.blue,2)}<rect x="26" y="9" width="18" height="45" rx="5" fill="#294961" stroke="${C.blue}" stroke-width="2"/>${path('M32 15v33M38 15v33',C.blue,2)}</g>`;
cell+=dotChain([[443,411],[468,394],[484,432],[506,409],[403,407]],C.gold,4);
cell+=path('M108 145Q128 89 192 86M84 291Q70 362 124 405M570 450Q646 446 685 366',C.muted,3);

let cytoskeleton=panel(34,43,225,432)+panel(286,43,225,432)+panel(538,43,225,432);
for(let row=0;row<12;row++)for(let col=0;col<5;col++)cytoskeleton+=circle(92+col*26,103+row*21,11,col%2?C.blue:C.cyan);
cytoskeleton+=ellipse(144,89,66,20,C.ink,`stroke="${C.cyan}" stroke-width="4"`)+ellipse(144,89,42,10,C.ink,`stroke="${C.muted}" stroke-width="2"`);
for(let i=0;i<13;i++){const y=93+i*20;cytoskeleton+=circle(400+20*Math.sin(i*.65),y,12,C.coral)+circle(400-20*Math.sin(i*.65),y,12,C.gold);}
for(let i=0;i<8;i++){let d='';for(let y=87;y<=350;y+=5){const x=650+29*Math.sin((y-87)/34+i*Math.PI/4);d+=`${y===87?'M':'L'}${x} ${y}`;}cytoskeleton+=path(d,i%2?C.violet:'#8870ac',3);}
cytoskeleton+=path('M66 424Q100 395 132 419T226 416',C.muted,5);
for(let i=0;i<7;i++)cytoskeleton+=path(`M${78+i*22} 411Q${70+i*22} 374 ${90+i*22} 368`,C.cyan,3);
cytoskeleton+=ellipse(334,420,11,15,C.cyan)+path('M344 420Q369 392 395 420T480 420',C.cyan,3);
cytoskeleton+=path('M571 406H731M574 413H728',C.muted,3)+path('M595 401l-10 -17M693 401l10 -17',C.violet,4);

let nucleus=`<circle cx="230" cy="243" r="151" fill="#30264b" stroke="${C.violet}" stroke-width="12"/><circle cx="230" cy="243" r="136" fill="none" stroke="#776391" stroke-width="4"/>`;
nucleus+=circle(234,251,40,C.violet)+path('M133 199C101 130 197 132 163 199S242 200 286 152S337 198 308 220M120 278C172 236 161 329 222 328S226 371 306 323S275 277 335 273',C.violet,5);
for(let a of [.1,1,2,3.4,4.3,5.1]){let x=230+148*Math.cos(a),y=243+148*Math.sin(a);nucleus+=circle(x,y,12,C.ink,`stroke="${C.violet}" stroke-width="3"`);}
nucleus+=arrow(403,244,447,244);
nucleus+=path('M475 114Q493 73 511 114T547 114T583 114T619 114T655 114T691 114T727 114',C.cyan,4)+path('M475 114Q493 155 511 114T547 114T583 114T619 114T655 114T691 114T727 114',C.blue,4);
for(let x=484;x<722;x+=12)nucleus+=path(`M${x} ${114-19*Math.sin((x-475)*Math.PI/36)}V${114+19*Math.sin((x-475)*Math.PI/36)}`,C.muted,2);
nucleus+=path('M476 236Q492 196 512 232T557 230T602 232T647 230T704 230',C.cyan,4);
for(let x of[516,564,612,660])nucleus+=circle(x,229,15,C.violet)+path(`M${x-15} 226Q${x-4} 209 ${x+13} 220Q${x+22} 235 ${x+3} 242`,C.cyan,3);
nucleus+=chromosome(585,367,1.2)+chromosome(684,367,1.2,C.coral);
nucleus+=arrow(601,159,601,194)+arrow(601,265,601,297);

let replication='';
replication+=path('M54 236H289Q340 228 393 150T740 113',C.cyan,7)+path('M54 282H289Q340 290 393 370T740 407',C.blue,7);
for(let x=67;x<291;x+=19)replication+=path(`M${x} 240V279`,C.muted,3);
replication+=path('M431 161Q530 133 734 139',C.coral,7)+path('M431 357Q530 385 734 381',C.coral,7);
for(let x=480;x<730;x+=22)replication+=path(`M${x} 122V137M${x} 383V401`,C.muted,3);
replication+=`<path d="M306 218L340 221L361 259L340 298L306 300L326 259Z" fill="${C.gold}" stroke="#d7b755" stroke-width="3"/>`;
replication+=ellipse(436,153,33,29,C.violet)+ellipse(436,365,33,29,C.violet);
replication+=dotChain([[387,114],[417,95],[461,82],[479,188],[375,340],[400,416],[470,438],[493,341]],C.coral,8);
replication+=arrow(225,189,90,189)+txt(154,169,'FORK ADVANCES',C.muted,13);
replication+=panel(570,217,179,88)+path('M591 240h131',C.cyan,5)+path('M591 271h131',C.coral,5);
replication+=txt(656,328,'ONE OLD + ONE NEW',C.muted,13);

let transcription=panel(38,40,724,208)+panel(38,279,724,194);
transcription+=path('M72 122H234Q324 58 421 122H731',C.blue,6)+path('M72 162H234Q324 226 421 162H731',C.cyan,6);
for(let x=81;x<=717;x+=20){if(x<227||x>434)transcription+=path(`M${x} 125V159`,C.muted,3);}
transcription+=ellipse(345,144,59,57,'#493b65',`stroke="${C.violet}" stroke-width="4"`);
transcription+=path('M342 165Q323 185 299 186L205 214H107',C.coral,6);
transcription+=txt(320,169,'U A C',C.light,13)+txt(331,198,'A U G',C.light,13);
transcription+=arrow(476,216,670,216,C.muted);
transcription+=`<rect x="89" y="319" width="113" height="27" rx="5" fill="${C.cyan}"/><rect x="202" y="319" width="104" height="27" rx="5" fill="${C.muted}"/><rect x="306" y="319" width="113" height="27" rx="5" fill="${C.cyan}"/><rect x="419" y="319" width="104" height="27" rx="5" fill="${C.muted}"/><rect x="523" y="319" width="113" height="27" rx="5" fill="${C.cyan}"/>`;
transcription+=path('M201 350Q253 398 306 350M419 350Q470 398 523 350',C.muted,3,'stroke-dasharray="5 6"');
transcription+=`<rect x="190" y="412" width="113" height="27" rx="5" fill="${C.cyan}"/><rect x="303" y="412" width="113" height="27" rx="5" fill="${C.cyan}"/><rect x="416" y="412" width="113" height="27" rx="5" fill="${C.cyan}"/>`+circle(177,425,12,C.gold)+path('M532 425h120',C.coral,5)+txt(600,417,'A A A A A',C.coral,12);

let translation=path('M72 367H731',C.coral,7);
translation+=`<path d="M241 347C229 270 254 203 316 200C349 164 402 174 426 209C486 207 521 274 500 347Z" fill="#47365f" stroke="${C.violet}" stroke-width="4"/><path d="M249 381Q371 458 499 381Z" fill="#47365f" stroke="${C.violet}" stroke-width="4"/>`;
translation+=`<g fill="${C.light}" font-size="18" font-family="monospace" text-anchor="middle"><text x="128" y="359">AUG</text><text x="210" y="359">GCU</text><text x="292" y="359">GAA</text><text x="374" y="359">CCU</text><text x="456" y="359">UGG</text><text x="538" y="359">ACU</text><text x="620" y="359">UAA</text></g>`;
translation+=path('M365 334V298H340V279H358V252H387V279H406V298H382V334',C.cyan,6)+txt(374,338,'GGA',C.cyan,17);
translation+=path('M543 257V220H518V201H536V174H565V201H584V220H560V257',C.cyan,6)+txt(552,283,'ACC',C.cyan,17);
translation+=circle(551,164,15,C.gold)+circle(372,242,15,C.gold)+dotChain([[353,222],[337,201],[316,181],[293,172],[267,175],[245,164],[230,142]],C.coral,12);
translation+=arrow(83,446,692,446)+txt(105,391,'5′',C.coral,16)+txt(703,391,'3′',C.coral,16);

const mitosisCell=(x,y,stage)=>{
 let s=ellipse(x,y,103,82,'#122a3a',`stroke="${C.cyan}" stroke-width="3"`);
 if(stage===0){s+=ellipse(x,y,59,49,'#30264b',`stroke="${C.violet}" stroke-width="2" stroke-dasharray="7 6"`);s+=chromosome(x-26,y-16,.42)+chromosome(x+25,y+17,.42,C.coral)+chromosome(x-19,y+24,.32,C.coral)+chromosome(x+25,y-23,.32);}
 if(stage===1||stage===2){s+=circle(x-85,y,6,C.gold)+circle(x+85,y,6,C.gold);for(let dy of[-37,-12,14,37]){s+=path(`M${x-82} ${y}L${x+(stage===2?-38:0)} ${y+dy}M${x+82} ${y}L${x+(stage===2?38:0)} ${y+dy}`,C.muted,2);if(stage===1)s+=chromosome(x,y+dy,.28,dy<0?C.violet:C.coral);else{s+=path(`M${x-28} ${y+dy-9}L${x-43} ${y+dy}L${x-28} ${y+dy+9}`,dy<0?C.violet:C.coral,5);s+=path(`M${x+28} ${y+dy-9}L${x+43} ${y+dy}L${x+28} ${y+dy+9}`,dy<0?C.violet:C.coral,5);}}}
 if(stage===3){for(let dx of[-48,48]){s+=ellipse(x+dx,y,35,38,'#30264b',`stroke="${C.violet}" stroke-width="2"`)+path(`M${x+dx-15} ${y-18}q25 9 4 19t13 18`,C.violet,4)+path(`M${x+dx+15} ${y-20}q-27 14 -7 21t-9 17`,C.coral,4);}s+=path(`M${x} ${y-81}Q${x-26} ${y-46} ${x-12} ${y-15}M${x} ${y+81}Q${x-26} ${y+46} ${x-12} ${y+15}`,C.cyan,4);}
 if(stage===4){s=ellipse(x-53,y,48,67,'#122a3a',`stroke="${C.cyan}" stroke-width="3"`)+ellipse(x+53,y,48,67,'#122a3a',`stroke="${C.cyan}" stroke-width="3"`);for(let dx of[-53,53])s+=circle(x+dx,y,26,'#30264b',`stroke="${C.violet}" stroke-width="2"`)+path(`M${x+dx-14} ${y-8}q20 -18 21 2t-17 18`,C.violet,3);}
 return s;
};
let mitosis=mitosisCell(145,153,0)+mitosisCell(400,153,1)+mitosisCell(655,153,2)+mitosisCell(529,382,3)+mitosisCell(272,382,4);
mitosis+=arrow(263,151,278,151)+arrow(518,151,533,151)+path('M686 253Q687 297 641 326',C.muted,3)+arrow(413,380,390,380);
mitosis+=txt(400,37,'FOLLOW THE GENETIC MATERIAL',C.muted,13);

const ring=(start,end,col)=>{const cx=311,cy=259,r=161,p=a=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];let a=p(start),b=p(end);return path(`M${a[0]} ${a[1]}A${r} ${r} 0 ${end-start>Math.PI?1:0} 1 ${b[0]} ${b[1]}`,col,72);};
let cycle=ring(-1.45,.17,C.cyan)+ring(.27,1.93,C.blue)+ring(2.03,3.33,C.violet)+ring(3.43,4.72,C.coral);
cycle+=circle(311,259,112,'#122339')+circle(296,255,50,'#30264b',`stroke="${C.violet}" stroke-width="3"`)+path('M263 245q48 -40 37 9t23 29',C.violet,4);
cycle+=arrow(516,167,596,123)+ellipse(656,111,65,46,'#16323d',`stroke="${C.cyan}" stroke-width="3"`)+circle(654,111,21,'#30264b');
cycle+=panel(569,261,170,170)+chromosome(610,320,.53)+chromosome(690,320,.53,C.coral)+path('M602 377H700',C.muted,3)+circle(601,377,6,C.gold)+circle(701,377,6,C.gold);
cycle+=circle(295,60,9,C.gold)+circle(208,429,9,C.gold)+circle(166,182,9,C.gold);
cycle+=path('M494 253l-12 13l-12 -13M317 444l-13 -12l13 -12M127 265l12 -13l12 13M305 74l13 12l-13 12',C.ink,4);

let differentiation='';
differentiation+=path('M403 116V151M403 151L245 211M403 151L595 211M245 282L104 347M245 282L261 347M245 282L446 355M595 282L687 347',C.muted,4);
differentiation+=circle(403,80,36,'#463562',`stroke="${C.violet}" stroke-width="3"`)+circle(403,80,14,C.violet);
for(let x of[245,595])differentiation+=circle(x,244,38,'#294748',`stroke="${C.cyan}" stroke-width="3"`)+circle(x,244,17,C.cyan);
differentiation+=ellipse(103,380,46,31,C.coral)+ellipse(103,380,25,14,'#8a4d49');
differentiation+=circle(262,380,38,'#bfd3df')+path('M249 361C273 349 286 378 269 384C284 404 260 415 246 397C223 397 228 372 249 361Z','#675393',3);
differentiation+=circle(687,380,36,'#b9d7d6')+circle(687,380,26,'#675393');
differentiation+=dotChain([[433,370],[454,379],[442,396],[468,398]],C.gold,8);
differentiation+=path('M356 62C308 20 284 58 313 82L325 71M313 82L304 69',C.violet,3);
differentiation+=txt(405,486,'SPECIALIZATION NARROWS THE POSSIBLE FATES',C.muted,14);

export const diagrams={
 membrane:[fig('membrane-structure','The selective boundary','A cutaway of the fluid mosaic membrane. The two leaflets face water; the nonpolar tails face one another.','OpenStax §3.1, Figs. 3.2–3.4',membrane,[
  target('phospholipid-head','Hydrophilic head',82,230,'The polar phosphate-containing head interacts with water outside the cell or in the cytosol.'),
  target('phospholipid-tails','Hydrophobic tails',151,273,'The two nonpolar fatty-acid tails face the interior of the bilayer, away from water.'),
  target('cholesterol','Cholesterol',222,276,'Cholesterol sits among the lipid tails and helps regulate membrane fluidity and stability.'),
  target('channel-protein','Channel protein',350,259,'A membrane-spanning protein provides a selective, water-friendly passage through the hydrophobic bilayer.'),
  target('glycoprotein','Glycoprotein',564,274,'A protein with an outward-facing carbohydrate chain. Such tags participate in recognition and other interactions.'),
  target('glycocalyx','Glycocalyx',608,130,'Carbohydrate chains on proteins and lipids form an extracellular coat involved in protection, recognition, and adhesion.'),
  target('glycolipid','Glycolipid',690,193,'A lipid with an attached carbohydrate chain facing the extracellular fluid.'),
  target('peripheral-protein','Peripheral protein',126,353,'This protein associates with one membrane surface rather than crossing the entire bilayer.')])],
 organelles:[fig('human-cell','Inside a human cell','A composite teaching cell: individual human cells differ in their organelles, shape, and specialization.','OpenStax §3.2, Figs. 3.13–3.18',cell,[
  target('plasma-membrane','Plasma membrane',717,260,'The selectively permeable boundary separates the cytoplasm from extracellular fluid.'),
  target('nucleus','Nucleus',236,189,'Houses most cellular DNA and is the site of transcription; its envelope separates it from the cytoplasm.'),
  target('nucleolus','Nucleolus',287,214,'Produces ribosomal RNA and assembles ribosomal subunits inside the nucleus.'),
  target('rough-er','Rough endoplasmic reticulum',332,346,'Membrane sacs with attached ribosomes make proteins destined for secretion, membranes, or certain organelles.'),
  target('smooth-er','Smooth endoplasmic reticulum',472,182,'A ribosome-free membrane network involved in lipid synthesis, calcium storage, and detoxification.'),
  target('golgi','Golgi apparatus',572,327,'Stacked flattened sacs modify, sort, and package products arriving from the ER.'),
  target('mitochondrion','Mitochondrion',176,393,'Its folded inner membrane supports much of the cell’s aerobic ATP production.'),
  target('lysosome','Lysosome',637,400,'Contains digestive enzymes that break down worn-out components and material brought into the cell.'),
  target('peroxisome','Peroxisome',612,97,'Carries out oxidative reactions; catalase helps convert hydrogen peroxide to water and oxygen.'),
  target('centrioles','Centrioles',414,110,'A paired set of cylindrical microtubule structures in the centrosome near the nucleus.'),
  target('free-ribosome','Free ribosomes',468,414,'Unbound ribosomes translate mRNA into proteins, including many used in the cytosol.'),
  target('vesicle','Transport vesicle',634,263,'A small membrane-bound carrier moves cargo between organelles or to the plasma membrane.'),
  target('cytosol','Cytosol',103,241,'The fluid portion of the cytoplasm around organelles. Cytoplasm includes both cytosol and organelles outside the nucleus.')]),
 fig('cytoskeleton','The cell’s support network','Three filament types, enlarged separately. The small lower sketches connect filament structure to cellular movement and anchoring.','OpenStax §3.2, Fig. 3.18',cytoskeleton,[
  target('microtubule','Microtubule',144,216,'A hollow tubulin cylinder; resists compression, forms intracellular transport tracks, and participates in the spindle, cilia, and flagella.'),
  target('microfilament','Microfilament',400,212,'Thin intertwined actin chains; important for cell shape, muscle contraction, and the cleavage furrow during cytokinesis.'),
  target('intermediate-filament','Intermediate filament',647,218,'Rope-like protein fibers resist tension and help anchor cells and organelles.'),
  target('cilia','Cilia',144,391,'Numerous short microtubule-based projections move material along a cell surface, as in the airways.'),
  target('flagellum','Flagellum',414,420,'The long microtubule-based projection that propels a sperm cell; sperm are the only flagellated human cells.'),
  target('cell-junction-anchor','Cytoskeletal anchoring',646,407,'Intermediate filaments attach to cellular junctions, helping tissues resist pulling forces.')])],
 nucleus:[fig('nucleus-packaging','From nucleus to chromosome','The left cutaway shows the nuclear compartment. The right enlargement moves from DNA to nucleosomes to condensed chromosomes. Not to scale.','OpenStax §3.3, Figs. 3.19, 3.22–3.23',nucleus,[
  target('nuclear-envelope','Nuclear envelope',104,164,'Two lipid bilayers enclose the nucleus; the outer membrane is continuous with the rough ER.'),
  target('nuclear-pore','Nuclear pore',377,258,'A regulated passage through the envelope. RNA and ribosomal subunits leave; many proteins enter.'),
  target('nucleolus-detail','Nucleolus',232,252,'A region where rRNA is produced and ribosomal subunits are assembled; it has no enclosing membrane.'),
  target('chromatin','Chromatin',204,329,'DNA plus associated proteins within the nucleus. It condenses into visible chromosomes during division.'),
  target('dna-double-helix','DNA double helix',601,111,'Two antiparallel strands with sugar-phosphate backbones and complementary bases: A pairs with T; C with G.'),
  target('nucleosome','Nucleosome',564,232,'A length of DNA wrapped around histone proteins, the basic repeating unit of chromatin packaging.'),
  target('chromosome','Replicated chromosome',584,366,'A condensed chromosome after replication has two sister chromatids joined at a centromere. Each chromatid contains a DNA molecule.'),
  target('homolog','Homologous chromosome',684,367,'The corresponding chromosome inherited from the other parent. Homologs carry the same kinds of genes but can have different alleles.')]),
 fig('dna-replication','Copy once, conserve half','A simplified replication fork emphasizes the roles of helicase, polymerase, and template strands. Leading/lagging-strand details are omitted.','OpenStax §3.3, Fig. 3.24',replication,[
  target('parental-dna','Parental DNA',146,260,'Before copying, the two complementary DNA strands are paired together.'),
  target('helicase','Helicase',333,260,'Unwinds and separates the paired DNA strands at the replication fork.'),
  target('template-strand','Template strand',573,114,'Each original strand supplies the base sequence that directs synthesis of its new complementary strand.'),
  target('dna-polymerase','DNA polymerase',437,153,'Adds complementary nucleotides to the growing DNA strand. New DNA is synthesized in the 5′ to 3′ direction.'),
  target('new-strand','New DNA strand',570,384,'The newly assembled strand is complementary to its template. DNA polymerase and other enzymes also help limit copying errors.'),
  target('free-nucleotides','Free nucleotides',420,94,'Building blocks available for incorporation into a new DNA strand.'),
  target('semiconservative','Semiconservative product',656,255,'Each completed daughter DNA molecule contains one pre-existing strand and one newly synthesized strand.')])],
 protein:[fig('transcription-splicing','Transcribe, then edit','Top: a small region of DNA is transcribed. Bottom: introns are removed and exons joined before mature mRNA leaves the nucleus.','OpenStax §3.4, Figs. 3.26–3.27',transcription,[
  target('coding-strand','Coding DNA strand',590,121,'Its sequence matches the RNA transcript except DNA uses T where RNA uses U. It is not the strand read as the template.'),
  target('template-dna','Template DNA strand',590,162,'RNA polymerase reads this strand to build complementary RNA.'),
  target('rna-polymerase','RNA polymerase',345,119,'Opens a local transcription bubble and joins RNA nucleotides to extend the transcript.'),
  target('pre-mrna','Growing pre-mRNA',170,213,'The initial RNA transcript is complementary to the DNA template strand. It is processed before translation.'),
  target('exon','Exon',145,332,'A transcript segment retained in the mature RNA after splicing.'),
  target('intron','Intron',253,333,'A transcript segment removed by the spliceosome during RNA processing.'),
  target('mature-mrna','Mature mRNA',361,425,'Spliced RNA with joined exons; a 5′ cap and poly-A tail help protect it and support later translation.'),
  target('poly-a-tail','Poly-A tail',602,434,'A chain of adenine nucleotides added to the 3′ end of most eukaryotic mRNA.')]),
 fig('translation','Read the message, build the chain','The ribosome reads mRNA from 5′ to 3′. Complementary tRNA anticodons deliver amino acids in the encoded order.','OpenStax §3.4, Figs. 3.28–3.29',translation,[
  target('mrna','mRNA',159,368,'Carries the nucleotide message from DNA to a ribosome. The message is read in three-base codons.'),
  target('ribosome','Ribosome',458,269,'Its large and small subunits position mRNA and tRNAs and catalyze peptide-bond formation.'),
  target('codon','Codon',290,367,'A three-nucleotide unit in mRNA. For example, GAA specifies glutamate.'),
  target('trna','tRNA',551,215,'An adapter RNA carries a specific amino acid and pairs its anticodon with a complementary mRNA codon.'),
  target('anticodon','Anticodon',374,329,'A three-base sequence in tRNA; GGA pairs antiparallel with the illustrated CCU mRNA codon.'),
  target('amino-acid','Amino acid',550,163,'A building block of protein carried by a tRNA before being joined to the growing chain.'),
  target('polypeptide','Growing polypeptide',294,175,'Amino acids joined by peptide bonds; the completed chain will fold and may undergo further processing.'),
  target('stop-codon','Stop codon',620,368,'UAA, UAG, and UGA signal termination rather than specifying an amino acid.')])],
 division:[fig('cell-cycle','One cell cycle','Move around the ring through growth, DNA synthesis, preparation, and division. The branch represents leaving the active division cycle. Durations are not to scale.','OpenStax §3.5, Figs. 3.30–3.31',cycle,[
  target('g1','G1 phase',451,179,'The cell grows, carries out normal functions, and produces cellular components before DNA synthesis.'),
  target('s-phase','S phase',384,402,'DNA is replicated. Each chromosome acquires a sister chromatid; chromosome number does not double simply because DNA amount doubles.'),
  target('g2','G2 phase',167,339,'Further growth, checks, and preparation for mitosis follow DNA replication.'),
  target('m-phase','Mitotic phase',214,134,'Mitosis distributes duplicated chromosomes into two nuclei; cytokinesis divides the cytoplasm.'),
  target('g0','G0 phase',653,111,'A cell leaves the active division cycle. Some cells may re-enter; others remain outside the cycle while performing specialized functions.'),
  target('sister-chromatids','Sister chromatids',611,320,'Two copies of one replicated chromosome are joined at the centromere. A typical human cell has 46 chromosomes and 92 chromatids after S phase.'),
  target('checkpoint','Cell-cycle checkpoints',208,429,'Regulatory checks help prevent progression when conditions or DNA integrity are unsuitable; cyclins and cyclin-dependent kinases regulate progression.')]),
 fig('mitosis','Distribute the copies','Follow the arrows from chromosome condensation to two cells. Only four chromosomes are shown for clarity; this is mitosis, not meiosis.','OpenStax §3.5, Fig. 3.32',mitosis,[
  target('prophase','Prophase',145,153,'Chromatin condenses into visible chromosomes. The spindle forms; the nucleolus disappears and the nuclear envelope breaks down as division proceeds.'),
  target('metaphase','Metaphase',400,153,'Duplicated chromosomes align individually along the cell equator, attached to spindle fibers from opposite poles.'),
  target('anaphase','Anaphase',655,153,'Sister chromatids separate. Each is now a chromosome, moving toward an opposite pole.'),
  target('telophase','Telophase',529,382,'Chromosomes reach the poles; nuclear envelopes reform and chromosomes begin to decondense.'),
  target('cytokinesis','Cytokinesis',273,381,'An actin–myosin cleavage furrow divides the cytoplasm, producing two daughter cells. It overlaps late mitosis.')])],
 differentiation:[fig('blood-lineage','A branching set of possibilities','A deliberately simplified blood-cell lineage. Branches represent restricted developmental potential, not a literal single-step conversion. Platelets are fragments of megakaryocytes.','OpenStax §3.6, Figs. 3.34–3.35',differentiation,[
  target('hematopoietic-stem-cell','Hematopoietic stem cell',403,80,'A multipotent adult stem cell can self-renew and produce the blood-cell lineages.'),
  target('self-renewal','Self-renewal',307,57,'Stem-cell division can maintain the stem-cell pool as well as provide descendants that differentiate.'),
  target('myeloid-progenitor','Myeloid progenitor',245,245,'The myeloid branch gives rise to red blood cells, granulocytes, monocytes, and megakaryocytes that shed platelets. Additional intermediate stages are omitted.'),
  target('lymphoid-progenitor','Lymphoid progenitor',595,245,'The lymphoid branch gives rise to B cells, T cells, and natural killer cells. The textbook figure shows additional stages and branches.'),
  target('red-blood-cell','Red blood cell',104,380,'A specialized biconcave cell carries oxygen. Mature human red blood cells have expelled their nucleus.'),
  target('granulocyte','Granulocyte',261,380,'A specialized white blood cell with cytoplasmic granules and a lobed nucleus; the sketch represents a neutrophil.'),
  target('lymphocyte','Lymphocyte',687,380,'A specialized white blood cell involved in immune defense; its large nucleus occupies much of the cell.'),
  target('platelets','Platelets',449,383,'Small cell fragments shed from megakaryocytes in the myeloid lineage participate in hemostasis. They are not whole nucleated cells.')])]
};

export const references=[
 {id:'fig-3-4',title:'Cell membrane',file:'assets/openstax-3-4.png',section:'membrane',page:88,caption:'Figure 3.4. Original membrane structure and molecular components.'},
 {id:'fig-3-9',title:'Sodium-potassium pump',file:'assets/openstax-3-9.png',section:'membrane',page:92,caption:'Figure 3.9. The ATP-driven pump exports three Na+ and imports two K+ per cycle.'},
 {id:'fig-3-13',title:'Prototypical human cell',file:'assets/openstax-3-13.png',section:'organelles',page:96,caption:'Figure 3.13. A composite cell with its primary organelles and internal structures.'},
 {id:'fig-3-19',title:'The nucleus',file:'assets/openstax-3-19.png',section:'nucleus',page:102,caption:'Figure 3.19. Nuclear envelope, pores, nucleolus, and chromatin.'},
 {id:'fig-3-24',title:'DNA replication',file:'assets/openstax-3-24.png',section:'nucleus',page:106,caption:'Figure 3.24. Each daughter molecule retains one original DNA strand.'},
 {id:'fig-3-26',title:'Transcription',file:'assets/openstax-3-26.png',section:'protein',page:108,caption:'Figure 3.26. A gene is transcribed into a complementary RNA molecule.'},
 {id:'fig-3-28',title:'Translation',file:'assets/openstax-3-28.png',section:'protein',page:110,caption:'Figure 3.28. tRNA, mRNA, and a ribosome coordinate polypeptide synthesis.'},
 {id:'fig-3-30',title:'Cell cycle',file:'assets/openstax-3-30.png',section:'division',page:112,caption:'Figure 3.30. Interphase and mitotic phase, with the G0 branch.'},
 {id:'fig-3-32',title:'Mitosis and cytokinesis',file:'assets/openstax-3-32.png',section:'division',page:113,caption:'Figure 3.32. Chromosome separation and division of the cell.'},
 {id:'fig-3-34',title:'Hematopoiesis',file:'assets/openstax-3-34.png',section:'differentiation',page:117,caption:'Figure 3.34. Detailed blood-cell differentiation from hematopoietic stem cells.'}
];

export const figureLicense={attribution:'OpenStax, Anatomy and Physiology 2e, ©2026 Rice University. Access for free at openstax.org.',url:'https://openstax.org/details/books/anatomy-and-physiology-2e',license:'CC BY-NC-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-nc-sa/4.0/',adaptations:'Interactive schematics are original educational adaptations; source PNG figures retain the original textbook labels. Not to scale.'};
