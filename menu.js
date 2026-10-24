/* Menu di Barbafiamme: riempie <nav class="bf-menu" data-page="..."></nav> su ogni pagina.
   Su computer: una riga di pulsanti. Su telefono: un pulsante "Menu" che apre una griglia di pulsanti grandi. */
(function(){
  const ITEMS=[
    ['home','index.html','🏠','Home'],
    ['amici','amici.html','🎮','Piccoli Inventori'],
    ['record','record.html','🏆','Sala dei Record'],
    ['disegni','disegni.html','🖍️','Disegni'],
    ['crea','crea.html','✏️','Crea il tuo gioco']
  ];
  const css=`
.bf-menu{width:100%;font-family:'Baloo 2','Trebuchet MS',system-ui,sans-serif}
.bf-menu ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.bf-menu a,.bf-menu .bf-toggle{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-weight:800;font-size:16px;line-height:1.2;color:#1f1d2b;text-decoration:none;background:#fff;border:3px solid #1f1d2b;border-radius:12px;padding:6px 12px;box-shadow:3px 3px 0 #1f1d2b;white-space:nowrap;cursor:pointer}
.bf-menu a:hover{background:#fff4cf}
.bf-menu a:active,.bf-menu .bf-toggle:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #1f1d2b}
.bf-menu a[aria-current="page"]{background:#ffc93c}
.bf-menu a:focus-visible,.bf-menu .bf-toggle:focus-visible{outline:3px dashed #2f6fe4;outline-offset:3px}
.bf-menu .bf-toggle{display:none}
@media (max-width:640px){
  .bf-menu .bf-toggle{display:flex;width:100%;justify-content:space-between;font-size:18px;padding:10px 14px;background:#ffc93c}
  .bf-menu .bf-toggle .bf-ico{font-size:22px;line-height:1}
  .bf-menu ul{display:none;margin-top:10px;grid-template-columns:1fr 1fr;gap:10px}
  .bf-menu.open ul{display:grid}
  .bf-menu li{min-width:0}
  .bf-menu ul a{width:100%;box-sizing:border-box;flex-direction:column;justify-content:center;gap:2px;min-height:76px;padding:8px 6px;font-size:16px;white-space:normal;text-align:center;line-height:1.1}
  .bf-menu ul a span[aria-hidden]{font-size:26px;line-height:1}
  .bf-menu li:last-child:nth-child(odd){grid-column:1/-1}
}`;
  function build(nav,n){
    if(!document.getElementById('bf-menu-css')){const s=document.createElement('style');s.id='bf-menu-css';s.textContent=css;document.head.append(s)}
    const page=nav.dataset.page||'';nav.setAttribute('aria-label','Menu del sito');
    const listId='bf-menu-list-'+n,cur=ITEMS.find(i=>i[0]===page);
    const tg=document.createElement('button');tg.type='button';tg.className='bf-toggle';tg.setAttribute('aria-expanded','false');tg.setAttribute('aria-controls',listId);
    const lab=document.createElement('span');lab.textContent=cur?cur[2]+' '+cur[3]:'Menu';
    const ico=document.createElement('span');ico.className='bf-ico';ico.setAttribute('aria-hidden','true');ico.textContent='☰';
    const sr=document.createElement('span');sr.textContent='Menu';sr.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
    tg.append(lab,sr,ico);
    const ul=document.createElement('ul');ul.id=listId;
    ITEMS.forEach(([id,href,ic,label])=>{const li=document.createElement('li'),a=document.createElement('a');a.href=href;
      const i=document.createElement('span');i.setAttribute('aria-hidden','true');i.textContent=ic;a.append(i,document.createTextNode(label));
      if(id===page)a.setAttribute('aria-current','page');a.addEventListener('click',()=>set(false));li.append(a);ul.append(li)});
    function set(o){nav.classList.toggle('open',o);tg.setAttribute('aria-expanded',o);ico.textContent=o?'✕':'☰'}
    tg.addEventListener('click',()=>set(!nav.classList.contains('open')));
    document.addEventListener('click',e=>{if(!nav.contains(e.target))set(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){set(false);tg.focus()}});
    nav.textContent='';nav.append(tg,ul)}
  function run(){document.querySelectorAll('nav.bf-menu').forEach(build)}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
})();
