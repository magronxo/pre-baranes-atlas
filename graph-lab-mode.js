(()=>{
const svg=document.getElementById('g'),nav=document.querySelector('.nav'),saveBtn=document.getElementById('save'),status=document.getElementById('status');
if(!svg||!nav)return;
const KEY='pre-baranes-atlas:mode:v1';
const INFO={
'Oriol':{type:'Owner / Project Manager',summary:'Defineix la intenció de producte, l’abast i les decisions materials. És l’autoritat humana del producte.',flow:'Intenció i decisions → ChatGPT / Master.'},
'ChatGPT / Master':{type:'Master / reasoning',summary:'Govern tècnic i arquitectònic de PRE-BARANES. Converteix la intenció d’Oriol en arquitectura, seqüència, verificació i següent acció tècnica.',flow:'Oriol → Master → Inbox / PRE-BARANES.'},
'Telegram':{type:'Channel / interface',summary:'Canal d’atenció i interacció. Exposa Radar i Architect sense convertir Telegram en autoritat o runtime.',flow:'Radar i Architect ↔ Telegram → Oriol.'},
'Radar':{type:'Radar / intelligence',summary:'Nucli de descoberta i intel·ligència de PRE-BARANES. Organitza senyals, canvis i informació útil per a l’owner.',flow:'Telegram → Radar → Research Agent / Radar Web.'},
'Personal':{type:'Radar lane',summary:'Vista de Radar orientada a l’atenció i context personal de l’owner.',flow:'Forma part del Radar general.'},
'Intelligence':{type:'Radar lane',summary:'Vista de Radar orientada a intel·ligència tècnica i canvis rellevants.',flow:'Forma part del Radar general.'},
'Architect':{type:'Telegram sub-channel',summary:'Subcanal de Telegram que dona accés a l’agent Architect de PRE-BARANES.',flow:'Telegram Architect → ARCHITECT.'},
'ARCHITECT':{type:'OpenClaw agent · routing / orchestration',summary:'Agent d’orquestració. Rep handoffs, interpreta el treball admès, selecciona ruta/model i deriva cap a research o cap al boundary de Baranes.',flow:'Inbox / Telegram → ARCHITECT → Research Agent / Runtime Guardrails.'},
'Model Recommend':{type:'Routing capability',summary:'Recomanació de model/provider adequada a la tasca dins de la capa de routing.',flow:'Capacitat adjunta a ARCHITECT.'},
'Inbox':{type:'Entry / handoff',summary:'Punt d’entrada neutral de treball des del Master cap a PRE-BARANES.',flow:'ChatGPT / Master → Inbox → ARCHITECT.'},
'Research Agent':{type:'OpenClaw agent',summary:'Agent de recerca i verificació. Investiga senyals/material rellevant i produeix coneixement estructurat.',flow:'Radar / ARCHITECT → Research Agent → Knowledge Database.'},
'Writer Agent':{type:'OpenClaw agent',summary:'Agent d’escriptura estructurada per preparar material que ha d’entrar al domini de ledger.',flow:'Writer Agent → LedgerOps.'},
'Curator Agent':{type:'OpenClaw agent',summary:'Agent de curació: ordena, selecciona i preserva material/proveniència abans del tractament de ledger.',flow:'Curator Agent → LedgerOps.'},
'QA Agent':{type:'OpenClaw agent',summary:'Agent de quality assurance sobre treball que ha d’entrar al flux de repositori.',flow:'QA Agent → RepoOps.'},
'Knowledge Database':{type:'Data / knowledge',summary:'Base de coneixement i context de PRE-BARANES. No és Ledger ni autoritat Baranes.',flow:'Research Agent → Knowledge Database.'},
'Radar Web':{type:'Owner Web UI',summary:'Interfície web humana del Radar: cerca, “Interesting Now” i vista d’entitat. És una surface, no un agent.',flow:'Radar → Radar Web → Oriol.'},
'PRE-BARANES':{type:'System container',summary:'Capa de baixa autoritat per context, radar, routing, research i preparació del treball abans de creuar boundaries governats.',flow:'Master / Telegram → PRE-BARANES → Runtime Guardrails / Baranes.'},
'Baranes Core / Control Plane':{type:'Governed control plane',summary:'Contenidor del control plane de Baranes: boundaries, efectes governats, repos, host, ledger i publication.',flow:'Runtime Guardrails → Ops domains → efectes governats.'},
'Runtime Guardrails':{type:'Entry / guardrail',summary:'Punt d’entrada de PRE-BARANES a Baranes. Aplica el boundary de runtime i deriva només efectes admesos.',flow:'ARCHITECT → Runtime Guardrails → RepoOps / HostOps / LedgerOps.'},
'RepoOps':{type:'Ops / control domain',summary:'Domini governat d’operacions sobre repositoris.',flow:'Runtime Guardrails / QA → RepoOps → SDD / PublicationOps.'},
'HostOps':{type:'Ops / control domain',summary:'Domini governat d’operacions i efectes sobre host.',flow:'Runtime Guardrails → HostOps.'},
'LedgerOps':{type:'Ops / control domain',summary:'Domini governat d’operacions sobre ledger/evidència durable.',flow:'Runtime Guardrails / Writer / Curator → LedgerOps → PublicationOps.'},
'PublicationOps':{type:'Ops / control domain',summary:'Domini de publicació i sortida governada.',flow:'RepoOps + LedgerOps → PublicationOps.'},
'Coding Agents':{type:'Execution role',summary:'Bloc d’agents d’implementació que executen treball de codi després de la preparació/governança corresponent.',flow:'SDD → Coding Agents.'},
'Codex':{type:'Coding agent',summary:'Agent d’implementació de codi disponible dins del rol Coding Agents.',flow:'Membre de Coding Agents.'},
'OpenCode':{type:'Coding agent',summary:'Agent d’implementació de codi disponible dins del rol Coding Agents.',flow:'Membre de Coding Agents.'},
'OCWS':{type:'OpenClaw-specific tooling',summary:'Consola/tooling específic d’OpenClaw per observació de quota, host i diagnòstic.',flow:'Conté Quota State, Host Probes i Diagnostic Probes.'},
'Quota State':{type:'OCWS provider',summary:'Estat observat de quota/capacitat utilitzat per OCWS.',flow:'Subcomponent d’OCWS.'},
'Host Probes':{type:'OCWS provider',summary:'Probes d’observació del host.',flow:'Subcomponent d’OCWS.'},
'Diagnostic Probes':{type:'OCWS provider',summary:'Probes de diagnòstic específics del runtime/tooling.',flow:'Subcomponent d’OCWS.'},
'SDD':{type:'Governance / delivery stage',summary:'Etapa visual entre RepoOps i els agents de codi. Representa el lifecycle/especificació governada; ChatGPT no té autoritat SDD canònica.',flow:'RepoOps → SDD → Coding Agents.'},
'REPOS':{type:'Product repositories',summary:'Agrupació visual dels repositoris/productes que reben implementació i delivery.',flow:'Conté ops_dashboard i hf-downloader.'},
'ops_dashboard':{type:'Product repo',summary:'Repositori/producte OpenClaw Ops Dashboard.',flow:'Membre de REPOS.'},
'hf-downloader':{type:'Product repo',summary:'Repositori/producte hf-downloader.',flow:'Membre de REPOS.'}
};
const style=document.createElement('style');style.textContent=`
#atlas-mode-group{display:flex;gap:4px;padding:2px;border:1px solid #3b485b;border-radius:10px;background:#0f172a80}
#atlas-mode-group button{border:0!important;background:transparent!important;padding:5px 9px!important;color:#94a3b8!important}
#atlas-mode-group button.active{background:#334155!important;color:#fff!important;box-shadow:inset 0 0 0 1px #64748b}
body[data-atlas-mode="view"] #g .node,body[data-atlas-mode="view"] #g .module,body[data-atlas-mode="view"] #g .container-node,body[data-atlas-mode="view"] #g .baranes-container-node,body[data-atlas-mode="view"] #g .baranes-module,body[data-atlas-mode="view"] #g .runtime-box-owned,body[data-atlas-mode="view"] #g .atlas-delivery-node,body[data-atlas-mode="view"] #g .radar-web-node,body[data-atlas-mode="view"] #g .writer-module{cursor:pointer!important}
body[data-atlas-mode="view"] #g .resize-handle{cursor:pointer!important}
.atlas-info-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(2,6,12,.24);backdrop-filter:blur(1.5px);padding:28px}
.atlas-info-overlay.open{display:flex}
.atlas-info-card{position:relative;width:min(520px,calc(100vw - 48px));max-height:min(72vh,650px);overflow:auto;padding:24px 26px 22px;border:1px solid rgba(148,163,184,.48);border-radius:18px;background:rgba(15,20,27,.90);box-shadow:0 24px 90px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.06);backdrop-filter:blur(12px);color:#f8fafc}
.atlas-info-close{position:absolute;right:14px;top:12px;width:32px;height:32px;border-radius:9px;border:1px solid #475569;background:#111827;color:#cbd5e1;font-size:18px;cursor:pointer}
.atlas-info-type{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd;font-weight:700;margin:0 42px 7px 0}
.atlas-info-title{font-size:22px;line-height:1.2;margin:0 42px 14px 0;color:#fff}
.atlas-info-summary{font-size:14px;line-height:1.65;color:#dbe4ef;margin:0 0 18px}
.atlas-info-flow{padding:12px 14px;border:1px solid rgba(100,116,139,.5);border-radius:12px;background:rgba(30,41,59,.58);font-size:12px;line-height:1.55;color:#cbd5e1}
.atlas-info-flow b{color:#f8fafc}
@media(max-width:700px){.atlas-info-overlay{padding:14px}.atlas-info-card{padding:20px}.atlas-info-title{font-size:19px}}
`;document.head.appendChild(style);
const group=document.createElement('span');group.id='atlas-mode-group';
const viewBtn=document.createElement('button');viewBtn.type='button';viewBtn.textContent='View';viewBtn.title='Consulta el mapa';
const designBtn=document.createElement('button');designBtn.type='button';designBtn.textContent='Design';designBtn.title='Mou i redimensiona el mapa';
group.append(viewBtn,designBtn);nav.insertBefore(group,saveBtn||null);
const overlay=document.createElement('div');overlay.className='atlas-info-overlay';overlay.innerHTML=`<section class="atlas-info-card" role="dialog" aria-modal="true" aria-labelledby="atlas-info-title"><button class="atlas-info-close" type="button" aria-label="Tancar">×</button><div class="atlas-info-type"></div><h2 class="atlas-info-title" id="atlas-info-title"></h2><p class="atlas-info-summary"></p><div class="atlas-info-flow"></div></section>`;document.body.appendChild(overlay);
const q=s=>overlay.querySelector(s),close=()=>overlay.classList.remove('open');q('.atlas-info-close').addEventListener('click',close);overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)close()});window.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const clean=s=>(s||'').replace(/^[^A-Za-zÀ-ÿ0-9]+\s*/,'').trim();
function keyFromText(s){const c=clean(s);if(INFO[c])return c;for(const k of Object.keys(INFO))if(c===k||c.includes(k))return k;return c}
function component(target){
 const exact=target.closest?.('text');if(exact){const k=keyFromText(exact.textContent);if(INFO[k])return k}
 const radarSub=target.closest?.('.radar-sub');if(radarSub){const k=keyFromText(radarSub.textContent);if(INFO[k])return k}
 const sub=target.closest?.('.subbox');if(sub){const k=keyFromText(sub.textContent);if(INFO[k])return k}
 const delivery=target.closest?.('[data-delivery-id]');if(delivery){const id=delivery.dataset.deliveryId;return ({sdd:'SDD',repos:'REPOS',curator:'Curator Agent',qa:'QA Agent'})[id]||null}
 const bm=target.closest?.('.baranes-module');if(bm)return ({runtime:'Runtime Guardrails',repoops:'RepoOps',hostops:'HostOps',ledgerops:'LedgerOps',publicationops:'PublicationOps'})[bm.dataset.baranesModule]||null;
 if(target.closest?.('.writer-module'))return 'Writer Agent';
 if(target.closest?.('.radar-web-node'))return 'Radar Web';
 if(target.closest?.('.research-module'))return 'Research Agent';
 if(target.closest?.('.knowledge-module'))return 'Knowledge Database';
 if(target.closest?.('.inbox-module'))return 'Inbox';
 if(target.closest?.('.routing-module'))return 'ARCHITECT';
 if(target.closest?.('.radar-module'))return 'Radar';
 const rt=target.closest?.('.runtime-box-owned');if(rt)return (rt.textContent||'').includes('Coding Agents')?'Coding Agents':'OCWS';
 if(target.closest?.('.baranes-container-node'))return 'Baranes Core / Control Plane';
 const c=target.closest?.('.container-node[data-id="prebaranes"]');if(c)return 'PRE-BARANES';
 const n=target.closest?.('.node[data-id]');if(n)return ({oriol:'Oriol',chatgpt:'ChatGPT / Master',telegram:'Telegram'})[n.dataset.id]||null;
 return null;
}
function show(key){const d=INFO[key]||{type:'Atlas component',summary:'Component del mapa PRE-BARANES / Baranes.',flow:'Relacions visibles al mapa.'};q('.atlas-info-type').textContent=d.type;q('.atlas-info-title').textContent=key;q('.atlas-info-summary').textContent=d.summary;q('.atlas-info-flow').innerHTML=`<b>Flux principal</b><br>${d.flow}`;overlay.classList.add('open')}
let mode=localStorage.getItem(KEY)||'view';if(mode!=='view'&&mode!=='design')mode='view';
function setMode(next){mode=next;document.body.dataset.atlasMode=mode;viewBtn.classList.toggle('active',mode==='view');designBtn.classList.toggle('active',mode==='design');try{localStorage.setItem(KEY,mode)}catch(_){};if(status)status.textContent=mode==='view'?'View · clica una caixa per consultar-la · drag bloquejat':'Design · arrossega i redimensiona · Save layout per conservar-ho';if(mode==='design')close()}
viewBtn.addEventListener('click',()=>setMode('view'));designBtn.addEventListener('click',()=>setMode('design'));
let pending=null;
svg.addEventListener('pointerdown',e=>{if(mode!=='view')return;const key=component(e.target);if(!key)return;e.preventDefault();e.stopImmediatePropagation();pending={key,id:e.pointerId,x:e.clientX,y:e.clientY}},true);
svg.addEventListener('pointermove',e=>{if(!pending||e.pointerId!==pending.id)return;if(Math.hypot(e.clientX-pending.x,e.clientY-pending.y)>7)pending.moved=true},true);
svg.addEventListener('pointerup',e=>{if(!pending||e.pointerId!==pending.id)return;e.preventDefault();e.stopImmediatePropagation();const p=pending;pending=null;if(!p.moved)show(p.key)},true);
svg.addEventListener('pointercancel',()=>{pending=null},true);
setMode(mode);
})();