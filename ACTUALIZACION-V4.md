# Sitio v4 — reconstruido a partir de tu brief

## Qué cambió respecto a v3
Tu brief fue muy claro sobre por qué la v3 se sentía genérica: demasiadas
secciones dispersas diluían el impacto. Esta versión sigue tu brief
sección por sección:

**Se retiró:**
- Las marquesinas (categorías y clientes) — no estaban en tu especificación.
- El tablero interactivo "arma tu proyecto" — no pedido, distraía del foco.
- Los testimonios de clientes en portada — tu Sobre Mí ahora lleva la cita
  "Cada encuadre tiene una razón." como manda el brief.
- Las 4 páginas de categoría separadas — ahora es **una sola página** con
  navegación ancla (Obra · Proceso · Inversión · Contacto), como pediste.
  Dejé redirecciones automáticas por si alguien tenía guardado un link viejo.
- **La animación del logo al pasar el cursor.** Tu Manual dice "el logo no
  se anima" y mi v3 lo rotaba sutilmente — corregido. Ahora solo aparece
  con un fundido en el preloader, nada más.

**Se construyó nuevo, siguiendo tu especificación técnica:**
- Galería "Obra" que funde tus 4 categorías en un solo flujo envolvente:
  mezcla de escalas (piezas verticales + una ancha cada 5), una pieza a
  **sangre completa** (borde a borde de pantalla) tomada de Dirección de
  set, velo Barro en multiplicar al 14% + zoom 1.05/0.6s al pasar el
  cursor, y ficha visible con "Dirigida por D.C." en cada pieza.
- Placeholder honesto: mientras no haya foto real, un tramado diagonal de
  Lino (no un bloque plano) con la etiqueta de la serie encima.
- Menú hamburguesa real en móvil (antes solo se ocultaba el menú, sin
  alternativa) — probado y funcional a 375px y 768px.
- Sección Inversión oscura con tus 3 ofertas reales, borde que se
  ilumina a Cobre al pasar el cursor, "Inversión desde $X".
- Nav con filete inferior que aparece a los 20px de scroll, como pediste.

Las 4 categorías (Producto/Gastronomía/Publicidad/Dirección) se conservan
como archivos separados en el administrador — solo cambia que el sitio
público ahora las presenta fusionadas en una sola galería, como pide tu brief.
El Diario sigue disponible (enlace discreto en el pie), aunque ya no está
en el menú principal porque tu brief especifica solo 4 enlaces de nav.

## Verificado antes de entregarte esto
- Sintaxis JS sin errores, HTML balanceado en las 7 páginas.
- Galería Obra fusiona correctamente las 4 categorías (probado con datos reales).
- Velo Barro al 14% de opacidad al pasar el cursor (dentro del rango 12–16% pedido).
- Menú hamburguesa abre y cierra correctamente en 375px y 768px.
- Cero desbordamiento horizontal en 375px, 768px y 1440px (los tres anchos que pediste).
- Ninguna palabra prohibida de tu Manual de Marca presente.
- Ninguna regla de animación en el logo.

## Cómo subirlo (mismos pasos de siempre, con la verificación extra)
1. Borra cualquier zip viejo de tu carpeta de Descargas para no confundirte.
2. Descomprime `Diego_Camacho_SITIO_v4_BRIEF_2026-07-07.zip`.
3. En tu repo: **Add file ▸ Upload files**, arrastra todo el contenido.
4. **Antes de confirmar el commit**, revisa la lista de cambios que GitHub
   te muestra — debe decir que modifica `index.html`, `style.css`, `app.js`.
5. Commit changes. Espera un minuto y entra con recarga forzada
   (Ctrl+Shift+R / Cmd+Shift+R).
