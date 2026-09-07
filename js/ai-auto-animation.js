(() => {
  if (!window.PixelAIGenerator || window.PixelAIGenerator.__autoAnimation) return;
  const originalGenerate = window.PixelAIGenerator.generate.bind(window.PixelAIGenerator);
  const animationIntent = /\b(animaci[oó]n|animate|animated|frames?|fotogramas?|camina(?:ndo)?|walk(?:ing)?|corre|running|respira(?:ndo)?|breath(?:ing)?|parpade(?:a|ando)?|blink(?:ing)?|idle|movi(?:miento|endo)|gira(?:ndo)?|rotat(?:e|ing))\b/i;

  window.PixelAIGenerator.generate = options => {
    const prompt = String(options?.prompt || "");
    const detectedType = animationIntent.test(prompt) ? "animation" : options?.type;
    return originalGenerate({ ...options, type: detectedType || "object" });
  };

  window.PixelAIGenerator.__autoAnimation = true;
})();