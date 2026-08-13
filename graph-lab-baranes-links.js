(()=>{
const svg=document.getElementById('g'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),NS='http://www.w3.org/2000/svg';
function el(tag,a={}){const q=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))q.setAttribute(k,v);return q}
function tr(g){const m=(g?.getAttribute('transform')||'').match(/translate\(([-.\d]+)[ ,]+([-.\d]+)\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}}
function box(sel){const g=nodes.querySelector(sel);if(!g)return null;let x=0,y=0,p=g;while(p&&p!==svg){if(p.getAttribute){const t=tr(p);x+=t.x;y+=t.y}p=p.parentNode}const r=g.querySelector('rect');return r?{x,y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}:null}
function boundary(b,ux,uy,out){const cx=b.x+b.w/2,cy=b.y+b.h/2,hw=b.w/2,hh=b.h/2,d=1/Math.max(Math.abs(ux)/(hw||1),Math.abs(uy)/(hh||1),.0001);return{x:cx+(out?1:-1)*ux*d,y:cy+(out?1:-1)*uy*d}}
function path(a,b,bend){const ax=a.x+a.w/2,ay=a.y+a.h/2,bx=b.x+b.w/2,by=b.y+b.h/2,dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,nx=-uy,ny=ux,S=boundary(a,ux,uy,true),T=boundary(b,ux,uy,false),cx=(S.x+T.x)/2+nx*bend,cy=(S.y+T.y)/2+ny*bend;return`M${S.x} ${S.y}Q${cx} ${cy} ${T.x} ${T.y}`}
function marker(id,color){const defs=svg.querySelector('defs');if(!defs||defs.querySelector('#'+id))return;const m=el('marker',{id,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'});m.appendChild(el('path',{d:'M0 0L10 5L0 10z',fill:color}));defs.appendChild(m)}
marker('arrowAgentLink','#f9a8d4');marker('arrowGuardLink','#a5b4fc');marker('arrowOpsLink','#cbd5e1');
const links=[
 ['.writer-module','.baranes-ledgerops',-20,'#f9a8d4','arrowAgentLink'],
 ['.baranes-runtime','.baranes-repoops',-28,'#a5b4fc','arrowGuardLink'],
 ['.baranes-runtime','.baranes-hostops',0,'#a5b4fc','arrowGuardLink'],
 ['.baranes-runtime','.baranes-ledgerops',28,'#a5b4fc','arrowGuardLink'],
 ['.baranes-ledgerops','.baranes-publicationops',-18,'#cbd5e1','arrowOpsLink'],
 ['.baranes-repoops','.baranes-publicationops',18,'#cbd5e1','arrowOpsLink']
];
function draw(){edges.querySelectorAll('.baranes-flow-link').forEach(n=>n.remove());for(const[s,t,b,c,m]of links){const A=box(s),B=box(t);if(A&&B)edges.appendChild(el('path',{class:'edge baranes-flow-link',d:path(A,B,b),style:`stroke:${c};stroke-width:2.35;pointer-events:none`,'marker-end':`url(#${m})`}))}}
let scheduled=false;new MutationObserver(ms=>{if(ms.some(m=>m.type==='attributes'||[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('baranes-flow-link')))&&!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;draw()})}}).observe(nodes,{childList:true,subtree:true,attributes:true,attributeFilter:['transform']});
draw();
})();