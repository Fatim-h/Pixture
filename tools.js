const root2 = ReactDOM.createRoot(document.getElementById("current_color"));

const input = document.getElementById("favcolor");
const color_show = document.getElementById("color_show");

root2.render(<span>Color Hex: {input.value}</span>);

input.addEventListener("change", (e) => {
  const currentColor = input.value;
  color_show.style.backgroundColor = input.value;
  root2.render(<span>Color Hex: {currentColor}</span>); 
});
