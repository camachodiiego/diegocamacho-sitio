/* ============================================================
   Diego Camacho — app.js (v7, consolidado)
   Base: tu archivo original (marquesina, portadas, tira horizontal,
   tablero interactivo, testimonios, Diario en el menú) + los ajustes
   que aprobaste después (logo grande, preloader con nombre, hero con
   imagen a sangre completa, marcadores claros, botón flotante).
   Sin precios numéricos expuestos: solo "cotización personalizada".
   ============================================================ */

window.SITE_CONFIG = window.SITE_CONFIG || { ghOwner: "camachodiiego", ghRepo: "diegocamacho-sitio" };
const CAT_LABELS = { producto:'Producto', gastronomia:'Gastronomía', publicidad:'Publicidad', direccion:'Dirección de set' };

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
async function loadJSON(p){ try{ const r = await fetch(p, {cache:"no-store"}); return r.ok ? await r.json() : null; }catch(e){ return null; } }
function relSrc(p){ return (p||'').replace(/^\/+/, ''); }
function esc(s){ return (s||'').replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

/* ---------- Reveal-on-scroll ---------- */
let io = null;
function observe(nodes){
  nodes = nodes.filter(Boolean);
  if(!nodes.length) return;
  if(reduced()){ nodes.forEach(n=>n.classList.add('visible')); return; }
  io = io || new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold:.12, rootMargin:'0px 0px -6% 0px' });
  nodes.forEach(n=>io.observe(n));
}

/* ---------- Marcadores claros de imagen faltante ---------- */
const PH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="9" cy="10" r="1.7"/><path d="M21 16l-5.2-5.2a1.5 1.5 0 00-2.1 0L4 20"/></svg>';
function phInner(title, sub){ return `<div class="ph-label">${PH_ICON}<span class="pht">${esc(title)}</span><span class="phs">${esc(sub)}</span></div>`; }
function phBlock(title, sub){ return `<div class="ph">${PH_ICON}<span>${esc(title)}${sub?' — '+esc(sub):''}</span></div>`; }
window.__phFallback = function(img, path){
  const frame = img.parentElement;
  if(!frame) return;
  frame.classList.add('is-ph');
  frame.innerHTML = phInner('Imagen no encontrada', 'Ruta esperada: '+path);
};
function imgOrPh(src, alt){
  if(src) return `<img src="${src}" alt="${esc(alt)}" loading="lazy" onerror="window.__phFallback(this,'${src}')">`;
  return null;
}

/* ---------- Preloader + header + hero + menú (el símbolo nunca se anima) ---------- */
function initChrome(){
  const preloader = document.getElementById('preloader');
  const hero = document.getElementById('hero');
  const header = document.getElementById('header');
  if(preloader){
    requestAnimationFrame(()=>preloader.classList.add('ready'));
    let finished = false;
    const reveal = ()=>{
      if(finished) return; finished = true;
      preloader.classList.add('done');
      if(hero) hero.classList.add('in');
    };
    const minWait = new Promise(res=>setTimeout(res, 2200));
    const loaded = new Promise(res=>{
      if(document.readyState === 'complete') res();
      else window.addEventListener('load', ()=>res(), {once:true});
    });
    const capped = new Promise(res=>setTimeout(res, 4000));
    Promise.race([Promise.all([minWait, loaded]), capped]).then(reveal);
  } else if(hero){ hero.classList.add('in'); }

  if(header){
    const onScroll = ()=> header.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
  }

  const burger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    const toggle = (open)=>{ mobileMenu.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); };
    burger.addEventListener('click', ()=> toggle(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>toggle(false)));
    document.addEventListener('keydown', e=>{ if(e.key === 'Escape') toggle(false); });
  }

  const wa = document.getElementById('waFloat');
  if(wa && hero){
    const obs = new IntersectionObserver(es=>es.forEach(e=>wa.classList.toggle('shown', !e.isIntersecting)), {threshold:.05});
    obs.observe(hero);
  } else if(wa){ wa.classList.add('shown'); }
}

