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

function applyMonochromeTheme() {
  console.log("Monochrome theme applied");
  // Add implementation
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
        applyMonochromeTheme();
        break;
      case "triad":
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
});
