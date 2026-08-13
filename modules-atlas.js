(()=>{
const svg=document.getElementById('g'),zonesLayer=document.getElementById('zones'),nodesLayer=document.getElementById('nodes'),edgesLayer=document.getElementById('edges'),labelsLayer=document.getElementById('labels'),handlesLayer=document.getElementById('edge-handles'),saveBtn=document.getElementById('save'),fitBtn=document.getElementById('fit'),status=document.getElementById('status'),NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:modules-atlas:v1';
const defs={
 personalRadar:{x:40,y:125,w:240,h:104,type:'personal',kicker:'PRE-BARANES · NON-CANONICAL',title:'📡 Personal Radar',note:'personal technical intelligence'},
 personalKnowledge:{x:40,y:365,w:260,h:104,type:'data',kicker:'PRE-BARANES · NON-CANONICAL',title:'🗄️ Personal Knowledge DB',note:'personal context / knowledge'},
 inbox:{x:350,y:125,w:230,h:104,type:'entry',kicker:'CANONICAL ENTRY',title:'📥 Inbox Control Plane',note:'job handoff / queue'},
 executionAutonomy:{x:340,y:390,w:250,h:112,type:'autonomy',kicker:'CONTINUATION CONTRACT',title:'♻️ Execution Autonomy',note:'continue while scope remains admitted'},
 routing:{x:655,y:155,w:275,h:118,type:'routing',kicker:'CONTROL / ORCHESTRATION',title:'🧭 Routing / Orchestration',note:'classify · route · choose execution path'},
 baranes:{x:650,y:410,w:300,h:124,type:'core',kicker:'GOVERNANCE + OBSERVABILITY CORE',title:'🛡️ Baranes',note:'authority · policy · operational truth'},
 runtimeGuardrails:{x:1020,y:190,w:270,h:116,type:'execution',kicker:'EXECUTION CORE',title:'🛡️ Runtime Guardrails',note:'execution boundary / enforcement'},
 agentRuntime:{x:1330,y:90,w:280,h:236,type:'runtime',kicker:'RUNTIME FAMILY',title:'🤖 Agent Runtime',compound:'runtime'},
 sandbox:{x:1320,y:410,w:290,h:154,type:'sandbox',kicker:'ISOLATION / EXECUTION',title:'🧱 Sandbox',compound:'sandbox'},
 ledgerOps:{x:615,y:680,w:170,h:90,type:'ops',kicker:'OPS DOMAIN',title:'📒 LedgerOps'},
 repoOps:{x:805,y:680,w:170,h:90,type:'ops',kicker:'OPS DOMAIN',title:'📦 RepoOps'},
 hostOps:{x:995,y:680,w:170,h:90,type:'ops',kicker:'OPS DOMAIN',title:'🖥️ HostOps'},
 publicationOps:{x:1185,y:680,w:185,h:90,type:'ops',kicker:'OPS DOMAIN',title:'📤 PublicationOps'},
 labOps:{x:1390,y:680,w:170,h:90,type:'ops',kicker:'OPS DOMAIN',title:'🧪 LabOps'}
};
const state={};for(const [id,d] of Object.entries(defs))state[id]={x:d.x,y:d.y};
const edges=[
 {from:'inbox',to:'routing',label:'job',cls:'control'},
 {from:'personalRadar',to:'routing',label:'signals',cls:'context'},
 {from:'personalKnowledge',to:'routing',label:'context',cls:'context'},
 {from:'routing',to:'runtimeGuardrails',label:'admit / execute',cls:'execution'},
 {from:'executionAutonomy',to:'runtimeGuardrails',label:'continuation',cls:'autonomy'},
 {from:'baranes',to:'runtimeGuardrails',label:'govern / observe',cls:'governance'},
 {from:'runtimeGuardrails',to:'agentRuntime',label:'runtime contract',cls:'execution'},
 {from:'agentRuntime',to:'sandbox',label:'sandboxed execution',cls:'sandbox'},
 {from:'baranes',to:'ledgerOps',cls:'ops'},{from:'baranes',to:'repoOps',cls:'ops'},{from:'baranes',to:'hostOps',cls:'ops'},{from:'baranes',to:'publicationOps',cls:'ops'},{from:'baranes',to:'labOps',cls:'ops'}
];
const controls={};for(let i=0;i<edges.length;i++)controls[i]={c1dx:0,c1dy:0,c2dx:0,c2dy:0};
let view={x:0,y:0,w:1640,h:900},drag=null,edgeDrag=null,pan=null;
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.positions)for(const id in state)if(s.positions[id])state[id]={...state[id],...s.positions[id]};if(s?.controls)for(const i in controls)if(s.controls[i])controls[i]={...controls[i],...s.controls[i]};if(s?.view&&['x','y','w','h'].every(k=>Number.isFinite(s.view[k])))view={...s.view}}catch(_){}
function E(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
function P(e){const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}}
function applyView(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`)}
function box(id){const d=defs[id],s=state[id];return{x:s.x,y:s.y,w:d.w,h:d.h}}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,k=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*k,y:cy+(out?1:-1)*uy*k}}
function edgeBase(i){const e=edges[i],a=box(e.from),b=box(e.to),ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),T=boundary(b,ux,uy,false),bend=e.cls==='governance'?-18:e.cls==='autonomy'?18:0;return{S,T,c1:{x:S.x+(T.x-S.x)/3+nx*bend,y:S.y+(T.y-S.y)/3+ny*bend},c2:{x:S.x+(T.x-S.x)*2/3+nx*bend,y:S.y+(T.y-S.y)*2/3+ny*bend}}}
function edgeGeom(i){const b=edgeBase(i),c=controls[i],C1={x:b.c1.x+c.c1dx,y:b.c1.y+c.c1dy},C2={x:b.c2.x+c.c2dx,y:b.c2.y+c.c2dy};return{...b,C1,C2,d:`M${b.S.x} ${b.S.y}C${C1.x} ${C1.y} ${C2.x} ${C2.y} ${b.T.x} ${b.T.y}`}}
function cubic(g,t=.5){const u=1-t;return{x:u*u*u*g.S.x+3*u*u*t*g.C1.x+3*u*t*t*g.C2.x+t*t*t*g.T.x,y:u*u*u*g.S.y+3*u*u*t*g.C1.y+3*u*t*t*g.C2.y+t*t*t*g.T.y}}
function renderZones(){zonesLayer.innerHTML='';const rect=(cl,x,y,w,h,rx=20)=>zonesLayer.appendChild(E('rect',{class:`zone-bg ${cl}`,x,y,width:w,height:h,rx})),path=(cl,d)=>zonesLayer.appendChild(E('path',{class:`zone-bg ${cl}`,d,'stroke-linejoin':'round'})),label=(x,y,title,sub)=>{let t=E('text',{class:'zone-title',x,y});t.textContent=title;zonesLayer.appendChild(t);t=E('text',{class:'zone-subtitle',x,y:y+17});t.textContent=sub;zonesLayer.appendChild(t)};
 rect('zone-personal',20,88,300,490);label(38,113,'PERSONAL / PRE-BARANES','context personal · no canònic');
 path('zone-control','M330 88H980V340H600V578H330Z');label(348,113,'CONTROL & ORCHESTRATION','entry · routing · continuation');
 path('zone-governance','M600 350H980V590H1615V830H600Z');label(618,375,'GOVERNANCE & OPS','authority · observability · operational domains');
 rect('zone-runtime',990,60,625,518);label(1008,85,'RUNTIME & ISOLATION','execution boundary · runtime · sandbox');
}
function renderRuntime(g,d){const subs=[['runtime-openclaw','OpenClaw','CURRENT'],['runtime-hermes','Hermes','RUNTIME'],['runtime-agenticos','AgenticOS','FUTURE']];subs.forEach(([cl,title,badge],i)=>{const y=73+i*51;g.appendChild(E('rect',{class:`sub-box ${cl}`,x:14,y,width:d.w-28,height:40,rx:10}));let t=E('text',{class:'sub-title',x:d.w/2,y:y+24});t.textContent=title;g.appendChild(t);t=E('text',{class:badge==='FUTURE'?'badge-future':'badge-current',x:d.w-36,y:y+14});t.textContent=badge;g.appendChild(t)})}
function renderSandbox(g,d){g.appendChild(E('rect',{class:'sub-box sandbox-openshell',x:16,y:76,width:d.w-32,height:56,rx:11}));let t=E('text',{class:'sub-title',x:d.w/2,y:106});t.textContent='OpenShell';g.appendChild(t);t=E('text',{class:'badge-current',x:d.w/2,y:123});t.textContent='TARGET ADOPTION';g.appendChild(t)}
function renderNode(id){const d=defs[id],s=state[id],g=E('g',{class:`module-node type-${d.type}`,'data-id':id,transform:`translate(${s.x} ${s.y})`});g.appendChild(E('rect',{class:'module-box',width:d.w,height:d.h,rx:15}));let t=E('text',{class:'kicker',x:d.w/2,y:24});t.textContent=d.kicker;g.appendChild(t);t=E('text',{class:'title',x:d.w/2,y:53});t.textContent=d.title;g.appendChild(t);if(d.note){t=E('text',{class:'note',x:d.w/2,y:80});t.textContent=d.note;g.appendChild(t)}if(d.compound==='runtime')renderRuntime(g,d);if(d.compound==='sandbox')renderSandbox(g,d);nodesLayer.appendChild(g)}
function renderEdges(){edgesLayer.innerHTML='';labelsLayer.innerHTML='';handlesLayer.innerHTML='';for(let i=0;i<edges.length;i++){const e=edges[i],g=edgeGeom(i);edgesLayer.appendChild(E('path',{class:`edge ${e.cls||''}`,d:g.d}));if(e.label){const p=cubic(g,.5),w=Math.max(64,e.label.length*6.1+18);labelsLayer.appendChild(E('rect',{class:'edge-label-bg',x:p.x-w/2,y:p.y-10,width:w,height:20,rx:10}));const t=E('text',{class:'edge-label',x:p.x,y:p.y+4});t.textContent=e.label;labelsLayer.appendChild(t)}for(const [which,p] of [['c1',g.C1],['c2',g.C2]])handlesLayer.appendChild(E('circle',{class:`edge-handle ${e.cls||''}${edgeDrag&&edgeDrag.index===i&&edgeDrag.which===which?' active':''}`,'data-edge':i,'data-control':which,cx:p.x,cy:p.y,r:5.5}))}}
function render(){renderZones();nodesLayer.innerHTML='';for(const id of Object.keys(defs))renderNode(id);renderEdges()}
function dirty(){saveBtn.classList.remove('saved');saveBtn.textContent='Save layout';status.textContent='Layout modificat · Save layout per conservar-lo'}
function save(){try{localStorage.setItem(KEY,JSON.stringify({positions:state,controls,view}));saveBtn.classList.add('saved');saveBtn.textContent='Saved';status.textContent='Layout i corbes guardats en aquest navegador'}catch(_){status.textContent='No s’ha pogut guardar'}}
function fit(){const bs=Object.keys(defs).map(box),pts=[];for(let i=0;i<edges.length;i++){const g=edgeGeom(i);pts.push(g.C1,g.C2)}const m=60,minX=Math.min(...bs.map(b=>b.x),...pts.map(p=>p.x))-m,minY=Math.min(...bs.map(b=>b.y),...pts.map(p=>p.y))-m,maxX=Math.max(...bs.map(b=>b.x+b.w),...pts.map(p=>p.x))+m,maxY=Math.max(...bs.map(b=>b.y+b.h),...pts.map(p=>p.y))+m;let x=minX,y=minY,w=maxX-minX,h=maxY-minY;const r=svg.getBoundingClientRect(),a=(r.width||1)/(r.height||1);if(w/h>a){const nh=w/a;y-=(nh-h)/2;h=nh}else{const nw=h*a;x-=(nw-w)/2;w=nw}view={x,y,w,h};applyView()}
svg.addEventListener('pointerdown',e=>{const h=e.target.closest?.('.edge-handle');if(h){e.preventDefault();e.stopPropagation();edgeDrag={index:+h.dataset.edge,which:h.dataset.control,pid:e.pointerId};try{svg.setPointerCapture(e.pointerId)}catch(_){};renderEdges();return}const g=e.target.closest?.('.module-node');if(g){e.preventDefault();e.stopPropagation();const id=g.dataset.id,p=P(e),s=state[id];drag={id,pid:e.pointerId,dx:p.x-s.x,dy:p.y-s.y};try{svg.setPointerCapture(e.pointerId)}catch(_){};return}pan={pid:e.pointerId,x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};try{svg.setPointerCapture(e.pointerId)}catch(_){} });
svg.addEventListener('pointermove',e=>{if(edgeDrag&&e.pointerId===edgeDrag.pid){e.preventDefault();const p=P(e),b=edgeBase(edgeDrag.index),c=controls[edgeDrag.index];if(edgeDrag.which==='c1'){c.c1dx=p.x-b.c1.x;c.c1dy=p.y-b.c1.y}else{c.c2dx=p.x-b.c2.x;c.c2dy=p.y-b.c2.y}renderEdges();dirty();return}if(drag&&e.pointerId===drag.pid){e.preventDefault();const p=P(e),s=state[drag.id];s.x=p.x-drag.dx;s.y=p.y-drag.dy;const g=nodesLayer.querySelector(`[data-id="${drag.id}"]`);if(g)g.setAttribute('transform',`translate(${s.x} ${s.y})`);renderEdges();dirty();return}if(pan&&e.pointerId===pan.pid){const r=svg.getBoundingClientRect();view.x=pan.vx-(e.clientX-pan.x)/r.width*view.w;view.y=pan.vy-(e.clientY-pan.y)/r.height*view.h;applyView();dirty()}});
function end(e){if(edgeDrag&&e.pointerId===edgeDrag.pid){edgeDrag=null;renderEdges()}if(drag&&e.pointerId===drag.pid)drag=null;if(pan&&e.pointerId===pan.pid)pan=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}}
svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
svg.addEventListener('wheel',e=>{e.preventDefault();const p=P(e),old={...view},f=e.deltaY>0?1.1:.9,nw=Math.min(3000,Math.max(650,view.w*f)),nh=nw*(view.h/view.w),rx=(p.x-old.x)/old.w,ry=(p.y-old.y)/old.h;view.x=p.x-rx*nw;view.y=p.y-ry*nh;view.w=nw;view.h=nh;applyView();dirty()},{passive:false});
saveBtn.addEventListener('click',save);fitBtn.addEventListener('click',()=>{fit();dirty()});applyView();render();
})();
