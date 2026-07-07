/* ============================================================
   Diego Camacho — app.js (v4, siguiendo el brief de construcción)
   Hidrata desde /data/*.json (editados por Pages CMS), funde las
   4 categorías en una sola galería "Obra" envolvente, maneja el
   menú hamburguesa, el reveal al scroll, el lightbox y el diario.
   ============================================================ */

window.SITE_CONFIG = window.SITE_CONFIG || { ghOwner: "camachodiiego", ghRepo: "diegocamacho-sitio" };

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
async function loadJSON(p){ try{ const r = await fetch(p, {cache:"no-store"}); return r.ok ? await r.json() : null; }catch(e){ return null; } }
function relSrc(p){ return (p||'').replace(/^\/+/, ''); }

/* ---------- Reveal-on-scroll ---------- */
let io = null;
function observe(nodes){
  if(!nodes.length) return;
  if(reduced()){ nodes.forEach(n=>n.classList.add('visible')); return; }
  io = io || new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold:.12, rootMargin:'0px 0px -6% 0px' });
  nodes.forEach(n=>io.observe(n));
}

/* ---------- Preloader + header + hero (el símbolo nunca se anima) ---------- */
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
    // Espera deliberada mínima (~2.2s) para que el nombre se sienta, con tope máximo de 4s.
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

  // Menú hamburguesa
  const burger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    const toggle = (open)=>{
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', ()=> toggle(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>toggle(false)));
    document.addEventListener('keydown', e=>{ if(e.key === 'Escape') toggle(false); });
  }

  // Botón flotante de WhatsApp: aparece después de pasar el hero
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
    const im = e.target.closest('.obra-piece .frame img, .obra-fullbleed .frame img, .hero-image img');
    if(im){ open(im.src, im.alt); }
  });
}

const PH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="9" cy="10" r="1.7"/><path d="M21 16l-5.2-5.2a1.5 1.5 0 00-2.1 0L4 20"/></svg>';
function phInner(title, sub){ return `<div class="ph-label">${PH_ICON}<span class="pht">${title}</span><span class="phs">${sub}</span></div>`; }
function phBlock(title, sub){ return `<div class="ph">${PH_ICON}<span>${title}${sub?' — '+sub:''}</span></div>`; }
window.__phFallback = function(img, path){
  const frame = img.parentElement;
  if(!frame) return;
  frame.classList.add('is-ph');
  frame.innerHTML = phInner('Imagen no encontrada', 'Ruta esperada: '+path);
};

/* ---------- Textos y contacto ---------- */
async function hydrateSite(){
  const site = await loadJSON('data/site.json') || {};
  document.querySelectorAll('[data-site]').forEach(el=>{ const k = el.dataset.site; if(site[k]!=null) el.textContent = site[k]; });
  document.querySelectorAll('[data-site-mail]').forEach(el=>{ if(site.email){ el.href = 'mailto:'+site.email; if(el.dataset.siteMail==='text') el.textContent = site.email; } });
  document.querySelectorAll('[data-site-wa]').forEach(el=>{
    if(site.whatsapp){
      const base = 'https://wa.me/' + String(site.whatsapp).replace(/\D/g,'');
      const msg = el.dataset.waMsg;
      el.href = msg ? base + '?text=' + encodeURIComponent(msg) : base;
    }
  });
  const cards = document.querySelector('[data-inversion]');
  if(cards && Array.isArray(site.ofertas)){
    const roles = ['Puerta de entrada','Proyecto insignia','La columna del negocio'];
    cards.innerHTML = site.ofertas.map((o,i)=>{
      const msg = encodeURIComponent(`Hola, me interesa "${o.nombre||''}". Cuéntame más.`);
      const waHref = site.whatsapp ? `https://wa.me/${String(site.whatsapp).replace(/\D/g,'')}?text=${msg}` : '#';
      return `<div class="inv-card"><span class="k">${roles[i]||''}</span><h3>${o.nombre||''}</h3><p>${o.descripcion||''}</p>
        <div class="price">Inversión desde ${o.precio||''}<small>Se cotiza a la medida tras el brief.</small></div>
        <a class="inv-link" href="${waHref}" target="_blank">Preguntar por esta opción →</a></div>`;
    }).join('');
  }
}

