document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("image");

  function extractThreeDistinctColors(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorMap = new Map();
    const colorThreshold = 100;

    const samplePoints = [
      { x: 0.2, y: 0.2 }, // Kiri atas
      { x: 0.8, y: 0.2 }, // Kanan atas
      { x: 0.5, y: 0.5 }, // Tengah
      { x: 0.2, y: 0.8 }, // Kiri bawah
      { x: 0.8, y: 0.8 }, // Kanan bawah
    ];

    function rgbToHex(r, g, b) {
      return (
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    }

    function colorDistance(color1, color2) {
      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);

      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);

      return Math.sqrt(
        Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
      );
    }

    samplePoints.forEach((point) => {
      const x = Math.floor(point.x * (canvas.width - 1));
      const y = Math.floor(point.y * (canvas.height - 1));

      const pixelIndex = (y * canvas.width + x) * 4;

      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      const hexColor = rgbToHex(r, g, b);

      colorMap.set(hexColor, (colorMap.get(hexColor) || 0) + 1);
    });

    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    const distinctColors = [];
    for (const color of sortedColors) {
      if (
        distinctColors.length === 0 ||
        distinctColors.every((c) => colorDistance(c, color) > colorThreshold)
      ) {
        distinctColors.push(color);
        if (distinctColors.length === 3) break;
      }
    }

    while (distinctColors.length < 3) {
      distinctColors.push("#2C3E50");
    }

    return distinctColors.slice(0, 3);
  }

  function applyColorGradient(colors) {
    const gradient = `linear-gradient(
            135deg,
            ${colors[0]} 25%,
            ${colors[1]} 60%,
            ${colors[2]} 100%
        )`;

    // Terapkan gradien pada seluruh viewport
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = gradient;
    document.body.style.backgroundSize = "cover";
    document.body.style.overflow = "hidden";

    // Debugging untuk memastikan warna gradien
    console.log("Gradient Applied:", gradient);
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  image.addEventListener("load", () => {
    const dominantColors = extractThreeDistinctColors(image);
    applyColorGradient(dominantColors);
  });

  if (image.complete) {
    const dominantColors = extractThreeDistinctColors(image);
    applyColorGradient(dominantColors);
  }
});
