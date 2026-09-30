// Deliberately fixed to loopback. Never route student work through a hosted proxy.
export const OLLAMA_URL='http://127.0.0.1:11434';
export const remoteModel=m=>!!(m?.remote_host||m?.remote_model||/(?:^|[:/-])cloud(?:$|[:/-])/i.test(m?.name||m?.model||''));
export function usableModel(m){return !remoteModel(m)&&!/(embed|rerank)/i.test(m?.name||'')&&(!Array.isArray(m?.capabilities)||m.capabilities.includes('completion'));}
export class OllamaError extends Error{constructor(message,code='request'){super(message);this.code=code;}}
export async function consumeNDJSON(stream,onValue,signal){
 const reader=stream.getReader(),decoder=new TextDecoder();let buffer='';
 const emit=line=>{if(!line.trim())return;let value;try{value=JSON.parse(line);}catch{throw new OllamaError('Ollama returned unreadable download progress. Check the connection and retry.','format');}if(value.error)throw new OllamaError(String(value.error).slice(0,500),'server');onValue(value);};
 try{while(true){if(signal?.aborted)throw new DOMException('Aborted','AbortError');const {done,value}=await reader.read();buffer+=decoder.decode(value||new Uint8Array(),{stream:!done});if(buffer.length>1_000_000)throw new OllamaError('Download progress exceeded the safe response limit.','size');let at;while((at=buffer.indexOf('\n'))>=0){emit(buffer.slice(0,at));buffer=buffer.slice(at+1);}if(done){emit(buffer);break;}}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
export function createBrowserOllama({fetchImpl=globalThis.fetch,onProgress=()=>{},timeoutMs=240000}={}){
 let active=null;
 async function request(path,body,signal,stream=false){
  let response;try{response=await fetchImpl(OLLAMA_URL+'/api/'+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal,credentials:'omit',cache:'no-store',redirect:'error'});}catch(err){if(signal.aborted)throw err;throw new OllamaError('Soma cannot connect to Ollama yet. Open Ollama, allow this website in Ollama settings, and check your browser’s local connection permission.','connection');}
  if(!response.ok)throw new OllamaError(response.status===403?'Ollama has not allowed this website. Follow the “Allow this website” setup step.':`Ollama returned ${response.status}. ${response.status===404?'The model or API is unavailable. Refresh your models or update Ollama.':response.status===503?'Ollama is busy. Wait for the other request or choose a smaller model.':'Check Ollama and try again.'}`,response.status===403?'origin':'server');
  if(stream)return response;
  const reader=response.body.getReader(),decoder=new TextDecoder();let text='',bytes=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>2_000_000)throw new OllamaError('Ollama’s response was too large. Try a shorter request.','size');text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
  let result;try{result=JSON.parse(text);}catch{throw new OllamaError('Ollama returned an unreadable response. Try again or update Ollama.','format');}if(result.error)throw new OllamaError(String(result.error).slice(0,500),'server');return result;
 }
 async function checkModel(model,signal){
  if(typeof model!=='string'||!model.trim()||model.length>200||remoteModel({name:model}))throw new OllamaError('Choose a downloaded local chat model. Cloud models are not used by Soma.','model');
  const details=await request('show',{model},signal);
  if(remoteModel(details))throw new OllamaError('This model uses a remote host. Choose a local model; Soma will not send this conversation to the cloud.','model');
  if(!details.capabilities?.includes('completion'))throw new OllamaError('This model does not report chat support. Choose a chat model, or update Ollama if it is an older installation.','model');
  return details;
 }
 return {async invoke(command,args={}){
  if(command==='cancel_job'){active?.abort('cancelled');return;}
  if(active)throw new OllamaError('Finish or cancel the current request first.','busy');
  const controller=new AbortController();active=controller;let timedOut=false;
  const duration=command==='pull_model'?30*60*1000:['status','models'].includes(command)?8000:timeoutMs;
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},duration);
  try{
   if(command==='status'){const v=await request('version',null,controller.signal);if(typeof v.version!=='string')throw new OllamaError('The local service did not identify itself as Ollama.','format');return {ready:true,running:true,version:v.version};}
   if(command==='models'){const v=await request('tags',null,controller.signal);if(!Array.isArray(v.models))throw new OllamaError('Ollama returned an invalid model list.','format');return {models:v.models.filter(usableModel),excluded:v.models.filter(m=>!usableModel(m)).length};}
   if(command==='model_details')return await checkModel(args.model,controller.signal);
   if(command==='loaded_models')return await request('ps',null,controller.signal);
   if(command==='chat'){
    const details=await checkModel(args.model,controller.signal);
    const body={model:args.model,messages:args.messages,stream:false,format:args.format||undefined,keep_alive:'5m',options:{num_ctx:8192,num_predict:args.format?3500:80,temperature:args.format?.properties?.questions?0.5:0.2}};
    // Opt out of hidden reasoning only for models which advertise thinking support.
    if(details.capabilities.includes('thinking'))body.think=false;
    const v=await request('chat',body,controller.signal);if(remoteModel(v))throw new OllamaError('The response identified a remote model. Local-only mode is required.','model');return v;
   }
   if(command==='pull_model'){
    if(typeof args.model!=='string'||remoteModel({name:args.model})||!/^qwen3\.5:(2b|4b|9b)-q4_K_M$/.test(args.model))throw new OllamaError('Choose a local model from the download list.','model');
    const response=await request('pull',{model:args.model,stream:true},controller.signal,true);let complete=false;
    await consumeNDJSON(response.body,p=>{if(p.status==='success')complete=true;onProgress({status:String(p.status||'Downloading…'),digest:p.digest,completed:p.completed,total:p.total});},controller.signal);
    if(!complete)throw new OllamaError('The download ended before Ollama confirmed completion. Check again; retrying can reuse downloaded data.','download');return {success:true};
   }
   throw new OllamaError('This action is managed in the Ollama application, not the browser.','unsupported');
  }catch(err){if(controller.signal.aborted)throw new OllamaError(timedOut?'This step timed out. Ollama may still be loading or working. Check again, or try a smaller model.':'Stopped waiting for this request. Ollama may still be finishing work in the background.',timedOut?'timeout':'cancelled');throw err;}finally{clearTimeout(timer);active=null;}
 }};
}
