function UsedColorPalette({ colors, onSelect }) {
  return (
    <div className="used_colors">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-cell"
          style={{
            backgroundColor: color,
            border: "1px solid #aaa",
            width: "100%",
            height: "3vh",
            aspectRatio: "4 / 3",
            cursor: "pointer",
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
    // define globally accessible palateedit function
    window.palateedit = (prevColor, newColor, shouldEdit) => {
      if (!shouldEdit || prevColor === newColor) return;

      setColorsUsed((prevColorsUsed) => {
        const updatedColors = [...prevColorsUsed];
        const updatedCounts = [...colorUsedCount];

        // Decrement count or remove prevColor
        const prevIdx = updatedColors.indexOf(prevColor);
        if (prevIdx !== -1) {
          updatedCounts[prevIdx]--;
          if (updatedCounts[prevIdx] === 0) {
            updatedColors.splice(prevIdx, 1);
            updatedCounts.splice(prevIdx, 1);
          }
        }

        // Increment or add newColor
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
      setCellColors(Array(28).fill("#a2adb6"));
    };
  }, []);

  return <UsedColorPalette colors={colorsUsed} onSelect={handleCellClick} />;
}

// Mount component
const root3 = ReactDOM.createRoot(document.getElementById("used_colors"));
root3.render(<Palette />);