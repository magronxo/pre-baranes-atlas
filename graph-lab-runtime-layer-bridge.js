(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),save=document.getElementById('save'),runtimeLayer=document.getElementById('runtime-nodes'),NS='http://www.w3.org/2000/svg',RUN='pre-baranes-atlas:runtime-boxes:v1';
if(!svg||!nodes||!edges||!runtimeLayer)return;
let savedRuntime={};try{savedRuntime=JSON.parse(localStorage.getItem(RUN)||'{}')||{}}catch(_){savedRuntime={}}
let runtimeDirty=false;
const E=(t,a={})=>{const q=document.createElementNS(NS,t);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q};
const T=g=>{const m=(g?.getAttribute('transform')||'').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}};
function box(g){if(!g)return null;let x=0,y=0,p=g;while(p&&p!==svg){const q=T(p);x+=q.x;y+=q.y;p=p.parentNode}const r=g.querySelector('rect');return r?{x,y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,d=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*d,y:cy+(out?1:-1)*uy*d}}
function curve(a,b,bend=16){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),Z=boundary(b,ux,uy,false),cx=(S.x+Z.x)/2+nx*bend,cy=(S.y+Z.y)/2+ny*bend;return`M${S.x} ${S.y}Q${cx} ${cy} ${Z.x} ${Z.y}`}
function coding(){return [...runtimeLayer.querySelectorAll('.runtime-box-owned')].find(g=>(g.textContent||'').includes('Coding Agents'))||null}
function ensureMarker(){const defs=svg.querySelector('defs');if(!defs||defs.querySelector('#arrowRuntimeDelivery'))return;const m=E('marker',{id:'arrowRuntimeDelivery',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'});m.appendChild(E('path',{d:'M0 0L10 5L0 10z',fill:'#a5b4fc'}));defs.appendChild(m)}
function draw(){ensureMarker();edges.querySelectorAll('.runtime-delivery-link').forEach(n=>n.remove());const sdd=nodes.querySelector('[data-delivery-id="sdd"]'),cg=coding(),a=box(sdd),b=box(cg);if(!a||!b)return;edges.appendChild(E('path',{class:'edge runtime-delivery-link',d:curve(a,b,16),style:'stroke:#a5b4fc;stroke-width:2.35;pointer-events:none','marker-end':'url(#arrowRuntimeDelivery)'}))}
function persistRuntime(){const out={};for(const g of runtimeLayer.querySelectorAll('.runtime-box-owned')){const p=T(g),r=g.querySelector('rect'),id=(g.textContent||'').includes('Coding Agents')?'coding':'ocws';out[id]={x:p.x,y:p.y,w:r?+r.getAttribute('width'):300,h:r?+r.getAttribute('height'):150}}savedRuntime=out;try{localStorage.setItem(RUN,JSON.stringify(out))}catch(_){}}
function restoreSavedAfterLegacyPointerUp(){if(!runtimeDirty)return;runtimeDirty=false;const snapshot=JSON.stringify(savedRuntime);setTimeout(()=>{try{localStorage.setItem(RUN,snapshot)}catch(_){}},0)}
if(save)save.addEventListener('click',()=>requestAnimationFrame(persistRuntime));
window.addEventListener('pointerup',restoreSavedAfterLegacyPointerUp,true);window.addEventListener('pointercancel',restoreSavedAfterLegacyPointerUp,true);
let scheduled=false;const observer=new MutationObserver(ms=>{if(ms.some(m=>m.type==='attributes'&&runtimeLayer.contains(m.target)))runtimeDirty=true;if(!scheduled&&ms.some(m=>m.type==='attributes'||m.addedNodes.length||m.removedNodes.length)){scheduled=true;requestAnimationFrame(()=>{scheduled=false;draw()})}});
observer.observe(nodes,{subtree:true,childList:true,attributes:true,attributeFilter:['transform']});
observer.observe(runtimeLayer,{subtree:true,childList:true,attributes:true,attributeFilter:['transform']});
draw();
})();