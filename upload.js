function openUploadDialogue() {
  const uploadDialog = document.getElementById("uploadDialog");
  uploadDialog.showModal();
}

window.openUploadDialogue = openUploadDialogue; // Expose globally for onclick

const uploadInput = document.getElementById("uploadImage");
const uploadDialog = document.getElementById("uploadDialog");
const uploadCloseBtn = document.getElementById("uploadCloseBtn");

uploadCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  uploadDialog.close();
});

// Handle file input change
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type !== "image/png") {
    alert("Please upload a PNG image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    loadImageToGrid(event.target.result);
    uploadDialog.close();
    uploadInput.value = ""; // reset input for future uploads
  };
  reader.readAsDataURL(file);
});

// Function to load the image and update grid colors
function loadImageToGrid(imageSrc) {
  const img = new Image();
  img.onload = () => {
    const width = window.currentCols || 0;
    const height = window.currentRows || 0;

    if (width === 0 || height === 0) {
      alert("Please create a workspace first.");
      return;
    }

    // Draw image to offscreen canvas scaled to workspace size
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const colors = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) {
        colors.push("#ffffff");
      } else {
        colors.push(rgbToHex(r, g, b));
      }
    }

    if (window.setCellColors) {
      window.setCellColors(colors);
    }
  };

  img.onerror = () => {
    alert("Failed to load image.");
  };

  img.src = imageSrc;
}

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