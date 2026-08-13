(()=>{
  const mark=()=>{
    const architect=document.querySelector('#nodes .routing-name');
    if(architect && architect.textContent!=='🦞 ARCHITECT') architect.textContent='🦞 ARCHITECT';
    const research=document.querySelector('#nodes .research-name');
    if(research && research.textContent!=='🦞 Research Agent') research.textContent='🦞 Research Agent';
  };
  mark();
  const nodes=document.getElementById('nodes');
  if(nodes) new MutationObserver(mark).observe(nodes,{childList:true,subtree:true});
})();