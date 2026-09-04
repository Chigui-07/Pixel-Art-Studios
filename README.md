# 🎨 Pixel Art Studios

Pixel Art Studios es una aplicación web para **aprender, practicar, crear y animar pixel art**.

La meta es que el estudio sirva tanto para aprender como para producir assets reales: objetos, personajes, animaciones, escenas, tilesets y efectos, siempre en pixel art.

## 🧩 Versión actual — v0.4.1

### Formatos del editor

- 8×8
- 12×12
- 16×16
- 24×24
- 32×32
- 48×48
- 64×64

Los tutoriales de la manzana siguen disponibles en 8×8, 16×16 y 32×32. Los demás tamaños funcionan como modo libre de producción y animación.

### Herramientas de dibujo y color

- ✏️ Lápiz con dibujo continuo.
- 🧽 Borrador.
- 🪣 Relleno.
- 💧 Cuentagotas.
- ╱ Línea.
- ▭ Rectángulo.
- ◯ Elipse/círculo.
- Selector de color.
- Paleta rápida.
- ☀️ Aclarar color activo.
- 🌑 Oscurecer color activo.

### Utilidades

- Deshacer y rehacer.
- Historial de estados.
- Voltear horizontal y vertical.
- Rotar 90°.
- Mostrar/ocultar cuadrícula.
- Zoom para lienzos grandes.
- Coordenadas y contador de píxeles.
- Exportar PNG.

## 🎞️ Animation Lab

El Animation Lab trabaja con frames reales, cada uno con su propio estado del lienzo.

Funciones actuales:

- crear frame vacío;
- duplicar el frame actual;
- eliminar frames;
- cambiar entre frames desde una línea de tiempo con miniaturas;
- mover el frame actual hacia la izquierda o derecha;
- activar/desactivar onion skin;
- ajustar la opacidad del onion skin;
- usar el frame anterior como referencia visual tenue;
- asignar una duración individual en milisegundos a cada frame;
- usar el selector de FPS como duración base rápida;
- reproducir la animación respetando la duración de cada frame;
- detener la reproducción;
- conservar un dibujo diferente en cada frame;
- exportar todos los frames como un spritesheet horizontal PNG.

Esto permite empezar a construir animaciones como caminar, dormir, levantarse, sentarse, expresiones, objetos animados y transiciones simples.

### Duración por frame

Cada frame guarda ahora su propio `durationMs`. Por ejemplo, una animación puede usar:

- Frame 1: 500 ms
- Frame 2: 120 ms
- Frame 3: 120 ms
- Frame 4: 800 ms

Esto permite pausas naturales sin tener que duplicar muchos frames.

### Onion skin

El onion skin muestra los píxeles dibujados del frame anterior sobre las zonas vacías del frame actual. Es solamente una referencia visual: **no modifica ni mezcla los píxeles reales del frame**.

La opacidad puede ajustarse desde el Animation Lab.

## 🤖 AI Lab

El AI Lab continúa siendo un prototipo local. Contempla:

- objetos;
- personajes;
- animaciones;
- escenas;
- assets de entorno.

Incluye opciones para tamaño, estilo RUMBO, detalle, paleta, iluminación, perspectiva, fondo, contorno, pasos y notas adicionales.

Todavía no se llama a una IA real. La especificación estructurada será la entrada del futuro generador.

## 🎮 Dirección para RUMBO

Pixel Art Studios mantiene una regla central: **todo el flujo visual será pixel art**.

El preset RUMBO servirá para mantener consistencia entre:

- personajes;
- objetos;
- habitaciones;
- ciudades;
- tilesets;
- animaciones;
- efectos;
- escenas y transiciones.

Una meta importante será guardar personajes base como Nicolás, Molly y Emily para que las futuras animaciones y la IA puedan reutilizar el mismo diseño visual en todos los frames.

## ⌨️ Atajos actuales

- `P` — lápiz.
- `E` — borrador.
- `F` — relleno.
- `I` — cuentagotas.
- `L` — línea.
- `R` — rectángulo.
- `O` — elipse.
- `Ctrl + Z` — deshacer.
- `Ctrl + Y` o `Ctrl + Shift + Z` — rehacer.

## 📁 Estructura

```text
Pixel-Art-Studios/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── canvas.js
│   ├── tutorials.js
│   ├── animation.js
│   └── ai-prep.js
└── data/
    └── objects/
        └── apple.json
```

---

# 📓 Bitácora de desarrollo

### v0.1 — Base inicial
- [x] Crear interfaz, cuadrícula y herramientas básicas.

### v0.2 — Tutoriales gráficos
- [x] Añadir instrucciones visuales por pasos.

### v0.2.1 — Pintura continua
- [x] Dibujar manteniendo presionado y arrastrando.

### v0.3 — Herramientas y formatos
- [x] Añadir formatos y herramientas adicionales.

### v0.3.1 — Corrección funcional
- [x] Hacer funcionales todas las herramientas principales.

### v0.3.2 — Formas y transformaciones
- [x] Elipse, volteos y rotación.

### v0.3.3 — Preparación para IA
- [x] AI Lab y especificación estructurada.

### v0.4 — Producción y animación
- [x] Añadir 12×12, 24×24, 48×48 y 64×64.
- [x] Mantener tutoriales solo donde existe contenido específico.
- [x] Añadir modo libre para otros tamaños.
- [x] Añadir aclarar y oscurecer color.
- [x] Exponer estado del lienzo para frames.
- [x] Crear Animation Lab.
- [x] Añadir frames vacíos.
- [x] Duplicar y eliminar frames.
- [x] Añadir timeline con miniaturas.
- [x] Añadir reproducción configurable por FPS.
- [x] Exportar spritesheet horizontal.
- [x] Ampliar AI Lab a animaciones y escenas.

### v0.4.1 — Animación avanzada
- [x] Añadir onion skin usando el frame anterior.
- [x] Permitir activar/desactivar onion skin.
- [x] Añadir control de opacidad del onion skin.
- [x] Añadir duración individual por frame en milisegundos.
- [x] Reproducir respetando la duración de cada frame.
- [x] Añadir movimiento de frames hacia izquierda/derecha.
- [x] Mostrar duración en cada miniatura del timeline.
- [x] Mantener onion skin separado del dibujo real.
- [ ] Copiar y pegar frames entre animaciones.
- [ ] Guardar animaciones como proyectos/assets.
- [ ] Exportar GIF/APNG.
- [ ] Biblioteca de personajes y assets base.
- [ ] Conectar IA real.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizan frameworks para mantener el proyecto sencillo y fácil de controlar.