/* ============================================================
   Diego Camacho — app.js
   Hidrata el sitio desde /data/*.json (editados por Pages CMS),
   maneja el movimiento (preloader, reveal, marquesina, header),
   el tablero "arma tu proyecto", el lightbox de galería y el diario.
   ============================================================ */

/* ---------- Config: repo público para leer el Diario vía GitHub API ---------- */
// Ajusta estos dos valores si cambias de usuario/repositorio.
window.SITE_CONFIG = window.SITE_CONFIG || { ghOwner: "camachodiiego", ghRepo: "diegocamacho-sitio" };

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
async function loadJSON(p){ try{ const r = await fetch(p, {cache:"no-store"}); return r.ok ? await r.json() : null; }catch(e){ return null; } }
function relSrc(p){ return (p||'').replace(/^\/+/, ''); } // rutas relativas: sirven en subcarpeta y en raíz

/* ---------- Reveal-on-scroll ---------- */
let io = null;
function observe(nodes){
  if(!nodes.length) return;
  if(reduced()){ nodes.forEach(n=>n.classList.add('visible','in')); return; }
  io = io || new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible','in'); io.unobserve(e.target); }
  }), { threshold:.14, rootMargin:'0px 0px -6% 0px' });
  nodes.forEach(n=>io.observe(n));
}

/* ---------- Preloader + hero + header ---------- */
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
      if(header) header.classList.add('shown');
    };
    if(document.readyState === 'complete'){ setTimeout(reveal, 900); }
    else{ window.addEventListener('load', ()=>setTimeout(reveal, 500)); }
    setTimeout(reveal, 1800); // nunca bloquea, aunque tarden las imágenes
  } else {
    if(hero) hero.classList.add('in');
    if(header) header.classList.add('shown');
  }
  if(header){
    window.addEventListener('scroll', ()=>{
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
  // WhatsApp flotante: aparece después del hero
  const wa = document.getElementById('whatsappFloat');
  if(wa && hero){
    const obs = new IntersectionObserver(es=>es.forEach(e=>wa.classList.toggle('shown', !e.isIntersecting)), {threshold:.1});
    obs.observe(hero);
  } else if(wa){
    wa.classList.add('shown');
  }
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
    const slot = e.target.closest('.slot img');
    if(slot){ open(slot.src, slot.alt); }
  });
}

/* ---------- Galería de categoría ---------- */
function renderGallery(container, data){
  const fotos = (data && Array.isArray(data.fotos)) ? data.fotos : [];
  if(!fotos.length){
    container.innerHTML = '<p class="muted" style="grid-column:1/-1;text-align:center;padding:40px;font-family:Newsreader,serif;font-style:italic">Próximamente. Estoy curando esta selección.</p>';
    return;
  }
  container.innerHTML = fotos.map((f,i)=>{
    const wide = (i % 5 === 0) ? ' wide' : '';
    const src = relSrc(f.imagen);
    const alt = f.alt || f.ficha || 'Fotografía de Diego Camacho';
    const ficha = f.ficha ? `<div class="ficha"><span class="n">${f.ficha}</span><span>${f.cliente||''}</span></div>` : '';
    return `<div><div class="slot${wide} reveal-img"><img src="${src}" alt="${alt}" loading="lazy"></div>${ficha}</div>`;
  }).join('');
  const items = [...container.children];
  items.forEach(el=>el.querySelector('.slot') && observe([el.querySelector('.slot')]));
}

/* ---------- Portadas (home) ---------- */
const CAT_LABELS = { producto:'Producto', gastronomia:'Gastronomía', publicidad:'Publicidad', direccion:'Dirección de set' };
async function renderCovers(container){
  const cats = Object.keys(CAT_LABELS);
  const datas = await Promise.all(cats.map(c=>loadJSON('data/galeria-'+c+'.json')));
  container.innerHTML = cats.map((c,i)=>{
    const fotos = (datas[i] && datas[i].fotos) || [];
    const first = fotos[0];
    const img = first ? relSrc(first.imagen) : '';
    const client = first ? (first.cliente || '') : 'Próximamente';
    return `<a class="cover reveal-img" href="${c}.html">
      <div class="cover-img">${img ? `<img src="${img}" alt="${CAT_LABELS[c]}">` : ''}</div>
      <div class="cover-meta"><div class="cover-line">
        <span class="cover-group">${CAT_LABELS[c]}</span><span class="cover-client">${client}</span>
      </div><span class="cover-cta">Ver galería <span class="arrow">→</span></span></div>
    </a>`;
  }).join('');
  observe([...container.children]);
}

/* ---------- Tira horizontal (mezcla de categorías) ---------- */
async function renderFeaturedStrip(container){
  const cats = Object.keys(CAT_LABELS);
  const datas = await Promise.all(cats.map(c=>loadJSON('data/galeria-'+c+'.json')));
  let items = [];
  cats.forEach((c,i)=>{
    const fotos = (datas[i] && datas[i].fotos) || [];
    fotos.slice(0,3).forEach(f=>items.push({cat:c, f}));
  });
  if(!items.length){ container.parentElement.style.display = 'none'; return; }
  container.innerHTML = items.map(({cat,f})=>{
    const src = relSrc(f.imagen);
    return `<a class="fphoto" href="${cat}.html"><img src="${src}" alt="${f.alt||f.ficha||''}" loading="lazy"><span class="fphoto-tag">${CAT_LABELS[cat]} · ${f.cliente||''}</span></a>`;
  }).join('');
}

