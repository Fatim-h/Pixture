const { useState, useEffect } = React;

function Grid({ rows, cols, cellColors, onCellClick }) {
  const total = rows * cols;

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    width: "100%",
    height: "100%",
    gap: "2px",
  };

  return (
    <div style={gridStyle}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: cellColors[i],
            width: "100%",
            aspectRatio: "1 / 1",
            border: "1px solid #aaa",
            cursor: "pointer",
          }}
          onClick={() => onCellClick(i)}
        />
      ))}
    </div>
  );
}

function App({ rows, cols }) {
  const total = rows * cols;
  const [cellColors, setCellColors] = useState(Array(total).fill("#ffffff"));
  useEffect(() => {
  window.setCellColors = setCellColors; // expose setter for tools.js
  window.getCellColors = () => [...cellColors]; // expose getter for tools.js
  }, [cellColors]);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

    useEffect(() => {
    const colorInput = document.getElementById("favcolor");
    const handleColorChange = (e) => {
      setSelectedColor(e.target.value);
    };
    colorInput.addEventListener("input", handleColorChange);

    return () => {
      colorInput.removeEventListener("input", handleColorChange);
    };
  }, []);

  useEffect(() => {
    setCellColors(Array(total).fill("#ffffff"));
  }, [rows, cols]);


  useEffect(() => {
  if (cols > 0 && rows > 0) {
    updateLiveCanvas(cellColors, cols, rows);
  }
}, [cellColors, cols, rows]);

if (rows === 0 || cols === 0) {
    return <div>Create a new workspace.</div>;
  }

  const handleCellClick = (index) => {
  const newColors = [...cellColors];
  const prevColor = newColors[index];
  const newColor = selectedColor;
  redo_stack = [];
  palatte_redo_stack = [];

  // only if the color is changing
  if (prevColor !== newColor) {
    newColors[index] = newColor;
    setCellColors(newColors);
    undo_stack.push([...cellColors]);
    palatte_undo_stack.push(window.getPaletteColors()); 
    palateedit(prevColor, newColor, true);  // update palate
  }
};

  return (
    <Grid
      rows={rows}
      cols={cols}
      cellColors={cellColors}
      onCellClick={handleCellClick}
    />
  );
}

// initial render
const root = ReactDOM.createRoot(document.getElementById("workspace"));
let currentRows = 0;
let currentCols = 0;
root.render(<App rows={currentRows} cols={currentCols} />);

// dialog logic
const dialog = document.getElementById("inputDialog");
const openBtn = document.getElementById("openDialogBtn");
const closeBtn = document.getElementById("closeBtn");

openBtn.addEventListener("click", () => {
  dialog.showModal();
});

document.getElementById("confirmBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const width = parseInt(document.getElementById("workspace_width").value, 10);
  const height = parseInt(document.getElementById("workspace_height").value, 10);

  if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
    currentCols = width;
    currentRows = height;
    window.currentCols = currentCols;
    window.currentRows = currentRows;

    root.render(<App rows={currentRows} cols={currentCols} />);
    if (window.resetPalette) window.resetPalette();
  }

  if (window.updateWorkspaceInfo) {
    window.updateWorkspaceInfo(currentCols, currentRows);
  }

  dialog.close();
});

closeBtn.addEventListener("click", (e) => {
  dialog.close();
});

function click_option(option) {
    const sections = {
      1: document.getElementById("basic_tools"),
      2: document.getElementById("palatte_tools"),
      3: document.getElementById("canvas_tools"),
    };
    Object.values(sections).forEach((section) => {
      if (section) section.style.display = "none";
    });
    if (sections[option]) {
      sections[option].style.display = "block";
    }
}

function updateLiveCanvas(cellColors, cols = currentCols, rows = currentRows, scale = 2) {
  const canvas = document.getElementById("liveCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = cols * scale;
  canvas.height = rows * scale;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      ctx.fillStyle = cellColors[i] || "#ffffff";
      ctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }
}

window.updateLiveCanvas = updateLiveCanvas;
