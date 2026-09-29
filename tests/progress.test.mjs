import test from 'node:test';
import assert from 'node:assert/strict';
import {resetProgress,progressGuard} from '../dist/shared/progress.js';
function memory(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
test('reset clears reviewed scores and drafts but preserves AI, preferences and unrelated data',()=>{const s=memory();for(const k of ['soma-inside-v1','soma-cell-studio-v1','soma-resume-v1','soma-atlas-draft-v1','soma-cell-draft-v1','soma-local-ai-v1','soma-motion','other'])s.setItem(k,'saved');resetProgress(s);for(const k of ['soma-inside-v1','soma-cell-studio-v1','soma-resume-v1','soma-atlas-draft-v1','soma-cell-draft-v1'])assert.equal(s.getItem(k),null);for(const k of ['soma-local-ai-v1','soma-motion','other'])assert.equal(s.getItem(k),'saved');});
test('stale windows cannot save again after reset, including pagehide',()=>{const s=memory();let notices=0;const guard=progressGuard(s,()=>notices++);assert.equal(guard(),true);resetProgress(s);assert.equal(guard(),false);assert.equal(guard(),false);assert.equal(notices,1);assert.equal(progressGuard(s,()=>{})(),true);});
