(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),labels=document.getElementById('labels'),save=document.getElementById('save'),status=document.getElementById('status'),NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:global-agents:v2';
if(!svg||!nodes||!edges||!labels)return;
let layer=document.getElementById('agent-nodes');if(!layer){layer=document.createElementNS(NS,'g');layer.id='agent-nodes';edges.parentNode.insertBefore(layer,edges)}
const IDS=['architect','research','writer','curator','qa'];let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){state={}}
let drag=null,syncQueued=false;
const P=e=>{const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}};
const T=g=>{const m=(g?.getAttribute('transform')||'').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}};
const E=(tag,a={})=>{const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q};
function pre(){const g=nodes.querySelector('.container-node[data-id="prebaranes"]'),p=T(g);return g?{g,x:p.x,y:p.y}:null}
function source(id){if(id==='architect')return nodes.querySelector('.routing-module');if(id==='research')return nodes.querySelector('.research-module');if(id==='writer')return nodes.querySelector('.writer-module');return nodes.querySelector(`[data-delivery-id="${id}"]:not([data-global-slot])`)}
function global(id){return layer.querySelector(`[data-global-agent="${id}"]`)}
function absPos(g){let x=0,y=0,p=g;while(p&&p!==svg){const q=T(p);x+=q.x;y+=q.y;p=p.parentNode}return{x,y}}
function size(g){const r=g?.querySelector('rect');return r?{w:+r.getAttribute('width'),h:+r.getAttribute('height')}:{w:190,h:78}}
function defaults(){const c=pre()||{x:640,y:250};return{architect:{x:c.x-300,y:c.y+10},research:{x:c.x-300,y:c.y+135},writer:{x:c.x-300,y:c.y+240},curator:{x:c.x-300,y:c.y+345},qa:{x:c.x-300,y:c.y+450}}}
function ensureState(id,g){if(Number.isFinite(state[id]?.x)&&Number.isFinite(state[id]?.y))return;const d=defaults()[id],s=size(g);state[id]={x:d.x,y:d.y,w:s.w,h:s.h}}
function migrate(id){let g=global(id);if(!g){g=source(id);if(!g)return null;ensureState(id,g);g.classList.remove('module','atlas-external-owned');g.dataset.globalAgent=id;layer.appendChild(g)}else ensureState(id,g);g.style.cursor=document.body.dataset.atlasMode==='view'?'pointer':'move';g.setAttribute('transform',`translate(${state[id].x} ${state[id].y})`);return g}
function removeDuplicates(id,keep){let sel=id==='architect'?'.routing-module':id==='research'?'.research-module':id==='writer'?'.writer-module':`[data-delivery-id="${id}"]:not([data-global-slot])`;nodes.querySelectorAll(sel).forEach(g=>{if(g!==keep)g.remove()})}
function ensureLegacySlots(){const c=pre()?.g;if(!c)return;for(const id of ['curator','qa']){if(c.querySelector(`[data-global-slot="${id}"]`))continue;const s=E('g',{'data-delivery-id':id,'data-global-slot':id,visibility:'hidden','pointer-events':'none'});c.appendChild(s)}}
function box(g,rectSel){if(!g)return null;const p=absPos(g),r=rectSel?g.querySelector(rectSel):g.querySelector('rect');return r?{x:p.x,y:p.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,d=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*d,y:cy+(out?1:-1)*uy*d}}
function geom(a,b,bend=0){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),Z=boundary(b,ux,uy,false),cx=(S.x+Z.x)/2+nx*bend,cy=(S.y+Z.y)/2+ny*bend;return{d:`M${S.x} ${S.y}Q${cx} ${cy} ${Z.x} ${Z.y}`,lx:(S.x+2*cx+Z.x)/4,ly:(S.y+2*cy+Z.y)/4}}
function upd(path,pill,a,b,bend){if(!path||!a||!b)return;const g=geom(a,b,bend);path.setAttribute('d',g.d);if(pill){const w=+pill.getAttribute('width')||90;pill.setAttribute('x',g.lx-w/2);pill.setAttribute('y',g.ly-10);const t=pill.nextElementSibling;if(t?.tagName?.toLowerCase()==='text'){t.setAttribute('x',g.lx);t.setAttribute('y',g.ly+4)}}}
function marker(){const defs=svg.querySelector('defs');if(!defs||defs.querySelector('#arrowGlobalAgent'))return;const m=E('marker',{id:'arrowGlobalAgent',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'});m.appendChild(E('path',{d:'M0 0L10 5L0 10z',fill:'#f9a8d4'}));defs.appendChild(m)}
function ownLink(a,b,bend=0){if(!a||!b)return;edges.appendChild(E('path',{class:'edge global-agent-link',d:geom(a,b,bend).d,style:'stroke:#f9a8d4;stroke-width:2.35;pointer-events:none','marker-end':'url(#arrowGlobalAgent)'}))}
function redraw(){
 marker();edges.querySelectorAll('.global-agent-link').forEach(n=>n.remove());
 const architect=box(global('architect'),'.routing-core'),research=box(global('research')),writer=box(global('writer')),curator=box(global('curator')),qa=box(global('qa')),inbox=box(nodes.querySelector('.inbox-module')),radar=box(nodes.querySelector('.radar-module')),knowledge=box(nodes.querySelector('.knowledge-module')),runtime=box(nodes.querySelector('.baranes-runtime')),ledger=box(nodes.querySelector('.baranes-ledgerops')),repo=box(nodes.querySelector('.baranes-repoops'));
 const tg=nodes.querySelector('.node[data-id="telegram"]'),subs=tg?[...tg.querySelectorAll('.subbox')]:[],telegramArchitect=box(subs[1]);
 upd(edges.querySelector('path.edge.routingedge'),labels.querySelector('rect.pill.routing-pill'),telegramArchitect,architect,30);
 const ie=[...edges.querySelectorAll('path.edge.inboxedge')],ip=[...labels.querySelectorAll('rect.pill.inbox-pill')];upd(ie[1],ip[1],inbox,architect,-22);
 const re=[...edges.querySelectorAll('path.edge.researchedge')],rp=[...labels.querySelectorAll('rect.pill.research-pill')];upd(re[0],rp[0],architect,research,24);upd(re[1],rp[1],radar,research,-26);
 upd(edges.querySelector('path.edge.knowledgeedge'),labels.querySelector('rect.pill.knowledge-pill'),research,knowledge,-18);
 upd(edges.querySelector('path.runtime-entry-edge'),labels.querySelector('rect.runtime-entry-label'),architect,runtime,34);
 ownLink(writer,ledger,-18);ownLink(curator,ledger,18);ownLink(qa,repo,-18);
}
function sync(){for(const id of IDS){const g=migrate(id);if(g)removeDuplicates(id,g)}ensureLegacySlots();redraw()}
function queueSync(){if(syncQueued)return;syncQueued=true;requestAnimationFrame(()=>{syncQueued=false;sync()})}
function idFromTarget(t){return t.closest?.('[data-global-agent]')?.dataset.globalAgent||null}
function dirty(){save?.classList.remove('saved');if(save)save.textContent='Save layout';if(status)status.textContent='Layout modificat · prem Save layout per conservar-lo'}
window.addEventListener('pointerdown',e=>{if(document.body.dataset.atlasMode!=='design')return;const id=idFromTarget(e.target);if(!id)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e),s=state[id];drag={id,pid:e.pointerId,dx:p.x-s.x,dy:p.y-s.y};try{svg.setPointerCapture(e.pointerId)}catch(_){}},true);
window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e),s=state[drag.id],g=global(drag.id);s.x=p.x-drag.dx;s.y=p.y-drag.dy;if(g)g.setAttribute('transform',`translate(${s.x} ${s.y})`);redraw();dirty()},true);
window.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();drag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}},true);
window.addEventListener('pointercancel',()=>{drag=null},true);
if(save)save.addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}});
new MutationObserver(ms=>{if(ms.some(m=>m.type==='childList'))queueSync();else redraw()}).observe(nodes,{subtree:true,childList:true,attributes:true,attributeFilter:['transform']});
new MutationObserver(redraw).observe(layer,{subtree:true,attributes:true,attributeFilter:['transform']});
setTimeout(sync,0);
})();