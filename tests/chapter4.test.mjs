import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {specimens} from '../dist/chapter4/specimens.js';
import {modules,facts} from '../dist/chapter4/content.js';
import {figures} from '../dist/chapter4/figures.js';
import {lab,labOptions} from '../dist/chapter4/labs.js';
import {bank,blueprint,makeSession,result,correct,validSession,sectionCounts} from '../dist/chapter4/engine.js';
import {chapters,sectionLink,textbook,e} from '../dist/shared/course.js';
import {resetProgress,progressGuard,revisionKey} from '../dist/shared/progress.js';
test('Chapter 4 objectives have stable identities, lessons, valid answers and remediation',()=>{
 assert.equal(modules.length,6);assert(bank.length>=120);assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
 for(const m of modules){assert(m.lessons.length>=2);for(const l of m.lessons){assert(l.body.length>150);assert(bank.some(q=>q.module===m.id&&q.lesson===l.id));}}
 for(const q of bank){assert(modules.find(m=>m.id===q.module).lessons.some(l=>l.id===q.lesson));assert.equal(new Set(q.options).size,4,q.id);assert(q.options.includes(q.answer));assert(correct(q,q.answer));assert(!correct(q,''));}
 assert.equal(facts.length,new Set(facts.map(f=>f.module+'/'+f.id)).size);
});
test('Chapter exam obeys all six quotas, includes reasoning, and never repeats a question',()=>{
 for(let run=0;run<20;run++){const s=makeSession({exam:true});assert(validSession(s));assert.equal(s.ids.length,40);assert.equal(new Set(s.ids).size,40);for(const [module,n]of Object.entries(blueprint)){const qs=s.ids.map(id=>bank.find(q=>q.id===id)).filter(q=>q.module===module);assert.equal(qs.length,n);assert(qs.some(q=>q.type==='reasoning'));}}
});
test('Assistance and unanswered items remain distinct through draft restoration',()=>{
 const s=makeSession({module:'epithelial'}),q=bank.find(q=>q.id===s.ids[0]);s.answers[q.id]=q.answer;s.assisted[q.id]=true;
 const restored=JSON.parse(JSON.stringify(s));assert(validSession(restored));assert.deepEqual(result(restored),result(s));assert.equal(result(s).independent,0);assert.equal(result(s).assisted,1);assert.equal(result(s).missed,10);
 assert(!validSession({...s,ids:['invented']}));assert(!validSession({...s,index:40}));assert(!validSession({...s,options:{}}));
});
test('Focused review includes assisted and missed records, excluding independently correct and untried',()=>{
 const [a,b,c]=bank;const stats={[a.id]:{lastCorrect:false},[b.id]:{lastCorrect:true,assisted:true},[c.id]:{lastCorrect:true}};
 const s=makeSession({revisit:true,stats});assert.deepEqual(new Set(s.ids),new Set([a.id,b.id]));
});
test('Every textbook figure is local, credited and explicitly study-only',()=>{
 assert.equal(figures.length,22);for(const f of figures){assert(fs.existsSync(new URL('../dist/chapter4/'+f.src,import.meta.url)));assert(f.credit.includes('OpenStax'));assert(f.role.includes('not used'));assert(f.width>300);}
});
test('Every lab mode renders; assessment versions omit text labels and captions',()=>{
 for(const m of modules)for(const [mode] of labOptions[m.id]){const v=lab(m.id,{mode});assert(v.svg.includes('<svg'));assert(v.caption.length>30);assert(v.title);}
 for(const q of bank.filter(q=>q.visual)){const v=lab(q.visual.module,{...q.visual,labels:false});assert(!v.svg.includes('<text'));assert(!v.svg.toLowerCase().includes(q.answer.toLowerCase()));}
});
test('Chapter routing and global reset include Tissue Studio without clearing settings',()=>{
 const c=chapters.find(c=>c.id===4);for(const s of c.sections)assert.equal(sectionLink(c,s),`chapter4/#module/${s[2]}/learn`);
 const values=new Map([['soma-tissue-studio-v1','scores'],['soma-tissue-draft-v1','draft'],['soma-motion','off']]);resetProgress({getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)});assert(!values.has('soma-tissue-studio-v1'));assert(!values.has('soma-tissue-draft-v1'));assert.equal(values.get('soma-motion'),'off');
});
function harness(storageFails=false){
 const nodes=new Map(),values=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',querySelector:node,querySelectorAll:()=>[],addEventListener(){},focus(){}});return nodes.get(id);};
 const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(storageFails)throw Error('denied');values.set(k,v);},removeItem:k=>values.delete(k)};
 const context=vm.createContext({setTimeout,clearTimeout,modules,facts,figures,specimens,lab,labOptions,bank,makeSession,correct,result,validSession,sectionCounts,chapters,textbook,e,progressGuard,revisionKey,read:(k,f={})=>JSON.parse(storage.getItem(k)||'null')||f,document:{querySelector:node,activeElement:null},localStorage:storage,location:{hash:'#module/types/learn',replace(){}},window:{addEventListener(){}},CSS:{escape:s=>s},confirm:()=>true,alert(){}});
 context.document.documentElement={dataset:{}};
 vm.runInContext(fs.readFileSync(new URL('../dist/chapter4/studio.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,''),context);
 return {run:s=>vm.runInContext(s,context),html:()=>node('#app').innerHTML,values};
}
test('Exam hides explanations and source identities until submission; recorded answers cannot inflate progress',()=>{
 const h=harness();h.run("state.session=makeSession({exam:true});state.session.index=state.session.ids.findIndex(id=>bank.find(q=>q.id===id).specimen);state.tab='session';render()");
 assert(h.html().includes('Unlabeled textbook tissue specimen'));assert(!h.html().includes('class="feedback"'));assert(!h.html().includes('Use a hint'));assert(!h.html().includes('Regents'));
 h.run("var q=bank.find(q=>q.id===state.session.ids[state.session.index]);state.session.answers[q.id]=q.answer;record(q.id);record(q.id)");assert.equal(h.run('state.stats[q.id].attempts'),1);
});
test('Practice help remains assisted after saving, and storage denial is visible immediately',()=>{
 const h=harness();h.run("state.session=makeSession({module:'types'});var q=bank.find(q=>q.id===state.session.ids[0]);state.session.answers[q.id]=q.answer;state.session.assisted[q.id]=true;record(q.id);state.tab='session';render()");
 assert(h.html().includes('Correct · assisted'));assert.equal(JSON.parse(h.values.get('soma-tissue-draft-v1')).session.assisted[h.run('q.id')],true);
 assert(harness(true).html().includes('Browser storage is unavailable'));
});
test('Micrograph questions have neutral image filenames and valid attribution after review',()=>{
 for(const s of specimens){assert(fs.existsSync(new URL('../dist/chapter4/'+s.src,import.meta.url)));assert(!s.src.toLowerCase().includes(s.name.toLowerCase()));assert(s.credit.includes('Regents'));assert(s.evidence.length>50);}
 for(let i=0;i<20;i++){const exam=makeSession({exam:true}),qs=exam.ids.map(id=>bank.find(q=>q.id===id));assert(qs.some(q=>q.specimen&&q.module==='muscle'));assert(qs.some(q=>q.specimen&&q.module==='connective'));const images=qs.filter(q=>q.specimen).map(q=>q.specimen);assert.equal(images.length,new Set(images).size);}
});

test('textbook tours preserve source geometry and provide contextual recall prompts',()=>{
 for(const m of modules)for(const [mode] of labOptions[m.id]){
  const first=lab(m.id,{mode});
  for(let step=0;step<first.steps;step++){
   const d=lab(m.id,{mode,step});assert(d.svg.includes('<image href="'+d.figure.src));assert(d.svg.includes('clip-path="url(#study-crop)"'));assert(d.question.endsWith('?'));assert(d.caption.length>50);
   const bounds=d.svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);assert(bounds.every(Number.isFinite));assert(bounds[0]>=0&&bounds[1]>=0&&bounds[2]>0&&bounds[3]>0);assert(bounds[0]+bounds[2]<=d.figure.width+1);assert(bounds[1]+bounds[3]<=d.figure.height+1);
  }
 }
 assert(!lab('muscle',{mode:'cardiac'}).svg.includes('contract'));
 assert.match(lab('epithelial',{mode:'transitional'}).caption,/does not remove cells/);
 assert(lab('nervous',{mode:'signal',step:2}).svg.includes('flow-trace'));
});
