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
- Crear una biblioteca ampliable de tutoriales.
- Preparar una futura generación asistida por IA.

## 🧩 Versión actual — v0.3.3

### Formatos

- 8×8 · Mini.
- 16×16 · Clásico.
- 32×32 · Detallado.

### Herramientas de dibujo

- ✏️ Lápiz con dibujo continuo.
- 🧽 Borrador.
- 🪣 Relleno.
- 💧 Cuentagotas.
- ╱ Línea.
- ▭ Rectángulo.
- ◯ Elipse/círculo.
- Selector de color y paleta rápida.

### Utilidades

- Deshacer y rehacer.
- Historial de hasta 60 estados.
- Voltear horizontal y vertical.
- Rotar 90°.
- Mostrar/ocultar cuadrícula.
- Zoom.
- Coordenadas y contador de píxeles.
- Exportar PNG.
- Panel visible de atajos.

### 🤖 AI Lab — prototipo local

La v0.3.3 introduce la primera estructura pensada específicamente para la futura IA.

El usuario puede definir:

- objeto a dibujar;
- categoría;
- tamaño 8×8, 16×16 o 32×32;
- estilo visual;
- nivel de detalle;
- tipo de paleta;
- iluminación;
- perspectiva;
- fondo;
- tipo de contorno;
- cantidad de pasos del tutorial;
- notas adicionales.

Por ahora **no se llama a ninguna API ni modelo de IA**. El sistema genera una especificación local estructurada (`pixel-art-studio-spec-v1`) que puede:

- previsualizarse;
- copiarse como JSON;
- aplicar el tamaño seleccionado al editor.

Esta especificación será la base para enviar solicitudes consistentes a una IA real en una versión futura.

La salida esperada de la futura IA será:

1. paleta recomendada;
2. sprite final;
3. pasos de construcción;
4. coordenadas de píxeles por paso;
5. colores por píxel cuando sea necesario;
6. guía gráfica acumulativa compatible con el sistema actual de tutoriales.

El AI Lab incluye pequeños presets locales para reconocer ideas como manzana, espada, árbol, cofre, casa y personaje y sugerir opciones iniciales.

### Tutorial gráfico actual

La manzana continúa siendo el objeto de práctica principal:

- **8×8:** forma esencial.
- **16×16:** contorno, relleno, luces y sombras.
- **32×32:** mayor detalle, curvas y tonos intermedios.

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
│   └── ai-prep.js
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

- Conectar el AI Lab a una IA real.
- Convertir la respuesta de IA directamente en tutoriales gráficos.
- Validar automáticamente la estructura generada.
- Biblioteca y buscador de objetos.
- Selección y movimiento de áreas.
- Copiar/pegar selecciones.
- Capas.
- Fondo transparente.
- Paletas guardadas.
- Personajes y animaciones.
- Escenarios y tilesets.
- Estilos adicionales.

---

# 📓 Bitácora de desarrollo

## 31 de agosto de 2026 — Inicio del proyecto

### v0.1 — Base inicial

- [x] Crear estructura, interfaz y cuadrícula 16×16.
- [x] Añadir lápiz, borrador, color y primer tutorial.

### v0.2 — Tutoriales gráficos

- [x] Añadir guía visual por coordenadas y pasos acumulativos.

### v0.2.1 — Pintura continua

- [x] Pintar y borrar manteniendo presionado y arrastrando.

### v0.3 — Herramientas y formatos

- [x] Añadir 8×8, 16×16 y 32×32.
- [x] Adaptar la manzana a cada resolución.

### v0.3.1 — Corrección funcional

- [x] Hacer funcionales herramientas, historial, zoom, cuadrícula y PNG.

### v0.3.2 — Formas y transformaciones

- [x] Añadir elipse, volteos y rotación.

### v0.3.3 — Preparación para IA

- [x] Añadir AI Lab.
- [x] Añadir entrada libre de objeto.
- [x] Añadir categoría, tamaño, estilo y detalle.
- [x] Añadir paleta, iluminación, perspectiva y fondo.
- [x] Añadir contorno, número de pasos y notas extra.
- [x] Generar una especificación local estructurada.
- [x] Copiar la especificación como JSON.
- [x] Aplicar el tamaño elegido al editor.
- [x] Añadir presets locales básicos.
- [x] Añadir panel visible de atajos.
- [ ] Conectar una IA real.
- [ ] Convertir la respuesta de IA en un tutorial cargable.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript

Por ahora no se utilizan frameworks para mantener el proyecto sencillo, rápido y fácil de comprender.