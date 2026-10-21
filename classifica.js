/* Classifica di Barbafiamme
   Salva i punteggi online (Supabase) quando CONFIG è compilato;
   altrimenti usa una classifica solo su questo dispositivo. */
(function(){
  const CONFIG={
    url:'https://fpiyvbkfmdparvhljbgf.supabase.co',
    key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaXl2YmtmbWRwYXJ2aGxqYmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDI3MzYsImV4cCI6MjEwODE3ODczNn0.iDh3xal5H3UcXld0GJy4q6zu8cnnqLOk34JMa3Ofwbw' // chiave pubblica "anon": va bene che sia visibile
  };
  const GAMES={
    granpremio:{title:'Gran Premio dei Disegni',unit:'tempo',asc:true,fmt:v=>(v/100).toFixed(2)+' s'},
    squadriglia:{title:'Squadriglia contro il Buio',unit:'punti',asc:false,fmt:v=>v+' punti'},
    pirati:{title:"Pirati all'Arrembaggio",unit:'monete',asc:false,fmt:v=>v+' monete'}
  };
  const online=!!(CONFIG.url&&CONFIG.key);
  const LS='bf_classifica_';
  function localGet(g){try{return JSON.parse(localStorage.getItem(LS+g)||'[]')}catch(e){return[]}}
  function localSet(g,a){try{localStorage.setItem(LS+g,JSON.stringify(a))}catch(e){}}
  function sortRows(g,a){const asc=GAMES[g].asc;return a.slice().sort((x,y)=>asc?x.score-y.score:y.score-x.score)}
  async function top(g,n=10){
    if(online){const r=await fetch(CONFIG.url+'/rest/v1/scores?select=name,score,created_at&game=eq.'+g+'&order=score.'+(GAMES[g].asc?'asc':'desc')+'&limit='+n,
        {headers:{apikey:CONFIG.key,Authorization:'Bearer '+CONFIG.key}});if(!r.ok)throw new Error('lettura');return r.json()}
    return sortRows(g,localGet(g)).slice(0,n)}
  async function submit(g,name,score){const row={game:g,name,score:Math.round(score)};
    if(online){const r=await fetch(CONFIG.url+'/rest/v1/scores',{method:'POST',headers:{apikey:CONFIG.key,Authorization:'Bearer '+CONFIG.key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row)});
      if(!r.ok)throw new Error('scrittura');return}
    const a=localGet(g);a.push(Object.assign(row,{created_at:new Date().toISOString()}));localSet(g,sortRows(g,a).slice(0,50))}
  function css(){if(document.getElementById('bf-cl-css'))return;const s=document.createElement('style');s.id='bf-cl-css';s.textContent=`
.bfcl{display:flex;flex-direction:column;gap:10px;font-family:inherit;color:inherit;margin-top:4px}
.bfcl h3{margin:0;font-size:20px;line-height:1.1}
.bfcl .note{font-size:13px;opacity:.75;margin:0}
.bfcl form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.bfcl label{font-weight:700;font-size:16px}
.bfcl input{width:5.2em;font:inherit;font-size:24px;font-weight:800;letter-spacing:.25em;text-transform:uppercase;text-align:center;padding:6px 4px;border:3px solid currentColor;border-radius:10px;background:transparent;color:inherit}
.bfcl button{font:inherit;font-weight:800;font-size:16px;padding:8px 16px;border:3px solid currentColor;border-radius:10px;background:#ffc93c;color:#1f1d2b;cursor:pointer}
.bfcl ol{margin:0;padding:0 4px 0 0;list-style:none;display:flex;flex-direction:column;gap:4px;font-variant-numeric:tabular-nums}
.bfcl li{display:grid;grid-template-columns:2.2em 1fr auto;gap:8px;align-items:center;padding:4px 10px;border:2px solid currentColor;border-radius:10px;font-size:16px}
.bfcl li.me{background:#ffc93c;color:#1f1d2b;font-weight:800}
.bfcl li b{letter-spacing:.15em}
.bfcl .rank{font-weight:800}
.bfcl .err{color:#e63946;font-weight:700;margin:0}`;document.head.append(s)}
  function esc(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
  async function renderList(box,g,mine){const ol=document.createElement('ol');box.querySelectorAll('ol,.err,.empty').forEach(n=>n.remove());
    try{const rows=await top(g,20);
      if(!rows.length){const p=document.createElement('p');p.className='note empty';p.textContent='Ancora nessun punteggio: sii il primo!';box.append(p);return}
      let marked=false;rows.forEach((r,i)=>{const li=document.createElement('li');if(mine&&!marked&&r.name===mine.name&&r.score===mine.score){li.className='me';marked=true}
        li.innerHTML='<span class="rank">'+(i+1)+'°</span><b>'+esc(r.name)+'</b><span>'+esc(GAMES[g].fmt(r.score))+'</span>';ol.append(li)});box.append(ol)}
    catch(e){const p=document.createElement('p');p.className='err';p.textContent='La classifica non risponde. Riprova più tardi.';box.append(p)}}
  function mount(el,g,score){css();if(!el||!GAMES[g])return;el.innerHTML='';const box=document.createElement('div');box.className='bfcl';el.append(box);
    box.innerHTML='<h3>'+(online?'Classifica mondiale':'Classifica')+'</h3>'+(online?'':'<p class="note">Per ora la classifica è salvata solo su questo dispositivo.</p>');
    if(score!=null&&score>0){const f=document.createElement('form');const id='bfcl-'+g;
      f.innerHTML='<label for="'+id+'">Le tue iniziali</label><input id="'+id+'" maxlength="3" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="AAA"><button type="submit">Salva '+esc(GAMES[g].fmt(score))+'</button>';
      const inp=f.querySelector('input');try{inp.value=localStorage.getItem('bf_iniziali')||''}catch(e){}
      inp.addEventListener('input',()=>{inp.value=inp.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,3)});
      inp.addEventListener('keydown',e=>e.stopPropagation());
      f.addEventListener('submit',async e=>{e.preventDefault();const name=inp.value;if(name.length!==3){inp.focus();return}
        const btn=f.querySelector('button');btn.disabled=true;btn.textContent='Salvo...';
        try{await submit(g,name,score);try{localStorage.setItem('bf_iniziali',name)}catch(_){}
          f.remove();renderList(box,g,{name,score:Math.round(score)})}
        catch(err){btn.disabled=false;btn.textContent='Riprova';}});
      box.append(f)}
    renderList(box,g,null)}
  window.Classifica={mount,top,submit,GAMES,online};
})();