/* ---------- OBRA: hero + full-bleed + galería, sin repetir fotos ---------- */
const CAT_LABELS = { producto:'Producto', gastronomia:'Gastronomía', publicidad:'Publicidad', direccion:'Dirección de set' };
async function renderObra(){
  const cats = Object.keys(CAT_LABELS);
  const datas = await Promise.all(cats.map(c=>loadJSON('data/galeria-'+c+'.json')));
  let items = [];
  cats.forEach((c,i)=>{
    const fotos = (datas[i] && datas[i].fotos) || [];
    fotos.forEach(f=>items.push({cat:c, f}));
  });

  const heroSlot = document.querySelector('[data-hero-image]');
  const grid = document.querySelector('[data-obra-grid]');
  const fbSlot = document.querySelector('[data-obra-fullbleed]');

  // Hero: la primera pieza disponible, de cualquier categoría.
  let heroItem = items[0] || null;
  if(heroItem){ items = items.filter(it=>it!==heroItem); }

  // Full-bleed de Obra: prioriza Dirección de set; nunca repite la del hero.
  let fbItem = items.find(it=>it.cat==='direccion') || items[0] || null;
  if(fbItem){ items = items.filter(it=>it!==fbItem); }

  if(heroSlot){
    if(heroItem && relSrc(heroItem.f.imagen)){
      const src = relSrc(heroItem.f.imagen);
      heroSlot.innerHTML = `<img src="${src}" alt="${heroItem.f.alt||heroItem.f.ficha||'Diego Camacho — fotografía y video comercial'}" onerror="window.__phFallback(this,'${src}')">`;
    } else {
      heroSlot.innerHTML = phBlock('Tu mejor toma abre aquí', 'sube la foto principal desde el Administrador');
    }
  }

  if(fbSlot){
    if(fbItem){
      const src = relSrc(fbItem.f.imagen);
      const inner = src
        ? `<img src="${src}" alt="${fbItem.f.alt||fbItem.f.ficha||''}" loading="lazy" onerror="window.__phFallback(this,'${src}')"><div class="veil"></div>`
        : phInner(fbItem.f.ficha||'Brand film', 'sube esta foto desde el Administrador');
      fbSlot.innerHTML = `<div class="frame${src?'':' is-ph'}">${inner}</div>
        <div class="ficha-fb"><span class="obra-ficha t" style="font-family:Newsreader,serif">${fbItem.f.ficha||'Serie destacada'}</span><span class="obra-ficha by">Dirigida por D.C.</span></div>`;
      fbSlot.classList.add('reveal-fb');
    } else {
      fbSlot.style.display = 'none';
    }
  }

  if(!grid) return;
  if(!items.length){
    grid.innerHTML = '<div class="obra-empty">Estoy curando la primera selección de obra. Vuelve pronto.</div>';
    if(heroSlot) observe([heroSlot.closest('.hero-image')].filter(Boolean));
    if(fbSlot && fbItem) observe([fbSlot]);
    return;
  }
  grid.innerHTML = items.map((it,i)=>{
    const wide = (i>0 && i % 5 === 0) ? ' wide' : '';
    const src = relSrc(it.f.imagen);
    const alt = it.f.alt || it.f.ficha || 'Fotografía de Diego Camacho';
    const ctx = `${CAT_LABELS[it.cat].toUpperCase()}${it.f.cliente ? ' · '+it.f.cliente.toUpperCase() : ''}`;
    const inner = src
      ? `<img src="${src}" alt="${alt}" loading="lazy" onerror="window.__phFallback(this,'${src}')"><div class="veil"></div>`
      : phInner(it.f.ficha||CAT_LABELS[it.cat], 'sube la foto desde el Administrador');
    return `<div class="obra-piece${wide}">
      <div class="frame${src?'':' is-ph'}">${inner}</div>
      <div class="obra-ficha"><span><span class="t">${it.f.ficha||CAT_LABELS[it.cat]}</span><span class="ctx">${ctx}</span></span><span class="by">Dirigida por D.C.</span></div>
    </div>`;
  }).join('');
  const pieces = [...grid.children];
  pieces.forEach((el,i)=>{ el.style.transitionDelay = (i%3)*70+'ms'; });
  observe(pieces);
  if(heroSlot) observe([heroSlot.closest('.hero-image')].filter(Boolean));
  if(fbSlot && fbItem) observe([fbSlot]);
}

/* ---------- Diario: listado vía GitHub API (páginas secundarias) ---------- */
function simpleMarkdown(md){
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const lines = md.replace(/\r\n/g,'\n').split(/\n{2,}/);
  return lines.map(block=>{
    block = block.trim(); if(!block) return '';
    if(/^###\s+/.test(block)) return '<h3>'+inline(block.replace(/^###\s+/,''))+'</h3>';
    if(/^##\s+/.test(block)) return '<h2>'+inline(block.replace(/^##\s+/,''))+'</h2>';
    if(/^#\s+/.test(block)) return '<h2>'+inline(block.replace(/^#\s+/,''))+'</h2>';
    return '<p>'+inline(block).replace(/\n/g,'<br>')+'</p>';
  }).join('\n');
  function inline(t){
    t = esc(t);
    t = t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    t = t.replace(/\*(.+?)\*/g,'<em>$1</em>');
    t = t.replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    return t;
  }
}
function parseFrontmatter(raw){
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if(!m) return { data:{}, body:raw };
  const data = {};
  m[1].split('\n').forEach(line=>{
    const mm = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if(mm) data[mm[1]] = mm[2].replace(/^"(.*)"$/,'$1');
  });
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
      <span class="df">${p.fecha||''}</span>
      <div><h3>${p.titulo||'(sin título)'}</h3><p>${p.extracto||''}</p></div>
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
    <div class="post-head"><span class="eyebrow muted">${post.fecha||''}</span><h1>${post.titulo||''}</h1></div>
    ${post.portada ? `<img class="post-cover" src="${relSrc(post.portada)}" alt="${post.titulo||''}">` : ''}
    <div class="post-body">${simpleMarkdown(post.body||'')}</div>`;
}

/* ---------- Reveal de bloques estáticos restantes ---------- */
function tagStatic(){
  document.querySelectorAll('.sec-head, .sobre-visual, .sobre-text, .proceso-grid, .inv-grid, .inv-foot').forEach(el=>{
    if(!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  observe([...document.querySelectorAll('.reveal:not(.visible)')]);
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', async ()=>{
  initChrome();
  initLightbox();
  await hydrateSite();
  await renderObra();

  const diarioList = document.querySelector('[data-diario-list]');
  if(diarioList) await renderDiarioList(diarioList);
  await renderDiarioPost();

  tagStatic();
});
