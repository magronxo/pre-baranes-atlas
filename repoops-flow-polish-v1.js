(()=>{
const svg=document.getElementById('g'),zones=document.getElementById('zones'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),labels=document.getElementById('labels'),handles=document.getElementById('edge-handles');
if(!svg||!zones||!nodes||!edges||!labels||!handles)return;
let raf=0;
function T(g){const m=(g?.getAttribute('transform')||'').match(/translate\(\s*([-+\d.eE]+)[ ,]+([-+\d.eE]+)\s*\)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0}}
function B(id){const g=nodes.querySelector(`[data-id="${id}"]`);if(!g)return null;const r=g.querySelector('.box'),t=T(g);if(!r)return null;return{x:t.x,y:t.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')}}
function wrapperSurface(){return [...zones.querySelectorAll('rect')].find(r=>!r.classList.contains('zone')&&r.getAttribute('stroke-dasharray')==='5 7')||null}
function patchZones(){
 const artifact=zones.querySelector('.zone-artifacts');if(artifact)artifact.setAttribute('height','315');
 const s=wrapperSurface();if(s){s.setAttribute('fill','#172338');s.setAttribute('fill-opacity','.68');s.setAttribute('stroke','#64748b');s.setAttribute('stroke-opacity','.58')}
}
function patchIntake(){
 const ps=edges.querySelectorAll('path');if(ps.length<13)return;
 const intake=B('intake'),record=B('featureRecord');if(!intake||!record)return;
 const S={x:intake.x+intake.w/2,y:intake.y+intake.h},T={x:record.x,y:record.y+record.h/2};
 const C1={x:S.x,y:S.y+46},C2={x:T.x-34,y:T.y-12};
 ps[12].setAttribute('d',`M${S.x} ${S.y}C${C1.x} ${C1.y} ${C2.x} ${C2.y} ${T.x} ${T.y}`);
 const hs=[...handles.querySelectorAll('[data-edge="12"]')];
 if(hs.length>=2){hs[0].setAttribute('cx',C1.x);hs[0].setAttribute('cy',C1.y);hs[1].setAttribute('cx',C2.x);hs[1].setAttribute('cy',C2.y)}
}
function patchRunnerDispatch(){
 const ps=edges.querySelectorAll('path'),runner=B('runner'),surface=wrapperSurface();if(!ps.length||!runner||!surface)return;
 const sx=runner.x+runner.w/2,sy=runner.y,rx=+surface.getAttribute('x'),ry=+surface.getAttribute('y'),rw=+surface.getAttribute('width'),rh=+surface.getAttribute('height'),tx=rx+rw/2,ty=ry+rh;
 const p=ps[ps.length-1];p.setAttribute('d',`M${sx} ${sy}C${sx} ${sy-58} ${tx+70} ${ty+44} ${tx} ${ty}`);
 const rs=labels.querySelectorAll('rect'),ts=labels.querySelectorAll('text');if(rs.length&&ts.length){const mx=(sx+tx)/2,my=(sy+ty)/2;const bg=rs[rs.length-1],t=ts[ts.length-1];bg.setAttribute('x',mx-55);bg.setAttribute('y',my-9);bg.setAttribute('width','110');bg.setAttribute('height','18');t.setAttribute('x',mx);t.setAttribute('y',my+3);t.textContent='allowlisted dispatch'}
}
function patch(){patchZones();patchIntake();patchRunnerDispatch()}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>requestAnimationFrame(()=>{raf=0;patch()}))}
new MutationObserver(schedule).observe(nodes,{subtree:true,attributes:true,attributeFilter:['transform']});
new MutationObserver(schedule).observe(zones,{childList:true});
new MutationObserver(schedule).observe(edges,{childList:true});
new MutationObserver(schedule).observe(handles,{childList:true});
window.addEventListener('load',schedule,{once:true});
schedule();
})();