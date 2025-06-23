const root2 = ReactDOM.createRoot(document.getElementById("current_color"));

const input = document.getElementById("favcolor");
const color_show = document.getElementById("color_show");

root2.render(<span>Color Hex: {input.value}</span>);

input.addEventListener("change", (e) => {
  const currentColor = input.value;
  color_show.style.backgroundColor = input.value;
  root2.render(<span>Color Hex: {currentColor}</span>); 
});

//set global stacks
window.undo_stack = [];
window.redo_stack = [];

function handleUndo() {
  if (window.undo_stack.length > 0 && window.setCellColors) {
    const currentState = window.getCellColors();
    const lastState = window.undo_stack.pop();
    window.redo_stack.push(currentState);
    window.setCellColors(lastState);
  }
}

function handleRedo() {
  if (window.redo_stack.length > 0 && window.setCellColors) {
    const currentState = window.getCellColors();
    const state = window.redo_stack.pop();
    window.undo_stack.push(currentState);
    window.setCellColors(state);
  }
}

//set global functions
window.handleUndo = handleUndo;
window.handleRedo = handleRedo;
