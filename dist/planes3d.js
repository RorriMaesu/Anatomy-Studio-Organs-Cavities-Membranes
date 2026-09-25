import * as T from './vendor/three/three.module.js';
import {OrbitControls} from './vendor/three/controls/OrbitControls.js';
import {GLTFLoader} from './vendor/three/loaders/GLTFLoader.js';

const names=['Sagittal','Frontal','Transverse','Oblique'];
const colors=[0xff7549,0x42b8ff,0xffd342,0xbd86ff];
let asset, savedCamera;
export async function mountPlanes(card){
 const stage=card.querySelector('.planes-stage'), status=card.querySelector('.planes-status');
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 renderer.setClearColor(0x14232e,1);
 stage.prepend(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.01,30);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.target.set(0,.98,0); controls.enablePan=false;controls.minDistance=1.5;controls.maxDistance=6;
 camera.position.fromArray(savedCamera||[2.6,1.65,3.3]); controls.update();
 scene.add(new T.HemisphereLight(0xffffff,0x344453,2.5));
 const light=new T.DirectionalLight(0xffffff,3);light.position.set(2,4,4);scene.add(light);
 const fill=new T.DirectionalLight(0x82baff,1.4);fill.position.set(-3,2,-3);scene.add(fill);
 let model,dead=false,all=false,ghost=false;
 const active=Number(card.dataset.active),quiz=card.dataset.quiz==='true';
 const disposables=[],markers=[];
 let pointerStart;
 renderer.domElement.addEventListener('pointerdown',e=>{pointerStart=[e.clientX,e.clientY];});
 renderer.domElement.addEventListener('pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart[0],e.clientY-pointerStart[1])>5)return;const rect=renderer.domElement.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);const hit=ray.intersectObjects(markers.filter(m=>m.parent.visible),false)[0];if(hit)card.querySelector(`[data-pin="${hit.object.userData.index}"]`)?.click();});
 function draw(){if(dead)return;renderer.render(scene,camera);savedCamera=camera.position.toArray();stage.dataset.camera=camera.position.toArray().map(n=>n.toFixed(2)).join(',');}
 controls.addEventListener('change',draw);
 const resize=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}});resize.observe(stage);
 function update(){if(!model)return;names.forEach((name,i)=>{const p=model.getObjectByName(name);p.visible=all||active<0||active===i;});model.traverse(o=>{if(o.isMesh&&!names.includes(o.name)){o.material.transparent=ghost;o.material.opacity=ghost?.25:1;o.material.depthWrite=!ghost;}});draw();}
 function preset(which){const positions={home:[2.6,1.65,3.3],front:[0,.98,4],side:[4,.98,0],top:[0,4.8,.001]};camera.position.fromArray(positions[which]);camera.up.set(0,1,0);controls.update();draw();}
 card.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>preset(b.dataset.camera));
 card.querySelector('[data-all]')?.addEventListener('click',e=>{all=!all;e.currentTarget.setAttribute('aria-pressed',all);update();});
 card.querySelector('[data-ghost]').onclick=e=>{ghost=!ghost;e.currentTarget.setAttribute('aria-pressed',ghost);update();};
 stage.tabIndex=0;stage.setAttribute('role','img');stage.setAttribute('aria-label','Interactive human and cutting planes. Drag to rotate, scroll to zoom, or use arrow keys. Camera presets are below.');
 stage.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();const s=new T.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(e.key==='ArrowLeft')s.theta-=.15;if(e.key==='ArrowRight')s.theta+=.15;if(e.key==='ArrowUp')s.phi-=.15;if(e.key==='ArrowDown')s.phi+=.15;if(e.key==='+')s.radius=Math.max(1.5,s.radius-.2);if(e.key==='-')s.radius=Math.min(6,s.radius+.2);s.makeSafe();camera.position.copy(new T.Vector3().setFromSpherical(s).add(controls.target));controls.update();draw();};
 const cleanup=()=>{dead=true;resize.disconnect();controls.dispose();renderer.dispose();renderer.forceContextLoss();disposables.forEach(x=>x.dispose());};
 card.cleanup3D=cleanup;
 try{
  asset??=new GLTFLoader().loadAsync(new URL('./assets/body-planes.glb',import.meta.url).href).catch(e=>{asset=null;throw e;});
  const gltf=await asset;if(dead)return;
  model=gltf.scene.clone(true);model.traverse(o=>{if(o.isMesh){o.material=o.material.clone();disposables.push(o.material);}});scene.add(model);
  names.forEach((name,i)=>{const p=model.getObjectByName(name);p.material=new T.MeshBasicMaterial({color:colors[i],transparent:true,opacity:.27,side:T.DoubleSide,depthWrite:false});disposables.push(p.material);p.renderOrder=2;const geo=new T.EdgesGeometry(p.geometry),mat=new T.LineBasicMaterial({color:colors[i],transparent:true,depthTest:true,depthWrite:false});// Draw outlines after the surfaces, but respect the solid body depth.
   const outline=new T.LineSegments(geo,mat);outline.renderOrder=3;p.add(outline);disposables.push(geo,mat);
   const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#14232e';ctx.beginPath();ctx.arc(64,64,49,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#'+colors[i].toString(16);ctx.lineWidth=7;ctx.stroke();ctx.fillStyle='white';ctx.font='bold 65px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),64,66);const tex=new T.CanvasTexture(c),sm=new T.SpriteMaterial({map:tex,depthTest:false});const marker=new T.Sprite(sm);marker.renderOrder=4;marker.scale.set(.15,.15,.15);const pos=p.geometry.attributes.position;marker.position.fromBufferAttribute(pos,i===2?0:2);p.add(marker);disposables.push(tex,sm);
  });
  model.traverse(o=>{if(o.isSprite){o.scale.set(.19,.19,.19);o.userData.index=names.indexOf(o.parent.name);markers.push(o);}});
  for(const [text,x,z] of [['FRONT',0,.88],['BACK',0,-.88],['RIGHT',-.94,0],['LEFT',.94,0]]){
   const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#bdcdd6';ctx.font='bold 42px sans-serif';ctx.textAlign='center';ctx.fillText(text,128,47);const tex=new T.CanvasTexture(c),mat=new T.SpriteMaterial({map:tex,depthTest:false,sizeAttenuation:false});const label=new T.Sprite(mat);label.position.set(x,.02,z);label.scale.set(.13,.0325,1);scene.add(label);disposables.push(tex,mat);
  }
  status.textContent=quiz?'Rotate to inspect. Select a numbered marker or its button.':'Drag to rotate · scroll to zoom · arrow keys also rotate';stage.dataset.ready='true';update();
 }catch(e){if(dead)return;cleanup();renderer.domElement.remove();status.textContent='3D could not load. Use the textbook diagram below.';card.querySelector('[data-fallback]').click();}
 return cleanup;
}