/* ---------- Lightbox ---------- */
function initLightbox(){
  const lb = document.createElement('div');
  lb.className = 'lightbox'; lb.id = 'lightbox';
  lb.innerHTML = `<button class="lightbox-close" id="lbClose">Cerrar ✕</button><figure><img id="lbImg" src="" alt=""><figcaption id="lbCap"></figcaption></figure>`;
  document.body.appendChild(lb);
  const img = lb.querySelector('#lbImg'), cap = lb.querySelector('#lbCap');
  function open(src, caption){ img.src = src; img.alt = caption||''; cap.textContent = caption||''; lb.classList.add('active'); }
  function close(){ lb.classList.remove('active'); }
  lb.addEventListener('click', e=>{ if(e.target === lb) close(); });
  lb.querySelector('#lbClose').addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') close(); });
  document.addEventListener('click', e=>{
    const im = e.target.closest('.obra-piece .frame img, .hero-image img, .fphoto img, .cover-img img');
    if(im){ open(im.src, im.alt); }
  });
}

/* ---------- Textos, contacto y servicios (site.json) — SIN precios numéricos ---------- */
async function hydrateSite(){
  const site = await loadJSON('data/site.json') || {};
  window.__SITE = site;
  document.querySelectorAll('[data-site]').forEach(el=>{ const k = el.dataset.site; if(site[k]!=null) el.textContent = site[k]; });
  document.querySelectorAll('[data-site-mail]').forEach(el=>{ if(site.email){ el.href = 'mailto:'+site.email; if(el.dataset.siteMail==='text') el.textContent = site.email; } });
  document.querySelectorAll('[data-site-wa]').forEach(el=>{
    if(site.whatsapp){
      const base = 'https://wa.me/' + String(site.whatsapp).replace(/\D/g,'');
      const msg = el.dataset.waMsg;
      el.href = msg ? base + '?text=' + encodeURIComponent(msg) : base;
    }
  });
  const list = document.querySelector('[data-ofertas-list]');
  if(list && Array.isArray(site.ofertas)){
    list.innerHTML = site.ofertas.map((o,i)=>
      `<li><span class="quote-num">${String(i+1).padStart(2,'0')}</span><div><h4>${esc(o.nombre)}</h4><p>${esc(o.descripcion)}</p></div></li>`
    ).join('');
  }
}

/* ---------- Carga fusionada de las 4 categorías ---------- */
async function loadAllWorks(){
  const cats = Object.keys(CAT_LABELS);
  const datas = await Promise.all(cats.map(c=>loadJSON('data/galeria-'+c+'.json')));
  let items = [];
  cats.forEach((c,i)=>{
    const fotos = (datas[i] && datas[i].fotos) || [];
    fotos.forEach(f=>items.push({cat:c, f}));
  });
  return items;
}

/* ---------- Hero: imagen a sangre completa ---------- */
async function renderHeroImage(items){
  const heroSlot = document.querySelector('[data-hero-image]');
  if(!heroSlot) return null;
  const heroItem = items[0] || null;
  const tag = heroItem ? imgOrPh(relSrc(heroItem.f.imagen), heroItem.f.alt || 'Diego Camacho — fotografía y video comercial') : null;
  heroSlot.innerHTML = tag || phBlock('Tu mejor toma abre aquí', 'sube la foto principal desde el Administrador');
  observe([heroSlot]);
  return heroItem;
}

/* ---------- Portadas por categoría (grid con hover) ---------- */
async function renderCovers(container, items){
  const cats = Object.keys(CAT_LABELS);
  container.innerHTML = cats.map(c=>{
    const first = items.find(it=>it.cat===c);
    const src = first ? relSrc(first.f.imagen) : null;
    const client = first ? (first.f.cliente || first.f.ficha || '') : '';
    const tag = src ? `<img src="${src}" alt="${esc(CAT_LABELS[c])}" onerror="window.__phFallback(this,'${src}')">` : '';
    const ph = !src ? phInner(CAT_LABELS[c], 'sube la primera foto desde el Administrador') : '';
    return `<a class="cover" href="#trabajo" data-cat-link="${c}">
      <div class="cover-img">${tag}</div>${ph}
      <div class="cover-meta"><div class="cover-line"><span class="cover-group">${CAT_LABELS[c]}</span><span class="cover-client">${esc(client)||'&nbsp;'}</span></div>
      <span class="cover-cta">Ver galería <span class="arrow">→</span></span></div>
    </a>`;
  }).join('');
  observe([...container.children]);
  container.querySelectorAll('[data-cat-link]').forEach(a=>a.addEventListener('click', e=>{
    e.preventDefault();
    activeCat = a.dataset.catLink;
    document.querySelector('#trabajo')?.scrollIntoView({behavior: reduced()?'auto':'smooth'});
    paintTrabajoTabs();
  }));
}

