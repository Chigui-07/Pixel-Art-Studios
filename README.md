# 🎨 Pixel Art Studios

Pixel Art Studios es una aplicación web para **aprender, practicar y crear pixel art mediante instrucciones paso a paso**.

La idea principal no es solamente copiar una imagen, sino aprender a construir objetos, personajes y escenarios entendiendo formas, color, luz, sombra y estilo.

## 🎯 Objetivo

Crear un estudio de pixel art que permita:

- Dibujar sobre una cuadrícula interactiva.
- Seguir tutoriales escritos paso a paso.
- Practicar un mismo objeto en distintos tamaños y estilos.
- Aprender fundamentos de pixel art.
- Crear una biblioteca ampliable de tutoriales.
- Usar lo aprendido posteriormente en videojuegos y otros proyectos.

## 🧩 Primera versión — v0.1

La primera versión incluye:

- Lienzo pixelado de 16×16.
- Herramienta lápiz.
- Borrador.
- Selector de color.
- Limpiar lienzo.
- Cuadrícula visible.
- Panel de tutorial.
- Navegación entre instrucciones.
- Primer tutorial de práctica: una manzana sencilla.

## 📁 Estructura inicial

```text
Pixel-Art-Studios/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── canvas.js
│   └── tutorials.js
└── data/
    └── objects/
        └── apple.json
```

## 🗺️ Ideas futuras

- Tamaños 8×8, 16×16, 32×32 y personalizados.
- Capas.
- Cuentagotas.
- Relleno.
- Deshacer y rehacer.
- Exportar PNG.
- Zoom.
- Paletas guardadas.
- Tutoriales de muebles, comida, plantas y tecnología.
- Personajes y animaciones.
- Escenarios y tilesets.
- Estilos 8-bit, 16-bit, Game Boy, RPG, isométrico y moderno.
- Desafíos de práctica.
- Modo libre sin referencia visual.

---

# 📓 Bitácora de desarrollo

## 31 de agosto de 2026 — Inicio del proyecto

### Decisiones

- Se creó el repositorio `Pixel-Art-Studios`.
- Se decidió construir el proyecto como aplicación web.
- El enfoque principal será **enseñar mediante instrucciones**, no solo mostrar sprites para copiar.
- Los tutoriales se separarán de la lógica principal para poder añadir contenido fácilmente.
- Se empezará con una versión pequeña pero funcional antes de agregar herramientas avanzadas.

### v0.1 — Base inicial

- [x] Definir concepto del proyecto.
- [x] Crear estructura inicial.
- [x] Crear README y bitácora.
- [x] Crear interfaz base.
- [x] Crear cuadrícula interactiva 16×16.
- [x] Añadir lápiz, borrador y selector de color.
- [x] Añadir tutorial paso a paso.
- [ ] Probar la interfaz en GitHub Pages.
- [ ] Mejorar el diseño visual.
- [ ] Añadir segundo objeto de práctica.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizarán frameworks para mantener el proyecto sencillo y comprender bien cada parte.