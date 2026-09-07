window.PixelAIGenerator = (() => {
  const EMPTY = "transparent";

  function hash(text) {
    let value = 2166136261;
    for (const char of text) {
      value ^= char.charCodeAt(0);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function parseSize(prompt, requested = "auto") {
    if (requested !== "auto") return Number(requested);
    const match = String(prompt).match(/\b(8|12|16|24|32|48|64)\s*[x×]\s*\1\b/i);
    if (match) return Number(match[1]);
    if (/personaje|character|persona|edificio|casa|escena/i.test(prompt)) return 32;
    return 16;
  }

  function paletteFor(prompt, style) {
    const seed = hash(`${prompt}-${style}`);
    const hue = seed % 360;
    const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;
    if (/madera|wood|café|cafe|marr[oó]n/i.test(prompt)) return ["#2b211d", "#5c3b2c", "#8a5a3c", "#c58a5a", "#e2bc8f"];
    if (/azul|blue/i.test(prompt)) return ["#182338", "#28466d", "#3f6fa6", "#79a9d8", "#d0e4f2"];
    if (/verde|green|árbol|arbol|planta|nature/i.test(prompt)) return ["#1d2b22", "#315a3d", "#4f7f4d", "#78a65d", "#b8cf7a"];
    if (/metal|espada|sword/i.test(prompt)) return ["#20232b", "#424955", "#7e8999", "#c1ccd8", "#eef4fa"];
    return ["#202027", hsl(hue, 42, 28), hsl(hue, 55, 43), hsl(hue, 65, 62), hsl((hue + 24) % 360, 55, 78)];
  }

  function blank(size) { return new Array(size * size).fill(EMPTY); }
  function set(pixels, size, x, y, color) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    pixels[y * size + x] = color;
  }
  function rect(pixels, size, x0, y0, x1, y1, color, fill = true) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (fill || x === x0 || x === x1 || y === y0 || y === y1) set(pixels, size, x, y, color);
    }
  }

  function scalePoint(size, x, y) {
    const base = 16;
    return [Math.round((x / base) * size), Math.round((y / base) * size)];
  }

  function bed(size, colors) {
    const p = blank(size); const s = v => Math.round(v * size / 16);
    rect(p,size,s(2),s(6),s(13),s(11),colors[0],false);
    rect(p,size,s(3),s(7),s(12),s(10),colors[3],true);
    rect(p,size,s(3),s(7),s(6),s(8),colors[4],true);
    rect(p,size,s(2),s(5),s(3),s(12),colors[1],true);
    rect(p,size,s(12),s(8),s(13),s(12),colors[1],true);
    rect(p,size,s(4),s(10),s(11),s(11),colors[2],true);
    return p;
  }

  function tree(size, colors) {
    const p = blank(size); const s = v => Math.round(v * size / 16);
    rect(p,size,s(7),s(9),s(8),s(14),"#6b4630",true);
    for (const [cx,cy,r,c] of [[8,5,4,2],[5,7,3,3],[10,7,3,3]]) {
      for (let y=-r;y<=r;y++) for(let x=-r;x<=r;x++) if(x*x+y*y<=r*r) set(p,size,s(cx+x),s(cy+y),colors[c]);
    }
    return p;
  }

  function apple(size, colors) {
    const p = blank(size); const s=v=>Math.round(v*size/16);
    for(let y=4;y<=12;y++) for(let x=3;x<=12;x++) {
      const dx=(x-7.5)/5, dy=(y-8)/4.5;
      if(dx*dx+dy*dy<=1) set(p,size,s(x),s(y),colors[2]);
    }
    rect(p,size,s(7),s(2),s(8),s(4),"#5b3b28",true);
    set(p,size,s(9),s(3),colors[4]); set(p,size,s(10),s(3),colors[4]);
    return p;
  }

  function chest(size, colors) {
    const p=blank(size); const s=v=>Math.round(v*size/16);
    rect(p,size,s(3),s(6),s(12),s(12),colors[0],false);
    rect(p,size,s(4),s(7),s(11),s(11),colors[2],true);
    rect(p,size,s(3),s(5),s(12),s(7),colors[1],true);
    rect(p,size,s(7),s(8),s(8),s(10),colors[4],true);
    return p;
  }

  function lamp(size, colors) {
    const p=blank(size); const s=v=>Math.round(v*size/16);
    rect(p,size,s(7),s(7),s(8),s(12),colors[1],true);
    rect(p,size,s(5),s(12),s(10),s(13),colors[0],true);
    for(let y=3;y<=7;y++) for(let x=4;x<=11;x++) if(Math.abs(x-7.5)<=4-(y-3)*.6) set(p,size,s(x),s(y),colors[3]);
    rect(p,size,s(5),s(3),s(10),s(3),colors[0],true);
    return p;
  }

  function door(size, colors) {
    const p=blank(size); const s=v=>Math.round(v*size/16);
    rect(p,size,s(4),s(2),s(11),s(14),colors[0],false);
    rect(p,size,s(5),s(3),s(10),s(13),colors[2],true);
    set(p,size,s(9),s(8),colors[4]);
    return p;
  }

  function generic(prompt, size, colors) {
    const p=blank(size); const seed=hash(prompt);
    const margin=Math.max(2,Math.round(size*.18));
    const cx=Math.floor(size/2), cy=Math.floor(size/2);
    const rx=Math.max(2,cx-margin), ry=Math.max(2,cy-margin);
    for(let y=margin;y<size-margin;y++) for(let x=margin;x<size-margin;x++) {
      const nx=(x-cx)/rx, ny=(y-cy)/ry;
      const wobble=((x*13+y*7+seed)%11)/40;
      if(nx*nx+ny*ny < .78+wobble) p[y*size+x]=colors[(x+y+seed)%3+1];
    }
    for(let x=margin;x<size-margin;x++) set(p,size,x,margin,colors[0]);
    return p;
  }

  function generate({ prompt, size = "auto", type = "object", style = "rumbo" }) {
    const clean = String(prompt || "").trim();
    if (!clean) throw new Error("Describe qué quieres crear.");
    const canvasSize = parseSize(clean, size);
    const palette = paletteFor(clean, style);
    let pixels;
    if (/cama|bed/i.test(clean)) pixels = bed(canvasSize, palette);
    else if (/árbol|arbol|tree/i.test(clean)) pixels = tree(canvasSize, palette);
    else if (/manzana|apple/i.test(clean)) pixels = apple(canvasSize, palette);
    else if (/cofre|chest/i.test(clean)) pixels = chest(canvasSize, palette);
    else if (/lámpara|lampara|lamp/i.test(clean)) pixels = lamp(canvasSize, palette);
    else if (/puerta|door/i.test(clean)) pixels = door(canvasSize, palette);
    else pixels = generic(clean, canvasSize, palette);

    return {
      format: "pixel-art-ai-draft-v1",
      generator: "local-prototype",
      name: clean.slice(0, 60),
      prompt: clean,
      type,
      style,
      size: canvasSize,
      palette,
      pixels
    };
  }

  function apply(result) {
    if (!result || !Array.isArray(result.pixels)) return false;
    const sizeSelect = document.getElementById("sizeSelect");
    if (sizeSelect && String(sizeSelect.value) !== String(result.size)) sizeSelect.value = String(result.size);
    window.PixelCanvas.loadState({ size: result.size, pixels: [...result.pixels] });
    const sizeLabel = document.getElementById("canvasSizeLabel");
    if (sizeLabel) sizeLabel.textContent = `${result.size} × ${result.size}`;
    window.dispatchEvent(new CustomEvent("pixelaigenerated", { detail: result }));
    return true;
  }

  return { generate, apply, parseSize };
})();