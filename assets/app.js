async function loadJSON(p){try{const r=await fetch(p,{cache:"no-store"});return r.ok?await r.json():null}catch(e){return null}}

function renderGallery(container,data){
  const fotos=(data&&Array.isArray(data.fotos))?data.fotos:[];
  if(!fotos.length){
    container.innerHTML='<p class="muted" style="grid-column:1/-1;text-align:center;padding:40px;font-family:Newsreader,serif;font-style:italic">Próximamente. Estoy curando esta selección.</p>';
    return;
  }
  container.innerHTML=fotos.map((f,i)=>{
    const wide=(i%4===0)?' wide':'';
    const src=f.imagen||'';
    const alt=f.alt||f.ficha||'Fotografía de Diego Camacho';
    const ficha=f.ficha?`<div class="ficha"><span class="n">${f.ficha}</span><span>${f.cliente||''}</span></div>`:'';
    return `<div><div class="slot${wide}"><img src="${src}" alt="${alt}" loading="lazy"></div>${ficha}</div>`;
  }).join("");
}

async function hydrate(){
  const site=await loadJSON('data/site.json')||{};
  document.querySelectorAll('[data-site]').forEach(el=>{const k=el.dataset.site;if(site[k]!=null)el.textContent=site[k];});
  document.querySelectorAll('[data-site-mail]').forEach(el=>{if(site.email){el.href='mailto:'+site.email;if(el.dataset.siteMail==='text')el.textContent=site.email;}});
  document.querySelectorAll('[data-site-wa]').forEach(el=>{if(site.whatsapp)el.href='https://wa.me/'+String(site.whatsapp).replace(/\D/g,'');});
  // ofertas
  const ob=document.querySelector('[data-ofertas]');
  if(ob&&Array.isArray(site.ofertas)){
    const roles=['Puerta de entrada','Proyecto insignia','La columna del negocio'];
    const subs=['MXN · según alcance','MXN · franja media-premium','MXN / mes · contrato semestral'];
    ob.innerHTML=site.ofertas.map((o,i)=>`<div class="oferta"><span class="k">${roles[i]||''}</span><h3>${o.nombre||''}</h3><div class="role"></div><p>${o.descripcion||''}</p><div class="price">${o.precio||''}<small>${subs[i]||''}</small></div></div>`).join("");
  }
  // galería (si la página tiene contenedor)
  const g=document.querySelector('[data-gallery]');
  if(g){const data=await loadJSON('data/galeria-'+g.dataset.gallery+'.json');renderGallery(g,data);}
}
document.addEventListener('DOMContentLoaded',hydrate);
