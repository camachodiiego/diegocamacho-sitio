# Tu sitio — cómo llenarlo y publicarlo (gratis, sin tarjeta)

Este sitio ya funciona solo. No depende de Claude Design ni de ningún programa: son
archivos HTML normales. Ábrelos con doble clic para verlos en tu navegador.

## Paso 1 — Pon tus fotos
1. Mete tus imágenes en las carpetas de `img/` (`producto`, `gastronomia`, `publicidad`,
   `direccion`, `home`). Nómbralas `01.jpg`, `02.jpg`, etc.
2. En cada página `.html`, cada hueco de foto tiene un comentario que te dice exactamente
   qué escribir. Busca los bloques `<div class="ph">…</div>` y cámbialos por:
   `<img src="img/producto/01.jpg" alt="descripción corta">`
3. **Curaduría (importante):** máximo 15–20 fotos por categoría. Menos y mejores.
   Si una foto necesita explicación para impresionar, no entra.
4. Edita las "fichas de obra" (Serie 01 · Cliente · Año) con tus datos reales.
5. Cambia el WhatsApp (`wa.me/523300000000`) y el correo por los tuyos en todas las páginas.

> Tamaño ideal de imagen: lado largo ~2000px, JPG calidad 80. Comprime en squoosh.app (gratis)
> para que el sitio cargue rápido — los compradores abandonan sitios lentos.

## Paso 2 — Publícalo gratis (elige UNA)

### Opción A · Cloudflare Pages — la más simple, sin tarjeta (recomendada)
1. Entra a **dash.cloudflare.com/sign-up**, crea cuenta con tu correo (no pide tarjeta).
2. Menú **Workers & Pages ▸ Create ▸ Pages ▸ Upload assets**.
3. Arrastra **toda la carpeta del sitio** (con `index.html` en la raíz). Ponle nombre.
4. En segundos te da una dirección `tunombre.pages.dev`. Ya está en internet, gratis y para siempre.
5. (Opcional) Compra un dominio `diegocamacho.mx` (~$150–400/año en Namecheap) y conéctalo desde ahí.

### Opción B · GitHub Pages — gratis, si te animas con GitHub
1. Crea cuenta en github.com, crea un repositorio, sube estos archivos.
2. Settings ▸ Pages ▸ Source: rama `main` ▸ Save. Te da `tuusuario.github.io/repo`.

### Opción C · Yo lo subo por ti con tu Vercel (que ya tienes conectado)
Vercel tiene plan gratuito real (Hobby, sin costo). Cuando tengas unas fotos puestas,
dime **"publica el sitio"** y lo dejo en línea a través de tu conexión de Vercel en un paso.
No puedo crear cuentas por ti, pero el despliegue sí lo hago yo.

## Nota
No publiques con los placeholders puestos: primero mete al menos la obra selecta del inicio
y 6–8 fotos por categoría. Un sitio a medias vende peor que ningún sitio.