/* ---------- Textos, ofertas, contacto ---------- */
async function hydrateSite(){
  const site = await loadJSON('data/site.json') || {};
  document.querySelectorAll('[data-site]').forEach(el=>{ const k = el.dataset.site; if(site[k]!=null) el.textContent = site[k]; });
  document.querySelectorAll('[data-site-html]').forEach(el=>{ const k = el.dataset.siteHtml; if(site[k]!=null) el.innerHTML = site[k]; });
  document.querySelectorAll('[data-site-mail]').forEach(el=>{ if(site.email){ el.href = 'mailto:'+site.email; if(el.dataset.siteMail==='text') el.textContent = site.email; } });
  document.querySelectorAll('[data-site-wa]').forEach(el=>{
    if(site.whatsapp){
      const base = 'https://wa.me/' + String(site.whatsapp).replace(/\D/g,'');
      const msg = el.dataset.waMsg;
      el.href = msg ? base + '?text=' + encodeURIComponent(msg) : base;
    }
  });
}

/* ---------- Ofertas dentro del tablero de cotización ---------- */
async function hydrateOfertas(container){
  const site = await loadJSON('data/site.json') || {};
  if(!Array.isArray(site.ofertas)) return;
  const roles = ['Puerta de entrada','Proyecto insignia','La columna del negocio'];
  container.innerHTML = site.ofertas.map((o,i)=>`
    <li><span class="quote-num">${String(i+1).padStart(2,'0')}</span>
      <div><h4>${o.nombre||''} <span class="muted" style="font-weight:400;font-size:.82em">— ${roles[i]||''}</span></h4>
      <p>${o.descripcion||''} <strong style="color:var(--barro)">${o.precio||''}</strong></p></div></li>`).join('');
}

/* ---------- Clientes reales (banda de confianza) ---------- */
function renderClients(container, list){
  container.innerHTML = list.map(c=>`<div class="client-cell"><span>${c}</span></div>`).join('');
}

/* ---------- Testimonios (honesto: solo muestra los reales que Diego suba) ---------- */
async function hydrateTestimonios(container){
  const data = await loadJSON('data/testimonios.json');
  const items = (data && Array.isArray(data.items)) ? data.items.filter(t=>t.cita) : [];
  if(!items.length){
    container.innerHTML = '<div class="testimonials-empty">Los primeros testimonios de este ciclo están por publicarse aquí — directo de las marcas con las que trabajo.</div>';
    return;
  }
  container.innerHTML = items.map(t=>{
    const initials = (t.nombre||'??').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    return `<div class="testimonial"><blockquote>"${t.cita}"</blockquote>
      <div class="testimonial-author"><div class="avatar">${initials}</div>
      <div>${t.nombre||''}<span>${t.rol||''}</span></div></div></div>`;
  }).join('');
}

/* ---------- Tablero "arma tu proyecto" (drag + mezcla de color) ---------- */
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

/* ---------- Diario: listado, leyendo el repo público vía GitHub API ---------- */
function simpleMarkdown(md){
  // Conversor mínimo: encabezados, negritas, cursivas, enlaces y párrafos.
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

/* ---------- Bloques estáticos que necesitan reveal ---------- */
function tagStatic(){
  document.querySelectorAll('.section-head, .contact-card, .about-visual, .about-text, .process, .testimonials-grid, .quote-grid, .featured').forEach(el=>{
    if(!el.classList.contains('reveal') && !el.classList.contains('reveal-img')) el.classList.add('reveal');
  });
  document.querySelectorAll('.process-step, .quote-list li').forEach((el,i)=>{ el.classList.add('reveal'); el.style.transitionDelay=(i%4)*70+'ms'; });
  observe([...document.querySelectorAll('.reveal:not(.visible), .reveal-img:not(.visible)')]);
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', async ()=>{
  initChrome();
  initLightbox();
  initBuildBoard();

  await hydrateSite();

  const ofertasList = document.querySelector('[data-ofertas-list]');
  if(ofertasList) await hydrateOfertas(ofertasList);

  const covers = document.querySelector('[data-covers]');
  if(covers) await renderCovers(covers);

  const strip = document.querySelector('[data-featured-strip]');
  if(strip) await renderFeaturedStrip(strip);

  const testi = document.querySelector('[data-testimonios]');
  if(testi) await hydrateTestimonios(testi);

  const gallery = document.querySelector('[data-gallery]');
  if(gallery){ const d = await loadJSON('data/galeria-'+gallery.dataset.gallery+'.json'); renderGallery(gallery, d); }

  const diarioList = document.querySelector('[data-diario-list]');
  if(diarioList) await renderDiarioList(diarioList);
  await renderDiarioPost();

  tagStatic();
});
