(()=>{
const svg=document.getElementById('g'),nav=document.querySelector('.nav'),save=document.getElementById('save'),status=document.getElementById('status');
if(!svg||!nav)return;
const KEY='pre-baranes-atlas:modules-atlas:mode:v1';
const style=document.createElement('style');style.textContent=`
#modules-mode-group{display:flex;gap:4px;padding:2px;border:1px solid #3b485b;border-radius:10px;background:#0f172a80}
#modules-mode-group button{border:0!important;background:transparent!important;padding:5px 9px!important;color:#94a3b8!important}
#modules-mode-group button.active{background:#334155!important;color:#fff!important;box-shadow:inset 0 0 0 1px #64748b}
body[data-modules-mode="view"] #edge-handles{display:none}
body[data-modules-mode="view"] .module-node{cursor:default!important}
body[data-modules-mode="design"] .module-node{cursor:move!important}
`;document.head.appendChild(style);
const group=document.createElement('span');group.id='modules-mode-group';
const view=document.createElement('button');view.type='button';view.textContent='View';view.title='Consulta el mapa sense editar-lo';
const design=document.createElement('button');design.type='button';design.textContent='Design';design.title='Mou mòduls i modela les fletxes';
group.append(view,design);nav.insertBefore(group,save||null);
let mode=localStorage.getItem(KEY)||'design';if(mode!=='view'&&mode!=='design')mode='design';
function setMode(next){
 mode=next;document.body.dataset.modulesMode=mode;
 view.classList.toggle('active',mode==='view');design.classList.toggle('active',mode==='design');
 try{localStorage.setItem(KEY,mode)}catch(_){}
 if(status)status.textContent=mode==='view'?'View · edició bloquejada · pan / zoom disponibles':'Design · mou mòduls i els dos punts de cada fletxa · Save layout per conservar-ho';
}
view.addEventListener('click',()=>setMode('view'));design.addEventListener('click',()=>setMode('design'));
window.addEventListener('pointerdown',e=>{
 if(mode!=='view')return;
 if(e.target.closest?.('.module-node,.edge-handle')){e.preventDefault();e.stopImmediatePropagation()}
},true);
setMode(mode);
})();