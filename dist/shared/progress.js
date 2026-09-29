// A revision prevents an older open study tab from restoring cleared records.
export const revisionKey='soma-progress-revision-v1';
export function resetProgress(storage){
 const keys=['soma-inside-v1','soma-cell-studio-v1','soma-resume-v1','soma-atlas-draft-v1','soma-cell-draft-v1','soma-tissue-studio-v1','soma-tissue-draft-v1'];
 const previous=keys.map(k=>[k,storage.getItem(k)]);
 try{
  for(const k of keys)storage.removeItem(k);
  storage.setItem(revisionKey,JSON.stringify(`${Date.now()}-${Math.random()}`));
 }catch(error){for(const [k,v] of previous)if(v!==null)storage.setItem(k,v);throw error;}
}
export function progressGuard(storage,onChange){
 let initial;try{initial=storage.getItem(revisionKey);}catch{return ()=>true;}let stale=false;
 return ()=>{if(stale)return false;let current;try{current=storage.getItem(revisionKey);}catch{return false;}if(current!==initial){stale=true;onChange();return false;}return true;};
}
