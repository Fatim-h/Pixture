const root2 = ReactDOM.createRoot(document.getElementById("current_color"));

const input = document.getElementById("favcolor");
const color_show = document.getElementById("color_show");

root2.render(<span>Color Hex: {input.value}</span>);

input.addEventListener("change", (e) => {
  const currentColor = input.value;
  color_show.style.backgroundColor = input.value;
  root2.render(<span>Color Hex: {currentColor}</span>);
});

window.undo_stack = [];
window.redo_stack = [];
window.palatte_undo_stack = [];
window.palatte_redo_stack = [];

function handleUndo() {
  if (
    window.undo_stack.length > 0 &&
    window.setCellColors &&
    window.getCellColors &&
    window.setPaletteColors &&
    window.getPaletteColors
  ) {
    // restore palette
    const currentPalette = window.getPaletteColors();
    const lastPalette = window.palatte_undo_stack.pop();
    if (lastPalette) {
      window.palatte_redo_stack.push(currentPalette);
      window.setPaletteColors(lastPalette);
    }

    // restore canvas
    const currentCanvas = window.getCellColors();
    const lastCanvas = window.undo_stack.pop();
    window.redo_stack.push(currentCanvas);
    window.setCellColors(lastCanvas);
    updateLiveCanvas(lastCanvas);
  }
}

function handleRedo() {
  if (
    window.redo_stack.length > 0 &&
    window.setCellColors &&
    window.getCellColors &&
    window.setPaletteColors &&
    window.getPaletteColors
  ) {
    // restore palette
    const currentPalette = window.getPaletteColors();
    const redoPalette = window.palatte_redo_stack.pop();
    if (redoPalette) {
      window.palatte_undo_stack.push(currentPalette);
      window.setPaletteColors(redoPalette);
    }

    // restore canvas
    const currentCanvas = window.getCellColors();
    const redoCanvas = window.redo_stack.pop();
    window.undo_stack.push(currentCanvas);
    window.setCellColors(redoCanvas);
    updateLiveCanvas(redoCanvas);
  }
}

window.handleUndo = handleUndo;
window.handleRedo = handleRedo;

function WorkspaceInfo() {
  const [dimensions, setDimensions] = React.useState({
    width: window.currentCols || 0,
    height: window.currentRows || 0,
  });

  React.useEffect(() => {
    window.updateWorkspaceInfo = (newWidth, newHeight) => {
      setDimensions({ width: newWidth, height: newHeight });
    };
  }, []);

  return (
    <p>
      Width: {dimensions.width} <br />
      Height: {dimensions.height}
    </p>
  );
}

const root4 = ReactDOM.createRoot(document.getElementById("width_height"));
root4.render(<WorkspaceInfo />);
