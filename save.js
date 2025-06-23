function exportToPNG(width, height, cellColors, scale, filename) {
  const canvas = document.getElementById("exportCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width * scale;
  canvas.height = height * scale;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const i = row * width + col;
      const color = cellColors[i] || "#ffffff";
      ctx.fillStyle = color;
      ctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }

  // Trigger download
  const link = document.createElement("a");
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}


const exportDialog = document.getElementById("saveDialog");
const exportConfirmBtn = document.getElementById("saveConfirmBtn");
const exportCloseBtn = document.getElementById("saveCloseBtn");

function openSaveDialog(){
    exportDialog.showModal();
}

exportConfirmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const width = window.currentCols;
  const height = window.currentRows;
  const colors = window.getCellColors ? window.getCellColors() : [];

  const scale = parseInt(document.getElementById("saveScale").value, 10);
  const filename = document.getElementById("filename").value.trim();

  if (width > 0 && height > 0 && colors.length > 0 && scale > 0) {
    exportToPNG(width, height, colors, scale, filename);
    exportDialog.close();
  } else {
    alert("Invalid export settings or nothing to export.");
  }
});

exportCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  exportDialog.close();
});