/* ---------- Tira horizontal (mezcla de categorías) ---------- */
async function renderFeaturedStrip(container, items){
  const picks = items.slice(0, 10);
  if(!picks.length){ container.parentElement.style.display = 'none'; return; }
  container.innerHTML = picks.map(({cat,f})=>{
    const src = relSrc(f.imagen);
    const tag = imgOrPh(src, f.alt||f.ficha||'');
    return `<a class="fphoto${src?'':' is-ph'}" href="#trabajo">${tag||phInner(f.ficha||CAT_LABELS[cat],'')}${src?`<span class="fphoto-tag">${esc(CAT_LABELS[cat])} · ${esc(f.cliente||'')}</span>`:''}</a>`;
  }).join('');
  observe([...container.children]);
}

/* ---------- Trabajo: tabs + galería (dentro de la misma página) ---------- */
let activeCat = 'producto';
let WORKS_DATA = {};
function paintTrabajoTabs(){
  const tabsEl = document.querySelector('[data-cat-tabs]');
  const grid = document.querySelector('[data-trabajo-grid]');
  if(!tabsEl || !grid) return;
  const cats = Object.keys(CAT_LABELS);
  tabsEl.innerHTML = cats.map(c=>`<button class="cat-tab ${c===activeCat?'active':''}" data-cat="${c}">${CAT_LABELS[c]}</button>`).join('');
  tabsEl.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click', ()=>{ activeCat=b.dataset.cat; paintTrabajoTabs(); }));
  const fotos = (WORKS_DATA[activeCat] && WORKS_DATA[activeCat].fotos) || [];
  if(!fotos.length){
    grid.innerHTML = `<div class="obra-empty">Aún no hay fotos en ${CAT_LABELS[activeCat]}. Súbelas desde el Administrador.</div>`;
    return;
  }
  grid.innerHTML = fotos.map((f,i)=>{
    const wide = (i>0 && i%5===0) ? ' wide' : '';
    const src = relSrc(f.imagen);
    const tag = imgOrPh(src, f.alt||f.ficha||'');
    const ctx = `${CAT_LABELS[activeCat].toUpperCase()}${f.cliente?' · '+f.cliente.toUpperCase():''}`;
    return `<div class="obra-piece${wide}"><div class="frame${src?'':' is-ph'}">${tag||phInner(f.ficha||CAT_LABELS[activeCat],'sube la foto desde el Administrador')}${src?'<div class="veil"></div>':''}</div>
      <div class="obra-ficha"><span><span class="t">${esc(f.ficha||CAT_LABELS[activeCat])}</span><span class="ctx">${esc(ctx)}</span></span><span class="by">Dirigida por D.C.</span></div></div>`;
  }).join('');
  const pieces = [...grid.children];
  pieces.forEach((el,i)=>{ el.style.transitionDelay = (i%3)*70+'ms'; });
  observe(pieces);
}
async function renderTrabajoSection(){
  const tabsEl = document.querySelector('[data-cat-tabs]');
  if(!tabsEl) return;
  const cats = Object.keys(CAT_LABELS);
  await Promise.all(cats.map(async c=>{ WORKS_DATA[c] = (await loadJSON('data/galeria-'+c+'.json')) || {fotos:[]}; }));
  paintTrabajoTabs();
}

