
const { useState } = React;

function Grid({ rows, cols }) {
  const total = rows * cols;
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    width: "100%",
    height: "100%",
    gap: "2px",
  };

  const cellStyle = {
    backgroundColor: "#cfe8fc",
    width: "100%",
    height: "100%",
  };

  return (
    <div style={gridStyle}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={cellStyle}>
        </div>
      ))}
    </div>
  );
}

function App({ rows, cols }) {
  if (rows === 0 || cols === 0) {
    return <div>Please enter dimensions to generate grid.</div>;
  }
  return <Grid rows={rows} cols={cols} />;
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

