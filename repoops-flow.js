(()=>{
const svg=document.getElementById('g'),zonesLayer=document.getElementById('zones'),nodesLayer=document.getElementById('nodes'),edgesLayer=document.getElementById('edges'),labelsLayer=document.getElementById('labels'),handlesLayer=document.getElementById('edge-handles'),saveBtn=document.getElementById('save'),fitBtn=document.getElementById('fit'),viewBtn=document.getElementById('mode-view'),designBtn=document.getElementById('mode-design'),status=document.getElementById('status'),NS='http://www.w3.org/2000/svg';
const KEY='pre-baranes-atlas:repoops-flow:v1',MODE_KEY='pre-baranes-atlas:repoops-flow:mode:v1';
const defs={
 seed:{x:38,y:108,w:132,h:76,type:'seed',kicker:'PRE-SDD',title:'💡 SEED',note:'formatted feature idea'},
 intake:{x:205,y:108,w:142,h:76,type:'phase',kicker:'ADOPT / IDENTITY',title:'◆ INTAKE',note:'feature is admitted'},
 design:{x:382,y:108,w:142,h:76,type:'phase',kicker:'SDD',title:'DESIGN',note:'what / architecture'},
 spec:{x:559,y:108,w:142,h:76,type:'phase',kicker:'SDD',title:'SPEC',note:'exact behaviour'},
 validation:{x:736,y:108,w:150,h:76,type:'gate',kicker:'INDEPENDENT GATE',title:'VALIDATION',note:'spec PASS / FAIL'},
 tasks:{x:921,y:108,w:142,h:76,type:'phase',kicker:'SDD',title:'TASKS',note:'bounded work plan'},
 implementation:{x:1098,y:103,w:164,h:86,type:'implementation',kicker:'ENGINEERING LOOP',title:'IMPLEMENTATION',note:'edit · test · correct'},
 verify:{x:1300,y:108,w:142,h:76,type:'verify',kicker:'ASSURANCE',title:'VERIFY',note:'candidate vs spec'},
 audit:{x:1477,y:108,w:150,h:76,type:'verify',kicker:'ASSURANCE',title:'AUDIT / QA',note:'independent close'},
 closed:{x:1658,y:108,w:118,h:76,type:'close',kicker:'TERMINAL',title:'CLOSED',note:'feature complete'},
 seedDossier:{x:38,y:397,w:148,h:66,type:'artifact',kicker:'ARTIFACT',title:'Seed dossier',note:'SEED-xxx.md'},
 featureRecord:{x:222,y:305,w:1450,h:58,type:'record',kicker:'PERSISTENT STATE',title:'Feature Record',note:'identity · phase · paths · results · provenance'},
 designDoc:{x:378,y:397,w:148,h:66,type:'artifact',kicker:'ARTIFACT',title:'design.md',note:'design_path'},
 specDoc:{x:555,y:397,w:148,h:66,type:'artifact',kicker:'ARTIFACT',title:'spec.md',note:'spec_path'},
 validationEvidence:{x:728,y:397,w:164,h:66,type:'evidence',kicker:'EVIDENCE',title:'Validation',note:'PASS / findings'},
 tasksDoc:{x:915,y:397,w:148,h:66,type:'artifact',kicker:'ARTIFACT',title:'tasks.md',note:'task_path + scope'},
 candidate:{x:1087,y:392,w:176,h:76,type:'candidate',kicker:'BOUNDED CANDIDATE',title:'Sealed candidate',note:'diff · tests · exact scope'},
 verifyEvidence:{x:1292,y:397,w:158,h:66,type:'evidence',kicker:'EVIDENCE',title:'Verification',note:'PASS / report'},
 auditEvidence:{x:1472,y:397,w:174,h:66,type:'evidence',kicker:'EVIDENCE',title:'Audit / closure',note:'audit · QA · close'},
 gitSdd:{x:826,y:486,w:174,h:54,type:'git',kicker:'OPTIONAL CHECKPOINT',title:'Git · SDD package'},
 gitAdoption:{x:1120,y:486,w:174,h:54,type:'git',kicker:'PRIMARY CHECKPOINT',title:'Git · adoption'},
 gitClosure:{x:1474,y:486,w:184,h:54,type:'git',kicker:'IF NEEDED',title:'Git · closure'},
 control:{x:42,y:642,w:186,h:78,type:'control',kicker:'TECHNICAL CONTROL',title:'Architect / Master',note:'bounded repo request'},
 helper:{x:267,y:642,w:166,h:78,type:'helper',kicker:'FRONT DOOR',title:'repoops-helper',note:'construct / validate'},
 job:{x:470,y:642,w:166,h:78,type:'job',kicker:'REQUEST ENVELOPE',title:'RepoOps Job',note:'scope · actor · effect'},
 queue:{x:674,y:642,w:156,h:78,type:'queue',kicker:'DURABLE STATE',title:'Job Queue',note:'pending → running'},
 runner:{x:875,y:618,w:298,h:126,type:'runner',kicker:'REPOOPS ENGINE',title:'⚙ RepoOps Job Runner',note:'admission · dispatch · terminal result'},
 phaseController:{x:476,y:802,w:154,h:66,type:'wrapper',kicker:'WRAPPER',title:'Phase Controller',note:'transition gate'},
 artifactWriter:{x:646,y:802,w:154,h:66,type:'wrapper-write',kicker:'WRAPPER · WRITE',title:'Artifact Writer',note:'SDD materialization'},
 specValidator:{x:816,y:802,w:154,h:66,type:'wrapper-ai',kicker:'WRAPPER · AI',title:'Spec Validator',note:'OpenCode review'},
 gateInspector:{x:986,y:802,w:154,h:66,type:'wrapper',kicker:'WRAPPER',title:'Gate Inspector',note:'implementation eligibility'},
 contextCodex:{x:1156,y:802,w:154,h:66,type:'wrapper-ai',kicker:'WRAPPER · AI',title:'Context / Codex',note:'bounded repo reading'},
 planOpenCode:{x:1326,y:802,w:154,h:66,type:'wrapper-ai',kicker:'WRAPPER · AI',title:'OpenCode Plan',note:'read-only planning'},
 implementer:{x:1496,y:802,w:170,h:66,type:'wrapper-write',kicker:'WRAPPER · AI WRITE',title:'OpenCode Implementer',note:'candidate workspace'},
 verifier:{x:646,y:889,w:154,h:66,type:'wrapper',kicker:'WRAPPER',title:'Verifier',note:'deterministic evidence'},
 auditor:{x:816,y:889,w:154,h:66,type:'wrapper-ai',kicker:'WRAPPER · AI',title:'SDD Auditor',note:'OpenCode audit'},
 qa:{x:986,y:889,w:154,h:66,type:'wrapper',kicker:'WRAPPER',title:'QA Review',note:'closure evidence gate'},
 adoptionGit:{x:1156,y:889,w:194,h:66,type:'wrapper-git',kicker:'CANONICAL EFFECT',title:'Repo Adoption / Git',note:'exact governed commit'}
};
const state={};for(const[id,d]of Object.entries(defs))state[id]={x:d.x,y:d.y};
const edges=[
 {from:'seed',to:'intake',label:'adopt',cls:'flow'},{from:'intake',to:'design',cls:'flow'},{from:'design',to:'spec',cls:'flow'},{from:'spec',to:'validation',cls:'flow'},{from:'validation',to:'tasks',label:'PASS',cls:'flow'},{from:'tasks',to:'implementation',cls:'flow'},{from:'implementation',to:'verify',cls:'flow'},{from:'verify',to:'audit',cls:'flow'},{from:'audit',to:'closed',cls:'flow'},
 {from:'validation',to:'spec',label:'FAIL',cls:'return',bend:-72},{from:'verify',to:'implementation',label:'FAIL',cls:'return',bend:72},
 {from:'seed',to:'seedDossier',cls:'artifact'},{from:'intake',to:'featureRecord',cls:'artifact'},{from:'design',to:'designDoc',cls:'artifact'},{from:'spec',to:'specDoc',cls:'artifact'},{from:'validation',to:'validationEvidence',cls:'artifact'},{from:'tasks',to:'tasksDoc',cls:'artifact'},{from:'implementation',to:'candidate',cls:'artifact'},{from:'verify',to:'verifyEvidence',cls:'artifact'},{from:'audit',to:'auditEvidence',cls:'artifact'},
 {from:'tasksDoc',to:'gitSdd',label:'optional',cls:'git'},{from:'candidate',to:'gitAdoption',label:'adopt',cls:'git'},{from:'auditEvidence',to:'gitClosure',label:'if needed',cls:'git'},
 {from:'control',to:'helper',label:'request',cls:'engine'},{from:'helper',to:'job',label:'validate / build',cls:'engine'},{from:'job',to:'queue',cls:'engine'},{from:'queue',to:'runner',label:'claim',cls:'engine'}
];
const controls={};for(let i=0;i<edges.length;i++)controls[i]={c1dx:0,c1dy:0,c2dx:0,c2dy:0};
let view={x:0,y:0,w:1810,h:1010},mode=localStorage.getItem(MODE_KEY)||'design',drag=null,edgeDrag=null,pan=null;
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.positions)for(const id in state)if(s.positions[id])state[id]={...state[id],...s.positions[id]};if(s?.controls)for(const i in controls)if(s.controls[i])controls[i]={...controls[i],...s.controls[i]};if(s?.view&&['x','y','w','h'].every(k=>Number.isFinite(s.view[k])))view={...s.view}}catch(_){}
function E(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
function P(e){const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}}
function applyView(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`)}
function box(id){const d=defs[id],s=state[id];return{x:s.x,y:s.y,w:d.w,h:d.h}}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,k=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*k,y:cy+(out?1:-1)*uy*k}}
function edgeBase(i){const e=edges[i],a=box(e.from),b=box(e.to),ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),T=boundary(b,ux,uy,false),bend=e.bend||0;return{S,T,c1:{x:S.x+(T.x-S.x)/3+nx*bend,y:S.y+(T.y-S.y)/3+ny*bend},c2:{x:S.x+(T.x-S.x)*2/3+nx*bend,y:S.y+(T.y-S.y)*2/3+ny*bend}}}
function edgeGeom(i){const b=edgeBase(i),c=controls[i],C1={x:b.c1.x+c.c1dx,y:b.c1.y+c.c1dy},C2={x:b.c2.x+c.c2dx,y:b.c2.y+c.c2dy};return{...b,C1,C2,d:`M${b.S.x} ${b.S.y}C${C1.x} ${C1.y} ${C2.x} ${C2.y} ${b.T.x} ${b.T.y}`}}
function cubic(g,t=.5){const u=1-t;return{x:u*u*u*g.S.x+3*u*u*t*g.C1.x+3*u*t*t*g.C2.x+t*t*t*g.T.x,y:u*u*u*g.S.y+3*u*u*t*g.C1.y+3*u*t*t*g.C2.y+t*t*t*g.T.y}}
function renderZones(){zonesLayer.innerHTML='';const rect=(cl,x,y,w,h,rx=20)=>zonesLayer.appendChild(E('rect',{class:`zone ${cl}`,x,y,width:w,height:h,rx}));const label=(x,y,title,sub)=>{let t=E('text',{class:'zone-title',x,y});t.textContent=title;zonesLayer.appendChild(t);t=E('text',{class:'zone-subtitle',x,y:y+17});t.textContent=sub;zonesLayer.appendChild(t)};
 rect('zone-feature',18,65,1772,170);label(36,89,'1 · FEATURE FLOW','Seed → SDD → engineering candidate → assurance → close');
 rect('zone-artifacts',18,270,1772,292);label(36,294,'2 · ARTIFACT FLOW','Feature Record persists across lifecycle · Git is coherent checkpointing, never per-phase ritual');
 rect('zone-engine',18,592,1772,390);label(36,616,'3 · REPOOPS INTERNAL ENGINE','request → envelope → durable queue → runner → bounded wrapper dispatch');
 zonesLayer.appendChild(E('rect',{x:454,y:770,width:1240,height:200,rx:18,fill:'#0f172a','fill-opacity':'.34',stroke:'#64748b','stroke-opacity':'.32','stroke-dasharray':'5 7'}));
 let t=E('text',{class:'zone-title',x:474,y:792});t.textContent='ALLOWLISTED WRAPPER SURFACE';zonesLayer.appendChild(t);t=E('text',{class:'zone-subtitle',x:676,y:792});t.textContent='Phase 1: inventory visible · exact per-phase wiring comes in Phase 2';zonesLayer.appendChild(t);
 zonesLayer.appendChild(E('path',{class:'git-rail',d:'M770 551 H1690'}));t=E('text',{class:'git-label',x:775,y:546});t.textContent='GIT CHECKPOINTS · typically 2, at most ~3 · not one commit per SDD phase';zonesLayer.appendChild(t);
}
function renderNode(id){const d=defs[id],s=state[id],g=E('g',{class:`node type-${d.type}`,'data-id':id,transform:`translate(${s.x} ${s.y})`});g.appendChild(E('rect',{class:'box',width:d.w,height:d.h,rx:id==='featureRecord'?14:12}));let t=E('text',{class:'kicker',x:d.w/2,y:id==='featureRecord'?18:20});t.textContent=d.kicker;g.appendChild(t);t=E('text',{class:'title',x:d.w/2,y:id==='featureRecord'?37:43});t.textContent=d.title;g.appendChild(t);if(d.note){t=E('text',{class:'note',x:d.w/2,y:id==='featureRecord'?51:59});t.textContent=d.note;g.appendChild(t)}nodesLayer.appendChild(g)}
function renderEdges(){edgesLayer.innerHTML='';labelsLayer.innerHTML='';handlesLayer.innerHTML='';for(let i=0;i<edges.length;i++){const e=edges[i],g=edgeGeom(i);edgesLayer.appendChild(E('path',{class:`edge ${e.cls||''}`,d:g.d}));if(e.label){const p=cubic(g,.5),w=Math.max(52,e.label.length*5.8+18);labelsLayer.appendChild(E('rect',{class:'edge-label-bg',x:p.x-w/2,y:p.y-9,width:w,height:18,rx:9}));const t=E('text',{class:'edge-label',x:p.x,y:p.y+3});t.textContent=e.label;labelsLayer.appendChild(t)}for(const[which,p]of[['c1',g.C1],['c2',g.C2]])handlesLayer.appendChild(E('circle',{class:`edge-handle ${e.cls||''}${edgeDrag&&edgeDrag.index===i&&edgeDrag.which===which?' active':''}`,'data-edge':i,'data-control':which,cx:p.x,cy:p.y,r:5.2}))}
 const r=box('runner'),sx=r.x+r.w/2,sy=r.y+r.h,tx=1070,ty=770;edgesLayer.appendChild(E('path',{class:'edge engine',d:`M${sx} ${sy}C${sx} ${sy+32} ${tx} ${ty-28} ${tx} ${ty}`,'marker-end':'url(#arrowGreen)'}));const bg=E('rect',{class:'edge-label-bg',x:1015,y:745,width:110,height:18,rx:9});labelsLayer.appendChild(bg);const tt=E('text',{class:'edge-label',x:1070,y:757});tt.textContent='allowlisted dispatch';labelsLayer.appendChild(tt);
}
function render(){renderZones();nodesLayer.innerHTML='';for(const id of Object.keys(defs))renderNode(id);renderEdges()}
function dirty(){saveBtn.classList.remove('saved');saveBtn.textContent='Save layout';status.textContent='Layout modificat · Save layout per conservar-lo'}
function save(){try{localStorage.setItem(KEY,JSON.stringify({positions:state,controls,view}));saveBtn.classList.add('saved');saveBtn.textContent='Saved';status.textContent='Layout i corbes guardats en aquest navegador'}catch(_){status.textContent='No s’ha pogut guardar'}}
function fit(){const bs=Object.keys(defs).map(box),pts=[];for(let i=0;i<edges.length;i++){const g=edgeGeom(i);pts.push(g.C1,g.C2)}const m=55,minX=Math.min(...bs.map(b=>b.x),...pts.map(p=>p.x))-m,minY=Math.min(...bs.map(b=>b.y),...pts.map(p=>p.y))-m,maxX=Math.max(...bs.map(b=>b.x+b.w),...pts.map(p=>p.x))+m,maxY=Math.max(...bs.map(b=>b.y+b.h),...pts.map(p=>p.y))+m;let x=minX,y=minY,w=maxX-minX,h=maxY-minY;const r=svg.getBoundingClientRect(),a=(r.width||1)/(r.height||1);if(w/h>a){const nh=w/a;y-=(nh-h)/2;h=nh}else{const nw=h*a;x-=(nw-w)/2;w=nw}view={x,y,w,h};applyView()}
function setMode(next){mode=next;document.body.dataset.mode=mode;viewBtn.classList.toggle('active',mode==='view');designBtn.classList.toggle('active',mode==='design');try{localStorage.setItem(MODE_KEY,mode)}catch(_){}status.textContent=mode==='view'?'View · edició bloquejada · pan / zoom disponibles':'Design · mou caixes i punts de fletxa · Save layout per conservar-ho'}
svg.addEventListener('pointerdown',e=>{const h=e.target.closest?.('.edge-handle');if(h&&mode==='design'){e.preventDefault();e.stopPropagation();edgeDrag={index:+h.dataset.edge,which:h.dataset.control,pid:e.pointerId};try{svg.setPointerCapture(e.pointerId)}catch(_){};renderEdges();return}const g=e.target.closest?.('.node');if(g&&mode==='design'){e.preventDefault();e.stopPropagation();const id=g.dataset.id,p=P(e),s=state[id];drag={id,pid:e.pointerId,dx:p.x-s.x,dy:p.y-s.y};try{svg.setPointerCapture(e.pointerId)}catch(_){};return}pan={pid:e.pointerId,x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};try{svg.setPointerCapture(e.pointerId)}catch(_){} });
svg.addEventListener('pointermove',e=>{if(edgeDrag&&e.pointerId===edgeDrag.pid){e.preventDefault();const p=P(e),b=edgeBase(edgeDrag.index),c=controls[edgeDrag.index];if(edgeDrag.which==='c1'){c.c1dx=p.x-b.c1.x;c.c1dy=p.y-b.c1.y}else{c.c2dx=p.x-b.c2.x;c.c2dy=p.y-b.c2.y}renderEdges();dirty();return}if(drag&&e.pointerId===drag.pid){e.preventDefault();const p=P(e),s=state[drag.id];s.x=p.x-drag.dx;s.y=p.y-drag.dy;const g=nodesLayer.querySelector(`[data-id="${drag.id}"]`);if(g)g.setAttribute('transform',`translate(${s.x} ${s.y})`);renderEdges();dirty();return}if(pan&&e.pointerId===pan.pid){const r=svg.getBoundingClientRect();view.x=pan.vx-(e.clientX-pan.x)/r.width*view.w;view.y=pan.vy-(e.clientY-pan.y)/r.height*view.h;applyView();dirty()}});
function end(e){if(edgeDrag&&e.pointerId===edgeDrag.pid){edgeDrag=null;renderEdges()}if(drag&&e.pointerId===drag.pid)drag=null;if(pan&&e.pointerId===pan.pid)pan=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}}
svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);svg.addEventListener('wheel',e=>{e.preventDefault();const p=P(e),old={...view},f=e.deltaY>0?1.1:.9,nw=Math.min(3400,Math.max(720,view.w*f)),nh=nw*(view.h/view.w),rx=(p.x-old.x)/old.w,ry=(p.y-old.y)/old.h;view.x=p.x-rx*nw;view.y=p.y-ry*nh;view.w=nw;view.h=nh;applyView();dirty()},{passive:false});
saveBtn.addEventListener('click',save);fitBtn.addEventListener('click',()=>{fit();dirty()});viewBtn.addEventListener('click',()=>setMode('view'));designBtn.addEventListener('click',()=>setMode('design'));
if(mode!=='view'&&mode!=='design')mode='design';applyView();render();setMode(mode);
})();
