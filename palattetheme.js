function invertHexColor(hex) {
  if (!hex) return "#ffffff";
  hex = hex.replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const inverted = (0xFFFFFF ^ parseInt(hex, 16)).toString(16).padStart(6, '0');
  return `#${inverted}`;
}

function applyInvertedTheme(palette, grid) {
  console.log("Applying inverted theme...");

  const invertedGrid = grid.map(invertHexColor);
  const invertedPalette = palette.map(invertHexColor);

  window.setCellColors(invertedGrid);
  window.setPaletteColors(invertedPalette);
  window.updateLiveCanvas(invertedGrid);

  window.undo_stack.push(grid);
  window.palatte_undo_stack.push(palette);
  window.backgroundclr = invertHexColor(window.backgroundclr);

}

function openBinThemeDialog() {
  const binDialog = document.getElementById("binaryThemeDialog");
  binDialog?.showModal();
}

function applyBinaryThemeDialogHandler() {
  const binDialog = document.getElementById("binaryThemeDialog");
  const binConfirmBtn = document.getElementById("binConfirmBtn");
  const binCloseBtn = document.getElementById("binCloseBtn");
  const binColor1Input = document.getElementById("bincolor1");
  const binColor2Input = document.getElementById("bincolor2");

  if (!binDialog || !binConfirmBtn || !binCloseBtn) {
    console.warn("Binary theme dialog elements not found");
    return;
  }

  binCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    binDialog.close();
  });

  binConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const color1 = binColor1Input.value;
    const color2 = binColor2Input.value;

    if (!color1 || !color2 || color1 === color2) {
      alert("Please choose two different binary colors.");
      return;
    }

    applyBinaryTheme(color1, color2);
    binDialog.close();
  });
}

function applyBinaryTheme(color1, color2) {
  const currentColors = window.getCellColors();
  const currentPalette = window.getPaletteColors();
  console.log(window.backgroundclr);
  console.log(currentPalette);
  console.log(window._colorUsedCount);

  if (!currentColors || !currentPalette) {
    console.warn("Grid or palette not available");
    return;
  }

  let updatedColors;
  const updatePalatte = [color1,color2];

  if (window.backgroundclr && window.backgroundclr !== "transparent") {
    updatedColors = currentColors.map(color =>
      color.toLowerCase() === window.backgroundclr.toLowerCase() ? color1 : color2
    );
  } else {
    const usage = window._colorUsedCount || [];
    const maxIndex = usage.reduce((maxIdx, val, idx, arr) =>
      val > arr[maxIdx] ? idx : maxIdx, 0
    );

    const mostUsedColor = currentPalette[maxIndex] || "#000000";

    updatedColors = currentColors.map(color =>
      color.toLowerCase() === mostUsedColor.toLowerCase() ? color1 : color2
    );
  }
  window.backgroundclr = color1;
  window.setPaletteColors(updatePalatte);
  window.setCellColors(updatedColors);
  window.updateLiveCanvas(updatedColors);

  window.undo_stack.push(currentColors);
  //window.palatte_undo_stack.push(currentPalette);
  console.log(window.backgroundclr);
  console.log(currentPalette);
  console.log(window._colorUsedCount);
}

function openTriadThemeDialog() {
  const triDialog = document.getElementById("triadThemeDialog");
  triDialog?.showModal();
}

function applyTriadThemeDialogHandler() {
  const triDialog = document.getElementById("triadThemeDialog");
  const triConfirmBtn = document.getElementById("triConfirmBtn");
  const triCloseBtn = document.getElementById("triCloseBtn");
  const triColor1Input = document.getElementById("tricolor1");
  const triColor2Input = document.getElementById("tricolor2");
  const triColor3Input = document.getElementById("tricolor3");

  if (!triDialog || !triConfirmBtn || !triCloseBtn) {
    console.warn("Triad theme dialog elements not found");
    return;
  }

  triCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    triDialog.close();
  });

  triConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const color1 = triColor1Input.value;
    const color2 = triColor2Input.value;
    const color3 = triColor3Input.value;

    if (
      !color1 || !color2 || !color3 ||
      color1 === color2 || color1 === color3 || color2 === color3 || color1 === color2 === color3
    ) {
      alert("Please choose three different colors.");
      return;
    }

    applyTriadTheme(color1, color2, color3);
    triDialog.close();
  });
}

function applyTriadTheme(color1, color2, color3) {
  const currentColors = window.getCellColors();
  const currentPalette = window.getPaletteColors();

  if (!currentColors || !currentPalette) {
    console.warn("Grid or palette not available");
    return;
  }

  const updatePalette = [color1, color2, color3];
  let updatedColors;

}

