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

  const handleCellClick = (index) => {
  const newColors = [...cellColors];
  const prevColor = newColors[index];
  const newColor = selectedColor;
  redo_stack = [];

  // only do this if the color is changing
  if (prevColor !== newColor) {
    newColors[index] = newColor;
    setCellColors(newColors);
    undo_stack.push([...cellColors]);
    palateedit(prevColor, newColor, true);  // update palate
  }
};

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
    // Reset colors when dimensions change
    setCellColors(Array(total).fill("#ffffff"));
  }, [rows, cols]);

  if (rows === 0 || cols === 0) {
    return <div>Create a new workspace.</div>;
  }

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
