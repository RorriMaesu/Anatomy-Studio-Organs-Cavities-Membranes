export const normalize=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\b(the|a|an)\b/g,'').replace(/\s+/g,' ').trim();
export function shuffled(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const synonymGroups=[['cell membrane','plasma membrane'],['cilia','cilium'],['centriole','centrioles'],['ribosome','ribosomes'],['lysosome','lysosomes'],['peroxisome','peroxisomes'],['microtubule','microtubules'],['intermediate filament','intermediate filaments'],['crista','cristae'],['red blood cell','erythrocyte','rbc'],['platelet','platelets','thrombocyte','thrombocytes'],['mRNA','messenger RNA'],['tRNA','transfer RNA'],['rRNA','ribosomal RNA'],['checkpoint','cell-cycle checkpoint','cell-cycle checkpoints'],['mitotic phase','m phase'],['homologous chromosomes','homologous chromosome','homolog','homologs','homologous'],['rough er','rough endoplasmic reticulum','rer'],['smooth er','smooth endoplasmic reticulum','ser'],['golgi apparatus','golgi complex','golgi body'],['nuclear envelope','nuclear membrane'],['polyribosome','polysome'],['mitochondrion','mitochondria'],['flagellum','flagella'],['microfilament','actin filament'],['sodium-potassium pump','na k pump','na k atpase','sodium potassium atpase'],['sister chromatid','sister chromatids'],['homologous chromosome','homologous chromosomes','homolog'],['free ribosomes','free ribosome'],['g1 phase','g1'],['g2 phase','g2'],['g0 phase','g0'],['s phase','synthesis phase','s'],['differentiation','cellular differentiation']];
function aliases(name,extra=[]){const plain=name.replace(/\s*\([^)]*\)/g,'').trim(),short=[...name.matchAll(/\(([^)]+)\)/g)].map(m=>m[1]);const group=synonymGroups.find(g=>g.some(x=>normalize(x)===normalize(plain)))||[];return [...new Set([...extra,plain,...short,...group])];}
export function buildBank(modules,diagrams){
 const bank=[];
 for(const m of modules){
  for(const q of m.questions)bank.push({...q,id:`${m.id}/concept/${q.id}`,module:m.id,type:'choice',answer:q.options[q.answer]});
  for(const d of diagrams[m.id]||[])d.targets.forEach((t,i)=>{
   bank.push({id:`${m.id}/${d.id}/${t.id}/locate`,module:m.id,type:'locate',prompt:`Locate the ${t.name.toLowerCase()}.`,answer:i,answerText:t.name,explanation:t.description,diagram:d.id,target:i});
   bank.push({id:`${m.id}/${d.id}/${t.id}/typed`,module:m.id,type:'typed',prompt:`Name the structure at marker ${i+1}.`,answer:t.name,aliases:aliases(t.name,t.aliases),explanation:t.description,diagram:d.id,target:i});
  });
  m.terms.forEach((t,i)=>bank.push({id:`${m.id}/term/${i}`,module:m.id,type:'typed',prompt:`Name the term: ${t.definition}`,answer:t.term,aliases:aliases(t.term,t.aliases),explanation:t.definition}));
 }
 return bank;
}
export function practicePool(bank,{module=null,format='mixed',focus='all',stats={}}={}){
 return bank.filter(q=>(!module||q.module===module)&&(format==='mixed'||q.type===format)&&(focus==='untried'?!stats[q.id]:focus==='revisit'?!!stats[q.id]&&(!stats[q.id].lastCorrect||stats[q.id].assisted):true));
}
export function createSession(bank,{module=null,focus='all',stats={},format='mixed',count=12,exam=false,random=Math.random}={}){
 const available=practicePool(bank,{module,format,focus:exam?'all':focus,stats});
 let pool;
 if(exam){const ids=[...new Set(available.map(q=>q.module))],groups=shuffled(ids,random).map(id=>shuffled(available.filter(q=>q.module===id),random));pool=[];while(groups.some(g=>g.length)&&(count==='all'||pool.length<count))for(const g of groups)if(g.length&&(count==='all'||pool.length<count))pool.push(g.pop());pool=shuffled(pool,random);}
 else pool=shuffled(available,random).slice(0,count==='all'?available.length:count);
 return pool.map(q=>({...q,options:q.options?shuffled(q.options,random):undefined}));
}
export function grade(q,value){if(q.type==='locate')return typeof value==='number'&&value===q.answer;const input=normalize(value);return !!input&&[q.answer,...q.aliases||[]].some(a=>normalize(a)===input);}
export function score(records){return {total:records.length,independent:records.filter(r=>r.correct&&!r.assisted).length,assisted:records.filter(r=>r.correct&&r.assisted).length,missed:records.filter(r=>!r.correct||r.assisted).length};}
