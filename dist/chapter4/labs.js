// Teaching schematics, not histology specimens. Animation is illustrative, not to scale.
const colors=['#c8a4ff','#6ce6d4','#ffbc8b','#85baff'];
const text=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
const cell=(x,y,w,h,c='#bd91ef',cls='')=>`<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w,h)*.25}" fill="${c}" fill-opacity=".3" stroke="${c}" stroke-width="2"/><ellipse cx="${x+w/2}" cy="${y+h*.6}" rx="${Math.min(w,h)*.17}" ry="${Math.min(w,h)*.12}" fill="${c}"/></g>`;
const svg=(body,labels,extra='')=>`<svg viewBox="0 0 700 420" role="img" aria-label="Interactive teaching schematic${labels?' with labels':''}" ${extra}><defs><pattern id="stripes" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 0V14" stroke="#f7d4ff" stroke-width="4"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="3"/></filter></defs>${body}</svg>`;
export const labOptions={
 types:[['families','Four families'],['membranes','Membrane map'],['origins','Germ layers']],
 epithelial:[['classifier','Layers & shape'],['junctions','Cell junctions'],['transitional','Bladder stretch'],['secretion','Secretion modes']],
 connective:[['regular','Parallel collagen'],['irregular','Interwoven collagen'],['elastic','Elastic recoil'],['cartilage','Cartilage comparison']],
 muscle:[['skeletal','Skeletal'],['cardiac','Cardiac'],['smooth','Smooth']],
 nervous:[['signal','Trace a signal'],['support','Glial support']],
 repair:[['healing','Healing timeline'],['outcomes','Repair outcomes']]
};
export function lab(module,{mode=labOptions[module][0][0],labels=true,step=0,layers=1,shape='cuboidal',secretion='merocrine',stretch=false}={}){
 let body='',caption='',controls='',title='';
 const label=(x,y,t)=>labels?text(x,y,t):'';
 if(module==='types'){
  const names=mode==='membranes'?['Cutaneous','Mucous','Serous','Synovial']:mode==='origins'?['Ectoderm','Mesoderm','Endoderm']:['Epithelial','Connective','Muscle','Nervous'];
  const details=mode==='membranes'?['Skin','Passages to exterior','Closed ventral cavities','Movable joints']:mode==='origins'?['Epidermis; nervous system','Muscle; most connective tissue','Much digestive / respiratory lining']:['Cover & secrete','Support & bind','Contract & move','Communicate'];
  names.forEach((n,i)=>{let x=45+(i%2)*340,y=35+Math.floor(i/2)*195;body+=`<g class="float-cell" style="--delay:${i*-.8}s"><rect x="${x}" y="${y}" width="270" height="150" rx="24" fill="${colors[i]}" fill-opacity=".08" stroke="${colors[i]}"/>`;
   if(mode==='families'&&i===0)for(let a=0;a<5;a++)body+=cell(x+30+a*42,y+20,38,52,colors[i]);
   else if(mode==='families'&&i===1)for(let a=0;a<5;a++)body+=`<path d="M${x+20} ${y+20+a*12}q100 40 225 0" fill="none" stroke="${colors[i]}" stroke-width="3"/>`;
   else if(mode==='families'&&i===2)for(let a=0;a<3;a++)body+=`<rect x="${x+28}" y="${y+18+a*20}" width="210" height="15" rx="7" fill="url(#stripes)" stroke="${colors[i]}"/>`;
   else if(mode==='families')body+=`<path d="M${x+100} ${y+45}l-35 -25m35 25l-45 30m45 -30h100m-15 0l25 -25m-25 25l25 25" fill="none" stroke="${colors[i]}" stroke-width="4"/><circle cx="${x+100}" cy="${y+45}" r="20" fill="${colors[i]}" fill-opacity=".3" stroke="${colors[i]}"/>`;
   else if(mode==='membranes'){for(let a=0;a<6;a++)body+=cell(x+35+a*33,y+18,30,i===3?12:25,colors[i]);body+=`<path d="M${x+35} ${y+49}h195" stroke="${colors[i]}" stroke-width="3"/><path d="M${x+35} ${y+59}q80 25 195 0" fill="none" stroke="${colors[i]}" stroke-width="2"/>`;}
   else{for(let a=0;a<3;a++)body+=`<ellipse cx="${x+135}" cy="${y+26+a*20}" rx="90" ry="12" fill="${a===i?colors[i]:'#394158'}" stroke="${a===i?colors[i]:'#536079'}"/>`;}
   body+=label(x+135,y+104,n)+label(x+135,y+130,details[i])+'</g>';
  });
  title=mode==='families'?'Four tissues, one functioning organ':mode==='membranes'?'Match each membrane to its setting':'Developmental origins';caption=mode==='membranes'?'Cutaneous, mucous and serous membranes combine epithelium with connective tissue. Synovial membranes are connective tissue membranes.':mode==='origins'?'These are representative origins. Epithelium can arise from all three germ layers; the map is not a one-to-one assignment.':'Look for architecture: a packed sheet, matrix between cells, elongated contractile cells, or branching communication cells.';
 }
 if(module==='epithelial'){
  if(mode==='classifier'||mode==='transitional'){
   const transitional=mode==='transitional',n=transitional?(stretch?2:4):Number(layers),h=transitional?(stretch?24:43):shape==='squamous'?25:shape==='columnar'?(n===1?110:70):65,w=transitional?(stretch?90:65):shape==='squamous'?110:shape==='columnar'?43:65;
   for(let r=0;r<n;r++)for(let x=80;x+w<635;x+=w+3)body+=cell(x,320-(r+1)*(h+3),w,h);
   body+='<path d="M65 325H635" stroke="#6ce6d4" stroke-width="6"/>'+label(350,363,'Basement membrane')+label(350,65,'Apical / free surface');
   title=transitional?'Transitional epithelium':`${n===1?'Simple':'Stratified'} ${shape} epithelium`;
   controls=transitional?`<button data-stretch>${stretch?'Return to relaxed':'Distend the bladder'}</button>`:`<label>Layers <select id="layers"><option value="1" ${n===1?'selected':''}>One</option><option value="3" ${n===3?'selected':''}>Several</option></select></label><label>Surface shape <select id="shape">${['squamous','cuboidal','columnar'].map(s=>`<option ${shape===s?'selected':''}>${s}</option>`).join('')}</select></label>`;
   caption=transitional?'As the bladder fills, surface cells flatten and apparent thickness decreases. It remains a stratified transitional epithelium.':`First identify ${n===1?'one layer':'multiple layers'}, then the shape of the apical cells. This schematic isolates the naming rule; real micrographs are less regular.`;
  }else if(mode==='junctions'){
   body=cell(125,80,200,260)+cell(365,80,200,260);
   const ys=[125,210,295],names=['Tight: restrict passage','Anchoring: resist stress','Gap: exchange signals'];
   ys.forEach((y,i)=>{body+=`<path d="M315 ${y}H375" stroke="${colors[i]}" stroke-width="${i===0?12:6}" stroke-dasharray="${i===2?'5 3':'none'}"/>`+label(350,y-25,names[i]);});
   body+='<circle class="gap-pulse" cx="345" cy="295" r="9" fill="#ffbc8b"/>';title='Seal · hold · communicate';caption='The highlighted gap junction represents channels between cell interiors. Tight and anchoring junctions have different jobs; none is simply a larger gap.';
  }else{
   body=cell(220,160,260,190);body+='<g class="secreted"><circle cx="330" cy="125" r="13" fill="#6ce6d4"/><circle cx="370" cy="125" r="10" fill="#6ce6d4"/></g>';
   if(secretion==='apocrine')body+='<path class="secreted" d="M235 130Q350 60 465 130Z" fill="#c8a4ff" fill-opacity=".5" stroke="#c8a4ff"/>';
   if(secretion==='holocrine')body+='<g class="breakdown"><path d="M230 170L465 330M230 330L465 170" stroke="#ffbc8b" stroke-width="12"/></g>';
   title=secretion[0].toUpperCase()+secretion.slice(1)+' secretion';caption={merocrine:'Vesicles fuse with the apical membrane. Product exits by exocytosis; the cell remains intact.',apocrine:'An apical portion separates with the product. Some cytoplasm is lost with the secretion.',holocrine:'The entire cell breaks down and contributes to the product. Replacement cells are required.'}[secretion];body+=label(350,390,secretion==='holocrine'?'Entire cell contributes':secretion==='apocrine'?'Apical portion released':'Cell remains intact');
   controls=`<label>Release mechanism <select id="secretion">${['merocrine','apocrine','holocrine'].map(s=>`<option ${s===secretion?'selected':''}>${s}</option>`).join('')}</select></label>`;
  }
 }
 if(module==='connective'){
  if(mode==='cartilage'){
   ['Hyaline','Elastic','Fibrocartilage'].forEach((n,i)=>{const x=35+i*225;body+=`<rect x="${x}" y="95" width="195" height="230" rx="20" fill="${colors[i]}" fill-opacity=".12"/>`;
    for(let j=0;j<5;j++){let a=x+35+(j%2)*100,b=135+Math.floor(j/2)*65;body+=`<ellipse cx="${a}" cy="${b}" rx="20" ry="27" fill="none" stroke="${colors[i]}"/><circle cx="${a}" cy="${b}" r="9" fill="${colors[i]}"/>`;}
    if(i)for(let j=0;j<7;j++)body+=`<path d="M${x+5} ${105+j*31}q90 ${i===1?40:12} 185 0" fill="none" stroke="${colors[i]}" stroke-width="${i===1?2:7}" opacity=".55"/>`;
    body+=label(x+97,365,n);});
   title='Read the matrix around the lacunae';caption='Hyaline: fine collagen is hard to resolve. Elastic: branching elastic fibers. Fibrocartilage: thick collagen bundles. Compare these schematic cues with Figure 4.16.';
  }else{
   body='<rect x="65" y="65" width="570" height="285" rx="35" fill="#6ce6d4" fill-opacity=".07"/>';
   body+=`<g class="${mode==='elastic'?'recoil':'fiber-pull'}">`;
   for(let i=0;i<11;i++){let y=90+i*23;body+=`<path d="M90 ${y}Q250 ${y+(mode==='elastic'?55:15)} 610 ${mode==='irregular'?330-i*22:y}" fill="none" stroke="${mode==='elastic'?'#6ce6d4':'#c8a4ff'}" stroke-width="${mode==='elastic'?3:8}" opacity=".7"/>`;}
   body+='</g>';for(let i=0;i<5;i++)body+=`<ellipse cx="${160+i*90}" cy="${125+i*38}" rx="17" ry="6" fill="#ffbc8b"/>`;
   title={regular:'Parallel collagen bundles',irregular:'Interwoven collagen bundles',elastic:'Stretch and recoil'}[mode];body+=label(350,390,mode==='elastic'?'Elastic fibers':'Collagen fibers + fibroblast nuclei');caption={regular:'Parallel fibers favor resistance along their long axis. Tendons are a representative location.',irregular:'Interwoven fibers resist tension from several directions. The dermis is a representative location.',elastic:'Elastic fibers recover after stretching. This conceptual motion is not a measurement of tissue mechanics.'}[mode];
  }
 }
 if(module==='muscle'){
  for(let i=0;i<3;i++){let y=85+i*95;
   if(mode==='smooth')body+=`<path class="contract" d="M85 ${y+25}Q350 ${y-45} 615 ${y+25}Q350 ${y+95} 85 ${y+25}" fill="#c8a4ff" fill-opacity=".4" stroke="#c8a4ff"/><ellipse cx="350" cy="${y+25}" rx="25" ry="10" fill="#6ce6d4"/>`;
   else {body+=`<g class="contract"><rect x="85" y="${y}" width="530" height="60" rx="18" fill="url(#stripes)" fill-opacity=".45" stroke="#c8a4ff"/>`;if(mode==='cardiac')body+=`<path d="M240 ${y+10}l80 -45M410 ${y+50}l80 40" stroke="#c8a4ff" stroke-width="22"/><path d="M255 ${y}v60M465 ${y}v60" stroke="#ffbc8b" stroke-width="7"/><ellipse cx="350" cy="${y+30}" rx="18" ry="9" fill="#6ce6d4"/>`;else for(let j=0;j<4;j++)body+=`<ellipse cx="${145+j*130}" cy="${y+9}" rx="17" ry="6" fill="#6ce6d4"/>`;body+='</g>';}
  }
  title=mode[0].toUpperCase()+mode.slice(1)+' muscle';caption={skeletal:'Long striated fibers; multiple peripheral nuclei. Usually voluntary. Look for more than just the stripes.',cardiac:'Striated, branching cells with central nuclei and intercalated discs. Involuntary heart muscle.',smooth:'Spindle-shaped cells, one central nucleus, no visible striations. Involuntary walls of hollow organs.'}[mode];body+=label(350,405,mode==='smooth'?'Single central nuclei':mode==='skeletal'?'Peripheral nuclei + striations':'Branches + intercalated discs');
 }
 if(module==='nervous'){
  body='<path d="M170 210L80 95M130 155L60 165M170 210L65 295M125 255L140 340" fill="none" stroke="#c8a4ff" stroke-width="10"/><path d="M215 210H585L635 155M585 210L645 255" fill="none" stroke="#c8a4ff" stroke-width="12"/><circle cx="190" cy="210" r="55" fill="#6ce6d4" fill-opacity=".35" stroke="#6ce6d4" stroke-width="3"/><circle cx="190" cy="210" r="19" fill="#6ce6d4"/>';
  for(let i=0;i<4;i++)body+=`<rect x="${285+i*65}" y="190" width="47" height="40" rx="14" fill="#ffbc8b" fill-opacity=".4" stroke="#ffbc8b"/>`;
  body+=label(85,65,'Dendrites')+label(190,300,'Cell body')+label(400,275,'Axon')+label(400,150,'Myelin');
  if(mode==='signal'){body+=`<circle cx="${[100,190,405,620][step%4]}" cy="${[125,210,210,210][step%4]}" r="15" fill="#fff" class="signal-dot"/>`;caption=['Inputs arrive at dendrites, the receptive branches of this typical neuron.','The cell body integrates inputs; the nucleus supports cell maintenance.','An action potential propagates along the axon. Myelin supports rapid conduction.','Axon terminals communicate with another cell, often through a chemical synapse.'][step%4];title='Follow the information';controls='<button data-step="-1">← Previous step</button><button data-step="1">Next step →</button>';}else{title='Who makes this myelin?';caption='Oligodendrocytes form CNS myelin; Schwann cells form PNS myelin. Astrocytes support the local environment; microglia provide immune surveillance.';body+=label(350,365,'CNS: oligodendrocyte · PNS: Schwann cell');}
 }
 if(module==='repair'){
  const phase=step%4;
  for(let i=0;i<9;i++)if(i<3||i>5||phase>=2)body+=cell(65+i*63,100,58,55,phase>=2&&i>=3&&i<=5?'#6ce6d4':'#c8a4ff');
  body+='<path d="M60 165H640" stroke="#c8a4ff" stroke-width="5"/><rect x="60" y="170" width="580" height="175" fill="#c8a4ff" fill-opacity=".08"/>';
  if(phase===0)body+='<path d="M250 160Q350 210 450 160" stroke="#ffbc8b" stroke-width="28" fill="none"/>';
  if(phase===1)for(let i=0;i<7;i++)body+=`<circle class="float-cell" style="--delay:${i*-.4}s" cx="${240+i*35}" cy="${220+i%2*60}" r="17" fill="#85baff"/>`;
  if(phase>=2)for(let i=0;i<9;i++)body+=`<path d="M250 ${195+i*15}Q350 ${phase===2?335-i*8:210+i*15} 450 ${phase===2?200+i*12:195+i*15}" stroke="#6ce6d4" stroke-width="4" fill="none"/>`;
  const names=['Clot & temporary seal','Inflammation & cleanup','New tissue & collagen','Remodeling'];title=mode==='outcomes'?'Repair does not always restore everything':names[phase];caption=mode==='outcomes'?'Regeneration restores the same tissue type. Fibrosis replaces damaged tissue with collagen-rich scar. The result depends on the tissue and extent of injury.':[
   'Clotting helps limit blood loss and provides a temporary framework. The surface defect is still present.',
   'Vascular changes and recruited immune cells support cleanup. Inflammation and repair overlap.',
   'Fibroblasts deposit collagen while surface cells and vessels can grow into the repair region.',
   'Matrix is reorganized over time. Scar tissue may restore strength without restoring the original tissue architecture.'
  ][phase];body+=label(350,390,names[phase]);controls='<button data-step="-1">← Previous phase</button><span>Phases overlap in real tissue</span><button data-step="1">Next phase →</button>';
 }
 return {title,caption,controls,svg:svg(body,labels)};
}