/* ---------- Testimonios (honesto: solo los reales que subas) ---------- */
async function hydrateTestimonios(container){
  const data = await loadJSON('data/testimonios.json');
  const items = (data && Array.isArray(data.items)) ? data.items.filter(t=>t.cita) : [];
  if(!items.length){
    container.innerHTML = '<div class="testimonials-empty">Los primeros testimonios de este ciclo están por publicarse aquí — directo de las marcas con las que trabajo.</div>';
    return;
  }
  container.innerHTML = items.map(t=>{
    const initials = (t.nombre||'??').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    return `<div class="testimonial"><blockquote>"${esc(t.cita)}"</blockquote>
      <div class="testimonial-author"><div class="avatar">${esc(initials)}</div><div>${esc(t.nombre||'')}<span>${esc(t.rol||'')}</span></div></div></div>`;
  }).join('');
  observe([...container.children]);
}

/* ---------- Tablero "arma tu proyecto" (drag + mezcla de color, sin precios) ---------- */
function initBuildBoard(){
  const field = document.getElementById('buildField');
  if(!field) return;
  const zone = document.getElementById('buildZone');
  const countEl = document.getElementById('buildCount');
  const chips = field.querySelectorAll('.chip');
  const canDrag = window.matchMedia('(min-width: 721px)').matches;
  if(!canDrag) return;
  let active=null, offX=0, offY=0;
  function hexToRgb(h){ h=h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  function zoneRect(){ return zone.getBoundingClientRect(); }
  function inZone(cx,cy){ const z=zoneRect(),r=z.width/2,dx=cx-(z.left+r),dy=cy-(z.top+z.height/2); return (dx*dx+dy*dy)<=r*r; }
  function updateMix(){
    const inside=[...chips].filter(c=>{ const cr=c.getBoundingClientRect(); return inZone(cr.left+cr.width/2, cr.top+cr.height/2); });
    if(!inside.length){ zone.style.removeProperty('--mix'); zone.classList.remove('filled'); countEl.textContent=''; return; }
    let r=0,g=0,b=0; inside.forEach(c=>{ const [cr,cg,cb]=hexToRgb(c.dataset.color); r+=cr;g+=cg;b+=cb; });
    r=Math.round(r/inside.length); g=Math.round(g/inside.length); b=Math.round(b/inside.length);
    zone.style.setProperty('--mix', `rgb(${r},${g},${b})`);
    zone.classList.add('filled');
    countEl.textContent = inside.length + (inside.length===1?' pieza':' piezas');
  }
  function onDown(e){
    const chip=e.currentTarget; active=chip; chip.classList.add('dragging','placed'); chip.setPointerCapture(e.pointerId);
    const r=chip.getBoundingClientRect(), f=field.getBoundingClientRect();
    offX=e.clientX-r.left; offY=e.clientY-r.top;
    chip.style.left=(r.left-f.left)+'px'; chip.style.top=(r.top-f.top)+'px';
    chip.style.removeProperty('--x'); chip.style.removeProperty('--y');
  }
  function onMove(e){
    if(!active) return;
    const f=field.getBoundingClientRect();
    let nx=e.clientX-f.left-offX, ny=e.clientY-f.top-offY;
    nx=Math.max(0,Math.min(nx,f.width-active.offsetWidth)); ny=Math.max(0,Math.min(ny,f.height-active.offsetHeight));
    active.style.left=nx+'px'; active.style.top=ny+'px';
    zone.classList.toggle('hot', inZone(e.clientX,e.clientY));
  }
  function onUp(){ if(!active) return; active.classList.remove('dragging'); zone.classList.remove('hot'); updateMix(); active=null; }
  chips.forEach(chip=>{
    chip.addEventListener('pointerdown', onDown);
    chip.addEventListener('pointermove', onMove);
    chip.addEventListener('pointerup', onUp);
    chip.addEventListener('pointercancel', onUp);
    chip.addEventListener('dragstart', e=>e.preventDefault());
  });
}

/* ---------- Diario: listado + post individual (vía GitHub API) ---------- */
function simpleMarkdown(md){
  const e = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const blocks = md.replace(/\r\n/g,'\n').split(/\n{2,}/);
  return blocks.map(block=>{
    block = block.trim(); if(!block) return '';
    if(/^###\s+/.test(block)) return '<h3>'+inline(block.replace(/^###\s+/,''))+'</h3>';
    if(/^##\s+/.test(block)) return '<h2>'+inline(block.replace(/^##\s+/,''))+'</h2>';
    if(/^#\s+/.test(block)) return '<h2>'+inline(block.replace(/^#\s+/,''))+'</h2>';
    return '<p>'+inline(block).replace(/\n/g,'<br>')+'</p>';
  }).join('\n');
  function inline(t){ t=e(t); t=t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); t=t.replace(/\*(.+?)\*/g,'<em>$1</em>'); t=t.replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>'); return t; }
}
function parseFrontmatter(raw){
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if(!m) return { data:{}, body:raw };
  const data = {};
  m[1].split('\n').forEach(line=>{ const mm = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/); if(mm) data[mm[1]] = mm[2].replace(/^"(.*)"$/,'$1'); });
  return { data, body:m[2] };
}
async function ghListDiario(){
  const {ghOwner, ghRepo} = window.SITE_CONFIG;
  try{
    const r = await fetch(`https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/data/diario`, {cache:"no-store"});
    if(!r.ok) return [];
    const files = await r.json();
    if(!Array.isArray(files)) return [];
    const mds = files.filter(f=>f.name.endsWith('.md'));
    const posts = await Promise.all(mds.map(async f=>{
      const rr = await fetch(f.download_url, {cache:"no-store"});
      const raw = await rr.text();
      const {data, body} = parseFrontmatter(raw);
      return { ...data, body, filename:f.name };
    }));
    return posts.sort((a,b)=> (b.fecha||'').localeCompare(a.fecha||''));
  }catch(e){ return []; }
}
async function renderDiarioList(container){
  const posts = await ghListDiario();
  if(!posts.length){ container.innerHTML = '<div class="diario-empty">Aún no hay artículos publicados. Vuelve pronto.</div>'; return; }
  container.innerHTML = posts.map(p=>`
    <a class="diario-item" href="diario-post.html?slug=${encodeURIComponent(p.slug||p.filename)}">
      <span class="df">${esc(p.fecha||'')}</span>
      <div><h3>${esc(p.titulo||'(sin título)')}</h3><p>${esc(p.extracto||'')}</p></div>
      <span class="arrow">Leer →</span>
    </a>`).join('');
}
async function renderDiarioPost(){
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const root = document.getElementById('postRoot');
  if(!root) return;
  const posts = await ghListDiario();
  const post = posts.find(p=>p.slug===slug || p.filename===slug || p.filename===slug+'.md');
  if(!post){ root.innerHTML = '<div class="diario-empty">No encontré este artículo.</div>'; return; }
  document.title = (post.titulo||'Diario') + ' — Diego Camacho';
  const metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc && post.metaDescripcion) metaDesc.setAttribute('content', post.metaDescripcion);
  root.innerHTML = `
    <div class="post-head"><span class="eyebrow muted">${esc(post.fecha||'')}</span><h1>${esc(post.titulo||'')}</h1></div>
    ${post.portada ? `<img class="post-cover" src="${relSrc(post.portada)}" alt="${esc(post.titulo||'')}">` : ''}
    <div class="post-body">${simpleMarkdown(post.body||'')}</div>`;
}

/* ---------- Reveal genérico para bloques estáticos ---------- */
function tagStatic(){
  document.querySelectorAll('.sec-head, .contact-card, .about-visual, .about-text, .process, .quote-grid').forEach(el=>{
    if(!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  document.querySelectorAll('.process-step').forEach((el,i)=>{ el.classList.add('reveal'); el.style.transitionDelay=(i%4)*70+'ms'; });
  observe([...document.querySelectorAll('.reveal:not(.visible)')]);
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', async ()=>{
  initChrome();
  initLightbox();
  initBuildBoard();
  await hydrateSite();

  const items = await loadAllWorks();
  await renderHeroImage(items);

  const covers = document.querySelector('[data-covers]');
  if(covers) await renderCovers(covers, items);

  const strip = document.querySelector('[data-featured-strip]');
  if(strip) await renderFeaturedStrip(strip, items);

  await renderTrabajoSection();

  const testi = document.querySelector('[data-testimonios]');
  if(testi) await hydrateTestimonios(testi);

  const diarioList = document.querySelector('[data-diario-list]');
  if(diarioList) await renderDiarioList(diarioList);
  await renderDiarioPost();

  tagStatic();
});
