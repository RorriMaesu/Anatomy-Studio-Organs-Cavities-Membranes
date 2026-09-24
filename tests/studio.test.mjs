import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {sections,sources} from '../dist/data.js';
import {illustrations} from '../dist/system-geometry.js';
test('Blender export has four anatomically oriented planes and a lightweight human',()=>{
 const bytes=fs.readFileSync(new URL('../dist/assets/body-planes.glb',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'glTF');assert(bytes.length<2_000_000);
 const gltf=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
 assert(gltf.nodes.some(n=>n.name==='Human'));
 const binStart=20+bytes.readUInt32LE(12)+8;
 const coords=name=>{const n=gltf.nodes.find(n=>n.name===name);assert(n);const a=gltf.accessors[gltf.meshes[n.mesh].primitives[0].attributes.POSITION],v=gltf.bufferViews[a.bufferView];return Array.from({length:a.count},(_,i)=>Array.from({length:3},(_,j)=>bytes.readFloatLE(binStart+(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||12)+j*4)));};
 assert(coords('Sagittal').every(p=>Math.abs(p[0])<.0001));
 assert(coords('Frontal').every(p=>Math.abs(p[2])<.0001));
 assert(coords('Transverse').every(p=>Math.abs(p[1]-.94)<.0001));
 assert(new Set(coords('Oblique').map(p=>p[1])).size>1);
});
const code=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/import \{sections,sources\} from '\.\/data\.js(?:\?[^']*)?';/,'');
function harness(){const nodes=new Map();let saved='{}';const document={querySelector(id){if(!nodes.has(id))nodes.set(id,{value:'',checked:false,innerHTML:'',addEventListener(){},focus(){}});return nodes.get(id);},querySelectorAll(){return []}};const c=vm.createContext({sections,sources,document,localStorage:{getItem:()=>saved,setItem:(_,v)=>saved=v},setTimeout:fn=>fn(),confirm:()=>true,console});vm.runInContext(code,c);return {run:s=>vm.runInContext(s,c),node:id=>document.querySelector(id)};}
test('3D quiz conceals names and selection; study labels and textbook fallback remain available',()=>{
 const h=harness();h.run("state.section='planes'");
 let html=h.run("diagram(currentView(),{quiz:true,target:1,locate:true})");
 assert(html.includes('data-active="-1"'));assert.equal((html.match(/data-pin=/g)||[]).length,4);
 for(const name of ['Sagittal','Frontal','Transverse','Oblique'])assert(!html.includes(name));
 html=h.run("diagram(currentView(),{quiz:true,target:2})");assert(html.includes('data-active="2"'));assert(!html.includes('Transverse'));
 assert(h.run('diagram(currentView())').includes('Sagittal plane'));
 h.run('state.paperPlanes=true');assert(h.run('diagram(currentView())').includes('assets/planes.png'));
});
test('Printed figures never acquire duplicate SVG callout lines',()=>{
 const h=harness();
 for(const section of sections)for(const v of section.views.filter(v=>!v.customLeaders)){
  for(const overview of [true,false]){
   h.run(`state.overview=${overview}`);
   const html=h.run(`diagram(sections.find(s=>s.id===${JSON.stringify(section.id)}).views.find(v=>v.id===${JSON.stringify(v.id)}))`);
   assert(!html.includes('class="callouts"'),v.id);
   assert(!html.includes('<line '),v.id);
  }
 }
});
test('Nervous-system labels use the original label ends, including the branched nerve pointer',()=>{
 const v=sections[0].views.find(v=>v.id==='nervous');
 for(let i=0;i<v.targets.length;i++){
  const g=illustrations.nervous,stroke=g.strokes[g.targets[i].leaders[0]];
  assert.deepEqual(v.targets[i].leader[0],stroke.slice(0,2));
 }
});
test('Close-up label anchors stay on the original printed segments',()=>{
 const h=harness();
 assert.equal(h.run('JSON.stringify(printedAnchor([[0,10],[100,50]],[25,0,50,80]))'),'[25,20]');
 assert.equal(h.run('JSON.stringify(printedAnchor([[120,10],[90,10],[40,60]],[0,0,100,100]))'),'[100,10]');
 assert.equal(h.run('printedAnchor([[0,0],[10,10]],[20,20,10,10])'),null);
 for(const s of sections)for(const v of s.views)for(const p of v.targets.filter(p=>p.leader)){
  for(const box of [[0,0,...v.size],v.focusBox,p.detail].filter(Boolean)){
   const anchor=h.run(`printedAnchor(${JSON.stringify(p.leader)},${JSON.stringify(box)})`);
   assert(anchor,v.id+' / '+p.name+' printed path must intersect its crop');
   const [x,y,w,height]=box;
   assert(anchor[0]>=x-.01&&anchor[0]<=x+w+.01&&anchor[1]>=y-.01&&anchor[1]<=y+height+.01);
  }
 }
});
test('Every figure exists and every marker lies within its image',()=>{let targets=0;for(const s of sections){assert(s.facts.length);for(const v of s.views){assert(fs.existsSync(new URL('../dist/assets/'+v.src,import.meta.url)));assert.equal(v.size.length,2);for(const t of v.targets){targets++;assert(t.name&&t.teach);assert(t.x>=0&&t.x<=100&&t.y>=0&&t.y<=100);if(t.pin)assert(t.pin.every(n=>n>=0&&n<=100));}}for(const q of s.facts){assert(q.options.includes(q.a));assert.equal(new Set(q.options).size,q.options.length);}}assert(targets>=80);});
test('Every typed target and alias grades correctly; repeated submission cannot inflate score',()=>{const h=harness();for(const sec of sections){const bank=h.run(`bank(sections.find(s=>s.id==='${sec.id}'),'typed')`);for(const q of bank.filter(q=>q.type==='typed')){for(const name of [q.a,...(q.aliases||[])]){h.run(`state.session={questions:[${JSON.stringify(q)}],index:0,records:[],hint:false,answered:false};state.mode='practice';answer(${JSON.stringify(' '+name.toUpperCase()+' ')});`);assert(h.run('state.session.feedback.correct'));h.run("answer('not the answer')");assert.equal(h.run('state.session.records.length'),1);}}}});
test('Location practice accepts only the correct marker and hint use remains assisted',()=>{const h=harness();h.run("state.session={questions:bank(sections[1],'locate'),index:0,records:[],hint:true,answered:false};state.mode='practice';answer(0)");assert(h.run('state.session.feedback.correct'));assert(h.run('state.session.feedback.assisted'));assert.equal(h.run('state.stats[state.session.questions[0].id].correct'),0);h.run("state.session.index=1;state.session.answered=false;state.session.hint=false;answer(0)");assert.equal(h.run('state.session.feedback.correct'),false);});
test('Standard 40-question exam balances all 8 sections and excludes extensions',()=>{const h=harness();h.node('#exam-length').value='40';h.node('#extensions').checked=false;h.run('start(true)');assert.equal(h.run('state.session.questions.length'),40);for(const s of sections)assert.equal(h.run(`state.session.questions.filter(q=>q.section==='${s.id}').length`),5);assert.equal(h.run("state.session.questions.filter(q=>q.q.startsWith('Extension:')||q.view==='meninges').length"),0);h.run('answer(state.session.questions[0].type===\'locate\'?state.session.questions[0].target:state.session.questions[0].a)');assert(h.node('#app').innerHTML.includes('Answer recorded.'));assert(!h.node('#app').innerHTML.includes('class="feedback good"'));});
test('Complete bank, practice limits, mistakes, skipping and results',()=>{const h=harness();h.node('#exam-length').value='all';h.node('#extensions').checked=true;h.run('start(true)');const expected=h.run('sections.reduce((n,s)=>n+bank(s).length,0)');assert.equal(h.run('state.session.questions.length'),expected);assert.equal(h.run('new Set(state.session.questions.map(q=>q.id)).size'),expected);h.run("state.session=null;state.section='planes'");h.node('#format').value='choice';h.node('#scope').value='planes';h.node('#practice-length').value='10';h.run('start(false)');assert.equal(h.run('state.session.questions.length'),4);h.run("answer('Skipped');state.session.index++;state.session.answered=false;answer('wrong')");assert.equal(h.run('state.session.records.filter(r=>r.correct).length'),0);const html=h.run('results()');assert(html.includes('0 of 2'));assert(html.includes('Practice missed & assisted (2)'));});
test('Storage denial and corrupt saved preferences do not stop the app',()=>{const document={querySelector:()=>({innerHTML:'',addEventListener(){}}),querySelectorAll:()=>[]};const c=vm.createContext({sections,sources,document,localStorage:{getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},setTimeout:()=>{},console});vm.runInContext(code,c);vm.runInContext('persist()',c);assert(vm.runInContext('state.storageError',c));});
test('Typed drafts survive detail and hint renders, and review identifies the original diagram',()=>{const h=harness();h.run("state.session={questions:bank(sections.find(s=>s.id==='planes'),'typed','planes'),index:0,records:[],hint:false,answered:false,draft:'coronal plane'};state.mode='practice';render()");assert(h.node('#app').innerHTML.includes('value="coronal plane"'));h.run('state.overview=true;state.session.hint=true;render()');assert(h.node('#app').innerHTML.includes('value="coronal plane"'));h.run("answer('wrong');state.mode='results';render()");assert(h.node('#app').innerHTML.includes('class="review-figure"'));assert(h.node('#app').innerHTML.includes('Four ways to section the body'));assert(h.node('#app').innerHTML.includes('assets/planes.png'));});
test('Shared detail views retain all location targets; individual crops retain their target',()=>{
 for(const s of sections)for(const v of s.views)for(const p of v.targets){
  for(const box of [v.focusBox,p.detail].filter(Boolean)){
   const [x,y,w,h]=box,px=p.x*v.size[0]/100,py=p.y*v.size[1]/100;
   assert(px>=x&&px<=x+w&&py>=y&&py<=y+h,v.id+' / '+p.name+' is outside its crop');
  }
 }
});
test('Location quizzes retain every candidate and do not highlight the answer before submission',()=>{
 const h=harness();
 for(const s of sections)for(const v of s.views.filter(v=>v.targets.length)){
  for(let i=0;i<v.targets.length;i++){
   const html=h.run(`diagram(sections.find(s=>s.id===${JSON.stringify(s.id)}).views.find(v=>v.id===${JSON.stringify(v.id)}),{quiz:true,locate:true,target:${i}})`);
   assert.equal((html.match(/data-pin="/g)||[]).length,v.targets.length,v.id);
   assert(!html.includes('pin selected'),v.id);
   assert(!html.includes('class="plane-surface"'),v.id);
  }
 }
});
test('Recall cards and results show only the requested page',()=>{
 const h=harness();
 h.run("state.section='chemistry';state.factPage=1;state.factReveal=true");
 const study=h.run('study()');
 assert(study.includes(sections.find(s=>s.id==='chemistry').facts[1].q));
 assert(!study.includes(sections.find(s=>s.id==='chemistry').facts[0].q));
 h.run("state.session={exam:false,records:bank(sections.find(s=>s.id==='planes'),'locate').map(q=>({q,answer:'Skipped',correct:false,assisted:false}))};state.reviewPage=2");
 const result=h.run('results()');
 assert(result.includes('ANSWER 3'));
 assert(result.includes('Locate the transverse plane.'));
 assert(!result.includes('Locate the sagittal plane.'));
});
