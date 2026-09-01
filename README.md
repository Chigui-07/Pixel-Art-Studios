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

## 🧩 Versión actual — v0.3.1

### Formatos

- 8×8 · Mini.
- 16×16 · Clásico.
- 32×32 · Detallado.
- Cambio de formato desde el panel de herramientas o desde el tutorial.
- La cuadrícula y la guía se reconstruyen automáticamente al cambiar de tamaño.

### Herramientas de dibujo

- ✏️ Lápiz con dibujo continuo al arrastrar.
- 🧽 Borrador con borrado continuo al arrastrar.
- 🪣 Cubeta de relleno funcional.
- 💧 Cuentagotas funcional, incluyendo el color blanco.
- ╱ Herramienta de línea funcional entre punto inicial y final.
- ▭ Herramienta de rectángulo funcional entre dos esquinas.
- Selector de color.
- Paleta rápida.
- Visualización del código hexadecimal del color activo.

### Utilidades

- ↶ Deshacer.
- ↷ Rehacer.
- Historial de hasta 60 estados.
- Mostrar u ocultar cuadrícula.
- Zoom aproximado de 60% a 175%.
- Contador de píxeles utilizados.
- Coordenadas X/Y del cursor.
- Limpiar lienzo.
- Exportar el sprite como PNG en su resolución real.
- Atajos de teclado para herramientas y Ctrl+Z / Ctrl+Y.
- Mensajes visibles que confirman la herramienta o acción seleccionada.

### Tutorial gráfico

La manzana es actualmente el objeto de práctica principal y tiene tres versiones diseñadas específicamente para cada formato:

- **8×8:** silueta muy simple, pocos colores y detalles mínimos.
- **16×16:** contorno, relleno, luz, sombra, tallo y hoja.
- **32×32:** curvas más suaves, tonos intermedios, iluminación más compleja, sombras más amplias y detalles secundarios.

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
- `Ctrl + Z` — deshacer.
- `Ctrl + Y` o `Ctrl + Shift + Z` — rehacer.

## 🗺️ Ideas futuras

- Tamaños personalizados.
- Capas.
- Círculos y elipses pixeladas.
- Selección y movimiento de áreas.
- Copiar, pegar, voltear y rotar selecciones.
- Paletas guardadas y paletas por estilo.
- Fondo transparente.
- Exportación ampliada sin suavizado.
- Tutoriales de muebles, comida, plantas y tecnología.
- Personajes y animaciones.
- Escenarios y tilesets.
- Estilos 8-bit, 16-bit, Game Boy, RPG, isométrico y moderno.
- Desafíos de práctica.
- Modo libre sin referencia visual.
- Ocultar o mostrar la guía gráfica.
- Superponer la guía sobre el lienzo del usuario.
- Validar automáticamente si el paso fue dibujado correctamente.
- Buscador de objetos para solicitar qué se quiere dibujar.
- Generación de tutoriales paso a paso mediante IA.
- Generación automática de paletas, tamaños y estilos según la búsqueda.

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
- [x] Probar la interfaz en GitHub Pages.

### v0.2 — Tutoriales gráficos

- [x] Añadir una cuadrícula visual para las instrucciones.
- [x] Convertir los pasos del tutorial en datos con coordenadas de píxeles.
- [x] Mostrar acumulativamente lo construido en pasos anteriores.
- [x] Resaltar los píxeles que deben añadirse en el paso actual.
- [x] Mostrar el color recomendado para cada paso.
- [x] Hacer que el selector de color cambie automáticamente con el tutorial.
- [x] Mantener explicación escrita junto a la explicación gráfica.

### v0.2.1 — Pintura continua

- [x] Permitir pintar varios píxeles manteniendo presionado y arrastrando.
- [x] Permitir borrar varios píxeles manteniendo presionado y arrastrando.
- [x] Corregir la captura del puntero que impedía recorrer correctamente las celdas.
- [x] Evitar repintados innecesarios sobre el mismo píxel durante un arrastre.

### v0.3 — Herramientas y formatos

- [x] Añadir lienzos 8×8, 16×16 y 32×32.
- [x] Crear una versión diferente de la manzana para cada resolución.
- [x] Explicar las diferencias de detalle entre formatos.
- [x] Hacer dinámica la cuadrícula gráfica del tutorial.
- [x] Añadir interfaz para nuevas herramientas y utilidades.

### v0.3.1 — Corrección funcional

- [x] Conectar y reforzar la lógica real de todas las herramientas de v0.3.
- [x] Corregir línea y rectángulo para conservar el punto final durante el arrastre.
- [x] Hacer funcional el cuentagotas incluso sobre píxeles blancos.
- [x] Confirmar cubeta de relleno con historial.
- [x] Confirmar deshacer y rehacer.
- [x] Confirmar cambio entre 8×8, 16×16 y 32×32.
- [x] Confirmar mostrar/ocultar cuadrícula.
- [x] Confirmar zoom.
- [x] Confirmar exportación PNG.
- [x] Añadir mensajes de estado para saber qué herramienta está activa.
- [x] Añadir versionado a CSS y JavaScript (`?v=0.3.1`) para evitar que GitHub Pages cargue archivos antiguos desde caché.
- [ ] Añadir funciones nuevas solamente después de probar esta versión.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizan frameworks para mantener el proyecto sencillo, rápido y fácil de comprender.