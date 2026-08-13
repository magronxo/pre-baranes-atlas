(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),runtime=document.getElementById('runtime-nodes'),NS='http://www.w3.org/2000/svg';
if(!svg||!nodes||!edges)return;
const EXT='pre-baranes-atlas:external-layout:v2';
const P=e=>{const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}};
const T=g=>{const m=(g?.getAttribute('transform')||'').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}};
const E=(tag,a={})=>{const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q};
let drag=null;
svg.addEventListener('pointerdown',e=>{if(document.body.dataset.atlasMode!=='design')return;const g=e.target.closest?.('[data-delivery-id="sdd"]');if(!g)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e),q=T(g);drag={g,id:e.pointerId,dx:p.x-q.x,dy:p.y-q.y};try{svg.setPointerCapture(e.pointerId)}catch(_){}},true);
svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;e.preventDefault();e.stopImmediatePropagation();const p=P(e);drag.g.setAttribute('transform',`translate(${p.x-drag.dx} ${p.y-drag.dy})`)},true);
svg.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;e.preventDefault();e.stopImmediatePropagation();drag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){}},true);
svg.addEventListener('pointercancel',()=>{drag=null},true);
function restoreWriter(){let s=null;try{s=JSON.parse(localStorage.getItem(EXT)||'null')}catch(_){};if(!s?.writer)return;const pre=nodes.querySelector('.container-node[data-id="prebaranes"]'),writer=nodes.querySelector('.writer-module');if(!pre||!writer)return;const p=T(pre);writer.setAttribute('transform',`translate(${p.x+s.writer.x} ${p.y+s.writer.y})`)}
function box(g){if(!g)return null;let x=0,y=0,p=g;while(p&&p!==svg){const q=T(p);x+=q.x;y+=q.y;p=p.parentNode}const r=g.querySelector('rect');return r?{x,y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,d=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*d,y:cy+(out?1:-1)*uy*d}}
function curve(a,b){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),Z=boundary(b,ux,uy,false),cx=(S.x+Z.x)/2+nx*-18,cy=(S.y+Z.y)/2+ny*-18;return`M${S.x} ${S.y}Q${cx} ${cy} ${Z.x} ${Z.y}`}
function marker(){const defs=svg.querySelector('defs');if(!defs||defs.querySelector('#arrowCodingRepos'))return;const m=E('marker',{id:'arrowCodingRepos',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'});m.appendChild(E('path',{d:'M0 0L10 5L0 10z',fill:'#cbd5e1'}));defs.appendChild(m)}
function draw(){marker();edges.querySelectorAll('.coding-repos-link').forEach(n=>n.remove());const coding=[...(runtime||svg).querySelectorAll('.runtime-box-owned')].find(g=>(g.textContent||'').includes('Coding Agents')),repos=nodes.querySelector('[data-delivery-id="repos"]'),a=box(coding),b=box(repos);if(a&&b)edges.appendChild(E('path',{class:'edge coding-repos-link',d:curve(a,b),style:'stroke:#cbd5e1;stroke-width:2.35;pointer-events:none','marker-end':'url(#arrowCodingRepos)'}))}
let scheduled=false;const sync=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;restoreWriter();draw()})};
new MutationObserver(sync).observe(nodes,{subtree:true,childList:true,attributes:true,attributeFilter:['transform']});if(runtime)new MutationObserver(sync).observe(runtime,{subtree:true,childList:true,attributes:true,attributeFilter:['transform']});sync();
})();