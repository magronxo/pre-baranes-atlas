(()=>{
const svg=document.getElementById('g'),zones=document.getElementById('zones'),nodes=document.getElementById('nodes'),saveBtn=document.getElementById('save'),status=document.getElementById('status');
if(!svg||!zones||!nodes)return;
const NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:repoops-flow:phase2:v1';
const style=document.createElement('style');style.textContent=`
.phase2-edge{fill:none;stroke-width:1.8;pointer-events:none;opacity:.9}.phase2-edge.read{stroke:#38bdf8;stroke-dasharray:5 5;marker-end:url(#arrowCyan)}.phase2-edge.ai{stroke:#a78bfa;stroke-dasharray:4 4;marker-end:url(#arrowViolet)}.phase2-edge.write{stroke:#fb923c;marker-end:url(#arrowAmber)}.phase2-edge.effect{stroke:#f59e0b;stroke-width:2.4;marker-end:url(#arrowAmber)}
.phase2-label-bg{fill:#111827;stroke:#475569;pointer-events:none}.phase2-label{fill:#e2e8f0;font-size:8.5px;text-anchor:middle;pointer-events:none}.phase2-handle{fill:#111827;stroke-width:1.5;opacity:.78;cursor:move;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}.phase2-handle.read{stroke:#38bdf8}.phase2-handle.ai{stroke:#a78bfa}.phase2-handle.write{stroke:#fb923c}.phase2-handle.effect{stroke:#f59e0b}.phase2-handle:hover,.phase2-handle.active{stroke:#fff;stroke-width:2.1;opacity:1}
.phase2-node{cursor:move}.phase2-node .box{fill:#7c2d12;stroke:#fb923c}.phase2-node .kicker{fill:#fed7aa}.phase2-boundary{fill:none;stroke-width:1.4;stroke-dasharray:7 6;pointer-events:none}.phase2-boundary.read-write{stroke:#fb923c;opacity:.72}.phase2-boundary.canonical{stroke:#f59e0b;opacity:.82}.phase2-boundary-title{font-size:8.5px;font-weight:800;letter-spacing:.85px;pointer-events:none}.phase2-boundary-note{font-size:7.8px;fill:#94a3b8;pointer-events:none}.phase2-read-label{fill:#93c5fd}.phase2-write-label{fill:#fdba74}.phase2-canonical-label{fill:#fcd34d}
body[data-mode="view"] #phase2-handles{display:none}body[data-mode="view"] .phase2-node{cursor:default!important}
`;document.head.appendChild(style);
function E(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
const boundaryLayer=E('g',{id:'phase2-boundaries'}),wireLayer=E('g',{id:'phase2-wires'}),labelLayer=E('g',{id:'phase2-labels'}),handleLayer=E('g',{id:'phase2-handles'});
svg.insertBefore(boundaryLayer,svg.querySelector('#edges'));svg.insertBefore(wireLayer,nodes);svg.insertBefore(labelLayer,nodes);svg.appendChild(handleLayer);
let p2={seedWriter:{x:476,y:889}},drag=null,handleDrag=null,raf=0;
const wires=[
 {from:'seedWriter',to:'seedDossier',label:'write seed',cls:'write',bend:58},
 {from:'featureRecord',to:'phaseController',label:'transition check',cls:'read',bend:-28},
 {from:'artifactWriter',to:'featureRecord',label:'record write',cls:'write',bend:20},
 {from:'artifactWriter',to:'designDoc',label:'DESIGN',cls:'write',bend:-22},
 {from:'artifactWriter',to:'specDoc',label:'SPEC',cls:'write',bend:-8},
 {from:'artifactWriter',to:'tasksDoc',label:'TASKS',cls:'write',bend:24},
 {from:'specDoc',to:'specValidator',label:'validate',cls:'ai',bend:12},
 {from:'specValidator',to:'validationEvidence',label:'PASS / findings',cls:'read',bend:-16},
 {from:'tasksDoc',to:'gateInspector',label:'eligibility',cls:'read',bend:8},
 {from:'gateInspector',to:'contextCodex',label:'eligible',cls:'read'},
 {from:'contextCodex',to:'planOpenCode',label:'context',cls:'ai'},
 {from:'planOpenCode',to:'implementer',label:'plan',cls:'ai'},
 {from:'implementer',to:'candidate',label:'product write',cls:'write',bend:42},
 {from:'candidate',to:'adoptionGit',label:'approved candidate',cls:'effect',bend:-18},
 {from:'adoptionGit',to:'gitAdoption',label:'canonical commit',cls:'effect',bend:14},
 {from:'gitAdoption',to:'verifier',label:'verify adopted state',cls:'read',bend:118},
 {from:'verifier',to:'verifyEvidence',label:'verification evidence',cls:'read',bend:-20},
 {from:'verifyEvidence',to:'auditor',label:'audit input',cls:'ai',bend:26},
 {from:'auditor',to:'auditEvidence',label:'audit report',cls:'ai',bend:-20},
 {from:'auditEvidence',to:'qa',label:'closure gate',cls:'read',bend:82}
];
const ctl=wires.map(()=>({c1dx:0,c1dy:0,c2dx:0,c2dy:0}));
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.seedWriter&&Number.isFinite(s.seedWriter.x)&&Number.isFinite(s.seedWriter.y))p2.seedWriter=s.seedWriter;if(Array.isArray(s?.controls))for(let i=0;i<Math.min(s.controls.length,ctl.length);i++)ctl[i]={...ctl[i],...s.controls[i]}}catch(_){}
function nodeTransform(g){const raw=g?.getAttribute('transform')||'';const m=raw.match(/translate\(\s*([-+\d.eE]+)[ ,]+([-+\d.eE]+)\s*\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}}
function box(id){if(id==='seedWriter')return{x:p2.seedWriter.x,y:p2.seedWriter.y,w:154,h:66};const g=nodes.querySelector(`[data-id="${id}"]`);if(!g)return null;const r=g.querySelector('.box'),t=nodeTransform(g);return{x:t.x,y:t.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,k=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*k,y:cy+(out?1:-1)*uy*k}}
function base(i){const e=wires[i],a=box(e.from),b=box(e.to);if(!a||!b)return null;const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),T=boundary(b,ux,uy,false),bend=e.bend||0;return{S,T,c1:{x:S.x+(T.x-S.x)/3+nx*bend,y:S.y+(T.y-S.y)/3+ny*bend},c2:{x:S.x+(T.x-S.x)*2/3+nx*bend,y:S.y+(T.y-S.y)*2/3+ny*bend}}}
function geom(i){const b=base(i);if(!b)return null;const c=ctl[i],C1={x:b.c1.x+c.c1dx,y:b.c1.y+c.c1dy},C2={x:b.c2.x+c.c2dx,y:b.c2.y+c.c2dy};return{...b,C1,C2,d:`M${b.S.x} ${b.S.y}C${C1.x} ${C1.y} ${C2.x} ${C2.y} ${b.T.x} ${b.T.y}`}}
function mid(g,t=.5){const u=1-t;return{x:u*u*u*g.S.x+3*u*u*t*g.C1.x+3*u*t*t*g.C2.x+t*t*t*g.T.x,y:u*u*u*g.S.y+3*u*u*t*g.C1.y+3*u*t*t*g.C2.y+t*t*t*g.T.y}}
function seedNode(){let g=nodes.querySelector('[data-p2-id="seedWriter"]');if(g)return g;g=E('g',{class:'phase2-node type-wrapper-write','data-p2-id':'seedWriter'});g.appendChild(E('rect',{class:'box',width:154,height:66,rx:12}));let t=E('text',{class:'kicker',x:77,y:20});t.textContent='WRAPPER · WRITE';g.appendChild(t);t=E('text',{class:'title',x:77,y:43});t.textContent='Seed Writer';g.appendChild(t);t=E('text',{class:'note',x:77,y:59});t.textContent='Pre-SDD materialization';g.appendChild(t);nodes.appendChild(g);return g}
function renderSeed(){seedNode().setAttribute('transform',`translate(${p2.seedWriter.x} ${p2.seedWriter.y})`)}
function renderBoundaries(){boundaryLayer.innerHTML='';boundaryLayer.appendChild(E('path',{class:'phase2-boundary read-write',d:'M1488 786V878'}));let t=E('text',{class:'phase2-boundary-title phase2-read-label',x:1402,y:784});t.textContent='READ / PLAN';boundaryLayer.appendChild(t);t=E('text',{class:'phase2-boundary-title phase2-write-label',x:1498,y:784});t.textContent='PRODUCT WRITE';boundaryLayer.appendChild(t);t=E('text',{class:'phase2-boundary-note',x:1370,y:873});t.textContent='OpenCode planning cannot cross this boundary';boundaryLayer.appendChild(t);
 boundaryLayer.appendChild(E('path',{class:'phase2-boundary canonical',d:'M1064 476H1326'}));t=E('text',{class:'phase2-boundary-title phase2-write-label',x:1068,y:472});t.textContent='CANDIDATE WORKSPACE';boundaryLayer.appendChild(t);t=E('text',{class:'phase2-boundary-title phase2-canonical-label',x:1185,y:487});t.textContent='CANONICAL REPO EFFECT';boundaryLayer.appendChild(t);t=E('text',{class:'phase2-boundary-note',x:1322,y:487,'text-anchor':'end'});t.textContent='governed adoption · commit ≠ push';boundaryLayer.appendChild(t)}
function renderWires(){wireLayer.innerHTML='';labelLayer.innerHTML='';handleLayer.innerHTML='';for(let i=0;i<wires.length;i++){const e=wires[i],g=geom(i);if(!g)continue;wireLayer.appendChild(E('path',{class:`phase2-edge ${e.cls}`,d:g.d}));const p=mid(g),w=Math.max(52,e.label.length*5.4+16);labelLayer.appendChild(E('rect',{class:'phase2-label-bg',x:p.x-w/2,y:p.y-9,width:w,height:18,rx:9}));const t=E('text',{class:'phase2-label',x:p.x,y:p.y+3});t.textContent=e.label;labelLayer.appendChild(t);for(const[which,q]of[['c1',g.C1],['c2',g.C2]])handleLayer.appendChild(E('circle',{class:`phase2-handle ${e.cls}${handleDrag&&handleDrag.i===i&&handleDrag.which===which?' active':''}`,'data-p2-edge':i,'data-p2-control':which,cx:q.x,cy:q.y,r:4.8}))}}
function render(){renderSeed();renderBoundaries();renderWires()}
function point(e){const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}}
function dirty(){saveBtn?.classList.remove('saved');if(saveBtn)saveBtn.textContent='Save layout';if(status)status.textContent='Phase 2 · wiring modificat · Save layout per conservar-lo'}
function save(){try{localStorage.setItem(KEY,JSON.stringify({seedWriter:p2.seedWriter,controls:ctl}))}catch(_){}}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;renderWires()})}
new MutationObserver(schedule).observe(nodes,{subtree:true,attributes:true,attributeFilter:['transform']});
window.addEventListener('pointerdown',e=>{if(document.body.dataset.mode!=='design')return;const h=e.target.closest?.('.phase2-handle');if(h){e.preventDefault();e.stopImmediatePropagation();handleDrag={i:+h.dataset.p2Edge,which:h.dataset.p2Control,pid:e.pointerId};try{svg.setPointerCapture(e.pointerId)}catch(_){};renderWires();return}const n=e.target.closest?.('.phase2-node');if(n){e.preventDefault();e.stopImmediatePropagation();const p=point(e);drag={pid:e.pointerId,dx:p.x-p2.seedWriter.x,dy:p.y-p2.seedWriter.y};try{svg.setPointerCapture(e.pointerId)}catch(_){} }},true);
svg.addEventListener('pointermove',e=>{if(handleDrag&&e.pointerId===handleDrag.pid){e.preventDefault();const p=point(e),b=base(handleDrag.i);if(!b)return;const c=ctl[handleDrag.i];if(handleDrag.which==='c1'){c.c1dx=p.x-b.c1.x;c.c1dy=p.y-b.c1.y}else{c.c2dx=p.x-b.c2.x;c.c2dy=p.y-b.c2.y}renderWires();dirty();return}if(drag&&e.pointerId===drag.pid){e.preventDefault();const p=point(e);p2.seedWriter.x=p.x-drag.dx;p2.seedWriter.y=p.y-drag.dy;renderSeed();renderWires();dirty()}},true);
function end(e){if(handleDrag&&e.pointerId===handleDrag.pid){handleDrag=null;renderWires()}if(drag&&e.pointerId===drag.pid)drag=null}
svg.addEventListener('pointerup',end,true);svg.addEventListener('pointercancel',end,true);saveBtn?.addEventListener('click',save);
for(const t of zones.querySelectorAll('.zone-subtitle'))if(t.textContent.includes('Phase 1:'))t.textContent='Phase 2 · exact lifecycle ↔ wrapper wiring · runner dispatch remains centralized';
if(status)status.textContent=document.body.dataset.mode==='view'?'Phase 2 · View · lifecycle ↔ wrappers':'Phase 2 · Design · lifecycle ↔ wrappers · fletxes modelables';
render();
})();