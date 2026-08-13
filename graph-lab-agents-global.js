(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),labels=document.getElementById('labels'),save=document.getElementById('save'),status=document.getElementById('status'),NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:global-agents:v1';
if(!svg||!nodes||!edges||!labels)return;
const IDS=['architect','research','writer','curator','qa'];
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){state={}}
let drag=null,rebuildTimer=null,raf=0;
const P=e=>{const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}};
const T=g=>{const m=(g?.getAttribute('transform')||'').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}};
function find(id){return id==='architect'?nodes.querySelector('.routing-module'):id==='research'?nodes.querySelector('.research-module'):id==='writer'?nodes.querySelector('.writer-module'):nodes.querySelector(`[data-delivery-id="${id}"]`)}
function pre(){const g=nodes.querySelector('.container-node[data-id="prebaranes"]'),r=g?.querySelector('.container-hitbox'),p=T(g);return g&&r?{g,x:p.x,y:p.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function absPos(g){let x=0,y=0,p=g;while(p&&p!==svg){const q=T(p);x+=q.x;y+=q.y;p=p.parentNode}return{x,y}}
function rectSize(g){const r=g?.querySelector('rect');return r?{w:+r.getAttribute('width'),h:+r.getAttribute('height')}:{w:190,h:78}}
function initial(){const c=pre();if(!c)return;const defaults={architect:{x:c.x-280,y:c.y+20},research:{x:c.x-210,y:c.y+180},writer:{x:c.x-210,y:c.y+285},curator:{x:c.x-210,y:c.y+390},qa:{x:c.x-210,y:c.y+495}};for(const id of IDS){if(Number.isFinite(state[id]?.x)&&Number.isFinite(state[id]?.y))continue;const g=find(id),s=rectSize(g),d=defaults[id];state[id]={x:d.x,y:d.y,w:s.w,h:s.h}}}
function setTr(g,x,y){const v=`translate(${x} ${y})`;if(g&&g.getAttribute('transform')!==v)g.setAttribute('transform',v)}
function apply(id){const g=find(id),s=state[id];if(!g||!s)return;g.dataset.globalAgent=id;g.style.cursor=document.body.dataset.atlasMode==='view'?'pointer':'move';if(id==='curator'||id==='qa'){const c=pre();if(!c)return;setTr(g,s.x-c.x,s.y-c.y)}else setTr(g,s.x,s.y)}
function applyAll(){initial();for(const id of IDS)apply(id);redraw()}
function box(g,rectSel){if(!g)return null;const p=absPos(g),r=rectSel?g.querySelector(rectSel):g.querySelector('rect');return r?{x:p.x,y:p.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,d=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*d,y:cy+(out?1:-1)*uy*d}}
function geom(a,b,bend){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),Z=boundary(b,ux,uy,false),cx=(S.x+Z.x)/2+nx*bend,cy=(S.y+Z.y)/2+ny*bend;return{d:`M${S.x} ${S.y}Q${cx} ${cy} ${Z.x} ${Z.y}`,lx:(S.x+2*cx+Z.x)/4,ly:(S.y+2*cy+Z.y)/4}}
function upd(path,pill,a,b,bend){if(!path||!a||!b)return;const g=geom(a,b,bend);path.setAttribute('d',g.d);if(pill){const w=+pill.getAttribute('width')||90;pill.setAttribute('x',g.lx-w/2);pill.setAttribute('y',g.ly-10);const t=pill.nextElementSibling;if(t?.tagName?.toLowerCase()==='text'){t.setAttribute('x',g.lx);t.setAttribute('y',g.ly+4)}}}
function redraw(){
 const architect=box(find('architect'),'.routing-core'),research=box(find('research')),inbox=box(nodes.querySelector('.inbox-module')),radar=box(nodes.querySelector('.radar-module')),knowledge=box(nodes.querySelector('.knowledge-module')),runtime=box(nodes.querySelector('.baranes-runtime'));
 const tg=nodes.querySelector('.node[data-id="telegram"]'),subs=tg?[...tg.querySelectorAll('.subbox')]:[],telegramArchitect=box(subs[1]);
 upd(edges.querySelector('path.edge.routingedge'),labels.querySelector('rect.pill.routing-pill'),telegramArchitect,architect,30);
 const ie=[...edges.querySelectorAll('path.edge.inboxedge')],ip=[...labels.querySelectorAll('rect.pill.inbox-pill')];upd(ie[1],ip[1],inbox,architect,-22);
 const re=[...edges.querySelectorAll('path.edge.researchedge')],rp=[...labels.querySelectorAll('rect.pill.research-pill')];upd(re[0],rp[0],architect,research,24);upd(re[1],rp[1],radar,research,-26);
 upd(edges.querySelector('path.edge.knowledgeedge'),labels.querySelector('rect.pill.knowledge-pill'),research,knowledge,-18);
 upd(edges.querySelector('path.runtime-entry-edge'),labels.querySelector('rect.runtime-entry-label'),architect,runtime,34);
}
function idFromTarget(t){const g=t.closest?.('[data-global-agent]');if(g)return g.dataset.globalAgent;if(t.closest?.('.routing-module'))return'architect';if(t.closest?.('.research-module'))return'research';if(t.closest?.('.writer-module'))return'writer';const d=t.closest?.('[data-delivery-id]')?.dataset.deliveryId;return d==='curator'||d==='qa'?d:null}
function dirty(){save?.classList.remove('saved');if(save)save.textContent='Save layout';if(status)status.textContent='Layout modificat · prem Save layout per conservar-lo'}
svg.addEventListener('pointerdown',e=>{if(document.body.dataset.atlasMode!=='design')return;const id=idFromTarget(e.target);if(!id)return;initial();e.preventDefault();e.stopImmediatePropagation();const p=P(e),s=state[id];drag={id,pid:e.pointerId,dx:p.x-s.x,dy:p.y-s.y};try{svg.setPointerCapture(e.pointerId)}catch(_){}},true);
svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e),s=state[drag.id];s.x=p.x-drag.dx;s.y=p.y-drag.dy;apply(drag.id);redraw();dirty()},true);
svg.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();drag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}},true);
svg.addEventListener('pointercancel',()=>{drag=null},true);
if(save)save.addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}});
function scheduleRedraw(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;for(const id of ['curator','qa'])apply(id);redraw()})}
new MutationObserver(ms=>{const rebuild=ms.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length));if(rebuild){clearTimeout(rebuildTimer);rebuildTimer=setTimeout(applyAll,0)}else scheduleRedraw()}).observe(nodes,{subtree:true,childList:true,attributes:true,attributeFilter:['transform']});
setTimeout(applyAll,0);
})();