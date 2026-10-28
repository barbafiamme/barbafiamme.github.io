/* Interruttore di "Crea il tuo gioco".
   Si accende e si spegne da impostazioni.json:  "crea": true  = aperto,  "crea": false = [In Lavorazione].
   Nelle pagine: data-crea-on  = si vede solo con la pagina aperta
                 data-crea-off = si vede solo con la pagina spenta (ci scrive dentro il messaggio)  */
(function(){
  const css=document.createElement('style');
  css.textContent='html.crea-off [data-crea-on]{display:none!important}html:not(.crea-off) [data-crea-off]{display:none!important}';
  document.head.append(css);
  window.BFCrea=fetch('impostazioni.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({})).then(c=>{
    const aperta=c.crea!==false;
    if(!aperta){
      document.documentElement.classList.add('crea-off');
      const msg='[In Lavorazione] '+(typeof c.messaggio==='string'&&c.messaggio.trim()?c.messaggio.trim():'Per ora non si possono creare o cambiare videogiochi.');
      const put=()=>document.querySelectorAll('[data-crea-off]').forEach(el=>{const t=el.querySelector('[data-crea-msg]')||el;t.textContent=msg});
      document.readyState==='loading'?document.addEventListener('DOMContentLoaded',put):put();
    }
    return aperta;
  });
})();
