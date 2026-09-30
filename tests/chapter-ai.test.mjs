import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters,textbook} from '../dist/shared/course.js';
import {modules,corpus,retrieve,tutorMessages} from '../dist/local-ai/learning-engine.js';
test('every published section has scoped AI references and the exact textbook destination',()=>{
 assert.equal(modules.length,chapters.reduce((n,c)=>n+c.sections.length,0));
 assert.equal(new Set(corpus.map(r=>r.id)).size,corpus.length);
 for(const c of chapters)for(const s of c.sections){const m=modules.find(m=>m.section===s[0]);assert.equal(m.chapter,c.id);const refs=retrieve('explain',m.id,100);assert.ok(refs.length);assert.ok(refs.every(r=>r.url===textbook(s)&&r.chapter===c.id));assert.ok(m.studioUrl.startsWith('../'));}
});
test('legacy Chapter 3 reference identifiers survive the chapter expansion',()=>{
 assert.equal(corpus.filter(r=>r.id.startsWith('C3-')).length,53);
 assert.equal(corpus.find(r=>r.id==='C3-3.1-L1').module,'membrane');
 const refs=retrieve('tissues','c4-4-1');assert.ok(tutorMessages('Explain',[],refs,'socratic')[0].content.includes('provided studio references'));
});
