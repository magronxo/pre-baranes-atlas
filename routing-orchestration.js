(() => {
"use strict";

const NS="http://www.w3.org/2000/svg";
const STORAGE="pre-baranes-atlas:routing-orchestration:v1";
const svg=document.getElementById("routing-atlas");
const planesLayer=document.getElementById("planes");
const edgesLayer=document.getElementById("edges");
const labelsLayer=document.getElementById("edge-labels");
const nodesLayer=document.getElementById("nodes");
const handlesLayer=document.getElementById("edge-handles");
const infoCard=document.getElementById("info-card");
const statusLine=document.getElementById("status");
const saveBtn=document.getElementById("save-layout");
const viewBtn=document.getElementById("mode-view");
const designBtn=document.getElementById("mode-design");
if(!svg||!planesLayer||!edgesLayer||!nodesLayer)return;

const planes=[
{id:"authority",label:"AUTHORITY",subtitle:"product ownership and technical path",x:55,y:55,w:510,h:205},
{id:"routing",label:"ROUTING",subtitle:"ingress, interpretation and binding",x:610,y:55,w:955,h:205},
{id:"orchestration",label:"ORCHESTRATION",subtitle:"current actors plus explicitly non-canonical candidates",x:55,y:305,w:1510,h:310},
{id:"execution",label:"EXECUTION / EVIDENCE",subtitle:"bounded effects, evidence and domain-owned truth",x:55,y:655,w:1510,h:220}
];

const nodeSeed=[
{id:"oriol",name:"Oriol",role:"PRODUCT OWNER",plane:"authority",className:"authority",x:115,y:120,w:185,h:82,status:"CANONICAL",boundary:"Owns product intent, material scope and genuine product trade-offs."},
{id:"general-master",name:"General Master",role:"MASTER",plane:"authority",className:"authority",x:350,y:120,w:185,h:82,status:"CANONICAL",boundary:"Owns architecture, technical path, sequencing and the next clear technical action."},
{id:"ingress",name:"Ingress",role:"ENTRY / HANDOFF",plane:"routing",className:"routing",x:675,y:120,w:185,h:82,status:"MODEL",boundary:"Receives work without silently granting authority to the delivery channel."},
{id:"routing-binding",name:"Routing / Binding",role:"ROUTING",plane:"routing",className:"routing",x:955,y:120,w:205,h:82,status:"MODEL",boundary:"Binds work to the smallest competent actor or capability while preserving authority boundaries."},

{id:"architect",name:"Architect",role:"TECHNICAL ACTOR",plane:"orchestration",className:"orchestration",x:105,y:390,w:185,h:82,status:"CURRENT",boundary:"Handles bounded architecture and implementation work where an engineering actor is required."},
{id:"repoops-master",name:"RepoOps Master",role:"DOMAIN MASTER",plane:"orchestration",className:"orchestration",x:325,y:390,w:195,h:82,status:"CURRENT",boundary:"Owns repository-domain orchestration and bounded repository work."},
{id:"atlas",name:"Atlas",role:"INSPECTION SURFACE",plane:"orchestration",className:"orchestration",x:555,y:390,w:185,h:82,status:"CURRENT",boundary:"Makes architecture and boundaries inspectable; it is not an execution authority."},
{id:"radar",name:"Radar",role:"RESEARCH / SIGNAL",plane:"orchestration",className:"orchestration",x:775,y:390,w:185,h:82,status:"CURRENT",boundary:"Surfaces relevant signals and research without owning product or effect authority."},

{id:"operational-master",name:"Operational Master",role:"POSSIBLE MASTER",plane:"orchestration",className:"candidate",x:1015,y:365,w:200,h:88,status:"CANDIDATE",boundary:"Candidate operational orchestration role. Drawing it here does not admit it into canonical architecture."},
{id:"satan",name:"Satan",role:"POSSIBLE ACTOR",plane:"orchestration",className:"candidate",x:1260,y:365,w:185,h:88,status:"CANDIDATE",boundary:"Candidate operational actor. Its exact product role remains unadmitted."},
{id:"workers",name:"Workers",role:"REPLACEABLE EXECUTORS",plane:"orchestration",className:"candidate",x:1260,y:495,w:185,h:88,status:"CANDIDATE",boundary:"Candidate replaceable workers for bounded mechanical tasks; never authority owners."},

{id:"execution-surface",name:"Execution Surface",role:"BOUNDED EXECUTION",plane:"execution",className:"execution",x:145,y:725,w:205,h:82,status:"BOUNDARY",boundary:"Performs allowed effects inside explicit scope. Successful execution does not itself establish domain truth."},
{id:"evidence",name:"Evidence",role:"PROVENANCE / VERIFICATION",plane:"execution",className:"evidence",x:500,y:725,w:190,h:82,status:"BOUNDARY",boundary:"Carries execution results, verification and provenance. Evidence supports truth determination but does not own it."},
{id:"domain-truth",name:"Domain Effect Truth",role:"DOMAIN AUTHORITY",plane:"execution",className:"truth",x:850,y:725,w:215,h:82,status:"AUTHORITY BOUNDARY",boundary:"The affected semantic domain determines whether the intended effect is true."},
{id:"checkpoint",name:"Material Checkpoint",role:"RESULT / ESCALATION",plane:"execution",className:"checkpoint",x:1225,y:725,w:205,h:82,status:"BOUNDARY",boundary:"Surfaces material outcomes, blockers or product choices without turning routine technical progress into owner micromanagement."}
];

const edgeSeed=[
{id:"owner-master",from:"oriol",to:"general-master",label:"product intent / decisions",kind:"authority",bend:0},
{id:"ingress-routing",from:"ingress",to:"routing-binding",label:"incoming work",kind:"routing",bend:0},
{id:"master-routing",from:"general-master",to:"routing-binding",label:"technical direction",kind:"routing",bend:-34,labelT:.47,labelOffset:-18},
{id:"routing-architect",from:"routing-binding",to:"architect",label:"technical work",kind:"orchestration",bend:30,labelT:.48,labelOffset:18},
{id:"routing-repoops",from:"routing-binding",to:"repoops-master",label:"repository work",kind:"orchestration",bend:20,labelT:.5,labelOffset:-22},
{id:"routing-atlas",from:"routing-binding",to:"atlas",label:"inspection / model",kind:"orchestration",bend:8,labelT:.51,labelOffset:22},
{id:"routing-radar",from:"routing-binding",to:"radar",label:"research / signal",kind:"orchestration",bend:-5,labelT:.53,labelOffset:-22},
{id:"routing-operational",from:"routing-binding",to:"operational-master",label:"possible operational binding",kind:"candidate",bend:-18,labelT:.54,labelOffset:20},

{id:"operational-satan",from:"operational-master",to:"satan",label:"candidate delegation",kind:"candidate",bend:0,labelT:.5,labelOffset:-20},
{id:"satan-workers",from:"satan",to:"workers",label:"candidate worker use",kind:"candidate",bend:18,labelT:.55,labelOffset:22},

{id:"architect-exec",from:"architect",to:"execution-surface",label:"bounded execution",kind:"execution",bend:10,labelT:.55,labelOffset:18},
{id:"repoops-exec",from:"repoops-master",to:"execution-surface",label:"bounded repo effect",kind:"execution",bend:28,labelT:.55,labelOffset:-22},
{id:"workers-exec",from:"workers",to:"execution-surface",label:"candidate execution",kind:"candidate",bend:-75,labelT:.44,labelOffset:-28},

{id:"exec-evidence",from:"execution-surface",to:"evidence",label:"reports what happened",kind:"evidence",bend:0,labelT:.5,labelOffset:-20},
{id:"evidence-truth",from:"evidence",to:"domain-truth",label:"supports determination",kind:"evidence",bend:0,labelT:.5,labelOffset:20},
{id:"truth-checkpoint",from:"domain-truth",to:"checkpoint",label:"effect status",kind:"evidence",bend:0,labelT:.5,labelOffset:-20},
{id:"checkpoint-master",from:"checkpoint",to:"general-master",label:"material result",kind:"authority",bend:-170,labelT:.43,labelOffset:26},
{id:"radar-master",from:"radar",to:"general-master",label:"signal / research",kind:"orchestration",bend:80,labelT:.46,labelOffset:-30}
];

const nodes=Object.fromEntries(nodeSeed.map(n=>[n.id,{...n}]));
const edges=edgeSeed.map(e=>({...e}));
const initialNodes=Object.fromEntries(nodeSeed.map(n=>[n.id,{x:n.x,y:n.y}]));
let edgeControls={};
let mode="view",activePlane="all",selected=null,dirty=false;
let nodeDrag=null,pan=null,handleDrag=null;
let view={x:0,y:0,w:1620,h:930};

function x(tag,attrs={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))q.setAttribute(k,String(v));return q}
function txt(node,value){node.textContent=value;return node}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function visible(n){return activePlane==="all"||n.plane===activePlane}
function edgeVisible(e){return visible(nodes[e.from])&&visible(nodes[e.to])}
function setStatus(v){statusLine.textContent=v}
function baseStatus(){return mode==="design"?(dirty?"Design · layout o corbes modificades · Save layout per conservar-ho":"Design · mou nodes o punts de corba · Save layout per conservar-ho"):"View · selecciona un node · arrossega el fons per pan · wheel o +/− per zoom"}

function p(clientX,clientY){
 const r=svg.getBoundingClientRect();
 return{x:view.x+(clientX-r.left)/Math.max(1,r.width)*view.w,y:view.y+(clientY-r.top)/Math.max(1,r.height)*view.h}
}
function applyView(){svg.setAttribute("viewBox",`${view.x} ${view.y} ${view.w} ${view.h}`)}
function rectBoundary(n,towardX,towardY){
 const cx=n.x+n.w/2,cy=n.y+n.h/2,dx=towardX-cx,dy=towardY-cy;
 const scale=1/Math.max(Math.abs(dx)/Math.max(1,n.w/2),Math.abs(dy)/Math.max(1,n.h/2),.0001);
 return{x:cx+dx*scale,y:cy+dy*scale}
}
function geom(e){
 const a=nodes[e.from],b=nodes[e.to],ac={x:a.x+a.w/2,y:a.y+a.h/2},bc={x:b.x+b.w/2,y:b.y+b.h/2};
 const s=rectBoundary(a,bc.x,bc.y),t=rectBoundary(b,ac.x,ac.y),dx=t.x-s.x,dy=t.y-s.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,bend=e.bend||0;
 const base1={x:s.x+dx/3+nx*bend,y:s.y+dy/3+ny*bend},base2={x:s.x+2*dx/3+nx*bend,y:s.y+2*dy/3+ny*bend},c=edgeControls[e.id]||{};
 return{s,t,base1,base2,c1:{x:base1.x+(c.c1dx||0),y:base1.y+(c.c1dy||0)},c2:{x:base2.x+(c.c2dx||0),y:base2.y+(c.c2dy||0)}}
}
function cubic(g,t){
 const u=1-t;
 return{x:u*u*u*g.s.x+3*u*u*t*g.c1.x+3*u*t*t*g.c2.x+t*t*t*g.t.x,y:u*u*u*g.s.y+3*u*u*t*g.c1.y+3*u*t*t*g.c2.y+t*t*t*g.t.y}
}
function tangent(g,t){
 const u=1-t;
 return{x:3*u*u*(g.c1.x-g.s.x)+6*u*t*(g.c2.x-g.c1.x)+3*t*t*(g.t.x-g.c2.x),y:3*u*u*(g.c1.y-g.s.y)+6*u*t*(g.c2.y-g.c1.y)+3*t*t*(g.t.y-g.c2.y)}
}
function boxOverlap(a,b,pad=0){return!(a.x+a.w+pad<b.x||b.x+b.w+pad<a.x||a.y+a.h+pad<b.y||b.y+b.h+pad<a.y)}
function labelPosition(e,g,width,used){
 const nodeBoxes=Object.values(nodes).filter(visible).map(n=>({x:n.x-7,y:n.y-7,w:n.w+14,h:n.h+14}));
 const t0=Number.isFinite(e.labelT)?e.labelT:.5;
 const ts=[t0,Math.max(.2,t0-.1),Math.min(.8,t0+.1),.36,.64,.28,.72];
 const baseOff=Number.isFinite(e.labelOffset)?e.labelOffset:0;
 const offsets=[baseOff,baseOff+22,baseOff-22,baseOff+40,baseOff-40,0];
 for(const t of ts){
  const m=cubic(g,t),v=tangent(g,t),len=Math.hypot(v.x,v.y)||1,nx=-v.y/len,ny=v.x/len;
  for(const off of offsets){
   const cx=m.x+nx*off,cy=m.y+ny*off,candidate={x:cx-width/2,y:cy-10,w:width,h:20,cx,cy};
   if(nodeBoxes.some(b=>boxOverlap(candidate,b,3)))continue;
   if(used.some(b=>boxOverlap(candidate,b,5)))continue;
   used.push(candidate);return candidate;
  }
 }
 const m=cubic(g,t0),v=tangent(g,t0),len=Math.hypot(v.x,v.y)||1,nx=-v.y/len,ny=v.x/len;
 const fallback={x:m.x+nx*baseOff-width/2,y:m.y+ny*baseOff-10,w:width,h:20,cx:m.x+nx*baseOff,cy:m.y+ny*baseOff};
 used.push(fallback);return fallback;
}

function connected(id){
 const set=new Set([id]);
 for(const e of edges){if(!edgeVisible(e))continue;if(e.from===id)set.add(e.to);if(e.to===id)set.add(e.from)}
 return set;
}
function renderPlanes(){
 planesLayer.innerHTML="";
 for(const pl of planes){
  if(activePlane!=="all"&&activePlane!==pl.id)continue;
  const g=x("g",{"data-plane":pl.id});
  g.appendChild(x("rect",{class:`plane plane-${pl.id}`,x:pl.x,y:pl.y,width:pl.w,height:pl.h,rx:18}));
  g.appendChild(txt(x("text",{class:`plane-title ${pl.id}`,x:pl.x+18,y:pl.y+24}),pl.label));
  g.appendChild(txt(x("text",{class:"plane-subtitle",x:pl.x+18,y:pl.y+42}),pl.subtitle));
  planesLayer.appendChild(g);
 }
}
function renderEdges(){
 edgesLayer.innerHTML="";labelsLayer.innerHTML="";handlesLayer.innerHTML="";
 const usedLabels=[];
 for(const e of edges){
  if(!edgeVisible(e))continue;
  const g=geom(e),focus=selected&&(e.from===selected||e.to===selected),dim=selected&&!focus;
  edgesLayer.appendChild(x("path",{class:`edge ${e.kind}${focus?" focused":""}${dim?" dimmed":""}`,d:`M${g.s.x} ${g.s.y} C${g.c1.x} ${g.c1.y} ${g.c2.x} ${g.c2.y} ${g.t.x} ${g.t.y}`,"data-edge-id":e.id}));
  if(e.label){
   const width=Math.max(76,e.label.length*5.7+18),lp=labelPosition(e,g,width,usedLabels),lg=x("g",{class:`edge-label-group${focus?" focused":""}${dim?" dimmed":""}`});
   lg.appendChild(x("rect",{class:"edge-label-bg",x:lp.x,y:lp.y,width:lp.w,height:lp.h,rx:10}));
   lg.appendChild(txt(x("text",{class:"edge-label",x:lp.cx,y:lp.cy+3.4}),e.label));
   labelsLayer.appendChild(lg);
  }
  if(mode==="design"){
   handlesLayer.appendChild(x("path",{class:"handle-guide",d:`M${g.s.x} ${g.s.y} L${g.c1.x} ${g.c1.y} M${g.t.x} ${g.t.y} L${g.c2.x} ${g.c2.y}`}));
   for(const[which,pt]of[["c1",g.c1],["c2",g.c2]])handlesLayer.appendChild(x("circle",{class:"edge-handle",cx:pt.x,cy:pt.y,r:5.8,"data-edge-id":e.id,"data-which":which}));
  }
 }
}
function nodeNote(n){
 if(n.status==="CANDIDATE")return"not canonical";
 if(n.id==="domain-truth")return"affected domain owns truth";
 if(n.id==="evidence")return"supports, does not own truth";
 if(n.id==="execution-surface")return"effect ≠ truth";
 return n.status.toLowerCase();
}
function renderNodes(){
 nodesLayer.innerHTML="";
 const conn=selected?connected(selected):null;
 for(const n of Object.values(nodes)){
  if(!visible(n))continue;
  const sel=selected===n.id,focus=conn?.has(n.id),dim=selected&&!focus;
  const g=x("g",{class:`node ${n.className}${sel?" selected":""}${focus?" focused":""}${dim?" dimmed":""}`,transform:`translate(${n.x} ${n.y})`,"data-node-id":n.id,tabindex:"0",role:"button","aria-label":n.name});
  g.appendChild(x("rect",{class:"box",width:n.w,height:n.h,rx:14}));
  g.appendChild(txt(x("text",{class:"node-kicker",x:n.w/2,y:23}),n.role));
  g.appendChild(txt(x("text",{class:"node-title",x:n.w/2,y:48}),n.name));
  g.appendChild(txt(x("text",{class:"node-note",x:n.w/2,y:67}),nodeNote(n)));
  if(n.status==="CANDIDATE"){
   const bw=70;g.appendChild(x("rect",{class:"candidate-badge",x:n.w-bw-8,y:7,width:bw,height:16,rx:8}));
   g.appendChild(txt(x("text",{class:"candidate-text",x:n.w-bw/2-8,y:18}),"CANDIDATE"));
  }
  nodesLayer.appendChild(g);
 }
}
function renderCard(){
 if(!selected||!nodes[selected]||!visible(nodes[selected])){infoCard.classList.remove("open");infoCard.innerHTML="";return}
 const n=nodes[selected],pl=planes.find(p=>p.id===n.plane);
 infoCard.innerHTML=`<div class="card-head"><div><div class="card-kind">${escapeHtml(n.role)}</div><h2>${escapeHtml(n.name)}</h2></div><button class="card-close" type="button" aria-label="Close">×</button></div>
 <div class="card-status${n.status==="CANDIDATE"?" candidate":""}">${escapeHtml(n.status==="CANDIDATE"?"CANDIDATE — NOT CANONICAL":n.status)}</div>
 <p class="card-summary">${escapeHtml(n.boundary)}</p>
 <div class="card-grid"><div class="card-cap"><b>PLANE</b><span>${escapeHtml(pl?.label||n.plane)}</span></div><div class="card-cap"><b>ROLE</b><span>${escapeHtml(n.role)}</span></div></div>`;
 infoCard.querySelector(".card-close")?.addEventListener("click",clearSelection);infoCard.classList.add("open");
}
function render(){if(selected&&!visible(nodes[selected]))selected=null;renderPlanes();renderEdges();renderNodes();renderCard()}
function select(id){selected=selected===id?null:id;render();setStatus(selected?`View · ${nodes[selected].name} seleccionat · relacions connectades destacades · Esc neteja`:baseStatus())}
function clearSelection(){selected=null;render();setStatus(baseStatus())}
function markDirty(){dirty=true;saveBtn.classList.remove("saved");saveBtn.textContent="Save layout";setStatus(baseStatus())}
function setMode(next){mode=next;document.body.dataset.mode=next;viewBtn.classList.toggle("active",next==="view");designBtn.classList.toggle("active",next==="design");nodeDrag=handleDrag=null;renderEdges();renderNodes();setStatus(baseStatus())}

function snapshot(){return{version:1,nodes:Object.fromEntries(Object.values(nodes).map(n=>[n.id,{x:n.x,y:n.y}])),edgeControls,view:{...view}}}
function save(){
 try{localStorage.setItem(STORAGE,JSON.stringify(snapshot()));dirty=false;saveBtn.classList.add("saved");saveBtn.textContent="Saved";setStatus("Layout guardat localment")}
 catch(_){setStatus("No s'ha pogut guardar el layout")}
}
function restore(){
 try{
  const raw=localStorage.getItem(STORAGE);if(!raw)return false;const s=JSON.parse(raw);if(s?.version!==1)return false;
  for(const[id,pos]of Object.entries(s.nodes||{}))if(nodes[id]&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)){nodes[id].x=pos.x;nodes[id].y=pos.y}
  edgeControls=s.edgeControls||{};
  if(s.view&&["x","y","w","h"].every(k=>Number.isFinite(s.view[k])))view={...s.view};
  saveBtn.classList.add("saved");saveBtn.textContent="Saved";return true;
 }catch(_){return false}
}
function reset(){
 for(const[id,pos]of Object.entries(initialNodes)){nodes[id].x=pos.x;nodes[id].y=pos.y}
 edgeControls={};selected=null;activePlane="all";try{localStorage.removeItem(STORAGE)}catch(_){}
 document.querySelectorAll(".filters button").forEach(b=>b.classList.toggle("active",b.dataset.plane==="all"));
 dirty=false;saveBtn.classList.remove("saved");saveBtn.textContent="Save layout";render();fit();setStatus("Layout inicial restaurat");
}
function fit(){
 const list=Object.values(nodes).filter(visible);if(!list.length)return;
 const minX=Math.min(...list.map(n=>n.x)),minY=Math.min(...list.map(n=>n.y)),maxX=Math.max(...list.map(n=>n.x+n.w)),maxY=Math.max(...list.map(n=>n.y+n.h)),m=90;
 let x0=minX-m,y0=minY-m,w=maxX-minX+2*m,h=maxY-minY+2*m;
 const r=svg.getBoundingClientRect(),aspect=Math.max(.2,r.width/Math.max(1,r.height)),ba=w/h;
 if(ba>aspect){const nh=w/aspect;y0-=(nh-h)/2;h=nh}else{const nw=h*aspect;x0-=(nw-w)/2;w=nw}
 view={x:x0,y:y0,w,h};applyView();
}
function zoom(factor,clientX=null,clientY=null){
 const r=svg.getBoundingClientRect(),cx=clientX??r.left+r.width/2,cy=clientY??r.top+r.height/2,pt=p(cx,cy);
 const nw=Math.max(420,Math.min(4200,view.w*factor)),nh=Math.max(260,Math.min(2600,view.h*factor)),rx=(pt.x-view.x)/view.w,ry=(pt.y-view.y)/view.h;
 view={x:pt.x-nw*rx,y:pt.y-nh*ry,w:nw,h:nh};applyView();
}
function edgeById(id){return edges.find(e=>e.id===id)}

