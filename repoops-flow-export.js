(()=>{
const nav=document.querySelector('.nav'),save=document.getElementById('save'),status=document.getElementById('status');
if(!nav||!save)return;
const btn=document.createElement('button');btn.id='copy-layout';btn.type='button';btn.textContent='Copy layout';btn.title='Copia nodes, corbes, primitives i viewport del RepoOps Flow';
nav.insertBefore(btn,save);
const KEYS={
  base:'pre-baranes-atlas:repoops-flow:v1',
  phase2:'pre-baranes-atlas:repoops-flow:phase2:v1',
  primitives:'pre-baranes-atlas:repoops-flow:primitives:v1',
  mode:'pre-baranes-atlas:repoops-flow:mode:v1'
};
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return localStorage.getItem(k)}}
async function copy(){
  try{save.click()}catch(_){}
  const payload={format:'pre-baranes-atlas.repoops-layout.v1',exported_at:new Date().toISOString(),base:read(KEYS.base),phase2:read(KEYS.phase2),primitives:read(KEYS.primitives),mode:localStorage.getItem(KEYS.mode)||null};
  const text=JSON.stringify(payload,null,2);
  try{await navigator.clipboard.writeText(text);btn.textContent='Copied';if(status)status.textContent='Layout JSON copiat · enganxa’l al xat per bakejar-lo al repo';setTimeout(()=>btn.textContent='Copy layout',1800)}catch(_){
    window.prompt('Copia aquest layout JSON i enganxa’l al xat:',text);
    if(status)status.textContent='Layout JSON preparat per copiar';
  }
}
btn.addEventListener('click',copy);
})();
