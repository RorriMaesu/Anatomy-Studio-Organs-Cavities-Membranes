import {modules as cells} from '../chapter3/content.js';
import {modules as tissues} from '../chapter4/content.js';
import {sections} from '../data.js';
import {chapters,textbook,sectionLink} from '../shared/course.js';
const facts={'1.1':[0,1,13,14],'1.2':[2,3],'1.3':[9,10,11],'1.4':[12],'1.5':[4,5,6,7,8],'2.1':[0,1,2,3,4,5,6],'2.2':[7,8,9,10],'2.3':[17,18,19,20],'2.4':[11,12,13,14,15,16],'2.5':[21,22,23,24,25,26,27,28,29,30,31,32,33]};
export const modules=[];
export const corpus=[];
for(const c of chapters)for(const s of c.sections){
 const original=(c.id===3?cells:c.id===4?tissues:[]).find(m=>m.section===s[0]);
 const id=c.id===3?original.id:`c${c.id}-${s[0].replace('.','-')}`;
 const m={...original,id,chapter:c.id,section:s[0],title:s[1],coverage:c.id<3?'Focused studio essentials; read the textbook for full coverage.':'Reviewed studio lessons',studioUrl:'../'+sectionLink(c,s),starter:`Help me reason through ${s[1].toLowerCase()}.`};
 modules.push(m);
 const add=(key,title,text)=>text?.trim()&&corpus.push({id:`C${c.id}-${s[0]}-${key}`,module:id,chapter:c.id,section:s[0],title,text,url:textbook(s),studioUrl:m.studioUrl});
 if(original){original.lessons.forEach((l,i)=>add(`L${i+1}`,l.title,l.body+' Common misconception: '+l.trap+' Memory cue: '+(l.analogy||l.cue||'')+(l.facts?' '+l.facts.map(f=>f.term+': '+f.definition).join(' '):'')));continue;}
 const source=sections.find(x=>x.id===(c.id===1?'foundations':'chemistry'));
 for(const i of facts[s[0]]||[]){const f=source.facts[i];if(f)add(`F${i}`,f.q,f.a+'. '+f.why);}
 const atlas=s[0]==='1.2'?['organs']:s[0]==='1.6'?['directions','body-regions','cavities','membranes','abdomen','planes']:[];
 for(const sid of atlas){const a=sections.find(x=>x.id===sid);for(const v of a.views||[]){if(/extension|meninges/i.test(v.title))continue;add(`${sid}-${v.id}`,v.title,v.targets.map(t=>t.name+': '+t.teach).join('\n'));}}
}
