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
  const [cellColors, setCellColors] = useState(Array(total).fill("#cfe8fc"));
  const [selectedColor, setSelectedColor] = useState("#cfe8fc");

  const handleCellClick = (index) => {
    const newColors = [...cellColors];
    newColors[index] = selectedColor;
    setCellColors(newColors);
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
    setCellColors(Array(total).fill("#cfe8fc"));
  }, [rows, cols]);

  if (rows === 0 || cols === 0) {
    return <div>Please enter dimensions to generate grid.</div>;
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

// Initial render with empty grid
const root = ReactDOM.createRoot(document.getElementById("workspace"));
let currentRows = 0;
let currentCols = 0;
root.render(<App rows={currentRows} cols={currentCols} />);

// Handle dialog logic
const dialog = document.getElementById("inputDialog");
const openBtn = document.getElementById("openDialogBtn");

openBtn.addEventListener("click", () => {
  dialog.showModal();
});

document.getElementById("confirmBtn").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission
  const width = parseInt(document.getElementById("workspace_width").value, 10);
  const height = parseInt(document.getElementById("workspace_height").value, 10);

  if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
    currentCols = width;
    currentRows = height;
    root.render(<App rows={currentRows} cols={currentCols} />);
  }

  dialog.close();
});
