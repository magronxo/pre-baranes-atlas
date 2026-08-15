(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),zones=document.getElementById('zones'),saveBtn=document.getElementById('save'),status=document.getElementById('status');
if(!svg||!nodes||!zones)return;
const NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:repoops-flow:primitives:v1';
const style=document.createElement('style');style.textContent=`
.primitive-chip{cursor:move}.primitive-chip .drag-hit{fill:transparent;pointer-events:all}.primitive-chip .primitive-text{fill:#ffe34d;font-size:9.6px;font-weight:900;letter-spacing:.15px;text-anchor:start;dominant-baseline:middle;paint-order:stroke;stroke:#5a4300;stroke-width:.65px;stroke-linejoin:round;pointer-events:none}.primitive-chip .primitive-shield{fill:#ffd600;stroke:#fff3a3;stroke-width:.9;pointer-events:none;filter:drop-shadow(0 0 3px rgba(255,220,0,.42))}.identity-trace-bg{fill:#111827;fill-opacity:.94;stroke:#d99b08;stroke-width:1.35}.identity-trace-title{fill:#ffe875;font-size:10.3px;font-weight:900;letter-spacing:1.05px}.identity-trace-item{fill:#fff2a8;font-size:10.9px;font-weight:800;text-anchor:middle}.identity-trace-arrow{fill:#ffd84d;font-size:13px;font-weight:850;text-anchor:middle}.recovery-note{fill:#ffe34d;font-size:7.5px;font-weight:800;letter-spacing:.5px;pointer-events:none}body[data-mode="view"] .primitive-chip{cursor:default}body[data-mode="view"] .primitive-chip .drag-hit{pointer-events:none}
`;document.head.appendChild(style);
function E(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
const layer=E('g',{id:'repoops-primitives'}),traceLayer=E('g',{id:'repoops-identity-trace','pointer-events':'none'});svg.appendChild(layer);svg.appendChild(traceLayer);
function T(g){const m=(g?.getAttribute('transform')||'').match(/translate\(\s*([-+\d.eE]+)[ ,]+([-+\d.eE]+)\s*\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}}
function B(id){const g=nodes.querySelector(`[data-id="${id}"]`);if(!g)return null;const r=g.querySelector('.box'),t=T(g);if(!r)return null;return{x:t.x,y:t.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}}
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){}
function pos(id,x,y){const p=saved[id];return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?p:{x,y}}
function shield(g){g.appendChild(E('path',{class:'primitive-shield',d:'M8 1.5L14 3.8V8.2C14 12 11.6 15.1 8 17.2C4.4 15.1 2 12 2 8.2V3.8Z',transform:'translate(0 1) scale(.72)'}))}
function primitive(id,x,y,w,label){const p=pos(id,x,y),g=E('g',{class:'primitive-chip','data-primitive':id,transform:`translate(${p.x} ${p.y})`});g.appendChild(E('rect',{class:'drag-hit',x:-4,y:-5,width:w,height:27,rx:6}));shield(g);const t=E('text',{class:'primitive-text',x:16,y:8.5});t.textContent=label;g.appendChild(t);layer.appendChild(g);return{id,x:p.x,y:p.y,w,h:18}}
function note(x,y,text){const t=E('text',{class:'recovery-note',x,y});t.textContent=text;layer.appendChild(t)}
function renderPrimitives(){
 layer.innerHTML='';const helper=B('helper'),job=B('job'),queue=B('queue'),runner=B('runner');if(!helper||!job||!queue||!runner)return;
 primitive('admission',helper.x-34,helper.y-76,304,'PolicyQuery → PolicyDecision → ApprovalRecord');
 primitive('capability',job.x-16,job.y-45,160,'ExecutionCapability');
 primitive('reservation',queue.x-2,queue.y-78,170,'CapabilityReservation');
 primitive('request',runner.x-26,runner.y-48,146,'ExecutionRequest');
 primitive('consumption',runner.x+136,runner.y-48,178,'CapabilityConsumption');
 primitive('results',runner.x+328,runner.y-48,232,'ExecutionResult → EvidenceEnvelope');
 const recovery=primitive('recovery',runner.x+runner.w+42,runner.y+50,140,'RecoveryState');note(recovery.x,recovery.y-7,'FAIL / UNKNOWN EFFECT');
}
function renderTrace(){traceLayer.innerHTML='';const engine=zones.querySelector('.zone-engine');if(!engine)return;const x=205,w=1400,y=1041,h=46;traceLayer.appendChild(E('rect',{class:'identity-trace-bg',x,y,width:w,height:h,rx:12}));let t=E('text',{class:'identity-trace-title',x:x+16,y:y+17});t.textContent='IDENTITY TRACE';traceLayer.appendChild(t);const items=['job_id','transaction_id','capability_id','reservation_id','attempt_id','candidate_id','commit_sha'],start=x+165,end=x+w-32,step=(end-start)/(items.length-1);items.forEach((it,i)=>{const px=start+i*step,q=E('text',{class:'identity-trace-item',x:px,y:y+32});q.textContent=it;traceLayer.appendChild(q);if(i<items.length-1){const a=E('text',{class:'identity-trace-arrow',x:px+step/2,y:y+32});a.textContent='→';traceLayer.appendChild(a)}})}
function P(e){const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}}
let drag=null,raf=0;function dirty(){saveBtn?.classList.remove('saved');if(saveBtn)saveBtn.textContent='Save layout';if(status)status.textContent='Primitive moguda · Save layout per conservar-la'}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;renderPrimitives();renderTrace()})}
window.addEventListener('pointerdown',e=>{if(document.body.dataset.mode!=='design')return;const g=e.target.closest?.('.primitive-chip');if(!g)return;e.preventDefault();e.stopImmediatePropagation();const id=g.dataset.primitive,p=P(e),m=(g.getAttribute('transform')||'').match(/translate\(\s*([-+\d.eE]+)[ ,]+([-+\d.eE]+)\s*\)/),x=m?+m[1]:p.x,y=m?+m[2]:p.y;drag={id,pid:e.pointerId,dx:p.x-x,dy:p.y-y};try{svg.setPointerCapture(e.pointerId)}catch(_){}},true);
svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e);saved[drag.id]={x:p.x-drag.dx,y:p.y-drag.dy};renderPrimitives();dirty()},true);
function end(e){if(drag&&e.pointerId===drag.pid){drag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}}}
svg.addEventListener('pointerup',end,true);svg.addEventListener('pointercancel',end,true);
saveBtn?.addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_){} });
new MutationObserver(schedule).observe(nodes,{subtree:true,attributes:true,attributeFilter:['transform']});new MutationObserver(schedule).observe(zones,{childList:true,subtree:true});window.addEventListener('load',schedule,{once:true});schedule();
})();