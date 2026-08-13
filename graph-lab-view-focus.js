(()=>{
const svg=document.getElementById('g'),edges=document.getElementById('edges'),labels=document.getElementById('labels');
if(!svg||!edges)return;
const style=document.createElement('style');style.textContent=`
body.atlas-focus-active #g .atlas-focus-component{opacity:.14;transition:opacity .16s ease,filter .16s ease}
body.atlas-focus-active #g .atlas-focus-component.atlas-focus{opacity:1;filter:drop-shadow(0 0 8px rgba(147,197,253,.24))}
body.atlas-focus-active #edges .edge{opacity:.12;transition:opacity .16s ease}
body.atlas-focus-active #edges .edge.atlas-focus{opacity:1}
body.atlas-focus-active #labels>*{opacity:.20;transition:opacity .16s ease}
body.atlas-focus-active #labels>*.atlas-focus{opacity:1}
`;document.head.appendChild(style);
const mainSelectors=['#agent-nodes > [data-global-agent]','#runtime-nodes > .runtime-box-owned','#nodes > .node[data-id]','#nodes > .radar-module','#nodes > .inbox-module','#nodes > .knowledge-module','#nodes > .radar-web-node','#nodes .baranes-module','#nodes > [data-delivery-id="sdd"]','#nodes > [data-delivery-id="repos"]'];
const endpointSelectors=[...mainSelectors,'#nodes .subbox','#nodes .radar-sub'];
const unique=xs=>[...new Set(xs.filter(Boolean))];
function collect(selectors){const out=[];for(const s of selectors)out.push(...svg.querySelectorAll(s));return unique(out).filter(g=>g.querySelector('rect'))}
function displayGroup(g){if(!g)return null;if(g.matches('.subbox'))return g.closest('.node[data-id="telegram"]');if(g.matches('.radar-sub'))return g.closest('.radar-module');return g}
function worldBox(g){try{const b=g.getBBox(),m=g.getCTM();if(!m)return null;const pts=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}catch(_){return null}}
const near=(p,b,m=20)=>b&&p.x>=b.x-m&&p.x<=b.x+b.w+m&&p.y>=b.y-m&&p.y<=b.y+b.h+m;
function distanceToBox(p,b){const dx=Math.max(b.x-p.x,0,p.x-(b.x+b.w)),dy=Math.max(b.y-p.y,0,p.y-(b.y+b.h));return Math.hypot(dx,dy)}
function componentAt(x,y){const priorities=['[data-global-agent]','.baranes-module','.runtime-box-owned','[data-delivery-id="sdd"]','[data-delivery-id="repos"]','.radar-web-node','.radar-sub','.subbox','.radar-module','.inbox-module','.knowledge-module','.node[data-id]'];for(const el of document.elementsFromPoint(x,y)){for(const s of priorities){const g=el.closest?.(s);if(g&&svg.contains(g))return displayGroup(g)}}return null}
function clear(){document.body.classList.remove('atlas-focus-active');svg.querySelectorAll('.atlas-focus-component,.atlas-focus').forEach(g=>g.classList.remove('atlas-focus-component','atlas-focus'))}
function focus(selected){clear();if(!selected)return;const mains=collect(mainSelectors),endpoints=collect(endpointSelectors),selectedBox=worldBox(selected);if(!selectedBox)return;for(const g of mains)g.classList.add('atlas-focus-component');selected.classList.add('atlas-focus');const focused=[];
for(const path of edges.querySelectorAll('.edge')){try{const len=path.getTotalLength();if(!len)continue;const a=path.getPointAtLength(0),b=path.getPointAtLength(len),ta=near(a,selectedBox,24),tb=near(b,selectedBox,24);if(!ta&&!tb)continue;path.classList.add('atlas-focus');focused.push(path);const other=ta?b:a;let best=null,bestD=Infinity;for(const candidate of endpoints){const dg=displayGroup(candidate);if(dg===selected)continue;const cb=worldBox(candidate);if(!cb)continue;const d=distanceToBox(other,cb);if(d<bestD){bestD=d;best=dg}}if(best&&bestD<45)best.classList.add('atlas-focus')}catch(_){}}
if(labels){for(const path of focused){try{const p=path.getPointAtLength(path.getTotalLength()/2);let best=null,bestD=Infinity;for(const t of labels.querySelectorAll('text.elabel')){const x=+t.getAttribute('x'),y=+t.getAttribute('y'),d=Math.hypot(x-p.x,y-p.y);if(d<bestD){bestD=d;best=t}}if(best&&bestD<100){best.classList.add('atlas-focus');best.previousElementSibling?.classList.add('atlas-focus')}}catch(_){}}}
document.body.classList.add('atlas-focus-active')}
const clean=s=>(s||'').replace(/^[^A-Za-zÀ-ÿ0-9]+\s*/,'').trim();
function patchPopup(){requestAnimationFrame(()=>{const title=document.querySelector('.atlas-info-title'),flow=document.querySelector('.atlas-info-flow'),summary=document.querySelector('.atlas-info-summary');if(!title||!flow)return;const k=clean(title.textContent);if(k==='ARCHITECT'){flow.innerHTML='<b>Flux principal</b><br>Inbox / Telegram → ARCHITECT → Runtime Guardrails.';if(summary)summary.textContent='Agent d’orquestració. Rep handoffs, interpreta el treball admès, selecciona ruta/model i deriva els efectes governats cap al boundary de Baranes.'}else if(k==='Research Agent'){flow.innerHTML='<b>Flux principal</b><br>Radar → Research Agent → Knowledge Database.'}})}
window.addEventListener('pointerup',e=>{if(document.body.dataset.atlasMode!=='view')return;const g=componentAt(e.clientX,e.clientY);if(g){focus(g);patchPopup()}else clear()},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')clear()},true);
document.addEventListener('click',e=>{if(e.target.closest?.('.atlas-info-close')||e.target.classList?.contains('atlas-info-overlay'))clear()},true);
new MutationObserver(()=>{if(document.body.dataset.atlasMode!=='view')clear()}).observe(document.body,{attributes:true,attributeFilter:['data-atlas-mode']});
})();