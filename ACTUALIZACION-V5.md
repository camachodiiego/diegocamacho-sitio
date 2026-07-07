# Sitio v5 — auditoría + tus correcciones + razonamiento de conversión

## Antes que nada: dónde está en vivo
Al revisar `camachodiiego.github.io/diegocamacho-sitio` ahora mismo, sigue en la
versión vieja — la v4/v5 aún no se sube ahí. El repositorio nuevo que creaste
(`diego-camacho-Sitio-v4`) no tiene GitHub Pages activado, así que probablemente
viste esta versión abriendo `index.html` localmente en tu navegador — está bien,
pero recuerda que falta subir esto al repo original para que quede en línea.

## Mi respuesta a "¿esto convierte?"
No, todavía no — por dos razones que pesan más que el diseño:
1. **Cero fotos reales.** Ninguna cantidad de ajuste visual compensa un portafolio
   de fotografía sin una sola foto. Es la prioridad #1, antes que cualquier otra cosa.
2. **El hero no tenía ninguna acción.** Alguien listo para contratar tenía que
   bajar hasta el final para encontrar tu correo. Ya lo corregí (ver abajo).

## Tus 6 puntos, uno por uno
1. **Marcadores más claros de dónde van las imágenes** — cada espacio sin foto
   ahora tiene un ícono, un texto claro ("Sube la foto desde el Administrador")
   y, si ya existe una entrada pero el archivo no carga, te dice la ruta exacta
   que espera (ej. "Ruta esperada: img/producto/01.jpg") — útil para depurar.
2. **Más separación entre piezas** — el espacio entre fotos de la galería Obra
   casi se dobló (de ~16–30px a ~26–48px según el ancho de pantalla).
3. **La etapa del nombre duraba muy poco** — el preloader ahora sostiene tu
   nombre en pantalla un mínimo de ~2.2 segundos (antes se cortaba a 1.5s o menos),
   con un límite máximo de 4s para no castigar conexiones lentas. Verificado: 2.95s reales.
4. **Abre con imagen de lado a lado** — el hero ahora es de dos partes, como en
   McCurry (la plantilla más detallada de tu propio brief): tu nombre en nameplate
   gigante sobre fondo oscuro, seguido inmediatamente por una imagen a sangre
   completa (borde a borde de pantalla, no del contenedor).
5. **El logo se sentía chico** — de 30px a 44px en la barra de navegación.
6. **Análisis de conversión** — con tu autorización explícita, agregué tres cosas
   que no pediste pero que sí importan para generar contacto real: un botón de
   WhatsApp visible desde el hero, un botón flotante de WhatsApp en toda la
   página (aparece después de pasar el hero), y un enlace de "Preguntar por esta
   opción" en cada una de tus 3 tarjetas de Inversión. También agregué una línea
   discreta de texto (no una marquesina) con tus clientes reales en Sobre mí,
   como señal de confianza.

## Sobre "la plantilla que te gustó"
No llegó ningún archivo ni link a mi contexto en tu mensaje. Usé como referencia
la plantilla McCurry que tu propio brief describe (nameplate + retrato a sangre
completa), porque coincide con tu pedido de "imagen de lado a lado". Si es otra
plantilla, mándamela y ajusto específicamente a ella.

## Verificado antes de entregarte esto
- Preloader: 2.95s reales (antes ~1.5s máx).
- Logo: 44px confirmado en el DOM (antes 30px).
- Imagen del hero: ancho igual al viewport en 375px, 768px y 1440px (edge-to-edge real).
- Gap de galería: 43.5px confirmado (antes ~16-30px).
- Marcador claro sin foto + marcador de ruta rota, ambos probados y funcionando.
- Botón flotante de WhatsApp: aparece correctamente al pasar el hero (probado con scroll real).
- 3 tarjetas de Inversión con su propio enlace de contacto.
- Línea de confianza con clientes reales, presente y visible.
- Cero errores de JavaScript, cero desbordamiento horizontal en los 3 anchos.
- Sin rotación del logo en ningún estado. Sin palabras prohibidas del Manual.

## Siguiente paso
Sube esto al repositorio ORIGINAL (`camachodiiego.github.io/diegocamacho-sitio`),
no al nuevo. Antes de confirmar el commit, revisa que la lista de cambios diga
que modifica `index.html`, `style.css`, `app.js`. Y, en serio: las 15-20 fotos
reales siguen siendo lo que más va a mover tu conversión — más que cualquier
ajuste que hagamos aquí.
