(()=>{
const BASE_KEY='pre-baranes-atlas:repoops-flow:v1';
const P2_KEY='pre-baranes-atlas:repoops-flow:phase2:v1';
const SEED_KEY='pre-baranes-atlas:repoops-flow:layout-seed:v2';

// Bake the reviewed layout into the browser once, while preserving any
// custom positions outside the two lower RepoOps rails.
try{
  if(localStorage.getItem(SEED_KEY)!=='1'){
    let previous={};
    try{previous=JSON.parse(localStorage.getItem(BASE_KEY)||'{}')||{}}catch(_){}
    const positions={...(previous.positions||{}),
      phaseController:{x:370,y:678},
      artifactWriter:{x:565,y:678},
      specValidator:{x:760,y:678},
      gateInspector:{x:955,y:678},
      contextCodex:{x:1150,y:678},
      planOpenCode:{x:1345,y:678},
      implementer:{x:1535,y:678},
      verifier:{x:625,y:790},
      auditor:{x:850,y:790},
      qa:{x:1075,y:790},
      adoptionGit:{x:1320,y:790},
      control:{x:60,y:952},
      helper:{x:365,y:952},
      job:{x:620,y:952},
      queue:{x:870,y:952},
      runner:{x:1190,y:925}
    };
    // Reset edge control offsets because the rails have moved materially.
    localStorage.setItem(BASE_KEY,JSON.stringify({positions,view:{x:0,y:0,w:1810,h:1120}}));
    localStorage.setItem(P2_KEY,JSON.stringify({seedWriter:{x:370,y:790}}));
    localStorage.setItem(SEED_KEY,'1');
  }
}catch(_){}

function T(g){
  const m=(g?.getAttribute('transform')||'').match(/translate\(\s*([-+\d.eE]+)[ ,]+([-+\d.eE]+)\s*\)/);
  return m?{x:+m[1],y:+m[2]}:{x:0,y:0};
}
function B(nodes,id){
  const g=nodes?.querySelector(`[data-id="${id}"]`);if(!g)return null;
  const r=g.querySelector('.box'),t=T(g);if(!r)return null;
  return{x:t.x,y:t.y,w:+r.getAttribute('width'),h:+r.getAttribute('height')};
}
function patch(){
  const svg=document.getElementById('g'),zones=document.getElementById('zones'),nodes=document.getElementById('nodes'),edges=document.getElementById('edges'),labels=document.getElementById('labels');
  if(!svg||!zones||!nodes||!edges||!labels)return;

  const engine=zones.querySelector('.zone-engine');
  if(engine){engine.setAttribute('y','592');engine.setAttribute('height','500')}

  // The translucent dashed wrapper bank is the only raw rect with this fill.
  const surface=[...zones.querySelectorAll('rect')].find(r=>r.getAttribute('fill')==='#0f172a');
  if(surface){
    surface.setAttribute('x','320');surface.setAttribute('y','638');
    surface.setAttribute('width','1450');surface.setAttribute('height','248');
  }
  const zoneTexts=[...zones.querySelectorAll('text')];
  const title=zoneTexts.find(t=>t.textContent==='ALLOWLISTED WRAPPER SURFACE');
  if(title){title.setAttribute('x','346');title.setAttribute('y','660')}
  const subtitle=zoneTexts.find(t=>t.textContent.includes('exact lifecycle')||t.textContent.includes('inventory visible'));
  if(subtitle){subtitle.setAttribute('x','575');subtitle.setAttribute('y','660')}

  // Re-route the single centralized Runner → wrapper-bank dispatch upwards.
  const r=B(nodes,'runner');
  const paths=edges.querySelectorAll('path');
  if(r&&paths.length){
    const p=paths[paths.length-1],sx=r.x+r.w/2,sy=r.y,tx=1080,ty=892;
    p.setAttribute('d',`M${sx} ${sy}C${sx} ${sy-44} ${tx} ${ty+36} ${tx} ${ty}`);
  }
  const rects=labels.querySelectorAll('rect'),texts=labels.querySelectorAll('text');
  if(rects.length&&texts.length){
    const bg=rects[rects.length-1],tx=texts[texts.length-1];
    bg.setAttribute('x','1090');bg.setAttribute('y','898');bg.setAttribute('width','110');bg.setAttribute('height','18');
    tx.setAttribute('x','1145');tx.setAttribute('y','910');
  }
}

function start(){
  patch();
  const nodes=document.getElementById('nodes'),edges=document.getElementById('edges');
  let raf=0;const schedule=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;patch()})};
  if(nodes)new MutationObserver(schedule).observe(nodes,{subtree:true,attributes:true,attributeFilter:['transform']});
  if(edges)new MutationObserver(schedule).observe(edges,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else requestAnimationFrame(start);
})();