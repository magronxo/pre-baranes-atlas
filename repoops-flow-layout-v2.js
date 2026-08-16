(()=>{
const BASE_KEY='pre-baranes-atlas:repoops-flow:v1';
const P2_KEY='pre-baranes-atlas:repoops-flow:phase2:v1';
const PRIMITIVES_KEY='pre-baranes-atlas:repoops-flow:primitives:v1';

// Reviewed layout exported by Oriol on 2026-08-16.
// It is the public default only when a browser has no personal saved layout.
const BAKED_BASE={"positions":{"seed":{"x":38,"y":108},"intake":{"x":205,"y":108},"design":{"x":382,"y":108},"spec":{"x":559,"y":108},"validation":{"x":736,"y":108},"tasks":{"x":921,"y":108},"implementation":{"x":1107.3352623199655,"y":103.7709130670383},"verify":{"x":1305.8345445142336,"y":106.45817386592338},"audit":{"x":1484.5849256741208,"y":108},"closed":{"x":1658,"y":108},"seedDossier":{"x":38,"y":397},"featureRecord":{"x":224.70994750557543,"y":280.61109244235723},"designDoc":{"x":378,"y":360.9963950586747},"specDoc":{"x":555.8000984560168,"y":362.59656138241587},"validationEvidence":{"x":726.3998030879663,"y":362.548374707748},"tasksDoc":{"x":918.7594918274611,"y":464.6731329893683},"candidate":{"x":1107.3415736623137,"y":503.9451120140659},"verifyEvidence":{"x":1299.5851367847463,"y":358.74205430662624},"auditEvidence":{"x":1476.667653417004,"y":359.48379727883224},"gitSdd":{"x":920.402919929459,"y":364.0482750989938},"gitAdoption":{"x":1103.2563603215208,"y":363.4975616742582},"gitClosure":{"x":1474.800128976652,"y":471.59853360696263},"control":{"x":86.39218963361958,"y":915.548948179813},"helper":{"x":367.9520682709765,"y":917.6827701818601},"job":{"x":622.9521245769956,"y":921.7899518958984},"queue":{"x":871.4760059824789,"y":921.7899518958984},"runner":{"x":1192.294183869697,"y":899.2179700648485},"phaseController":{"x":370,"y":678},"artifactWriter":{"x":546.2208575912305,"y":678.8555950326328},"specValidator":{"x":721.6246661650055,"y":678.9566816795016},"gateInspector":{"x":841.3218845717935,"y":789.9335447599428},"contextCodex":{"x":947.2619203377511,"y":673.6841799732277},"planOpenCode":{"x":1145.5120475288152,"y":674.2740632124091},"implementer":{"x":1372.1017542564564,"y":679.9133998540697},"verifier":{"x":1132.5693079192386,"y":789.0433183204985},"auditor":{"x":1594.1698371294563,"y":683.216839889182},"qa":{"x":1560.8474260543117,"y":790.0000729901335},"adoptionGit":{"x":1320,"y":790}},"controls":{"0":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"1":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"2":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"3":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"4":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"5":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"6":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"7":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"8":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"9":{"c1dx":44.28101112843717,"c1dy":21.878542338187685,"c2dx":-58.41010964210125,"c2dy":3.3320447878164714},"10":{"c1dx":88.77019357625,"c1dy":124.6065588929309,"c2dx":-50.84127307198287,"c2dy":211.50479330354176},"11":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"12":{"c1dx":-724.5427540114156,"c1dy":29.12270967107247,"c2dx":24.466589009849372,"c2dy":-270.6674765890724},"13":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"14":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"15":{"c1dx":-1.4332287606384853,"c1dy":52.24801056005637,"c2dx":0,"c2dy":0},"16":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"17":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"18":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"19":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"20":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"21":{"c1dx":0,"c1dy":0,"c2dx":0.3195934876191586,"c2dy":-29.21833830566095},"22":{"c1dx":-61.937365371027454,"c1dy":0.3046452623916025,"c2dx":-19.223362680038235,"c2dy":-4.583328956478795},"23":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"24":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"25":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},"26":{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0}},"view":{"x":-168.83298667670633,"y":89.02179492682066,"w":2171.233878945487,"h":1016.832135203993}};
const BAKED_P2={"seedWriter":{"x":370,"y":790},"controls":[{"c1dx":-117.00645192000388,"c1dy":64.82649271167213,"c2dx":-136.7779803432399,"c2dy":89.35042441658095},{"c1dx":145.0988990505449,"c1dy":40.89851091931541,"c2dx":-65.62365302525245,"c2dy":-103.20070875848592},{"c1dx":95.23354487178972,"c1dy":-105.70630135861666,"c2dx":33.370805426230845,"c2dy":52.02300886352134},{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},{"c1dx":15.323327498633489,"c1dy":42.7518591483057,"c2dx":16.264882943261227,"c2dy":-2.8327107953097084},{"c1dx":-53.13100275119177,"c1dy":6.473216043037041,"c2dx":-3.542916181733858,"c2dy":2.8525716584800875},{"c1dx":-5.367422497697362,"c1dy":23.80012656730753,"c2dx":8.500008267422118,"c2dy":-7.010511280452306},{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},{"c1dx":0,"c1dy":0,"c2dx":0,"c2dy":0},{"c1dx":-12.128722894381099,"c1dy":7.767378286171038,"c2dx":-72.45195430273748,"c2dy":66.44931314295172},{"c1dx":9.385603532633468,"c1dy":-84.5509253531352,"c2dx":-99.91124583558553,"c2dy":-105.74200343661221},{"c1dx":60.05657307019237,"c1dy":-186.76155193998653,"c2dx":63.34090997616477,"c2dy":-51.61814184630174},{"c1dx":-2.893846078531851,"c1dy":62.877696644572325,"c2dx":-16.340900243581927,"c2dy":22.719023499537002},{"c1dx":141.0974234125065,"c1dy":122.6634106472003,"c2dx":22.912466489473445,"c2dy":67.5319751633275},{"c1dx":-81.75445595211795,"c1dy":67.38984849840733,"c2dx":-1.235162662849234,"c2dy":-47.56285579304085},{"c1dx":121.71194214341358,"c1dy":-258.6512245886598,"c2dx":0,"c2dy":0},{"c1dx":125.90149069694826,"c1dy":-46.54361091446208,"c2dx":-31.906929162790675,"c2dy":33.96740388135834}]};
const BAKED_PRIMITIVES={"results":{"x":1202.1585015026449,"y":1002.405984563304},"consumption":{"x":1201.9095755028793,"y":982.488839174844},"request":{"x":1202.6592273699105,"y":963.1600386468785},"reservation":{"x":879.833980124036,"y":903.2850945230937},"capability":{"x":623.7759516866485,"y":900.2025741444072},"admission":{"x":336.80557117553394,"y":896.5024865379635},"recovery":{"x":1372.83142342873,"y":983.0433940305359}};
try{
  if(!localStorage.getItem(BASE_KEY))localStorage.setItem(BASE_KEY,JSON.stringify(BAKED_BASE));
  if(!localStorage.getItem(P2_KEY))localStorage.setItem(P2_KEY,JSON.stringify(BAKED_P2));
  if(!localStorage.getItem(PRIMITIVES_KEY))localStorage.setItem(PRIMITIVES_KEY,JSON.stringify(BAKED_PRIMITIVES));
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