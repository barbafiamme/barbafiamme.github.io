/* Menu di Barbafiamme: riempie <nav class="bf-menu" data-page="..."></nav> su ogni pagina */
(function(){
  const ITEMS=[
    ['home','index.html','🏠','Home'],
    ['amici','amici.html','🎮','Piccoli Inventori'],
    ['record','index.html#record','🏆','Sala dei Record'],
    ['disegni','disegni.html','🖍️','Disegni'],
    ['crea','crea.html','✏️','Crea il tuo gioco']
  ];
  const css=`
.bf-menu{width:100%}
.bf-menu ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.bf-menu a{display:inline-flex;align-items:center;gap:6px;font-family:'Baloo 2','Trebuchet MS',system-ui,sans-serif;font-weight:800;font-size:16px;line-height:1.2;color:#1f1d2b;text-decoration:none;background:#fff;border:3px solid #1f1d2b;border-radius:12px;padding:6px 12px;box-shadow:3px 3px 0 #1f1d2b;white-space:nowrap}
.bf-menu a:hover{background:#fff4cf}
.bf-menu a:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #1f1d2b}
.bf-menu a[aria-current="page"]{background:#ffc93c}
.bf-menu a:focus-visible{outline:3px dashed #2f6fe4;outline-offset:3px}
@media (max-width:520px){.bf-menu ul{gap:6px}.bf-menu a{font-size:15px;padding:5px 10px}}`;
  function build(nav){
    if(!document.getElementById('bf-menu-css')){const s=document.createElement('style');s.id='bf-menu-css';s.textContent=css;document.head.append(s)}
    const page=nav.dataset.page||'';nav.setAttribute('aria-label','Menu del sito');
    const ul=document.createElement('ul');
    ITEMS.forEach(([id,href,ico,label])=>{const li=document.createElement('li'),a=document.createElement('a');a.href=href;
      const i=document.createElement('span');i.setAttribute('aria-hidden','true');i.textContent=ico;a.append(i,document.createTextNode(label));
      if(id===page)a.setAttribute('aria-current','page');li.append(a);ul.append(li)});
    nav.textContent='';nav.append(ul)}
  function run(){document.querySelectorAll('nav.bf-menu').forEach(build)}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
})();
