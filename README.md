# 🎨 Pixel Art Studios

Pixel Art Studios es una aplicación web para **aprender, practicar y crear pixel art mediante instrucciones paso a paso**.

La idea principal no es solamente copiar una imagen, sino aprender a construir objetos, personajes y escenarios entendiendo formas, color, luz, sombra, resolución y estilo.

## 🎯 Objetivo

Crear un estudio de pixel art que permita:

- Dibujar sobre una cuadrícula interactiva.
- Seguir tutoriales escritos y gráficos paso a paso.
- Ver exactamente qué píxeles se agregan en cada paso.
- Practicar un mismo objeto en diferentes resoluciones.
- Comprender cuánto detalle conviene usar según el tamaño del sprite.
- Aprender fundamentos de pixel art.
- Crear una biblioteca ampliable de tutoriales.
- Usar lo aprendido posteriormente en videojuegos y otros proyectos.

## 🧩 Versión actual — v0.3.2

### Formatos

- 8×8 · Mini.
- 16×16 · Clásico.
- 32×32 · Detallado.
- Cambio de formato desde el panel de herramientas o desde el tutorial.
- La cuadrícula y la guía se reconstruyen automáticamente al cambiar de tamaño.

### Herramientas de dibujo

- ✏️ Lápiz con dibujo continuo al arrastrar.
- 🧽 Borrador con borrado continuo al arrastrar.
- 🪣 Cubeta de relleno.
- 💧 Cuentagotas.
- ╱ Línea pixelada.
- ▭ Rectángulo pixelado.
- ◯ Elipse/círculo pixelado.
- Selector de color.
- Paleta rápida.
- Visualización del código hexadecimal del color activo.

### Utilidades

- ↶ Deshacer.
- ↷ Rehacer.
- Historial de hasta 60 estados.
- ↔ Voltear todo el lienzo horizontalmente.
- ↕ Voltear todo el lienzo verticalmente.
- ↻ Rotar todo el lienzo 90°.
- Mostrar u ocultar cuadrícula.
- Zoom aproximado de 60% a 175%.
- Contador de píxeles utilizados.
- Coordenadas X/Y del cursor.
- Limpiar lienzo.
- Exportar el sprite como PNG en su resolución real.
- Atajos de teclado.
- Mensajes visibles que confirman herramientas y acciones.

### Tutorial gráfico

La manzana sigue siendo el objeto de práctica principal y tiene tres versiones diseñadas específicamente para cada formato:

- **8×8:** silueta simple, pocos colores y detalles mínimos.
- **16×16:** contorno, relleno, luz, sombra, tallo y hoja.
- **32×32:** curvas más suaves, tonos intermedios, iluminación más compleja, sombras amplias y detalles secundarios.

El objetivo es demostrar que aumentar la resolución **no significa simplemente agrandar el mismo sprite**: cada tamaño requiere decisiones diferentes.

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
│   └── tutorials.js
└── data/
    └── objects/
        └── apple.json
```

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

## 🗺️ Ideas futuras

- Tamaños personalizados.
- Capas.
- Selección y movimiento de áreas.
- Copiar y pegar selecciones.
- Transformar solamente una selección.
- Paletas guardadas y paletas por estilo.
- Fondo transparente.
- Exportación ampliada sin suavizado.
- Tutoriales de muebles, comida, plantas y tecnología.
- Personajes y animaciones.
- Escenarios y tilesets.
- Estilos 8-bit, 16-bit, Game Boy, RPG, isométrico y moderno.
- Desafíos de práctica.
- Modo libre sin referencia visual.
- Superponer la guía sobre el lienzo del usuario.
- Validar automáticamente si el paso fue dibujado correctamente.
- Buscador de objetos para solicitar qué se quiere dibujar.
- Generación de tutoriales paso a paso mediante IA.
- Generación automática de paletas, tamaños y estilos según la búsqueda.

---

# 📓 Bitácora de desarrollo

## 31 de agosto de 2026 — Inicio del proyecto

### v0.1 — Base inicial

- [x] Definir concepto del proyecto.
- [x] Crear estructura inicial.
- [x] Crear README y bitácora.
- [x] Crear interfaz base.
- [x] Crear cuadrícula interactiva 16×16.
- [x] Añadir lápiz, borrador y selector de color.
- [x] Añadir tutorial paso a paso.
- [x] Probar la interfaz en GitHub Pages.

### v0.2 — Tutoriales gráficos

- [x] Añadir cuadrícula visual para instrucciones.
- [x] Convertir pasos en coordenadas de píxeles.
- [x] Mostrar acumulativamente pasos anteriores.
- [x] Resaltar píxeles del paso actual.
- [x] Mostrar color recomendado.

### v0.2.1 — Pintura continua

- [x] Pintar y borrar manteniendo presionado y arrastrando.

### v0.3 — Herramientas y formatos

- [x] Añadir lienzos 8×8, 16×16 y 32×32.
- [x] Crear una manzana distinta para cada resolución.
- [x] Añadir interfaz de herramientas y utilidades.

### v0.3.1 — Corrección funcional

- [x] Hacer funcionales lápiz, borrador, relleno, cuentagotas, línea y rectángulo.
- [x] Confirmar historial, zoom, cuadrícula, formatos y exportación PNG.
- [x] Añadir mensajes de estado.
- [x] Evitar caché antigua mediante versionado de scripts.

### v0.3.2 — Formas y transformaciones

- [x] Añadir elipse/círculo pixelado.
- [x] Añadir volteo horizontal del lienzo.
- [x] Añadir volteo vertical del lienzo.
- [x] Añadir rotación de 90°.
- [x] Integrar las nuevas acciones con deshacer/rehacer.
- [x] Añadir atajo `O` para la elipse.
- [ ] Añadir selección de áreas.
- [ ] Añadir fondo transparente.
- [ ] Añadir biblioteca/buscador de objetos.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizan frameworks para mantener el proyecto sencillo, rápido y fácil de comprender.