svg.addEventListener("pointerdown",e=>{
 const h=e.target.closest?.(".edge-handle");
 if(h&&mode==="design"){
  e.preventDefault();e.stopPropagation();const edge=edgeById(h.dataset.edgeId);if(!edge)return;const g=geom(edge);
  handleDrag={edgeId:edge.id,which:h.dataset.which,pid:e.pointerId,base:h.dataset.which==="c1"?g.base1:g.base2};svg.setPointerCapture(e.pointerId);return;
 }
 const ng=e.target.closest?.(".node");
 if(ng){
  const id=ng.dataset.nodeId;
  if(mode==="design"){const pt=p(e.clientX,e.clientY);nodeDrag={id,pid:e.pointerId,dx:pt.x-nodes[id].x,dy:pt.y-nodes[id].y,sx:e.clientX,sy:e.clientY,moved:false};svg.setPointerCapture(e.pointerId)}
  return;
 }
 const pt=p(e.clientX,e.clientY);pan={pid:e.pointerId,x:pt.x,y:pt.y,vx:view.x,vy:view.y};svg.setPointerCapture(e.pointerId);
});
svg.addEventListener("pointermove",e=>{
 if(handleDrag&&e.pointerId===handleDrag.pid){
  const pt=p(e.clientX,e.clientY),ctl=edgeControls[handleDrag.edgeId]||(edgeControls[handleDrag.edgeId]={});
  if(handleDrag.which==="c1"){ctl.c1dx=pt.x-handleDrag.base.x;ctl.c1dy=pt.y-handleDrag.base.y}else{ctl.c2dx=pt.x-handleDrag.base.x;ctl.c2dy=pt.y-handleDrag.base.y}
  markDirty();renderEdges();return;
 }
 if(nodeDrag&&e.pointerId===nodeDrag.pid){
  const pt=p(e.clientX,e.clientY),n=nodes[nodeDrag.id];n.x=pt.x-nodeDrag.dx;n.y=pt.y-nodeDrag.dy;
  if(Math.hypot(e.clientX-nodeDrag.sx,e.clientY-nodeDrag.sy)>3)nodeDrag.moved=true;
  markDirty();renderEdges();renderNodes();return;
 }
 if(pan&&e.pointerId===pan.pid){const pt=p(e.clientX,e.clientY);view.x=pan.vx-(pt.x-pan.x);view.y=pan.vy-(pt.y-pan.y);applyView()}
});
svg.addEventListener("pointerup",e=>{
 if(handleDrag&&e.pointerId===handleDrag.pid){handleDrag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){};renderEdges();return}
 if(nodeDrag&&e.pointerId===nodeDrag.pid){const d=nodeDrag;nodeDrag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){};if(!d.moved)select(d.id);return}
 if(pan&&e.pointerId===pan.pid){pan=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}}
});
svg.addEventListener("pointercancel",()=>{nodeDrag=pan=handleDrag=null});
svg.addEventListener("click",e=>{
 const ng=e.target.closest?.(".node");
 if(ng&&mode==="view"){e.stopPropagation();select(ng.dataset.nodeId);return}
 if(!ng&&!e.target.closest?.(".edge-handle")&&selected)clearSelection();
});
svg.addEventListener("keydown",e=>{const ng=e.target.closest?.(".node");if(ng&&(e.key==="Enter"||e.key===" ")){e.preventDefault();select(ng.dataset.nodeId)}});
svg.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY>0?1.1:.9,e.clientX,e.clientY)},{passive:false});

document.getElementById("zoom-in")?.addEventListener("click",()=>zoom(.88));
document.getElementById("zoom-out")?.addEventListener("click",()=>zoom(1.14));
document.getElementById("fit")?.addEventListener("click",fit);
document.getElementById("save-layout")?.addEventListener("click",save);
document.getElementById("reset-layout")?.addEventListener("click",reset);
viewBtn?.addEventListener("click",()=>setMode("view"));
designBtn?.addEventListener("click",()=>setMode("design"));
document.querySelectorAll(".filters button").forEach(b=>b.addEventListener("click",()=>{
 activePlane=b.dataset.plane||"all";document.querySelectorAll(".filters button").forEach(q=>q.classList.toggle("active",q===b));selected=null;render();fit();setStatus(`${b.textContent.trim()} · ${mode==="design"?"Design":"View"}`)
}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&selected)clearSelection()});

const restored=restore();applyView();render();setMode("view");if(!restored)requestAnimationFrame(fit);
})();
