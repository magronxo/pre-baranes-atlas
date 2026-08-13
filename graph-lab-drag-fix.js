(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),containers=document.getElementById('containers'),save=document.getElementById('save');
if(!svg||!nodes)return;
const EXT='pre-baranes-atlas:external-layout:v2',RUN='pre-baranes-atlas:runtime-boxes:v1';
let drag=null;
const P=e=>{const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}};
const tr=g=>{const m=(g?.getAttribute('transform')||'').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}};
const set=(g,x,y)=>g.setAttribute('transform',`translate(${x} ${y})`);
function pre(){const g=nodes.querySelector('.container-node[data-id="prebaranes"]'),p=tr(g),r=g?.querySelector('.container-hitbox');return g&&r?{x:p.x,y:p.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function baranes(){return nodes.querySelector('.baranes-container-node')}
function ensureBaranesSurface(){const g=baranes();if(!g)return;const shell=containers.querySelector('.atlas-external-owned > .container-shell'),hit=g.querySelector(':scope > rect[style*="cursor:grab"]');if(shell&&hit){hit.setAttribute('width',shell.getAttribute('width'));hit.setAttribute('height',shell.getAttribute('height'));hit.setAttribute('fill','transparent');hit.style.pointerEvents='all'}g.querySelectorAll(':scope > .container-kind,:scope > .container-title').forEach(x=>x.style.pointerEvents='none')}
function kind(target){
 const mod=target.closest('.baranes-module'); if(mod)return{type:'baranes-module',g:mod,id:mod.dataset.baranesModule};
 const writer=target.closest('.writer-module'); if(writer)return{type:'writer',g:writer};
 const radar=target.closest('.radar-web-node'); if(radar)return{type:'radarweb',g:radar};
 const rt=target.closest('.runtime-box-owned'); if(rt){const txt=rt.textContent||'';return{type:txt.includes('Coding Agents')?'coding':'ocws',g:rt}}
 const b=target.closest('.baranes-container-node'); if(b&&!target.closest('.resize-handle'))return{type:'baranes',g:b};
 return null;
}
function box(sel){const g=nodes.querySelector(sel);if(!g)return null;let x=0,y=0,p=g;while(p&&p!==svg){const q=tr(p);x+=q.x;y+=q.y;p=p.parentNode}const r=g.querySelector('rect');return r?{x,y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,d=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*d,y:cy+(out?1:-1)*uy*d}}
function curve(a,b,bend){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),T=boundary(b,ux,uy,false),cx=(S.x+T.x)/2+nx*bend,cy=(S.y+T.y)/2+ny*bend;return`M${S.x} ${S.y}Q${cx} ${cy} ${T.x} ${T.y}`}
function refreshSpecialEdges(){const a=box('.routing-module'),b=box('.baranes-runtime'),r=box('.radar-module'),w=box('.radar-web-node');const re=document.querySelector('.runtime-entry-edge');if(a&&b&&re)re.setAttribute('d',curve(a,b,34));const rw=document.querySelector('.radar-web-edge');if(r&&w&&rw)rw.setAttribute('d',curve(r,w,-26))}
function persist(){
 let e={};try{e=JSON.parse(localStorage.getItem(EXT)||'{}')||{}}catch(_){e={}};
 const bg=baranes(),bp=tr(bg);if(bg){const shell=containers.querySelector('.atlas-external-owned > .container-shell');e.baranes={...(e.baranes||{}),x:bp.x,y:bp.y,w:shell?+shell.getAttribute('width'):e.baranes?.w,h:shell?+shell.getAttribute('height'):e.baranes?.h}}
 const pc=pre(),wg=nodes.querySelector('.writer-module');if(pc&&wg){const p=tr(wg),r=wg.querySelector('rect');e.writer={x:p.x-pc.x,y:p.y-pc.y,w:r?+r.getAttribute('width'):190,h:r?+r.getAttribute('height'):78}}
 const rg=nodes.querySelector('.radar-web-node');if(rg){const p=tr(rg),r=rg.querySelector('rect');e.radarweb={x:p.x,y:p.y,w:r?+r.getAttribute('width'):200,h:r?+r.getAttribute('height'):82}}
 e.baranesModules=e.baranesModules||{};nodes.querySelectorAll('.baranes-module').forEach(g=>{const p=tr(g),r=g.querySelector('rect'),id=g.dataset.baranesModule;e.baranesModules[id]={x:p.x,y:p.y,w:r?+r.getAttribute('width'):150,h:r?+r.getAttribute('height'):72}});
 try{localStorage.setItem(EXT,JSON.stringify(e))}catch(_){}
 let rr={};try{rr=JSON.parse(localStorage.getItem(RUN)||'{}')||{}}catch(_){rr={}};nodes.querySelectorAll('.runtime-box-owned').forEach(g=>{const p=tr(g),r=g.querySelector('rect'),id=(g.textContent||'').includes('Coding Agents')?'coding':'ocws';rr[id]={x:p.x,y:p.y,w:r?+r.getAttribute('width'):300,h:r?+r.getAttribute('height'):150}});try{localStorage.setItem(RUN,JSON.stringify(rr))}catch(_){}
}
function down(e){ensureBaranesSurface();const k=kind(e.target);if(!k)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e),q=tr(k.g);drag={...k,start:p,x:q.x,y:q.y,pid:e.pointerId};try{svg.setPointerCapture(e.pointerId)}catch(_){} }
function move(e){if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e),x=drag.x+p.x-drag.start.x,y=drag.y+p.y-drag.start.y;set(drag.g,x,y);if(drag.type==='baranes'){const shells=[...containers.querySelectorAll('.atlas-external-owned')];const sh=shells.find(g=>{const q=tr(g);return Math.abs(q.x-drag.x)<1&&Math.abs(q.y-drag.y)<1})||shells[0];if(sh)set(sh,x,y)}refreshSpecialEdges()}
function up(e){if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();persist();drag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){} }
svg.addEventListener('pointerdown',down,true);svg.addEventListener('pointermove',move,true);svg.addEventListener('pointerup',up,true);svg.addEventListener('pointercancel',up,true);
new MutationObserver(ensureBaranesSurface).observe(containers,{subtree:true,attributes:true,attributeFilter:['width','height']});
if(save)save.addEventListener('click',()=>requestAnimationFrame(persist));ensureBaranesSurface();
})();