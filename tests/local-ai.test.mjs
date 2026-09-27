import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendation,statusLabel,escapeHtml} from '../dist/local-ai/core.js';
test('Ollama states distinguish missing, stopped, external and managed servers',()=>{
 assert.equal(statusLabel({installed:true,running:false}),'Installed · not running');
 assert.equal(statusLabel({installed:false,running:true}),'Running · start Soma session');
 assert.equal(statusLabel({installed:true,running:true,ready:true}),'Ready · local-only session');
 assert.equal(statusLabel({installed:false,running:false}),'Installation not found');
});
test('hardware recommendation leaves headroom and does not sum independent GPUs',()=>{
 const h={ramBytes:32*2**30,gpus:[{totalMiB:16311,freeMiB:15288}]};
 assert.match(recommendation(h).tag,/:9b/);
 assert.match(recommendation({...h,gpus:[{freeMiB:7000},{freeMiB:7000}]}).tag,/:4b/);
 assert.match(recommendation({...h,gpus:[]}).tag,/:2b/);
 assert.equal(recommendation({ramBytes:4*2**30,gpus:[]}),null);
});
test('model output is escaped before rendering',()=>assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;'));
