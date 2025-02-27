const pumpImage = document.querySelector(".imgPump");
const analogImage = document.querySelector(".imgAnalog");
const pumpPath = ["assets/img/Coolpump.png", "assets/img/Coolpump_active.png"];
const loggerPath = [
  "assets/img/Analoggauge.png",
  "assets/img/Analoggauge_Active.png",
];
const waterContainer = document.querySelector(".tank");
const waterContainer2 = document.querySelector(".tank-2");
let currentPumpIndex = 0;
let currentAnalogIndex = 0;

function waterPump(level) {
  const water = document.getElementById("water");
  const levelWater = document.getElementById("level-text");
  const heightPercentage = level + "%";
  water.style.height = heightPercentage;
  levelWater.textContent = level * 150 + "L";
}
function waterPump2(level) {
  const water = document.getElementById("water2");
  const heightPercentage = level + "%";
  water.style.height = heightPercentage;
}
setInterval(() => {
  const randomLevel = Math.floor(Math.random() * 101);
  waterPump(randomLevel);

  const randomLevel2 = Math.floor(Math.random() * 50);
  waterPump2(randomLevel2);
}, 3000);

let symbols = [];
let tankWaters = [];
let tankWaters2 = [];
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
function saveWaterTankPosition(element, id) {
  const existingTankIndex = tankWaters.findIndex((s) => s.id === id);
  const positionTank = {
    id: id,
    left: element.style.left || element.offsetLeft + "px",
    top: element.style.top || element.offsetTop + "px",
  };
  console.log("Value of position Tank: ", positionTank);
  if (existingTankIndex !== -1) {
    tankWaters[existingTankIndex] = positionTank;
  } else {
    tankWaters.push(positionTank);
  }
  saveTank();
}
function saveWaterTankPosition2(element, id) {
  const existingTankIndex2 = tankWaters2.findIndex((s) => s.id === id);
  const positionTank2 = {
    id: id,
    left: element.style.left || element.offsetLeft + "px",
    top: element.style.top || element.offsetTop + "px",
  };
  console.log("Value of position Tank2: ", positionTank2);
  if (existingTankIndex2 !== -1) {
    tankWaters2[existingTankIndex2] = positionTank2;
  } else {
    tankWaters2.push(positionTank2);
  }
  saveTank2();
}
function saveTank() {
  localStorage.setItem("tankItems", JSON.stringify(tankWaters));
  console.log("Save Tank Water : ", tankWaters);
}
function saveTank2() {
  localStorage.setItem("tankItems2", JSON.stringify(tankWaters2));
  console.log("Save Tank Water2 : ", tankWaters2);
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
        pumpImage.style.left = symbol.left;
        pumpImage.style.top = symbol.top;
      } else if (symbol.id === "analog") {
        analogImage.style.left = symbol.left;
        analogImage.style.top = symbol.top;
      }
    });
  }
}
function loadTankWater() {
  const savedTank = localStorage.getItem("tankItems");
  if (savedTank) {
    tankWaters = JSON.parse(savedTank);
    console.log("Load Tank Water: ", tankWaters);
    tankWaters.forEach((tankWater) => {
      if (tankWater.id === "water") {
        waterContainer.style.left = tankWater.left;
        waterContainer.style.top = tankWater.top;
      }
    });
  }
}
function loadTankWater2() {
  const savedTank2 = localStorage.getItem("tankItems2");
  if (savedTank2) {
    tankWaters2 = JSON.parse(savedTank2);
    console.log("Load Tank Water2: ", tankWaters2);
    tankWaters2.forEach((tankWater2) => {
      if (tankWater2.id === "water2") {
        waterContainer2.style.left = tankWater2.left;
        waterContainer2.style.top = tankWater2.top;
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
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
  function makeDraggableTank(element, tankWaterId) {
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
      saveWaterTankPosition(element, tankWaterId);
    }
  }
  function makeDraggableTank2(element, tankWaterId2) {
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
      saveWaterTankPosition2(element, tankWaterId2);
    }
  }
  // Gọi makeDraggable với ID tương ứng cho mỗi symbol
  makeDraggable(pumpImage, "pump");
  makeDraggable(analogImage, "analog");
  makeDraggableTank(waterContainer, "water");
  makeDraggableTank2(waterContainer2, "water2");
  // Tải vị trí symbol khi trang được tải
  loadSymbols();
  loadTankWater();
  loadTankWater2();
});

//==========Draw Line Feature==============
document.addEventListener("DOMContentLoaded", function () {
  const modelContainer = document.querySelector(".model-container");
  const linesContainer = document.querySelector(".lines-container");
  const drawLineBtn = document.getElementById("drawLineBtn");
  const saveLinesBtn = document.getElementById("saveLinesBtn");

  let isDrawing = false;
  let isSelectMode = false;
  let startX, startY;
  let lines = [];
  let currentLine = null;
  let isCtrlPressed = false;
  let selectedLines = [];

  const dropdownMenu = document.querySelector(".dropdown-menu");
  const clearAllButton = document.getElementById("clearAllLines");
  clearAllButton.addEventListener("click", function () {
    console.log("Access to clear all button");
    lines = [];
    selectedLines = [];
    linesContainer.innerHTML = "";
    saveLines(); //save the empty sate to localStorage
    alert("Clear all lines successful");
  });
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
//=============Chart Container===========
document.addEventListener("DOMContentLoaded", function () {
  const dataLine = document.getElementById("data-line");
  const dataArea = document.getElementById("data-area");
  const dataValue = document.getElementById("data-value");
  const chartWidth = document.querySelector(".chart-body").offsetWidth;
  const chartHeight = document.querySelector(".chart-body").offsetHeight;

  // Generate random data points
  const generateData = (points = 20) => {
    const data = [];
    for (let i = 0; i < points; i++) {
      // More realistic data with trends
      const baseValue = 70 + Math.sin(i / 3) * 20;
      const randomVariation = Math.random() * 10 - 5;
      const value = Math.max(10, Math.min(95, baseValue + randomVariation));
      data.push({
        x: i / (points - 1),
        y: value / 100,
      });
    }
    return data;
  };

  const renderChart = (data) => {
    // Clear previous chart
    dataLine.innerHTML = "";

    // Create data points and connections
    data.forEach((point, index) => {
      const x = point.x * chartWidth;
      const y = (1 - point.y) * chartHeight;

      // Create the data point
      const dataPoint = document.createElement("div");
      dataPoint.className = "data-point";
      dataPoint.style.left = `${x}px`;
      dataPoint.style.top = `${y}px`;
      dataLine.appendChild(dataPoint);

      // Create pulse effect for some points
      if (index % 5 === 0) {
        const dataPulse = document.createElement("div");
        dataPulse.className = "data-pulse";
        dataPulse.style.left = `${x}px`;
        dataPulse.style.top = `${y}px`;
        dataLine.appendChild(dataPulse);
      }

      // Connect to the next point
      if (index < data.length - 1) {
        const nextPoint = data[index + 1];
        const nextX = nextPoint.x * chartWidth;
        const nextY = (1 - nextPoint.y) * chartHeight;

        const length = Math.sqrt(
          Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
        );
        const angle = (Math.atan2(nextY - y, nextX - x) * 180) / Math.PI;

        const dataPath = document.createElement("div");
        dataPath.className = "data-path";
        dataPath.style.width = `${length}px`;
        dataPath.style.left = `${x}px`;
        dataPath.style.top = `${y}px`;
        dataPath.style.transform = `rotate(${angle}deg)`;
        dataLine.appendChild(dataPath);
      }
    });

    // Create the area under the curve
    const areaPoints = data
      .map((point, index) => {
        const x = point.x * chartWidth;
        const y = (1 - point.y) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");

    const fullPath = `0,${chartHeight} ${areaPoints} ${chartWidth},${chartHeight}`;

    dataArea.style.clipPath = `polygon(${fullPath})`;

    // Update the data value display
    const lastValue = data[data.length - 1].y * 100;
    dataValue.textContent = `${lastValue.toFixed(1)}%`;
  };

  // Initial render
  let chartData = generateData();
  renderChart(chartData);

  // Update chart periodically
  setInterval(() => {
    chartData = generateData();
    renderChart(chartData);
  }, 1000);

  // Button event listeners
  document.getElementById("daily-btn").addEventListener("click", function () {
    this.style.backgroundColor = "rgba(0, 100, 150, 0.5)";
    document.getElementById("weekly-btn").style.backgroundColor =
      "rgba(0, 100, 150, 0.3)";
    chartData = generateData(20);
    renderChart(chartData);
  });

  document.getElementById("weekly-btn").addEventListener("click", function () {
    this.style.backgroundColor = "rgba(0, 100, 150, 0.5)";
    document.getElementById("daily-btn").style.backgroundColor =
      "rgba(0, 100, 150, 0.3)";
    chartData = generateData(30);
    renderChart(chartData);
  });

  // Connect to existing components
  const pumpImage = document.querySelector(".imgPump");
  if (pumpImage) {
    pumpImage.addEventListener("click", function () {
      // Highlight the chart when pump is clicked
      const chartContainer = document.querySelector(".chart-container");
      chartContainer.style.boxShadow = "0 0 30px rgba(0, 180, 255, 0.6)";
      setTimeout(() => {
        chartContainer.style.boxShadow = "0 0 20px rgba(0, 180, 255, 0.3)";
      }, 2000);

      // Update chart data
      chartData = generateData();
      renderChart(chartData);
    });
  }
});
