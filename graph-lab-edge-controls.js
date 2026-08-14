(()=>{
const svg=document.getElementById('g'),edges=document.getElementById('edges'),labels=document.getElementById('labels'),save=document.getElementById('save'),status=document.getElementById('status'),nav=document.querySelector('.nav'),NS='http://www.w3.org/2000/svg',KEY='pre-baranes-atlas:system-edge-controls:v1';
if(!svg||!edges)return;
if(nav&&!nav.querySelector('a[href="./data-observability.html"]')){const a=document.createElement('a');a.href='./data-observability.html';a.textContent='Data & Observability';const anchor=document.getElementById('atlas-mode-group')||save;nav.insertBefore(a,anchor||null)}
const style=document.createElement('style');style.textContent=`
#system-edge-handles .system-edge-handle{fill:#111827;stroke:#94a3b8;stroke-width:1.6;opacity:.82;cursor:move;pointer-events:all;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
#system-edge-handles .system-edge-handle:hover,#system-edge-handles .system-edge-handle.active{stroke:#f8fafc;stroke-width:2.2;opacity:1}
body[data-atlas-mode="view"] #system-edge-handles{display:none}
`;document.head.appendChild(style);
let handles=document.getElementById('system-edge-handles');if(!handles){handles=document.createElementNS(NS,'g');handles.id='system-edge-handles';svg.appendChild(handles)}
let state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){state={}}
const bases=new WeakMap(),ownWrites=new WeakSet();let scheduled=false,drag=null;
function P(e){const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;return{x:v.x+(e.clientX-r.left)/r.width*v.width,y:v.y+(e.clientY-r.top)/r.height*v.height}}
function nums(d){return(d||'').match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)?.map(Number)||[]}
function parse(d){const n=nums(d);if(!n.length)return null;if(/C/i.test(d)&&n.length>=8)return{S:{x:n[0],y:n[1]},C1:{x:n[2],y:n[3]},C2:{x:n[4],y:n[5]},T:{x:n[6],y:n[7]}};if(/Q/i.test(d)&&n.length>=6){const S={x:n[0],y:n[1]},Q={x:n[2],y:n[3]},T={x:n[4],y:n[5]};return{S,C1:{x:S.x+2/3*(Q.x-S.x),y:S.y+2/3*(Q.y-S.y)},C2:{x:T.x+2/3*(Q.x-T.x),y:T.y+2/3*(Q.y-T.y)},T}}if(/L/i.test(d)&&n.length>=4){const S={x:n[0],y:n[1]},T={x:n[n.length-2],y:n[n.length-1]};return{S,C1:{x:S.x+(T.x-S.x)/3,y:S.y+(T.y-S.y)/3},C2:{x:S.x+2*(T.x-S.x)/3,y:S.y+2*(T.y-S.y)/3},T}}return null}
function cubicPoint(g,t=.5){const u=1-t;return{x:u*u*u*g.S.x+3*u*u*t*g.C1.x+3*u*t*t*g.C2.x+t*t*t*g.T.x,y:u*u*u*g.S.y+3*u*u*t*g.C1.y+3*u*t*t*g.C2.y+t*t*t*g.T.y}}
function nearestLabel(path){if(!labels)return null;let mid;try{mid=path.getPointAtLength(path.getTotalLength()/2)}catch(_){return null}let best=null,dist=Infinity;for(const t of labels.querySelectorAll('text.elabel')){const x=+t.getAttribute('x'),y=+t.getAttribute('y'),d=Math.hypot(x-mid.x,y-mid.y);if(d<dist){dist=d;best=t}}return best&&dist<115?{text:best,rect:best.previousElementSibling?.tagName?.toLowerCase()==='rect'?best.previousElementSibling:null}:null}
function cleanClasses(path){return[...path.classList].filter(c=>c!=='edge'&&c!=='atlas-focus'&&!c.startsWith('atlas-')).sort().join('.')||'edge'}
function assignKeys(paths){const counts={};for(const p of paths){if(p.dataset.systemEdgeKey)continue;const lab=nearestLabel(p)?.text?.textContent?.trim()||'';const root=`${cleanClasses(p)}|${lab}`;const i=counts[root]||0;counts[root]=i+1;p.dataset.systemEdgeKey=`${root}|${i}`}}
function control(key){return state[key]||(state[key]={c1dx:0,c1dy:0,c2dx:0,c2dy:0})}
function geom(path){const b=bases.get(path);if(!b)return null;const c=control(path.dataset.systemEdgeKey);return{S:b.S,T:b.T,C1:{x:b.C1.x+c.c1dx,y:b.C1.y+c.c1dy},C2:{x:b.C2.x+c.c2dx,y:b.C2.y+c.c2dy}}}
function moveLabel(path,g){const lab=nearestLabel(path);if(!lab)return;const m=cubicPoint(g,.5),t=lab.text,r=lab.rect;t.setAttribute('x',m.x);t.setAttribute('y',m.y+4);if(r){const w=+r.getAttribute('width')||90;r.setAttribute('x',m.x-w/2);r.setAttribute('y',m.y-10)}}
function applyPath(path){const g=geom(path);if(!g)return;ownWrites.add(path);path.setAttribute('d',`M${g.S.x} ${g.S.y}C${g.C1.x} ${g.C1.y} ${g.C2.x} ${g.C2.y} ${g.T.x} ${g.T.y}`);setTimeout(()=>ownWrites.delete(path),0);moveLabel(path,g)}
function handleCircle(path,which,p){const c=document.createElementNS(NS,'circle');c.setAttribute('class',`system-edge-handle${drag&&drag.key===path.dataset.systemEdgeKey&&drag.which===which?' active':''}`);c.dataset.key=path.dataset.systemEdgeKey;c.dataset.which=which;c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r','5.5');handles.appendChild(c)}
function sync(){scheduled=false;const paths=[...edges.querySelectorAll('path.edge')];assignKeys(paths);handles.innerHTML='';for(const p of paths){if(!bases.has(p)){const b=parse(p.getAttribute('d'));if(b)bases.set(p,b)}applyPath(p);const g=geom(p);if(g){handleCircle(p,'c1',g.C1);handleCircle(p,'c2',g.C2)}}}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(sync)}
new MutationObserver(ms=>{let external=false;for(const m of ms){if(m.type==='attributes'&&m.attributeName==='d'){const p=m.target;if(ownWrites.has(p))continue;const b=parse(p.getAttribute('d'));if(b){bases.set(p,b);external=true}}else if(m.type==='childList')external=true}if(external)queue()}).observe(edges,{subtree:true,childList:true,attributes:true,attributeFilter:['d']});
if(labels)new MutationObserver(queue).observe(labels,{childList:true});
function pathFor(key){return[...edges.querySelectorAll('path.edge')].find(p=>p.dataset.systemEdgeKey===key)||null}
function dirty(){save?.classList.remove('saved');if(save)save.textContent='Save layout';if(status)status.textContent='Design · layout o corbes modificades · prem Save layout'}
window.addEventListener('pointerdown',e=>{if(document.body.dataset.atlasMode!=='design')return;const h=e.target.closest?.('.system-edge-handle');if(!h)return;e.preventDefault();e.stopImmediatePropagation();drag={key:h.dataset.key,which:h.dataset.which,pid:e.pointerId};try{svg.setPointerCapture(e.pointerId)}catch(_){}},true);
window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();const path=pathFor(drag.key),b=path&&bases.get(path);if(!path||!b)return;const p=P(e),c=control(drag.key);if(drag.which==='c1'){c.c1dx=p.x-b.C1.x;c.c1dy=p.y-b.C1.y}else{c.c2dx=p.x-b.C2.x;c.c2dy=p.y-b.C2.y}applyPath(path);sync();dirty()},true);
window.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();e.stopImmediatePropagation();drag=null;try{svg.releasePointerCapture(e.pointerId)}catch(_){};queue()},true);
window.addEventListener('pointercancel',()=>{drag=null;queue()},true);
save?.addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}});
new MutationObserver(()=>{if(status&&document.body.dataset.atlasMode==='design')status.textContent='Design · mou caixes o els dos punts de cada fletxa · Save layout per conservar-ho'}).observe(document.body,{attributes:true,attributeFilter:['data-atlas-mode']});
queue();
})();