import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {modules,facts} from '../dist/chapter4/content.js';
import {figures} from '../dist/chapter4/figures.js';
import {lab,labOptions} from '../dist/chapter4/labs.js';
import {bank,blueprint,makeSession,result,correct,validSession} from '../dist/chapter4/engine.js';
import {chapters,sectionLink} from '../dist/shared/course.js';
import {resetProgress} from '../dist/shared/progress.js';
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
