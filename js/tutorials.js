window.PixelTutorials = {
  apple: {
    title: "Manzana clásica",
    meta: "16×16 · Principiante",
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
        pixels: [[7,3],[7,2],[8,3],[9,3],[10,2]] ,
        pixelColors: {
          "7,3":"#70452d",
          "7,2":"#70452d",
          "8,3":"#4f7f3d",
          "9,3":"#4f7f3d",
          "10,2":"#4f7f3d"
        }
      }
    ]
  }
};