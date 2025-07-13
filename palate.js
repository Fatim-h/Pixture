const root2 = ReactDOM.createRoot(document.getElementById("current_color"));

const input = document.getElementById("favcolor");
const color_show = document.getElementById("color_show");

root2.render(<span>Color Hex: {input.value}</span>);

input.addEventListener("change", (e) => {
  const currentColor = input.value;
  color_show.style.backgroundColor = input.value;
  root2.render(<span>Color Hex: {currentColor}</span>);
});

function UsedColorPalette({ colors, onSelect }) {
  return (
    <div className="used_colors">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-cell"
          style={{
            background: `radial-gradient(circle, ${color} 50% ,transparent)`,
            borderRadius: "50%",
            padding: "2px",
            width: "100%",
            height: "3vh",
            aspectRatio: "1 / 1",
            cursor: "pointer",
            display: "flex",
            transition: "background 0.2s ease",
          }}
          onClick={() => onSelect(color)}
        ></div>
      ))}
    </div>
  );
}

function Palette() {
  const [colorsUsed, setColorsUsed] = React.useState([]);
  const [colorUsedCount, setColorUsedCount] = React.useState([]);
  

  const handleCellClick = (color) => {
    const favcolor = document.getElementById("favcolor");
    const color_show = document.getElementById("color_show");

    favcolor.value = color;
    color_show.style.backgroundColor = color;

    root2.render(<span>Color Hex: {color}</span>);

    favcolor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  React.useEffect(() => {
    window.setPaletteColors = (colorsArray) => { 
      const cleanColors = colorsArray.filter(Boolean);
      setColorsUsed(cleanColors);
      setColorUsedCount(cleanColors.map(() => 1));
    }; //expose for tools.js, file.js

    window.getPaletteColors = () => [...colorsUsed];
  }, [colorsUsed]); //expose for tools.js, file.js

  

  React.useEffect(() => {
    // exposing palateedit for file.js
    window.palateedit = (prevColor, newColor, shouldEdit) => {
      if (!shouldEdit || prevColor === newColor) return;

      setColorsUsed((prevColorsUsed) => {
        const updatedColors = [...prevColorsUsed];
        const updatedCounts = [...colorUsedCount];

        const prevIdx = updatedColors.indexOf(prevColor);
        if (prevIdx !== -1) {
          updatedCounts[prevIdx]--;
          if (updatedCounts[prevIdx] === 0) {
            updatedColors.splice(prevIdx, 1);
            updatedCounts.splice(prevIdx, 1);
          }
        }

        const newIdx = updatedColors.indexOf(newColor);
        if (newIdx !== -1) {
          updatedCounts[newIdx]++;
        } else {
          updatedColors.push(newColor);
          updatedCounts.push(1);
        }

        setColorUsedCount(updatedCounts);
        return updatedColors;
      });
    };
  }, [colorUsedCount]);

  React.useEffect(() => {
    window.resetPalette = () => {
      setColorsUsed([]);
      setColorUsedCount([]);

      if (window.currentCols && window.currentRows) {
        setCellColors(Array(window.currentCols * window.currentRows).fill("#ffffff"));
      }
      undo_stack = [];
      redo_stack = [];
    };
  }, []);

  return <UsedColorPalette colors={colorsUsed} onSelect={handleCellClick} />;
}

window.undo_stack_palatte = [];
window.redo_stack_palatte = [];
window.palatte_undo_stack_palatte = [];
window.palatte_redo_stack_palatte = [];

function handlePalatteUndo() {
  if (
    window.undo_stack.length > 0 &&
    window.setCellColors &&
    window.getCellColors &&
    window.setPaletteColors &&
    window.getPaletteColors
  ) {
    // restore palette
    const currentPalette = window.getPaletteColors();
    const lastPalette = window.palatte_undo_stack_palatte.pop();
    if (lastPalette) {
      window.palatte_redo_stack_palatte.push(currentPalette);
      window.setPaletteColors(lastPalette);
    }

    // restore canvas
    const currentCanvas = window.getCellColors();
    const lastCanvas = window.undo_stack_palatte.pop();
    window.redo_stack_palatte.push(currentCanvas);
    window.setCellColors(lastCanvas);
    updateLiveCanvas(lastCanvas);
  }
}

function handlePalatteRedo() {
  if (
    window.redo_stack.length > 0 &&
    window.setCellColors &&
    window.getCellColors &&
    window.setPaletteColors &&
    window.getPaletteColors
  ) {
    // restore palette
    const currentPalette = window.getPaletteColors();
    const redoPalette = window.palatte_redo_stack_palatte.pop();
    if (redoPalette) {
      window.palatte_undo_stack_palatte.push(currentPalette);
      window.setPaletteColors(redoPalette);
    }

    // restore canvas
    const currentCanvas = window.getCellColors();
    const redoCanvas = window.redo_stack_palatte.pop();
    window.undo_stack_palatte.push(currentCanvas);
    window.setCellColors(redoCanvas);
    updateLiveCanvas(redoCanvas);
  }
}

// Mount component
const root3 = ReactDOM.createRoot(document.getElementById("used_colors_palatte"));
root3.render(<Palette />);
