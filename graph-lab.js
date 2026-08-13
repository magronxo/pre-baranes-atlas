(()=>{
const svg=document.getElementById('g'),CL=document.getElementById('containers'),NL=document.getElementById('nodes'),EL=document.getElementById('edges'),LL=document.getElementById('labels'),status=document.getElementById('status'),saveBtn=document.getElementById('save'),W=190,H=82,NS='http://www.w3.org/2000/svg',STORAGE='pre-baranes-atlas:graph-lab-layout:v1';

const ini={
  oriol:{x:70,y:300,w:W,h:H},
  chatgpt:{x:365,y:135,w:W,h:H},
  telegram:{x:285,y:430,w:240,h:150},
  prebaranes:{x:640,y:250,w:780,h:560}
};
const n={
  oriol:{...ini.oriol,name:'Oriol',kind:'OWNER / PROJECT MANAGER',cls:'owner'},
  chatgpt:{...ini.chatgpt,name:'ChatGPT / Master',kind:'MASTER',cls:'master'},
  telegram:{...ini.telegram,name:'Telegram',kind:'INTERFACE / CHANNEL',cls:'channel'},
  prebaranes:{...ini.prebaranes,name:'PRE-BARANES',kind:'SYSTEM CONTAINER',resizable:true}
};
const initialModules={
  radar:{x:22,y:78,w:238,h:156},
  routing:{x:310,y:76,w:260,h:141},
  inbox:{x:310,y:258,w:190,h:78},
  research:{x:22,y:300,w:190,h:78},
  knowledge:{x:280,y:405,w:220,h:78}
};
const modules={};
for(const id in initialModules) modules[id]={...initialModules[id]};

const e=[
  {s:'oriol',t:'chatgpt',l:'intent / decisions',b:-35},
  {s:'telegram',t:'oriol',l:'attention / delivery',b:35},
  {s:'telegram',sp:'radar',t:'prebaranes',tp:'personal',l:'personal radar',b:18,cls:'radaredge'},
  {s:'telegram',sp:'architect',t:'prebaranes',tp:'routing',l:'architect channel',b:30,cls:'routingedge'},
  {s:'chatgpt',t:'prebaranes',tp:'inbox',l:'inbox',b:12,cls:'inboxedge'},
  {s:'prebaranes',sp:'inbox',t:'prebaranes',tp:'routing',l:'dispatch',b:-22,cls:'inboxedge'},
  {s:'prebaranes',sp:'routing',t:'prebaranes',tp:'research',l:'research',b:24,cls:'researchedge'},
  {s:'prebaranes',sp:'research',t:'prebaranes',tp:'knowledge',l:'knowledge',b:-18,cls:'knowledgeedge'}
];

let view={x:0,y:0,w:1400,h:820},drag=null,moduleDrag=null,pan=null,resize=null;

function x(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}

function modulePort(name){
  const c=n.prebaranes,m=modules[name];
  if(name==='routing') return{x:c.x+m.x+m.w/2,y:c.y+m.y+46,hw:m.w/2,hh:46};
  return{x:c.x+m.x+m.w/2,y:c.y+m.y+m.h/2,hw:m.w/2,hh:m.h/2};
}
function portInfo(id,port){
  if(id==='telegram'){
    const o=n.telegram;
    if(port==='architect') return{x:o.x+66,y:o.y+101,hw:52,hh:29};
    if(port==='radar') return{x:o.x+174,y:o.y+101,hw:52,hh:29};
    return{x:o.x+o.w/2,y:o.y+o.h/2,hw:o.w/2,hh:o.h/2};
  }
  if(id==='prebaranes'){
    const c=n.prebaranes;
    if(port==='personal'){const m=modules.radar;return{x:c.x+m.x+61,y:c.y+m.y+87,hw:51,hh:35};}
    if(port==='routing') return modulePort('routing');
    if(port==='inbox') return modulePort('inbox');
    if(port==='research') return modulePort('research');
    if(port==='knowledge') return modulePort('knowledge');
  }
  const o=n[id];
  return{x:o.x+o.w/2,y:o.y+o.h/2,hw:o.w/2,hh:o.h/2};
}
function boundary(P,ux,uy,outward){
  const den=Math.max(Math.abs(ux)/(P.hw||1),Math.abs(uy)/(P.hh||1),.0001);
  const r=1/den;
  return{x:P.x+(outward?1:-1)*ux*r,y:P.y+(outward?1:-1)*uy*r};
}
function geom(z){
  const A=portInfo(z.s,z.sp),B=portInfo(z.t,z.tp),dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy)||1;
  const ux=dx/len,uy=dy/len,nx=-uy,ny=ux,S=boundary(A,ux,uy,true),T=boundary(B,ux,uy,false);
  const cx=(S.x+T.x)/2+nx*z.b,cy=(S.y+T.y)/2+ny*z.b;
  return{d:`M${S.x} ${S.y}Q${cx} ${cy} ${T.x} ${T.y}`,lx:(S.x+2*cx+T.x)/4,ly:(S.y+2*cy+T.y)/4};
}
function clampModule(name){
  const c=n.prebaranes,m=modules[name],pad=18,top=66;
  m.x=Math.max(pad,Math.min(m.x,c.w-m.w-pad));
  m.y=Math.max(top,Math.min(m.y,c.h-m.h-pad));
}

function renderTelegram(){
  const o=n.telegram,g=x('g',{class:'node channel','data-id':'telegram',transform:`translate(${o.x} ${o.y})`});
  g.appendChild(x('rect',{width:o.w,height:o.h,rx:16}));
  let t=x('text',{class:'telegram-kind',x:o.w/2,y:23});t.textContent='INTERFACE / CHANNEL';g.appendChild(t);
  t=x('text',{class:'telegram-title',x:o.w/2,y:48});t.textContent='Telegram';g.appendChild(t);
  for(const [dx,label] of [[14,'Architect'],[122,'Radar']]){
    const s=x('g',{class:'subbox',transform:`translate(${dx} 72)`});
    s.appendChild(x('rect',{width:104,height:58,rx:10}));
    const tt=x('text',{x:52,y:35});tt.textContent=label;s.appendChild(tt);g.appendChild(s);
  }
  NL.appendChild(g);
}
function renderContainer(){
  const o=n.prebaranes;
  const sh=x('g',{transform:`translate(${o.x} ${o.y})`});
  sh.appendChild(x('rect',{class:'container-shell',width:o.w,height:o.h,rx:18}));
  CL.appendChild(sh);
  const g=x('g',{class:'container-node','data-id':'prebaranes',transform:`translate(${o.x} ${o.y})`});
  g.appendChild(x('rect',{class:'container-hitbox',width:o.w,height:o.h,rx:18}));
  let t=x('text',{class:'container-kind',x:18,y:24});t.textContent='SYSTEM CONTAINER';g.appendChild(t);
  t=x('text',{class:'container-title',x:18,y:48});t.textContent='PRE-BARANES';g.appendChild(t);
  const rh=x('g',{class:'resize-handle',transform:`translate(${o.w-27} ${o.h-27})`});
  rh.appendChild(x('rect',{width:20,height:20,rx:5}));
  rh.appendChild(x('line',{x1:7,y1:15,x2:15,y2:7}));
  rh.appendChild(x('line',{x1:11,y1:15,x2:15,y2:11}));
  g.appendChild(rh);NL.appendChild(g);
}
function moduleGroup(name,cls){
  const m=modules[name],c=n.prebaranes;
  return x('g',{class:`module ${cls}`,'data-module':name,transform:`translate(${c.x+m.x} ${c.y+m.y})`});
}
function renderRadar(){
  const m=modules.radar,g=moduleGroup('radar','radar-module');
  g.appendChild(x('rect',{width:m.w,height:m.h,rx:14,fill:'#1e293b',stroke:'#64748b','stroke-width':1.5}));
  let t=x('text',{class:'radar-title',x:m.w/2,y:28});t.textContent='Radar';g.appendChild(t);
  for(const [dx,label,cl] of [[10,'Personal','radar-personal'],[126,'Intelligence','radar-intelligence']]){
    const s=x('g',{class:`radar-sub ${cl}`,transform:`translate(${dx} 52)`});
    s.appendChild(x('rect',{width:102,height:70,rx:10}));
    t=x('text',{x:51,y:42});t.textContent=label;s.appendChild(t);g.appendChild(s);
  }
  NL.appendChild(g);
}
function renderRouting(){
  const m=modules.routing,g=moduleGroup('routing','routing-module'),coreH=92,modelW=154,modelH=50,modelX=(m.w-modelW)/2,modelY=91;
  g.appendChild(x('rect',{class:'routing-core',width:m.w,height:coreH,rx:13}));
  let t=x('text',{class:'routing-kicker',x:m.w/2,y:30});t.textContent='ROUTING / ORCHESTRATION';g.appendChild(t);
  t=x('text',{class:'routing-name',x:m.w/2,y:61});t.textContent='ARCHITECT';g.appendChild(t);
  g.appendChild(x('rect',{class:'model-attached',x:modelX,y:modelY,width:modelW,height:modelH,rx:10}));
  g.appendChild(x('line',{class:'join-line',x1:modelX+10,y1:modelY,x2:modelX+modelW-10,y2:modelY}));
  t=x('text',{class:'model-text',x:m.w/2,y:modelY+31});t.textContent='Model Recommend';g.appendChild(t);
  NL.appendChild(g);
}
function renderSimple(name,boxCls,kCls,nCls,kicker,label){
  const m=modules[name],g=moduleGroup(name,`${name}-module`);
  g.appendChild(x('rect',{class:boxCls,width:m.w,height:m.h,rx:12}));
  let t=x('text',{class:kCls,x:m.w/2,y:25});t.textContent=kicker;g.appendChild(t);
  t=x('text',{class:nCls,x:m.w/2,y:52});t.textContent=label;g.appendChild(t);
  NL.appendChild(g);
}
function renderEdges(){
  EL.innerHTML=LL.innerHTML='';
  for(const z of e){
    const m=geom(z),p=x('path',{class:`edge${z.cls?' '+z.cls:''}`,d:m.d});
    const mk={radaredge:'arrowCyan',routingedge:'arrowViolet',inboxedge:'arrowAmber',researchedge:'arrowPink',knowledgeedge:'arrowBlue'}[z.cls];
    if(mk)p.setAttribute('marker-end',`url(#${mk})`);
    EL.appendChild(p);
    if(z.l){
      const ww=Math.max(82,z.l.length*6.4+18);
      const pc={radaredge:' radar-pill',routingedge:' routing-pill',inboxedge:' inbox-pill',researchedge:' research-pill',knowledgeedge:' knowledge-pill'}[z.cls]||'';
      LL.appendChild(x('rect',{class:`pill${pc}`,x:m.lx-ww/2,y:m.ly-10,width:ww,height:20,rx:10}));
      const tt=x('text',{class:'elabel',x:m.lx,y:m.ly+4});tt.textContent=z.l;LL.appendChild(tt);
    }
  }
}
function render(){
  CL.innerHTML=NL.innerHTML='';
  renderContainer();
  for(const id of ['oriol','chatgpt']){
    const o=n[id],g=x('g',{class:`node ${o.cls}`,'data-id':id,transform:`translate(${o.x} ${o.y})`});
    g.appendChild(x('rect',{width:o.w,height:o.h,rx:16}));
    let t=x('text',{class:'kind',x:o.w/2,y:27});t.textContent=o.kind;g.appendChild(t);
    t=x('text',{class:'name',x:o.w/2,y:55});t.textContent=o.name;g.appendChild(t);NL.appendChild(g);
  }
  renderTelegram();renderRadar();renderRouting();
  renderSimple('inbox','inbox-box','inbox-kicker','inbox-name','ENTRY / HANDOFF','Inbox');
  renderSimple('research','research-box','research-kicker','research-name','AGENT','Research Agent');
  renderSimple('knowledge','knowledge-box','knowledge-kicker','knowledge-name','DATA / CONTEXT','Knowledge Database');
  renderEdges();
}
function p(cx,cy){const r=svg.getBoundingClientRect();return{x:view.x+(cx-r.left)/r.width*view.w,y:view.y+(cy-r.top)/r.height*view.h};}
function apply(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);}
function fitAll(){const vals=Object.values(n),m=80,minX=Math.min(...vals.map(o=>o.x))-m,minY=Math.min(...vals.map(o=>o.y))-m,maxX=Math.max(...vals.map(o=>o.x+o.w))+m,maxY=Math.max(...vals.map(o=>o.y+o.h))+m;view={x:minX,y:minY,w:maxX-minX,h:maxY-minY};apply();}
function dirty(){saveBtn.classList.remove('saved');saveBtn.textContent='Save layout';status.textContent='Layout modificat · prem Save layout per conservar-lo';}
function snap(){const nodes={},mods={};for(const id in n)nodes[id]={x:n[id].x,y:n[id].y,w:n[id].w,h:n[id].h};for(const id in modules)mods[id]={x:modules[id].x,y:modules[id].y};return{version:3,nodes,modules:mods,view:{...view}};}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(snap()));saveBtn.classList.add('saved');saveBtn.textContent='Saved';status.textContent='Layout guardat';}catch(e){status.textContent='No s’ha pogut guardar';}}
function restore(){try{const raw=localStorage.getItem(STORAGE);if(!raw)return false;const d=JSON.parse(raw);if(!d.nodes)return false;for(const id in n){const s=d.nodes[id]||(id==='prebaranes'?d.nodes.baranes:null);if(!s)continue;if(Number.isFinite(s.x))n[id].x=s.x;if(Number.isFinite(s.y))n[id].y=s.y;if(n[id].resizable&&Number.isFinite(s.w)&&Number.isFinite(s.h)){n[id].w=Math.max(780,s.w);n[id].h=Math.max(520,s.h);}}if(d.modules)for(const id in modules){const s=d.modules[id];if(s&&Number.isFinite(s.x)&&Number.isFinite(s.y)){modules[id].x=s.x;modules[id].y=s.y;clampModule(id);}}if(d.view&&['x','y','w','h'].every(k=>Number.isFinite(d.view[k])))view={...d.view};saveBtn.classList.add('saved');saveBtn.textContent='Saved';status.textContent='Layout guardat restaurat';return true;}catch(e){return false;}}
svg.addEventListener('pointerdown',q=>{const h=q.target.closest('.resize-handle');if(h){const P=p(q.clientX,q.clientY);resize={x:P.x,y:P.y,w:n.prebaranes.w,h:n.prebaranes.h};svg.setPointerCapture(q.pointerId);return;}const mg=q.target.closest('.module');if(mg){const P=p(q.clientX,q.clientY),id=mg.dataset.module,m=modules[id];moduleDrag={id,dx:P.x-(n.prebaranes.x+m.x),dy:P.y-(n.prebaranes.y+m.y)};svg.setPointerCapture(q.pointerId);return;}const cg=q.target.closest('.container-node');if(cg){const P=p(q.clientX,q.clientY);drag={id:'prebaranes',dx:P.x-n.prebaranes.x,dy:P.y-n.prebaranes.y};svg.setPointerCapture(q.pointerId);return;}const g=q.target.closest('.node');if(g){const P=p(q.clientX,q.clientY),id=g.dataset.id;drag={id,dx:P.x-n[id].x,dy:P.y-n[id].y};svg.setPointerCapture(q.pointerId);}else{pan={x:q.clientX,y:q.clientY,vx:view.x,vy:view.y};svg.setPointerCapture(q.pointerId);}});
svg.addEventListener('pointermove',q=>{if(resize){const P=p(q.clientX,q.clientY);n.prebaranes.w=Math.min(1400,Math.max(780,resize.w+P.x-resize.x));n.prebaranes.h=Math.min(1000,Math.max(520,resize.h+P.y-resize.y));for(const id in modules)clampModule(id);render();dirty();}else if(moduleDrag){const P=p(q.clientX,q.clientY),m=modules[moduleDrag.id];m.x=P.x-n.prebaranes.x-moduleDrag.dx;m.y=P.y-n.prebaranes.y-moduleDrag.dy;clampModule(moduleDrag.id);render();dirty();}else if(drag){const P=p(q.clientX,q.clientY);n[drag.id].x=P.x-drag.dx;n[drag.id].y=P.y-drag.dy;render();dirty();}else if(pan){const r=svg.getBoundingClientRect();view.x=pan.vx-(q.clientX-pan.x)/r.width*view.w;view.y=pan.vy-(q.clientY-pan.y)/r.height*view.h;apply();dirty();}});
svg.addEventListener('pointerup',()=>{drag=moduleDrag=pan=resize=null;});svg.addEventListener('pointercancel',()=>{drag=moduleDrag=pan=resize=null;});
svg.addEventListener('wheel',q=>{q.preventDefault();const P=p(q.clientX,q.clientY),ratio=view.h/view.w,f=q.deltaY>0?1.1:.9,nw=Math.min(2800,Math.max(500,view.w*f)),nh=nw*ratio,rx=(P.x-view.x)/view.w,ry=(P.y-view.y)/view.h;view.x=P.x-rx*nw;view.y=P.y-ry*nh;view.w=nw;view.h=nh;apply();dirty();},{passive:false});
saveBtn.addEventListener('click',save);document.getElementById('fit').addEventListener('click',()=>{fitAll();dirty();});document.getElementById('reset').addEventListener('click',()=>{for(const id in n)Object.assign(n[id],ini[id]);for(const id in modules)Object.assign(modules[id],initialModules[id]);try{localStorage.removeItem(STORAGE);}catch(e){}saveBtn.classList.remove('saved');saveBtn.textContent='Save layout';fitAll();render();status.textContent='Layout inicial restaurat';});
const restored=restore();if(!restored)fitAll();apply();render();
})();