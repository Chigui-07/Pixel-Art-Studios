(() => {
  const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const row = (y, startX, endX) => range(startX, endX).map(x => [x, y]);
  const rows = (...definitions) => definitions.flatMap(([y, startX, endX]) => row(y, startX, endX));

  window.PixelTutorials = {
    apple: {
      8: {
        title: "Manzana mini",
        meta: "8×8 · Esencial",
        note: "En 8×8 no hay espacio para adornos: gana la silueta. El objetivo es reconocer una manzana con muy pocos píxeles.",
        steps: [
          {
            text: "Marca una silueta simple. En este tamaño conviene sacrificar curvas suaves y pensar en bloques fáciles de leer.",
            color: "#8f2d2d",
            colorName: "Rojo oscuro",
            pixels: [[2,2],[3,2],[4,2],[5,2],[1,3],[6,3],[1,4],[6,4],[2,5],[5,5],[3,6],[4,6]]
          },
          {
            text: "Rellena el centro con un rojo medio. No necesitamos degradados: un solo tono principal ya comunica volumen suficiente.",
            color: "#d94343",
            colorName: "Rojo medio",
            pixels: [[2,3],[3,3],[4,3],[5,3],[2,4],[3,4],[4,4],[5,4],[3,5],[4,5]]
          },
          {
            text: "Añade apenas dos píxeles de luz y uno de sombra. En un sprite tan pequeño, cada píxel cambia mucho la lectura.",
            color: "#ff7468",
            colorName: "Luz / sombra",
            pixels: [[2,3],[3,3],[5,4]],
            pixelColors: {
              "2,3":"#ff7468",
              "3,3":"#ff7468",
              "5,4":"#6e2027"
            }
          },
          {
            text: "Termina con un tallo y una hoja diminuta. Son detalles mínimos, pero ayudan a que la fruta se identifique de inmediato.",
            color: "#70452d",
            colorName: "Tallo / hoja",
            pixels: [[3,1],[4,1],[5,1]],
            pixelColors: {
              "3,1":"#70452d",
              "4,1":"#70452d",
              "5,1":"#4f7f3d"
            }
          }
        ]
      },
      16: {
        title: "Manzana clásica",
        meta: "16×16 · Principiante",
        note: "16×16 equilibra claridad y detalle. Ya podemos separar contorno, color base, luces, sombras y pequeños accesorios.",
        steps: [
          {
            text: "Empieza por la silueta superior. Coloca estos píxeles oscuros para marcar los hombros de la manzana y dejar un pequeño hueco en el centro.",
            color: "#8f2d2d",
            colorName: "Rojo oscuro",
            pixels: [[5,4],[6,4],[9,4],[10,4],[4,5],[11,5],[3,6],[12,6]]
          },
          {
            text: "Continúa cerrando los costados. La forma debe ensancharse en el centro y empezar a estrecharse abajo.",
            color: "#8f2d2d",
            colorName: "Rojo oscuro",
            pixels: [[3,7],[12,7],[3,8],[12,8],[3,9],[12,9],[4,10],[11,10],[5,11],[10,11],[6,12],[7,12],[8,12],[9,12]]
          },
          {
            text: "Rellena el interior con rojo medio. Mantén visible el contorno oscuro: el borde ayuda a que la silueta se lea con claridad.",
            color: "#d94343",
            colorName: "Rojo medio",
            pixels: [[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[6,11],[7,11],[8,11],[9,11]]
          },
          {
            text: "Añade luz en la zona superior izquierda. Son pocos píxeles: la intención es sugerir brillo, no pintar otra forma encima.",
            color: "#ff7468",
            colorName: "Rojo claro",
            pixels: [[5,6],[6,6],[5,7],[6,7],[7,7],[5,8]]
          },
          {
            text: "Refuerza el volumen con una sombra corta en la parte inferior derecha. Observa cómo la luz y la sombra apuntan en direcciones opuestas.",
            color: "#6e2027",
            colorName: "Rojo sombra",
            pixels: [[10,9],[11,9],[9,10],[10,10],[9,11]]
          },
          {
            text: "Termina con el tallo y una hoja pequeña. Estos detalles ocupan muy pocos píxeles, pero ayudan a identificar la fruta inmediatamente.",
            color: "#70452d",
            colorName: "Marrón / verde",
            pixels: [[7,3],[7,2],[8,3],[9,3],[10,2]],
            pixelColors: {
              "7,3":"#70452d",
              "7,2":"#70452d",
              "8,3":"#4f7f3d",
              "9,3":"#4f7f3d",
              "10,2":"#4f7f3d"
            }
          }
        ]
      },
      32: {
        title: "Manzana detallada",
        meta: "32×32 · Detallado",
        note: "32×32 permite una silueta más suave, varias zonas de luz y sombra, una hoja más legible y pequeños cambios de tono.",
        steps: [
          {
            text: "Construye primero la parte superior del contorno. A mayor resolución, podemos suavizar mejor las curvas usando pequeños escalones.",
            color: "#74232a",
            colorName: "Contorno profundo",
            pixels: [
              ...row(7,10,13), ...row(7,18,21),
              [9,8],[14,8],[17,8],[22,8],
              [8,9],[23,9], [7,10],[24,10], [6,11],[25,11]
            ]
          },
          {
            text: "Cierra los laterales y la base. Busca una forma ancha en el centro y ligeramente estrecha abajo para que no parezca una esfera perfecta.",
            color: "#74232a",
            colorName: "Contorno profundo",
            pixels: [
              [5,12],[26,12],[5,13],[26,13],[4,14],[27,14],[4,15],[27,15],[4,16],[27,16],[4,17],[27,17],
              [5,18],[26,18],[5,19],[26,19],[6,20],[25,20],[6,21],[25,21],[7,22],[24,22],[8,23],[23,23],
              [9,24],[22,24], ...row(25,10,21)
            ]
          },
          {
            text: "Rellena la masa principal con rojo medio. Aquí sí podemos conservar una franja de contorno y trabajar dentro con varios tonos.",
            color: "#d13b46",
            colorName: "Rojo base",
            pixels: rows(
              [8,10,13],[8,18,21],[9,9,22],[10,8,23],[11,7,24],[12,6,25],[13,6,25],[14,5,26],[15,5,26],
              [16,5,26],[17,5,26],[18,6,25],[19,6,25],[20,7,24],[21,7,24],[22,8,23],[23,9,22],[24,10,21]
            )
          },
          {
            text: "Añade un tono intermedio más cálido en la parte izquierda y superior. Esto crea una transición antes del brillo principal.",
            color: "#e94f55",
            colorName: "Rojo cálido",
            pixels: rows([10,10,15],[11,9,15],[12,8,14],[13,8,13],[14,7,12],[15,7,11],[16,7,10])
          },
          {
            text: "Coloca ahora la luz principal. En 32×32 podemos hacer un brillo con forma irregular en lugar de un simple bloque.",
            color: "#ff7a73",
            colorName: "Luz principal",
            pixels: [[9,11],[10,11],[11,11],[9,12],[10,12],[11,12],[12,12],[9,13],[10,13],[11,13],[9,14],[10,14],[8,15],[9,15],[8,16]]
          },
          {
            text: "Construye una sombra más rica en la zona inferior derecha. Usa una masa compacta que siga la curva de la fruta.",
            color: "#8d2733",
            colorName: "Sombra",
            pixels: rows([18,20,24],[19,19,24],[20,18,23],[21,18,22],[22,17,21],[23,17,20],[24,16,20])
          },
          {
            text: "Dibuja un tallo más alto y una hoja reconocible. Aquí ya tenemos resolución suficiente para insinuar dirección y forma.",
            color: "#6b432e",
            colorName: "Tallo / hoja",
            pixels: [[15,6],[15,5],[16,5],[16,4],[17,4],[18,5],[19,5],[20,5],[21,6],[20,6],[19,7],[18,7]],
            pixelColors: {
              "15,6":"#6b432e","15,5":"#6b432e","16,5":"#6b432e","16,4":"#6b432e","17,4":"#6b432e",
              "18,5":"#4f7f3d","19,5":"#4f7f3d","20,5":"#5f9348","21,6":"#5f9348","20,6":"#4f7f3d","19,7":"#4f7f3d","18,7":"#4f7f3d"
            }
          },
          {
            text: "Termina con detalles pequeños: un brillo secundario y algunos píxeles oscuros para reforzar profundidad. Estos detalles serían excesivos en 8×8, pero aquí sí funcionan.",
            color: "#ffd0c7",
            colorName: "Detalle final",
            pixels: [[12,10],[13,10],[12,11],[23,17],[22,20],[16,24]],
            pixelColors: {
              "12,10":"#ffd0c7","13,10":"#ffd0c7","12,11":"#ffd0c7",
              "23,17":"#6e2027","22,20":"#6e2027","16,24":"#6e2027"
            }
          }
        ]
      }
    }
  };
})();