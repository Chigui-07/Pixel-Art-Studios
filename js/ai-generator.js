window.PixelAIGenerator = (() => {
  const EMPTY = "T";

  function hash(text) {
    let value = 2166136261;
    for (const char of String(text)) {
      value ^= char.charCodeAt(0);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function parseSize(prompt, requested = "auto") {
    if (requested !== "auto") return Number(requested);
    const match = String(prompt).match(/\b(8|12|16|24|32|48|64)\s*[x×]\s*\1\b/i);
    if (match) return Number(match[1]);
    if (/personaje|character|persona|escena|scene|edificio|casa|animation|animaci[oó]n/i.test(prompt)) return 32;
    return 16;
  }

  function paletteFor(prompt, style) {
    const seed = hash(`${prompt}-${style}`);
    const palettes = {
      wood: ["#241914", "#513326", "#84563c", "#b77a52", "#e2b78a", "#6e8fbf", "#a9c9ee"],
      nature: ["#162119", "#274a31", "#3f6e3d", "#67934d", "#9fbd69", "#5e3d2a", "#946644"],
      metal: ["#171a20", "#313741", "#596472", "#8f9dab", "#c7d2dd", "#eceff4", "#8b6b38"],
      warm: ["#261a1a", "#5d2d2d", "#9a3d35", "#d85c47", "#f19a68", "#ffd0a8", "#70442f"],
      blue: ["#162034", "#253f62", "#3b6591", "#5f8fc4", "#94bce2", "#d0e2f2", "#5b3a2c"]
    };
    if (/madera|wood|café|cafe|marr[oó]n|cama|puerta|mesa|silla/i.test(prompt)) return palettes.wood;
    if (/árbol|arbol|tree|planta|nature|verde|green/i.test(prompt)) return palettes.nature;
    if (/metal|espada|sword|armadura/i.test(prompt)) return palettes.metal;
    if (/azul|blue/i.test(prompt)) return palettes.blue;
    return ["#202027", `hsl(${seed % 360} 38% 28%)`, `hsl(${seed % 360} 48% 42%)`, `hsl(${seed % 360} 58% 58%)`, `hsl(${(seed + 22) % 360} 52% 72%)`, `hsl(${(seed + 35) % 360} 44% 84%)`, "#6d4b35"];
  }

  function paletteEntries(colors) {
    const ids = ["O", "D", "M", "L", "H", "A", "B"];
    return [{ id:"T", hex:"transparent", role:"transparent" }, ...colors.map((hex, index) => ({
      id: ids[index] || `C${index + 1}`,
      hex,
      role: index === 0 ? "outline" : index === 1 ? "shadow" : index === 2 ? "base" : index === 3 ? "light" : index === 4 ? "highlight" : "accent"
    }))];
  }

  function blank(size) { return Array.from({ length:size }, () => new Array(size).fill(EMPTY)); }
  function set(p, x, y, color) { if (y >= 0 && y < p.length && x >= 0 && x < p.length) p[y][x] = color; }
  function fillRect(p, x0, y0, x1, y1, color) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(p, x, y, color);
  }
  function outlineRect(p, x0, y0, x1, y1, color) {
    for (let x=x0;x<=x1;x++){ set(p,x,y0,color); set(p,x,y1,color); }
    for (let y=y0;y<=y1;y++){ set(p,x0,y,color); set(p,x1,y,color); }
  }
  function S(size, value) { return Math.round(value * size / 16); }

  function bed(size) {
    const p = blank(size), s=v=>S(size,v);
    fillRect(p,s(2),s(5),s(3),s(13),"D");
    fillRect(p,s(12),s(8),s(13),s(13),"D");
    fillRect(p,s(3),s(7),s(12),s(12),"M");
    outlineRect(p,s(2),s(6),s(13),s(12),"O");
    fillRect(p,s(3),s(7),s(11),s(9),"A");
    fillRect(p,s(4),s(8),s(6),s(9),"H");
    fillRect(p,s(4),s(10),s(11),s(11),"B");
    fillRect(p,s(4),s(12),s(11),s(12),"D");
    set(p,s(3),s(6),"L"); set(p,s(12),s(8),"L");
    return p;
  }

  function tree(size) {
    const p=blank(size), s=v=>S(size,v);
    fillRect(p,s(7),s(9),s(8),s(14),"B");
    fillRect(p,s(7),s(9),s(7),s(13),"D");
    const circles=[[8,5,4,"M"],[5,7,3,"D"],[10,7,3,"L"],[8,4,2,"H"]];
    for(const [cx,cy,r,c] of circles){
      for(let y=-r;y<=r;y++) for(let x=-r;x<=r;x++) if(x*x+y*y<=r*r) set(p,s(cx+x),s(cy+y),c);
    }
    for(let x=s(5);x<=s(11);x++){ set(p,x,s(2),"O"); set(p,x,s(10),"O"); }
    return p;
  }

  function apple(size) {
    const p=blank(size), s=v=>S(size,v);
    for(let y=4;y<=12;y++) for(let x=3;x<=12;x++) {
      const dx=(x-7.5)/5, dy=(y-8)/4.6;
      if(dx*dx+dy*dy<=1){
        const id = x < 6 || y > 10 ? "D" : x > 9 && y < 7 ? "L" : "M";
        set(p,s(x),s(y),id);
      }
    }
    fillRect(p,s(7),s(2),s(8),s(4),"B");
    set(p,s(9),s(3),"L"); set(p,s(10),s(3),"H");
    return p;
  }

  function chest(size) {
    const p=blank(size), s=v=>S(size,v);
    fillRect(p,s(3),s(6),s(12),s(12),"D");
    outlineRect(p,s(3),s(5),s(12),s(12),"O");
    fillRect(p,s(4),s(7),s(11),s(11),"M");
    fillRect(p,s(4),s(6),s(11),s(7),"L");
    fillRect(p,s(7),s(8),s(8),s(10),"H");
    fillRect(p,s(4),s(11),s(11),s(11),"D");
    return p;
  }

  function lamp(size) {
    const p=blank(size), s=v=>S(size,v);
    for(let y=3;y<=7;y++) for(let x=4;x<=11;x++) {
      const half=4-(y-3)*.55;
      if(Math.abs(x-7.5)<=half) set(p,s(x),s(y), y<5 ? "H" : "L");
    }
    fillRect(p,s(7),s(7),s(8),s(12),"M");
    fillRect(p,s(5),s(12),s(10),s(13),"D");
    outlineRect(p,s(5),s(3),s(10),s(3),"O");
    return p;
  }

  function door(size) {
    const p=blank(size), s=v=>S(size,v);
    fillRect(p,s(4),s(2),s(11),s(14),"D");
    outlineRect(p,s(4),s(2),s(11),s(14),"O");
    fillRect(p,s(5),s(3),s(10),s(13),"M");
    fillRect(p,s(5),s(3),s(9),s(4),"L");
    fillRect(p,s(5),s(11),s(10),s(13),"D");
    set(p,s(9),s(8),"H");
    return p;
  }

  function generic(prompt, size) {
    const p=blank(size), seed=hash(prompt);
    const cx=Math.floor(size/2), cy=Math.floor(size/2);
    const rx=Math.max(3,Math.floor(size*.31)), ry=Math.max(3,Math.floor(size*.34));
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const nx=(x-cx)/rx, ny=(y-cy)/ry;
      const wobble=((x*11+y*17+seed)%13)/60;
      if(nx*nx+ny*ny < .82+wobble) {
        let id="M";
        if(x < cx-rx*.42 || y > cy+ry*.45) id="D";
        else if(x > cx+rx*.25 && y < cy-ry*.2) id="L";
        p[y][x]=id;
      }
    }
    // contorno automático alrededor de la silueta
    const copy=p.map(row=>[...row]);
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      if(copy[y][x]!==EMPTY) continue;
      const near=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>copy[y+dy]?.[x+dx] && copy[y+dy][x+dx]!==EMPTY);
      if(near) p[y][x]="O";
    }
    // acento determinista para evitar manchas demasiado planas
    const ax=Math.max(1,Math.min(size-2,cx + ((seed%5)-2)));
    const ay=Math.max(1,Math.min(size-2,cy - Math.floor(ry*.35)));
    set(p,ax,ay,"H");
    return p;
  }

  function buildBase(prompt, size) {
    if (/cama|bed/i.test(prompt)) return bed(size);
    if (/árbol|arbol|tree/i.test(prompt)) return tree(size);
    if (/manzana|apple/i.test(prompt)) return apple(size);
    if (/cofre|chest/i.test(prompt)) return chest(size);
    if (/lámpara|lampara|lamp/i.test(prompt)) return lamp(size);
    if (/puerta|door/i.test(prompt)) return door(size);
    return generic(prompt,size);
  }

  function shiftMatrix(source, dx, dy) {
    const size=source.length, out=blank(size);
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const nx=x+dx, ny=y+dy;
      if(source[y][x]!==EMPTY && nx>=0&&ny>=0&&nx<size&&ny<size) out[ny][nx]=source[y][x];
    }
    return out;
  }

  function animationFrames(prompt, base) {
    const size=base.length;
    if (/parpade|blink|luz|light|brill/i.test(prompt)) {
      const dim=base.map(row=>row.map(id=>id==="H"?"L":id==="L"?"M":id));
      return [base,dim,base];
    }
    if (/respira|breath|idle/i.test(prompt)) return [base, shiftMatrix(base,0,-1), base, shiftMatrix(base,0,1)];
    if (/camina|walk|andar|move|mover/i.test(prompt)) return [shiftMatrix(base,-1,0),base,shiftMatrix(base,1,0),base];
    return [base, shiftMatrix(base,1,0), base, shiftMatrix(base,-1,0)];
  }

  function buildAsset({ prompt, size="auto", type="object", style="rumbo" }) {
    const clean=String(prompt||"").trim();
    if(!clean) throw new Error("Describe qué quieres crear.");
    const canvasSize=parseSize(clean,size);
    const assetType=type === "animation" ? "animation" : type;
    const colors=paletteFor(clean,style);
    const palette=paletteEntries(colors);
    const base=buildBase(clean,canvasSize);
    const matrices=assetType === "animation" ? animationFrames(clean,base) : [base];
    const duration=/rápid|rapid|fast/i.test(clean)?110:/lent|slow/i.test(clean)?260:170;

    const asset={
      format:"pixel-art-ai-studio-v1",
      assetType,
      name:clean.slice(0,60),
      description:clean,
      style: style === "rumbo" ? { ...window.PixelAISchema.RUMBO_PROFILE } : {
        profile:"FREE", outline:"soft-dark", lighting:"top-left", detail:"medium", paletteMode:"limited", background:"transparent", antiAliasing:false
      },
      canvas:{ width:canvasSize, height:canvasSize },
      palette,
      tags:[assetType, style, "generated"],
      frames:matrices.map((pixels,index)=>({ id:`frame_${String(index+1).padStart(2,"0")}`, name:`frame ${index+1}`, durationMs:duration, pixels })),
      animation:{ isAnimated:assetType === "animation", loop:assetType === "animation", defaultFps:assetType === "animation" ? 6 : 1 },
      notes:{
        designIntent:"Pixel art editable, centrado y legible para juego 2D.",
        consistencyRules:["Fondo transparente","Sin anti-aliasing","Paleta limitada","Silueta clara"]
      }
    };

    const checked=window.PixelAISchema.validate(asset);
    if(!checked.ok) throw new Error(checked.errors[0]);
    return asset;
  }

  function apply(asset) { return window.PixelAISchema.applyToStudio(asset); }

  return { generate:buildAsset, apply, parseSize };
})();