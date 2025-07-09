backgroundclr = "#ffffff";

function removebgclr() {
  if (typeof backgroundclr === "undefined") {
    console.warn("backgroundclr is not defined.");
    return;
  }

  const currentColors = window.getCellColors(); // this is the array from state
  const updatedColors = currentColors.map(color =>
    color.toLowerCase() === backgroundclr.toLowerCase() ? "transparent" : color
  );

  backgroundclr = "transparent";

  window.setCellColors(updatedColors);
  undo_stack.push(updatedColors);
  window.updateLiveCanvas(updatedColors);
}

window.backgroundclr = backgroundclr;
//const root = ReactDOM.createRoot(document.getElementById("current_bg"));
//root.render(<span>Current Background: {backgroundclr}</span>);