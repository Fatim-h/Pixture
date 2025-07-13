(() => {
  let _backgroundclr = "#ffffff";

  Object.defineProperty(window, "backgroundclr", {
    get() {
      return _backgroundclr;
    },
    set(value) {
      _backgroundclr = value;

      const bgTextElement = document.querySelector("#current_bg p");
      if (bgTextElement) {
        bgTextElement.textContent = `Background Color : ${value}`;
      }
    }
  });

  window.backgroundclr = _backgroundclr; //expose for palattethem.js
})();
;

const input1 = document.getElementById("backcolor");
input1.addEventListener("change", (e) => {
    const currentColors = window.getCellColors();
    let updatedColors;

    if (!currentColors) {
      console.warn("Grid not available");
      return;
    }
    updatedColors = currentColors.map(color =>
      color.toLowerCase() === window.backgroundclr.toLowerCase() ? input1.value : color
    );
    window.setCellColors(updatedColors);
    window.updateLiveCanvas(updatedColors);
    window.backgroundclr = input1.value;
});

function removebgclr() {
  const currentColors = window.getCellColors();
  const updatedColors = currentColors.map(color =>
    color.toLowerCase() === window.backgroundclr.toLowerCase() ? "transparent" : color
  );

  window.backgroundclr = "transparent";

  window.setCellColors(updatedColors);
  window.undo_stack.push(updatedColors);
  window.updateLiveCanvas(updatedColors);
}
