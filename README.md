# 🎨 Pixel Art Studios

Pixel Art Studios es una aplicación web para **aprender, practicar, crear y animar pixel art**.

La meta es que el estudio sirva tanto para aprender como para producir assets reales: objetos, personajes, animaciones, escenas, tilesets y efectos, siempre en pixel art.

## 🧩 Versión actual — v0.4

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
- Zoom ampliado para lienzos grandes.
- Coordenadas y contador de píxeles.
- Exportar PNG.

## 🎞️ Animation Lab

La v0.4 introduce el primer editor de animaciones por frames.

Funciones actuales:

- crear frame vacío;
- duplicar el frame actual;
- eliminar frames;
- cambiar entre frames desde una línea de tiempo con miniaturas;
- reproducir la animación;
- seleccionar 2, 4, 6, 8 o 12 FPS;
- detener la reproducción;
- conservar un dibujo diferente en cada frame;
- exportar todos los frames como un spritesheet horizontal PNG.

Esto prepara el proyecto para animaciones como caminar, dormir, levantarse, sentarse, expresiones, objetos animados y transiciones simples.

## 🤖 AI Lab

El AI Lab continúa siendo un prototipo local. Ahora contempla no solo objetos sino también:

- personajes;
- animaciones;
- escenas;
- assets de entorno.

Incluye opciones para tamaño, estilo RUMBO, detalle, paleta, iluminación, perspectiva, fondo, contorno, pasos y notas adicionales.

Todavía no se llama a una IA real. La especificación estructurada será la entrada del futuro generador.

## 🎮 Dirección para RUMBO

Pixel Art Studios mantendrá una regla central: **todo el flujo visual será pixel art**.

A futuro, el preset RUMBO servirá para mantener consistencia entre:

- personajes;
- objetos;
- habitaciones;
- ciudades;
- tilesets;
- animaciones;
- efectos;
- escenas y transiciones.

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
- [ ] Onion skin.
- [ ] Duración individual por frame.
- [ ] Exportar GIF/APNG.
- [ ] Biblioteca de personajes y assets base.
- [ ] Conectar IA real.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizan frameworks para mantener el proyecto sencillo y fácil de controlar.