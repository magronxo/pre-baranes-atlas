(()=>{
const svg=document.getElementById('g'),nodesLayer=document.getElementById('nodes'),edgesLayer=document.getElementById('edges'),labelsLayer=document.getElementById('labels'),saveBtn=document.getElementById('save'),fitBtn=document.getElementById('fit'),status=document.getElementById('status'),NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:modules-atlas:v1';
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
let view={x:0,y:0,w:1640,h:900},drag=null,pan=null;
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.positions)for(const id in state)if(s.positions[id])state[id]={...state[id],...s.positions[id]};if(s?.view&&['x','y','w','h'].every(k=>Number.isFinite(s.view[k])))view={...s.view}}catch(_){}
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
function E(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
function P(e){const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}}
function applyView(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`)}
function box(id){const d=defs[id],s=state[id];return{x:s.x,y:s.y,w:d.w,h:d.h}}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,k=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*k,y:cy+(out?1:-1)*uy*k}}
function curve(a,b,bend=0){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),T=boundary(b,ux,uy,false),cx=(S.x+T.x)/2+nx*bend,cy=(S.y+T.y)/2+ny*bend;return{d:`M${S.x} ${S.y}Q${cx} ${cy} ${T.x} ${T.y}`,lx:(S.x+2*cx+T.x)/4,ly:(S.y+2*cy+T.y)/4}}
function renderRuntime(g,d){
 const subs=[['runtime-openclaw','OpenClaw','CURRENT'],['runtime-hermes','Hermes','RUNTIME'],['runtime-agenticos','AgenticOS','FUTURE']];
 subs.forEach(([cl,title,badge],i)=>{const y=73+i*51;g.appendChild(E('rect',{class:`sub-box ${cl}`,x:14,y,width:d.w-28,height:40,rx:10}));let t=E('text',{class:'sub-title',x:d.w/2,y:y+24});t.textContent=title;g.appendChild(t);t=E('text',{class:badge==='FUTURE'?'badge-future':'badge-current',x:d.w-36,y:y+14});t.textContent=badge;g.appendChild(t)})
}
function renderSandbox(g,d){g.appendChild(E('rect',{class:'sub-box sandbox-openshell',x:16,y:76,width:d.w-32,height:56,rx:11}));let t=E('text',{class:'sub-title',x:d.w/2,y:106});t.textContent='OpenShell';g.appendChild(t);t=E('text',{class:'badge-current',x:d.w/2,y:123});t.textContent='TARGET ADOPTION';g.appendChild(t)}
function renderNode(id){const d=defs[id],s=state[id],g=E('g',{class:`module-node type-${d.type}`,'data-id':id,transform:`translate(${s.x} ${s.y})`});g.appendChild(E('rect',{class:'module-box',width:d.w,height:d.h,rx:15}));let t=E('text',{class:'kicker',x:d.w/2,y:24});t.textContent=d.kicker;g.appendChild(t);t=E('text',{class:'title',x:d.w/2,y:53});t.textContent=d.title;g.appendChild(t);if(d.note){t=E('text',{class:'note',x:d.w/2,y:80});t.textContent=d.note;g.appendChild(t)}if(d.compound==='runtime')renderRuntime(g,d);if(d.compound==='sandbox')renderSandbox(g,d);nodesLayer.appendChild(g)}
function renderEdges(){edgesLayer.innerHTML='';labelsLayer.innerHTML='';for(const e of edges){const g=curve(box(e.from),box(e.to),e.cls==='governance'?-18:e.cls==='autonomy'?18:0);edgesLayer.appendChild(E('path',{class:`edge ${e.cls||''}`,d:g.d}));if(e.label){const w=Math.max(64,e.label.length*6.1+18);labelsLayer.appendChild(E('rect',{class:'edge-label-bg',x:g.lx-w/2,y:g.ly-10,width:w,height:20,rx:10}));const t=E('text',{class:'edge-label',x:g.lx,y:g.ly+4});t.textContent=e.label;labelsLayer.appendChild(t)}}}
function render(){nodesLayer.innerHTML='';for(const id of Object.keys(defs))renderNode(id);renderEdges()}
function dirty(){saveBtn.classList.remove('saved');saveBtn.textContent='Save layout';status.textContent='Layout modificat · Save layout per conservar-lo'}
function save(){try{localStorage.setItem(KEY,JSON.stringify({positions:state,view}));saveBtn.classList.add('saved');saveBtn.textContent='Saved';status.textContent='Layout guardat en aquest navegador'}catch(_){status.textContent='No s’ha pogut guardar'}}
function fit(){const bs=Object.keys(defs).map(box),m=60,minX=Math.min(...bs.map(b=>b.x))-m,minY=Math.min(...bs.map(b=>b.y))-m,maxX=Math.max(...bs.map(b=>b.x+b.w))+m,maxY=Math.max(...bs.map(b=>b.y+b.h))+m;let x=minX,y=minY,w=maxX-minX,h=maxY-minY;const r=svg.getBoundingClientRect(),a=(r.width||1)/(r.height||1);if(w/h>a){const nh=w/a;y-=(nh-h)/2;h=nh}else{const nw=h*a;x-=(nw-w)/2;w=nw}view={x,y,w,h};applyView()}
svg.addEventListener('pointerdown',e=>{const g=e.target.closest?.('.module-node');if(g){e.preventDefault();e.stopPropagation();const id=g.dataset.id,p=P(e),s=state[id];drag={id,pid:e.pointerId,dx:p.x-s.x,dy:p.y-s.y};try{svg.setPointerCapture(e.pointerId)}catch(_){};return}pan={pid:e.pointerId,x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};try{svg.setPointerCapture(e.pointerId)}catch(_){} });
svg.addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.pid){e.preventDefault();const p=P(e),s=state[drag.id];s.x=p.x-drag.dx;s.y=p.y-drag.dy;const g=nodesLayer.querySelector(`[data-id="${drag.id}"]`);if(g)g.setAttribute('transform',`translate(${s.x} ${s.y})`);renderEdges();dirty();return}if(pan&&e.pointerId===pan.pid){const r=svg.getBoundingClientRect();view.x=pan.vx-(e.clientX-pan.x)/r.width*view.w;view.y=pan.vy-(e.clientY-pan.y)/r.height*view.h;applyView();dirty()}});
function end(e){if(drag&&e.pointerId===drag.pid)drag=null;if(pan&&e.pointerId===pan.pid)pan=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}}
svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
svg.addEventListener('wheel',e=>{e.preventDefault();const p=P(e),old={...view},f=e.deltaY>0?1.1:.9,nw=Math.min(3000,Math.max(650,view.w*f)),nh=nw*(view.h/view.w),rx=(p.x-old.x)/old.w,ry=(p.y-old.y)/old.h;view.x=p.x-rx*nw;view.y=p.y-ry*nh;view.w=nw;view.h=nh;applyView();dirty()},{passive:false});
saveBtn.addEventListener('click',save);fitBtn.addEventListener('click',()=>{fit();dirty()});applyView();render();
})();
