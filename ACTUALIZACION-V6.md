# Sitio v6 — plantilla McCurry real, multi-página

## Qué cambió de raíz
Encontré el demo real de McCurry (mccurry-fluid-demo.squarespace.com) y lo usé
como calco, no solo la descripción de tu brief. La diferencia clave: **McCurry
es multi-página**, no un solo scroll largo. Por eso la v5 no te convenció —
eran estructuras distintas de fondo.

## El mapa de sitio ahora (calcado de McCurry)
- **Inicio** — nombre + foto a sangre completa, luego "teasers" cortos de cada
  sección con su link "Ver más": Trabajo (4 categorías como texto), Servicios
  (2 fotos), Diario (3 posts), Sobre mí (frase + foto). Cierra con tu nombre
  gigante repetido, como hace McCurry.
- **Trabajo** — página propia, con pestañas por categoría (Producto,
  Gastronomía, Publicidad, Dirección de set) y la galería completa de cada una.
- **Servicios** — tus 3 ofertas reales a detalle + el proceso de 4 pasos.
- **Diario** — el blog, sin cambios de fondo.
- **Sobre mí** — tu bio completa, cita y clientes reales.

## Un bug real que encontré y corregí
Al probar el cambio de pestañas en Trabajo, el clic no funcionaba — investigué
y encontré que mi CSS tenía una regla `header{position:fixed}` que, sin querer,
afectaba TODOS los `<header>` de cada página (no solo la barra de navegación),
haciendo que el banner de cada página se quedara pegado arriba tapando el
contenido. Ya está corregido y probado: los clics en las pestañas funcionan
perfecto.

## Se conserva de la v5 (lo que ya habías aprobado)
- Logo de 44px en la barra.
- Preloader con tu nombre, sostenido ~2.2s.
- Marcadores claros de imagen faltante (ícono + texto + ruta esperada si falla).
- Botón flotante de WhatsApp.
- Menú hamburguesa funcional en móvil.
- Línea de confianza con tus clientes reales en Sobre mí.

## Verificado antes de entregarte esto
- Las 5 páginas principales: cero errores de JavaScript.
- Cero desbordamiento horizontal en 375px, 768px y 1440px (15 combinaciones probadas).
- Pestañas de Trabajo cambian de categoría correctamente (bug corregido y reprobado).
- Las 3 tarjetas de Servicios, cada una con su enlace de WhatsApp.
- Sin rotación del logo. Sin palabras prohibidas del Manual.

## Cómo subirlo
Cambio grande — sube todo el ZIP de nuevo al repositorio ORIGINAL
(`camachodiiego.github.io/diegocamacho-sitio`), sobrescribiendo. Antes de
confirmar el commit, revisa que la lista de cambios diga que modifica
`index.html`, `style.css`, `app.js`, y que además AGREGA `trabajo.html`,
`servicios.html`, `sobre-mi.html` (archivos nuevos).
