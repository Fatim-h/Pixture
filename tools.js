import { currentRows, currentCols } from './file.js';

const { useState } = React;

const root2 = ReactDOM.createRoot(document.getElementById("current_color"));
const currentColor = "#cfe8fc";
root2.render(<span>Color Hex: {currentColor}</span>);
