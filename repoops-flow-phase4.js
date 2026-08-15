(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),zones=document.getElementById('zones');
if(!svg||!nodes||!zones)return;
const NS='http://www.w3.org/2000/svg';
const style=document.createElement('style');style.textContent=`
.primitive-chip rect{fill:#3f2c05;fill-opacity:.96;stroke:#facc15;stroke-width:1.35;rx:8}.primitive-chip text{fill:#fef3c7;font-size:8.7px;font-weight:800;text-anchor:middle;dominant-baseline:middle;pointer-events:none}.primitive-chip .shield{font-size:10px}.primitive-link{fill:none;stroke:#facc15;stroke-width:1.1;stroke-dasharray:4 4;opacity:.62;pointer-events:none}.primitive-group-label{fill:#fde68a;font-size:8px;font-weight:850;letter-spacing:.9px;pointer-events:none}.identity-trace-bg{fill:#111827;fill-opacity:.9;stroke:#a16207;stroke-width:1.1}.identity-trace-title{fill:#fde68a;font-size:8.3px;font-weight:850;letter-spacing:1px}.identity-trace-item{fill:#fef3c7;font-size:8.5px;font-weight:700;text-anchor:middle}.identity-trace-arrow{fill:#d6b861;font-size:10px;text-anchor:middle}.recovery-note{fill:#fbbf24;font-size:7.7px;font-weight:700;letter-spacing:.5px;pointer-events:none}
`;document.head.appendChild(style);
function E(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
const layer=E('g',{id:'repoops-primitives'}),traceLayer=E('g',{id:'repoops-identity-trace'});
svg.appendChild(layer);svg.appendChild(traceLayer);
function T(g){const m=(g?.getAttribute('transform')||'').match(/translate\(\s*([-+\d.eE]+)[ ,]+([-+\d.eE]+)\s*\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}}
function B(id){const g=nodes.querySelector(`[data-id="${id}"]`);if(!g)return null;const r=g.querySelector('.box'),t=T(g);if(!r)return null;return{x:t.x,y:t.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}}
function chip(x,y,w,label){const g=E('g',{class:'primitive-chip',transform:`translate(${x} ${y})`});g.appendChild(E('rect',{width:w,height:25,rx:8}));let t=E('text',{x:15,y:12.8,class:'shield'});t.textContent='🛡';g.appendChild(t);t=E('text',{x:(w+16)/2,y:12.8});t.textContent=label;g.appendChild(t);layer.appendChild(g);return{x,y,w,h:25}}
function link(a,b){if(!a||!b)return;const sx=a.x+a.w/2,sy=a.y+a.h,tx=b.x+b.w/2,ty=b.y;layer.insertBefore(E('path',{class:'primitive-link',d:`M${sx} ${sy}C${sx} ${sy+10} ${tx} ${ty-10} ${tx} ${ty}`}),layer.firstChild)}
function label(x,y,text){const t=E('text',{class:'primitive-group-label',x,y});t.textContent=text;layer.appendChild(t)}
function renderPrimitives(){layer.innerHTML='';const helper=B('helper'),job=B('job'),queue=B('queue'),runner=B('runner');if(!helper||!job||!queue||!runner)return;
 // Admission / authority primitives: a compact stack over repoops-helper.
 const hY=helper.y-104;label(helper.x-2,hY-9,'GOVERNANCE PRIMITIVES');
 const pq=chip(helper.x-6,hY,136,'PolicyQuery');
 const pd=chip(helper.x+136,hY,146,'PolicyDecision');
 const ar=chip(helper.x+62,hY+32,150,'ApprovalRecord');
 link(ar,{x:helper.x,y:helper.y-1,w:helper.w,h:1});
 // Execution request + executable grant sit directly over the durable Job envelope.
 const jY=job.y-72;
 const erq=chip(job.x-12,jY,146,'ExecutionRequest');
 const cap=chip(job.x+140,jY,166,'ExecutionCapability');
 link(erq,{x:job.x,y:job.y-1,w:job.w,h:1});
 link(cap,{x:job.x,y:job.y-1,w:job.w,h:1});
 // Queue owns the reservation point.
 const res=chip(queue.x+8,queue.y-43,166,'CapabilityReservation');
 link(res,{x:queue.x,y:queue.y-1,w:queue.w,h:1});
 // Runner consumes the capability and emits execution-side records.
 const rY=runner.y-74;
 const cons=chip(runner.x-18,rY,174,'CapabilityConsumption');
 const result=chip(runner.x+164,rY,142,'ExecutionResult');
 const evidence=chip(runner.x+314,rY,150,'EvidenceEnvelope');
 link(cons,{x:runner.x,y:runner.y-1,w:runner.w,h:1});
 link(result,{x:runner.x,y:runner.y-1,w:runner.w,h:1});
 link(evidence,{x:runner.x,y:runner.y-1,w:runner.w,h:1});
 // RecoveryState is deliberately off the happy path.
 const recovery=chip(runner.x+runner.w+38,runner.y+48,142,'RecoveryState');
 layer.insertBefore(E('path',{class:'primitive-link',d:`M${runner.x+runner.w} ${runner.y+runner.h*.66}C${runner.x+runner.w+18} ${runner.y+runner.h*.66} ${recovery.x-18} ${recovery.y+12} ${recovery.x} ${recovery.y+12}`}),layer.firstChild);
 const rt=E('text',{class:'recovery-note',x:recovery.x,y:recovery.y-7});rt.textContent='FAIL / UNKNOWN EFFECT';layer.appendChild(rt);
}
function renderTrace(){traceLayer.innerHTML='';const engine=zones.querySelector('.zone-engine');if(!engine)return;const x=210,w=1390,y=1067,h=38;traceLayer.appendChild(E('rect',{class:'identity-trace-bg',x,y,width:w,height:h,rx:12}));let t=E('text',{class:'identity-trace-title',x:x+16,y:y+14});t.textContent='IDENTITY TRACE';traceLayer.appendChild(t);
 const items=['job_id','transaction_id','capability_id','reservation_id','attempt_id','candidate_id','commit_sha'];const start=x+155,end=x+w-30,step=(end-start)/(items.length-1);items.forEach((it,i)=>{const px=start+i*step;const q=E('text',{class:'identity-trace-item',x:px,y:y+25});q.textContent=it;traceLayer.appendChild(q);if(i<items.length-1){const a=E('text',{class:'identity-trace-arrow',x:px+step/2,y:y+25});a.textContent='→';traceLayer.appendChild(a)}});
}
let raf=0;function render(){renderPrimitives();renderTrace()}function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
new MutationObserver(schedule).observe(nodes,{subtree:true,attributes:true,attributeFilter:['transform']});
new MutationObserver(schedule).observe(zones,{childList:true,subtree:true});
window.addEventListener('load',schedule,{once:true});schedule();
})();