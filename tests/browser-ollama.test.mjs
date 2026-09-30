import test from 'node:test';
import assert from 'node:assert/strict';
import {createBrowserOllama,consumeNDJSON,remoteModel,usableModel} from '../dist/local-ai/browser-ollama.js';
const response=v=>new Response(JSON.stringify(v),{status:200,headers:{'Content-Type':'application/json'}});
test('Browser adapter does not connect at construction; all requests stay on loopback',async()=>{
 const calls=[],bridge=createBrowserOllama({fetchImpl:async(url,options)=>{calls.push({url,options});return response(url.endsWith('/version')?{version:'0.35.0'}:{models:[]});}});
 assert.equal(calls.length,0);assert.equal((await bridge.invoke('status')).ready,true);assert.deepEqual((await bridge.invoke('models')).models,[]);
 assert(calls.every(c=>c.url.startsWith('http://127.0.0.1:11434/api/')&&c.options.credentials==='omit'&&c.options.redirect==='error'));
});
test('Cloud aliases and non-chat models are excluded; selected models are checked before prompts are sent',async()=>{
 assert(remoteModel({name:'innocent',remote_host:'https://example.com'}));assert(!usableModel({name:'alias',remote_model:'remote'}));assert(!usableModel({name:'vector',capabilities:['embedding']}));
 const calls=[];const bridge=createBrowserOllama({fetchImpl:async(url,opts)=>{calls.push(url);return response({capabilities:['completion'],remote_host:'https://example.com'});}});
 await assert.rejects(bridge.invoke('chat',{model:'alias',messages:[{role:'user',content:'Private answer'}]}),/remote host/);assert.equal(calls.length,1);assert(calls[0].endsWith('/show'));
});
test('Chat preserves schema and uses a bounded local context without executing model tools',async()=>{
 const calls=[],schema={type:'object',properties:{reply:{type:'string'}}};const bridge=createBrowserOllama({fetchImpl:async(url,opts)=>{calls.push(JSON.parse(opts.body));return response(url.endsWith('/show')?{capabilities:['completion','thinking']}:{message:{content:'{"reply":"Why?"}'}});}});
 const r=await bridge.invoke('chat',{model:'local',messages:[{role:'user',content:'Question'}],format:schema});assert(r.message.content);assert.deepEqual(calls[1].format,schema);assert.equal(calls[1].stream,false);assert.equal(calls[1].think,false);assert.equal(calls[1].options.num_ctx,8192);assert(!calls[1].tools);
});
test('Download NDJSON handles chunk splits, final lines and server errors',async()=>{
 const enc=new TextEncoder(),seen=[];const stream=new ReadableStream({start(c){for(const s of ['{"status":"pull','ing","completed":2}\n{"status":','"success"}'])c.enqueue(enc.encode(s));c.close();}});
 await consumeNDJSON(stream,v=>seen.push(v));assert.equal(seen.length,2);assert.equal(seen[1].status,'success');
 await assert.rejects(consumeNDJSON(new Response('{"error":"disk full"}\n').body,()=>{}),/disk full/);
});
test('Failed fetches do not falsely claim software is missing; cancellation releases the active operation',async()=>{
 const failed=createBrowserOllama({fetchImpl:async()=>{throw TypeError('Failed to fetch');}});await assert.rejects(failed.invoke('status'),err=>err.code==='connection'&&!err.message.includes('not installed'));
 let started;const gate=new Promise(r=>started=r);const bridge=createBrowserOllama({fetchImpl:async(url,{signal})=>{started();return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));}});
 const pending=bridge.invoke('status');await gate;await assert.rejects(bridge.invoke('models'),/Finish or cancel/);await bridge.invoke('cancel_job');await assert.rejects(pending,err=>err.code==='cancelled');
});
test('A download must report success and cannot be redirected to arbitrary model endpoints',async()=>{
 const bridge=createBrowserOllama({fetchImpl:async()=>new Response('{"status":"pulling","completed":10}\n')});await assert.rejects(bridge.invoke('pull_model',{model:'qwen3.5:2b-q4_K_M'}),/before Ollama confirmed/);await assert.rejects(bridge.invoke('pull_model',{model:'https://example.com/model'}),/download list/);
});
