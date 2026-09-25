import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {modules} from '../dist/chapter3/content.js';
import {diagrams,references} from '../dist/chapter3/diagrams.js';
import {buildBank,createSession,grade,score} from '../dist/chapter3/engine.js';
const bank=buildBank(modules,diagrams);
test('Chapter 3 covers six source sections with substantive lessons and applied questions',()=>{
 assert.deepEqual(modules.map(m=>m.section),['3.1','3.2','3.3','3.4','3.5','3.6']);
 for(const m of modules){assert(m.lessons.length>=7);assert(m.questions.length>=12);for(const l of m.lessons)assert(l.body&&l.analogy&&l.trap);for(const q of m.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4);assert(q.explanation);}}
 assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
});
test('All diagram targets and original reference figures are usable',()=>{
 for(const m of modules){assert(diagrams[m.id].length);for(const d of diagrams[m.id]){assert(d.svg.includes('viewBox="0 0 800 520"'));assert(!d.svg.includes('<script'));assert.equal(new Set(d.targets.map(t=>t.id)).size,d.targets.length);for(const t of d.targets)assert(t.x>=0&&t.x<=100&&t.y>=0&&t.y<=100&&t.name&&t.description);}}
 for(const r of references)assert(fs.existsSync(new URL('../dist/chapter3/'+r.file,import.meta.url)));
});
test('Exam balances modules, does not duplicate questions, and respects format and count',()=>{
 for(const format of ['mixed','typed','choice','locate']){const qs=createSession(bank,{exam:true,count:30,format});assert.equal(qs.length,30);assert.equal(new Set(qs.map(q=>q.id)).size,30);for(const m of modules)assert.equal(qs.filter(q=>q.module===m.id).length,5);if(format!=='mixed')assert(qs.every(q=>q.type===format));}
 assert.equal(createSession(bank,{exam:true,count:'all'}).length,bank.length);
 const qs=createSession(bank,{module:'protein',count:12});assert(qs.every(q=>q.module==='protein'));assert.equal(qs.length,12);
});
test('Every question accepts its intended answer; location requires a numeric target',()=>{
 for(const q of bank){assert(grade(q,q.answer));assert(!grade(q,'definitely not the answer'));if(q.type==='locate')assert(!grade(q,String(q.answer)));else assert(grade(q,' '+q.answer.toUpperCase()+' '));}
 assert.deepEqual(score([{correct:true,assisted:false},{correct:true,assisted:true},{correct:false,assisted:false}]),{total:3,independent:1,assisted:1,missed:2});
});
test('Typed recall accepts common abbreviations and equivalent anatomy names',()=>{
 assert(grade(bank.find(q=>q.type==='typed'&&q.answer==='Messenger RNA (mRNA)'),'mRNA'));
 assert(grade(bank.find(q=>q.type==='typed'&&q.answer==='Endoplasmic reticulum (ER)'),'endoplasmic reticulum'));
 assert(grade(bank.find(q=>q.type==='typed'&&q.answer==='Cell membrane'),'plasma membrane'));
 assert(grade(bank.find(q=>q.type==='typed'&&q.answer==='Rough ER'),'rough endoplasmic reticulum'));
});
function harness(){const nodes=new Map(),document={querySelector(s){if(!nodes.has(s))nodes.set(s,{innerHTML:'',value:'',checked:false,addEventListener(){},focus(){}});return nodes.get(s);},querySelectorAll(){return []}};const c=vm.createContext({modules,diagrams,references,buildBank,createSession,grade,score,document,localStorage:{getItem(){return '{}'},setItem(){}},confirm:()=>true});let code=fs.readFileSync(new URL('../dist/chapter3/studio.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');vm.runInContext(code,c);return s=>vm.runInContext(s,c);}
test('Location quizzes conceal selection, label names and premature exam feedback',()=>{
 const run=harness();run("start(false,[bank.find(q=>q.type==='locate')])");let html=run('quiz()');assert(!html.includes('diagram-pin active'));assert(!html.includes('diagram-key'));assert.equal((html.match(/data-target=/g)||[]).length,diagrams.membrane[0].targets.length);
 run('state.session.exam=true;submit(state.session.questions[0].answer)');html=run('quiz()');assert(html.includes('Answer recorded.'));assert(!html.includes('Correct.'));assert(!html.includes('diagram-pin active'));
});
test('Typed drafts survive hints, assisted scoring and double-submit protection',()=>{
 const run=harness();run("start(false,[bank.find(q=>q.type==='typed')]);state.session.draft='my draft';state.session.hint=true");assert(run('quiz()').includes('my draft'));run('submit(state.session.questions[0].answer);submit(state.session.questions[0].answer)');assert.equal(run('state.session.records.length'),1);assert.equal(run('score(state.session.records).independent'),0);assert.equal(run('score(state.session.records).assisted'),1);
});

test('Ending early records skipped answers consistently without duplicating submitted answers',()=>{
 const run=harness();run("start(false,bank.filter(q=>q.type==='choice').slice(0,3));submit(state.session.questions[0].answer);endSession()");
 assert.equal(run('state.session.records.length'),3);assert.equal(run('score(state.session.records).independent'),1);
 assert.equal(run('state.stats[state.session.questions[1].id].lastCorrect'),false);
 assert.equal(run('state.stats[state.session.questions[0].id].attempts'),1);
});
test('Diagram answer review restores the figure and correct marker with inert controls',()=>{
 const run=harness();run("start(true,[bank.find(q=>q.type==='locate')]);endSession()");const html=run('results()');
 assert(html.includes('diagram-wrap'));assert(html.includes('diagram-pin active'));assert(html.includes('Correct answer:'));
 for(const pin of html.matchAll(/<button class="diagram-pin[^>]*>/g))assert(pin[0].includes('disabled'));
});
test('Common biological singulars and RNA full names grade without accepting blank answers',()=>{
 for(const [name,value] of [['Cilia','cilium'],['Centrioles','centriole'],['mRNA','messenger RNA'],['Platelets','platelet'],['Homologous chromosomes','homologous']])assert(grade(bank.find(q=>q.type==='typed'&&q.answer===name),value));
 for(const q of bank.filter(q=>q.type==='typed'))assert(!grade(q,''));
});
test('Transcription schematic uses thymine in DNA and indicates strand orientation',()=>{
 const svg=diagrams.protein.find(d=>d.id==='transcription-splicing').svg;
 assert(svg.includes('T A C'));assert(!svg.includes('U A C'));assert(svg.includes('A U G'));assert(svg.includes('5′'));assert(svg.includes('3′'));
});
