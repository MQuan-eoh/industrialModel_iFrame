function waterPump(level) {
  const water = document.getElementById("water");
  const levelWater = document.getElementById("level-text");
  const heightPercentage = level + "%";
  water.style.height = heightPercentage;
  levelWater.textContent = level * 150 + "L";
}

setInterval(() => {
  const randomLevel = Math.floor(Math.random() * 101);
  waterPump(randomLevel);
}, 1000);

let symbols = [];
function saveSymbolPosition(element, id) {
  const existingSymbolIndex = symbols.findIndex((s) => s.id === id);
  const position = {
    id: id,
    left: element.style.left || element.offsetLeft + "px",
    top: element.style.top || element.offsetTop + "px",
  };
  if (existingSymbolIndex !== -1) {
    symbols[existingSymbolIndex] = position;
  } else {
    symbols.push(position);
  }
  saveSymbols();
}
function saveSymbols() {
  localStorage.setItem("symbolItems", JSON.stringify(symbols));
  console.log("Save symbols: ", symbols);
}
function loadSymbols() {
  const savedSymbols = localStorage.getItem("symbolItems");
  if (savedSymbols) {
    symbols = JSON.parse(savedSymbols);
    console.log("Loaded symbols:", symbols);
    symbols.forEach((symbol) => {
      if (symbol.id === "pump") {
        const pumpImage = document.querySelector(".imgPump");
        pumpImage.style.left = symbol.left;
        pumpImage.style.top = symbol.top;
      } else if (symbol.id === "analog") {
        const analogImage = document.querySelector(".imgAnalog");
        analogImage.style.left = symbol.left;
        analogImage.style.top = symbol.top;
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const pumpImage = document.querySelector(".imgPump");
  const analogImage = document.querySelector(".imgAnalog");
  const pumpPath = [
    "assets/img/Coolpump.png",
    "assets/img/Coolpump_active.png",
  ];
  const loggerPath = [
    "assets/img/Analoggauge.png",
    "assets/img/Analoggauge_Active.png",
  ];
  let currentPumpIndex = 0;
  let currentAnalogIndex = 0;

  pumpImage.addEventListener("click", function () {
    currentPumpIndex = (currentPumpIndex + 1) % pumpPath.length;
    pumpImage.src = pumpPath[currentPumpIndex];

    currentAnalogIndex = (currentAnalogIndex + 1) % loggerPath.length;
    analogImage.src = loggerPath[currentAnalogIndex];
  });

  //===============Function: Drag and Drop =============
  function makeDraggable(element, symbolId) {
    let isDragging = false;
    let initialX;
    let initialY;
    let currentX;
    let currentY;

    element.addEventListener("mousedown", dragStart);

    function dragStart(e) {
      e.preventDefault();
      initialX = e.clientX;
      initialY = e.clientY;
      currentX = element.offsetLeft;
      currentY = element.offsetTop;
      isDragging = true;
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", dragEnd);
    }

    function drag(e) {
      if (isDragging) {
        let dx = e.clientX - initialX;
        let dy = e.clientY - initialY;
        element.style.left = currentX + dx + "px";
        element.style.top = currentY + dy + "px";
      }
    }

    function dragEnd() {
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", dragEnd);

      // Lưu vị trí sau khi kéo thả
      saveSymbolPosition(element, symbolId);
    }
  }
  // Gọi makeDraggable với ID tương ứng cho mỗi symbol
  makeDraggable(pumpImage, "pump");
  makeDraggable(analogImage, "analog");

  // Tải vị trí symbol khi trang được tải
  loadSymbols();
});

//==========Draw Line Feature==============
document.addEventListener("DOMContentLoaded", function () {
  const modelContainer = document.querySelector(".model-container");
  const linesContainer = document.querySelector(".lines-container");
  const drawLineBtn = document.getElementById("drawLineBtn");
  const saveLinesBtn = document.getElementById("saveLinesBtn");
  const pumpImage = document.querySelector(".imgPump");

  let isDrawing = false;
  let isSelectMode = false;
  let startX, startY;
  let lines = [];
  let currentLine = null;
  let isCtrlPressed = false;
  let selectedLines = [];
  const dropdownMenu = document.querySelector(".dropdown-menu");

  const selectLineBtn = document.getElementById("selectLineBtn");
  dropdownMenu.appendChild(selectLineBtn);

  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
  dropdownMenu.appendChild(deleteSelectedBtn);

  // Load saved lines from localStorage
  function loadLines() {
    const savedLines = localStorage.getItem("dashboardLines");
    if (savedLines) {
      lines = JSON.parse(savedLines);
      renderLines();
    }
  }
  // Render all lines from the lines array
  function renderLines() {
    linesContainer.innerHTML = "";
    lines.forEach((line, index) => {
      const lineElement = document.createElement("div");
      lineElement.className = "drawn-line";
      lineElement.dataset.index = index;

      // Add selected class if the line is selected
      if (selectedLines.includes(index)) {
        lineElement.classList.add("selected");
      }

      // Calculate line properties
      const length = Math.sqrt(
        Math.pow(line.endX - line.startX, 2) +
          Math.pow(line.endY - line.startY, 2)
      );
      const angle =
        (Math.atan2(line.endY - line.startY, line.endX - line.startX) * 180) /
        Math.PI;

      // Set line style
      lineElement.style.width = `${length}px`;
      lineElement.style.left = `${line.startX}px`;
      lineElement.style.top = `${line.startY}px`;
      lineElement.style.transform = `rotate(${angle}deg)`;
      lineElement.style.transformOrigin = "0 0";

      // Make lines selectable when in select mode
      if (isSelectMode) {
        lineElement.style.pointerEvents = "auto";
        lineElement.addEventListener("click", function (e) {
          e.stopPropagation();
          const lineIndex = parseInt(this.dataset.index);

          // Toggle selection
          if (selectedLines.includes(lineIndex)) {
            selectedLines = selectedLines.filter((i) => i !== lineIndex);
          } else {
            selectedLines.push(lineIndex);
          }

          renderLines();
        });
      }

      linesContainer.appendChild(lineElement);
    });
  }

  // Save lines to localStorage
  function saveLines() {
    localStorage.setItem("dashboardLines", JSON.stringify(lines));
    // alert("Lines saved successfully!");
  }

  // Delete selected lines
  function deleteSelected() {
    if (selectedLines.length === 0) {
      alert("No lines selected. Please select lines to delete.");
      return;
    }

    // Sort indices in descending order to avoid shifting issues when removing
    selectedLines.sort((a, b) => b - a);

    // Remove selected lines
    selectedLines.forEach((index) => {
      lines.splice(index, 1);
    });

    // Clear selection and re-render
    selectedLines = [];
    renderLines();

    // Automatically save after deletion
    saveLines();
  }

  // Activate drawing mode
  drawLineBtn.addEventListener("click", function () {
    isDrawing = true;
    isSelectMode = false;
    drawLineBtn.classList.add("active");
    selectLineBtn.classList.remove("active");
    modelContainer.style.cursor = "crosshair";
    renderLines();
  });

  // Activate select mode
  selectLineBtn.addEventListener("click", function () {
    isSelectMode = true;
    isDrawing = false;
    selectLineBtn.classList.add("active");
    drawLineBtn.classList.remove("active");
    modelContainer.style.cursor = "pointer";
    renderLines();
  });

  // Delete selected lines
  deleteSelectedBtn.addEventListener("click", deleteSelected);

  // Save lines to localStorage
  saveLinesBtn.addEventListener("click", saveLines);

  // Track Ctrl key press
  document.addEventListener("keydown", function (e) {
    if (e.key === "Control") {
      isCtrlPressed = true;
    }
    // Add delete key support
    if (e.key === "Delete" && selectedLines.length > 0) {
      deleteSelected();
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.key === "Control") {
      isCtrlPressed = false;
    }
  });

  // Handle mouse events for drawing
  modelContainer.addEventListener("mousedown", function (e) {
    if (!isDrawing || isSelectMode) return;

    const rect = modelContainer.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    // Create a temporary line element
    currentLine = document.createElement("div");
    currentLine.className = "drawn-line";
    currentLine.style.left = `${startX}px`;
    currentLine.style.top = `${startY}px`;
    linesContainer.appendChild(currentLine);
  });

  modelContainer.addEventListener("mousemove", function (e) {
    if (!isDrawing || !currentLine || isSelectMode) return;

    const rect = modelContainer.getBoundingClientRect();
    let currentX = e.clientX - rect.left;
    let currentY = e.clientY - rect.top;

    // If Ctrl is pressed, make the line straight (horizontal or vertical)
    if (isCtrlPressed) {
      const dx = Math.abs(currentX - startX);
      const dy = Math.abs(currentY - startY);

      if (dx > dy) {
        // Make horizontal line
        currentY = startY;
      } else {
        // Make vertical line
        currentX = startX;
      }
    }

    // Calculate line properties
    const length = Math.sqrt(
      Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
    );
    const angle =
      (Math.atan2(currentY - startY, currentX - startX) * 180) / Math.PI;

    // Update line style
    currentLine.style.width = `${length}px`;
    currentLine.style.transform = `rotate(${angle}deg)`;
    currentLine.style.transformOrigin = "0 0";
  });

  modelContainer.addEventListener("mouseup", function (e) {
    if (!isDrawing || !currentLine || isSelectMode) return;

    const rect = modelContainer.getBoundingClientRect();
    let endX = e.clientX - rect.left;
    let endY = e.clientY - rect.top;

    // If Ctrl is pressed, make the line straight (horizontal or vertical)
    if (isCtrlPressed) {
      const dx = Math.abs(endX - startX);
      const dy = Math.abs(endY - startY);

      if (dx > dy) {
        // Make horizontal line
        endY = startY;
      } else {
        // Make vertical line
        endX = startX;
      }
    }

    // Save the line data
    lines.push({
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
    });

    // Re-render all lines
    renderLines();

    currentLine = null;
  });

  // Clear selection when clicking on the container (but not on a line)
  modelContainer.addEventListener("click", function (e) {
    if (
      (isSelectMode && e.target === modelContainer) ||
      e.target === linesContainer
    ) {
      selectedLines = [];
      renderLines();
    }
  });

  // Add water flow effect when pump is clicked
  pumpImage.addEventListener("click", function () {
    // Add flowing water effect to all lines
    const drawnLines = document.querySelectorAll(".drawn-line");
    drawnLines.forEach((line) => {
      line.classList.add("flowing");

      // Remove the effect after animation completes
      setTimeout(() => {
        line.classList.remove("flowing");
      }, 2000);
    });
  });

  // Load saved lines on page load
  loadLines();
});
