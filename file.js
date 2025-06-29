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

const colors_used = [];
const color_used_count = [];

function updatePaletteDisplay() {
  const paletteDiv = document.getElementById("used_colors");
  const cells = paletteDiv.getElementsByClassName("color-cell");

  for (let i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = colors_used[i] || "#ffffff";
  }
}

function palateedit(prevcolorr, colorr, typ) {
  if (typ) {
    if (prevcolorr !== colorr) {
      for (let x in colors_used) {
        if (colors_used[x] === prevcolorr) {
          color_used_count[x] -= 1;
          if (color_used_count[x] === 0) {
            colors_used.splice(x, 1);
            color_used_count.splice(x, 1);
            updatePaletteDisplay(); // render used_color
          }
          break;
        }
      }

      for (let x in colors_used) {
        if (colors_used[x] === colorr) {
          color_used_count[x] += 1;
          return;
        }
      }

      colors_used.push(colorr);
      color_used_count.push(1);
      updatePaletteDisplay(); // render used_color
    }
  }
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
  }
  const cells = document.getElementById("used_colors").getElementsByClassName("color-cell");
  for(let i = 0; i < 28; i++){
    cells[i].style.backgroundColor = "#a2adb6";
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
