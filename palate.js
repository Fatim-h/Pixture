function UsedColorPalette({ colors, onSelect }) {
  return (
    <div className="used_colors">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-cell"
          style={{
            border: "2px #587c8c46",
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

    favcolor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  React.useEffect(() => {
    // globally accessible palateedit function for file.js
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

  useEffect(() => {
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

const root3 = ReactDOM.createRoot(document.getElementById("used_colors"));
root3.render(<Palette />);
