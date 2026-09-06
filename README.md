# 🎨 Pixel Art Studios

Pixel Art Studios es una aplicación web para **aprender, practicar, crear y animar pixel art**.

La meta es que el estudio sirva tanto para aprender como para producir assets reales para proyectos como RUMBO: objetos, personajes, animaciones, escenas, tilesets y efectos, siempre en pixel art.

## 🧩 Versión actual — v0.5

### Formatos del editor

- 8×8
- 12×12
- 16×16
- 24×24
- 32×32
- 48×48
- 64×64

Los tutoriales de la manzana siguen disponibles en 8×8, 16×16 y 32×32. Los demás tamaños funcionan como modo libre de producción y animación.

## 🎨 Herramientas de dibujo

- ✏️ Lápiz con dibujo continuo.
- 🧽 Borrador.
- 🪣 Relleno.
- 💧 Cuentagotas.
- ╱ Línea.
- ▭ Rectángulo.
- ◯ Elipse/círculo.
- 🖐️ Mover dibujo completo dentro del lienzo.
- Selector de color.
- Paleta rápida.
- ☀️ Aclarar color activo.
- 🌑 Oscurecer color activo.

### Navegación

- `H` activa Mover dibujo.
- `Espacio + arrastrar` mueve solamente la vista del lienzo.

## 🧊 Transparencia real

Desde v0.5 el vacío del lienzo es realmente transparente y ya no se representa internamente como blanco.

Esto permite:

- borrar píxeles dejando transparencia real;
- exportar sprites PNG sin fondo blanco;
- exportar spritesheets transparentes;
- diferenciar un píxel blanco pintado de un píxel vacío;
- preparar assets directamente para videojuegos.

El lienzo y las miniaturas usan un patrón cuadriculado para mostrar visualmente la transparencia.

## 💾 Sistema de proyectos

La v0.5 introduce la primera base de producción persistente.

Un proyecto guarda:

- nombre del asset/proyecto;
- tamaño del lienzo;
- píxeles del sprite;
- todos los frames de animación;
- duración de cada frame;
- frame actual;
- FPS base;
- configuración de onion skin.

Opciones disponibles:

- **Guardar en navegador:** usa almacenamiento local para continuar rápidamente en la misma computadora.
- **Cargar guardado:** recupera el último proyecto guardado localmente.
- **Exportar proyecto:** genera un archivo `.pixelstudio.json` para respaldo y transporte.
- **Importar proyecto:** abre un archivo exportado anteriormente.

Para assets importantes de RUMBO se recomienda **exportar también el archivo del proyecto**, no depender solamente del guardado del navegador.

## 🎞️ Animation Lab

Funciones actuales:

- crear frame vacío;
- duplicar/eliminar frames;
- cambiar entre frames desde timeline con miniaturas;
- reordenar frames;
- onion skin;
- opacidad de onion skin;
- duración individual por frame;
- reproducción por duración;
- FPS base rápido;
- exportar spritesheet PNG transparente.

## 🤖 AI Lab

El AI Lab continúa siendo un prototipo local. Contempla:

- objetos;
- personajes;
- animaciones;
- escenas;
- assets de entorno.

Incluye tamaño, preset RUMBO, detalle, paleta, iluminación, perspectiva, fondo, contorno, pasos y notas adicionales.

Todavía no se conecta a una IA real. El siguiente objetivo es que la IA genere estructuras que Pixel Art Studios pueda validar y convertir directamente en sprites/tutoriales/frames.

## 🎮 Dirección para RUMBO

Pixel Art Studios mantiene una regla central: **todo el flujo visual será pixel art**.

El preset RUMBO servirá para mantener consistencia entre:

- Nicolás, Molly, Emily y otros personajes;
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
- `H` — mover dibujo.
- `Espacio + arrastrar` — desplazar vista.
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
│   ├── ai-prep.js
│   └── project.js
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
- [x] Añadir tamaños adicionales.
- [x] Crear Animation Lab.
- [x] Frames, reproducción y spritesheets.

### v0.4.1 — Animación avanzada
- [x] Onion skin.
- [x] Duración individual por frame.
- [x] Reordenamiento de frames.
- [x] Mover dibujo completo.
- [x] Separar mover dibujo de mover vista.

### v0.5 — Base de producción para RUMBO
- [x] Cambiar el vacío del lienzo a transparencia real.
- [x] Diferenciar blanco pintado de transparencia.
- [x] Exportar PNG transparente.
- [x] Exportar spritesheet transparente.
- [x] Adaptar onion skin a transparencia.
- [x] Añadir sistema de proyectos.
- [x] Guardar proyecto en navegador.
- [x] Cargar proyecto guardado.
- [x] Exportar proyecto como `.pixelstudio.json`.
- [x] Importar proyecto desde archivo.
- [x] Guardar/restaurar frames y duraciones.
- [ ] Selección rectangular de áreas.
- [ ] Copiar/cortar/pegar selección.
- [ ] Biblioteca de assets base de RUMBO.
- [ ] Carpetas/categorías para assets.
- [ ] Conectar IA real.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizan frameworks para mantener el proyecto sencillo y fácil de controlar.