function hexToRgb(hex) {
  const parsed = hex.replace(/^#/, '');
  const bigint = parseInt(parsed, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x =>
    x.toString(16).padStart(2, '0')
  ).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // gray
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    r = g = b = l; // gray
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function openMonoThemeDialog() {
  const monoDialog = document.getElementById("MonochromeThemeDialog");
  monoDialog?.showModal();
}

function applyMonochromeThemeDialogHandler() {
  const monoDialog = document.getElementById("MonochromeThemeDialog");
  const monoConfirmBtn = document.getElementById("monoConfirmBtn");
  const monoCloseBtn = document.getElementById("monoCloseBtn");
  const hueInput = document.getElementById("monochrome_hue");

  if (!monoDialog || !monoConfirmBtn || !monoCloseBtn || !hueInput) {
    console.warn("Monochrome theme dialog elements not found");
    return;
  }

  // Close dialog on cancel
  monoCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    monoDialog.close();
  });

  // Confirm and apply hue
  monoConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const hue = parseInt(hueInput.value, 10);

    if (isNaN(hue) || hue < 0 || hue > 360) {
      alert("Please select a valid hue between 0 and 360.");
      return;
    }
    console.log(hue);
    applyMonochromeTheme(hue);
    monoDialog.close();
  });
}

function applyMonochromeTheme(hue) {
  const currentColors = window.getCellColors();
  const currentPalette = window.getPaletteColors();

  if (!currentColors || !currentPalette) {
    console.warn("Grid or palette not available");
    return;
  }

  const updatedColors = currentColors.map(color => {
    const [r, g, b] = hexToRgb(color);
    const [_, s, l] = rgbToHsl(r, g, b);

    const [newR, newG, newB] = hslToRgb(hue / 360, s, l);
    return rgbToHex(newR, newG, newB);
  });

  const updatePalatte = currentPalette.map(color => {
    const [r, g, b] = hexToRgb(color);
    const [_, s, l] = rgbToHsl(r, g, b);

    const [newR, newG, newB] = hslToRgb(hue / 360, s, l);
    return rgbToHex(newR, newG, newB);
  });

  window.setCellColors(updatedColors);
  window.setPaletteColors(updatePalatte);
  const [r, g, b] = hexToRgb(window.backgroundclr);
  const [_, s, l] = rgbToHsl(r, g, b);

    const [newR, newG, newB] = hslToRgb(hue / 360, s, l);
  window.backgroundclr = rgbToHex(newR, newG, newB)
  undo_stack.push("updatedColors");
  console.log("Monochrome theme applied");
}

function applyGrayscaleTheme() {
  const currentColors = window.getCellColors();
  const currentPalette = window.getPaletteColors();

  if (!currentColors || !currentPalette) {
    console.warn("Grid or palette not available");
    return;
  }

  const updatedColors = currentColors.map(color => {
    const [r, g, b] = hexToRgb(color);
    const gray = Math.round(0.21 * r + 0.72 * g + 0.07 * b);
    return rgbToHex(gray, gray, gray);
  });

  const updatedPalette = currentPalette.map(color => {
    const [r, g, b] = hexToRgb(color);
    const gray = Math.round(0.21 * r + 0.72 * g + 0.07 * b); //the luminosity formula
    return rgbToHex(gray, gray, gray);
  });

  window.setCellColors(updatedColors);
  window.setPaletteColors(updatedPalette);

  if (window.backgroundclr) {
    const [r, g, b] = hexToRgb(window.backgroundclr);
    const gray = Math.round(0.21 * r + 0.72 * g + 0.07 * b);
    window.backgroundclr = rgbToHex(gray, gray, gray);
  }
  undo_stack.push("updatedColors");

  console.log("Grayscale theme applied");
}


//form input
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("themeForm");

  if (!form) {
    console.error("themeForm not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedValue = document.getElementById("myDropdown").value;
    const currentPalette = window.getPaletteColors();
    const currentGrid = window.getCellColors();

    window.undo_stack_palatte = currentGrid;
    window.palatte_undo_stack_palatte = currentPalette;

    switch (selectedValue) {
      case "inverted":
        applyInvertedTheme(currentPalette, currentGrid);
        break;
      case "binary":
        openBinThemeDialog();
        break;
      case "monochrome":
        openMonoThemeDialog();
        break;
      case "triad":
        openTriadThemeDialog();
        break;
      case "greyscale":
        applyGrayscaleTheme();
        break;
      case "unify":
        openTriadThemeDialog();
        break;
      default:
        alert("Please select a theme.");
    }

    window.redo_stack_palatte = [];
    window.palatte_redo_stack_palatte = [];
  });

  applyBinaryThemeDialogHandler();
  applyTriadThemeDialogHandler();
  applyMonochromeThemeDialogHandler();
});

// for monochrome dialog
function updateHuePreview(hue) {
    const preview = document.getElementById('huePreview');
    preview.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
  }
