// Save as JSON(put in the save.js file in a function)
/*
Current idea: include more file saving choices, as input "choices"
then depending on the choice the file gets saved appropriatly(parent function lets you coose the appropriate function)
PNG --- DONE
JSON --- USE THIS
JPG --- EASY ADDITION
 */


const hexArray = window.getCellColors();
const width = window.currentCols;
const height = window.currentRows;

const json = JSON.stringify({ width, height, pixels: hexArray });
const blob = new Blob([json], { type: "application/json" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = filename.endsWith(".json") ? filename : `${filename}.json`;
link.click();


//<--  -->

//Upload as JSON(put in upload.js file)
/*
Current idea: include more file uploading choices, as input "choices"
then depending on the choice the file gets uploaded appropriatly(parent function lets you coose the appropriate function)
PNG --- DONE with base, need work on scaling
JSON --- USE THIS
JPG --- Gotta see
 */


// Handle JSON file upload
const reader = new FileReader();
reader.onload = function (event) {
  try {
    const loaded = JSON.parse(event.target.result);

    if (
      typeof loaded.width !== "number" ||
      typeof loaded.height !== "number" ||
      !Array.isArray(loaded.pixels)
    ) {
      alert("Invalid JSON file.");
      return;
    }

    window.currentCols = loaded.width;
    window.currentRows = loaded.height;

    const root = ReactDOM.createRoot(document.getElementById("workspace"));
    root.render(<App rows={loaded.height} cols={loaded.width} />);
    
    setTimeout(() => {
      if (window.setCellColors) {
        window.setCellColors(loaded.pixels);
      }
    }, 50);
    uploadDialog.close();
  } catch (err) {
    alert("Failed to parse JSON.");
    console.error(err);
  }
};
reader.readAsText(file);
