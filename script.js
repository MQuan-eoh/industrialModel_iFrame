const waterContainer = document.querySelector(".tank");
const waterContainer2 = document.querySelector(".tank-2");
let currentPumpIndex = 0;
let currentAnalogIndex = 0;
let globalDragMode = false;
function waterPump(level) {
  const water = document.getElementById("water");
  const levelWater = document.getElementById("level-text");
  const heightPercentage = level + "%";
  water.style.height = heightPercentage;
  levelWater.textContent = level + "L";
}
function waterPump2(level) {
  const water = document.getElementById("water2");
  const heightPercentage = level + "%";
  water.style.height = heightPercentage;
}

let symbols = [];
let tankWaters = [];
let tankWaters2 = [];

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
  //===============Function: Drag and Drop ============
  function makeDraggableTank(element, tankWaterId) {
    let isDragging = false;
    let initialX, initialY, currentX, currentY;

    element.addEventListener("mousedown", dragStart);

    function dragStart(e) {
      if (!globalDragMode) return;

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
    let initialX, initialY, currentX, currentY;

    element.addEventListener("mousedown", dragStart);

    function dragStart(e) {
      if (!globalDragMode) return;

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

      //Save position
      saveWaterTankPosition2(element, tankWaterId2);
    }
  }

  makeDraggableTank(waterContainer, "water");
  makeDraggableTank2(waterContainer2, "water2");
  loadTankWater();
  loadTankWater2();

  //==========Draw Line Feature==============

  const modelContainer = document.querySelector(".model-container");
  const linesContainer = document.querySelector(".lines-container");
  const drawLineBtn = document.getElementById("drawLineBtn");
  const saveLinesBtn = document.getElementById("saveLinesBtn");
  const changePositionBtn = document.getElementById("changePosition");

  let isDrawing = false;
  let isSelectMode = false;
  let startX, startY;
  let lines = [];
  let currentLine = null;
  let isCtrlPressed = false;
  let selectedLines = [];
  //========Clear All Lines=====
  const clearAllButton = document.getElementById("clearAllLines");
  clearAllButton.addEventListener("click", function () {
    console.log("Access to clear all button");
    lines = [];
    selectedLines = [];
    linesContainer.innerHTML = "";
    saveLines(); //save the empty sate to localStorage
  });

  const selectLineBtn = document.getElementById("selectLineBtn");

  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

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
  //========Management of drop down menu=========
  // Thêm sự kiện click cho dropdown menu để quản lý chế độ active
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const modeButtons = [
    "drawLineBtn",
    "selectLineBtn",
    "selectSymbols",
    "changePosition",
  ];
  const modeStates = {
    isDrawing: false,
    isSelectMode: false,
    isSymbolSelectMode: false,
    globalDragMode: false,
  };

  dropdownMenu.addEventListener("click", function (e) {
    const target = e.target;
    if (!target.classList.contains("dropdown-item")) return;

    // Reset tất cả các mode
    Object.keys(modeStates).forEach((key) => (modeStates[key] = false));
    modeButtons.forEach((id) =>
      document.getElementById(id).classList.remove("active")
    );

    // Kích hoạt mode được chọn
    if (modeButtons.includes(target.id)) {
      target.classList.add("active");
      switch (target.id) {
        case "drawLineBtn":
          modeStates.isDrawing = true;
          break;
        case "selectLineBtn":
          modeStates.isSelectMode = true;
          break;
        case "selectSymbols":
          modeStates.isSymbolSelectMode = true;
          break;
        case "changePosition":
          modeStates.globalDragMode = true;
          break;
      }
    }
  });
  // Save lines to localStorage
  function saveLines() {
    localStorage.setItem("dashboardLines", JSON.stringify(lines));
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

  drawLineBtn.addEventListener("click", function () {
    isDrawing = true;
    isSelectMode = false;
    modelContainer.style.cursor = "crosshair";
    renderLines();
  });

  selectLineBtn.addEventListener("click", function () {
    isSelectMode = true;
    isDrawing = false;
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
  // Load saved lines on page load
  loadLines();
  //==========Chart Container================
  const ctx = document.getElementById("techChart").getContext("2d");

  // Generate random data
  const generateData = (count) => {
    const data = [];
    let value = 50;

    for (let i = 0; i < count; i++) {
      // Add some randomness but keep within bounds
      value = Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 10));
      data.push(value);
    }

    return data;
  };

  // Generate timestamps for last 24 hours, one per hour
  const generateTimeLabels = () => {
    const labels = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);

      const hours = String(time.getHours()).padStart(2, "0");
      const minutes = String(time.getMinutes()).padStart(2, "0");
      const seconds = String(time.getSeconds()).padStart(2, "0");

      labels.push(`${hours}:${minutes}:${seconds}`);
    }

    return labels;
  };

  const data = {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: "System Performance",
        data: generateData(24),
        borderColor: "#4cc9f0",
        backgroundColor: "rgba(76, 201, 240, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#f72585",
        pointBorderColor: "#f72585",
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#a5a5a5",
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 12,
            callback: function (value, index, values) {
              const fullLabel = this.getLabelForValue(value);
              if (values.length > 12) {
                return fullLabel.substring(0, 5);
              }
              return fullLabel; // Hiển thị HH:MM:SS
            },
          },
        },
        y: {
          min: 0,
          max: 100,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#a5a5a5",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ddd",
          },
        },
        tooltip: {
          backgroundColor: "rgba(59, 159, 185, 0.7)",
          titleColor: "#fff",
          bodyColor: "#ddd",
          borderColor: "#4361ee",
          borderWidth: 1,
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
    },
  };

  const myChart = new Chart(ctx, config);

  setInterval(() => {
    data.datasets[0].data.shift();
    const lastValue = data.datasets[0].data[data.datasets[0].data.length - 1];
    const newValue = Math.max(
      0,
      Math.min(100, lastValue + (Math.random() - 0.5) * 15)
    );
    data.datasets[0].data.push(newValue);

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    data.labels.shift();
    data.labels.push(`${hours}:${minutes}:${seconds}`);

    myChart.update();
  }, 1000);

  //==========Add Symbol Feature=============
  //Declare path symbols
  let collectionSymbol = [];
  const availableSymbols = [
    { path: "assets/img/Coolpump.png", name: "Máy bơm" },
    { path: "assets/img/Analoggauge.png", name: "Van nước" },
    { path: "assets/img/closeCoupled.png", name: "Close Coupled" },
    { path: "assets/img/filter.png", name: "Máy sấy" },
    { path: "assets/img/waterTreatment.png", name: "Xử lý nước" },
    { path: "assets/img/recyclingSystem.png", name: "Xử lý chất thải" },
    { path: "assets/img/Oilskimmer.png", name: "Máy lọc dầu" },
    { path: "assets/img/polymersystem.png", name: "Trạm bơm" },
    { path: "assets/img/Horizontalpump7.png", name: "Bơm lớn" },
    { path: "assets/img/tankLargest.png", name: "Bể nước lớn" },
    { path: "assets/img/Modularoffice5.png", name: "Văn phòng" },
    { path: "assets/img/Factory1.png", name: "Nhà máy" },
  ];

  //function load symbols from localStorage
  function loadSymbolCollection() {
    const savedSymbols = localStorage.getItem("symbolCollection");
    if (savedSymbols) {
      collectionSymbol = JSON.parse(savedSymbols);
      renderAddedSymbols();
    }
  }

  //Function to save Symbols to localStorage
  function saveSymbolCollection() {
    localStorage.setItem("symbolCollection", JSON.stringify(collectionSymbol));
  }

  //function to render added Symbols on the model Container
  function renderAddedSymbols() {
    const existingAddedSymbols = document.querySelectorAll(".symbol-wrapper");
    existingAddedSymbols.forEach((symbol) => symbol.remove());

    collectionSymbol.forEach((symbol) => {
      // Create wrapper div
      const wrapper = document.createElement("div");
      wrapper.className = "symbol-wrapper";
      wrapper.style.left = symbol.left || "50px";
      wrapper.style.top = symbol.top || "50px";
      wrapper.style.position = "absolute";
      wrapper.dataset.id = symbol.id;

      // Check if this is a pump symbol and add appropriate class
      if (symbol.name === "Bơm lớn") {
        wrapper.classList.add("pump-symbol");
      }

      // Create image inside wrapper
      const img = document.createElement("img");
      img.src = symbol.path;
      img.alt = symbol.name;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.pointerEvents = "none"; // Prevent img from interfering with mouse events

      // Apply size
      if (symbol.width) {
        wrapper.style.width = symbol.width;
      } else {
        wrapper.style.width = "64px";
      }

      if (symbol.height) {
        wrapper.style.height = symbol.height;
      } else {
        wrapper.style.height = "64px";
      }

      wrapper.appendChild(img);
      document.querySelector(".model-container").appendChild(wrapper);

      // Add resize and drag functionality
      makeDraggableSymbol(wrapper, symbol.id);
      makeResizable(wrapper, symbol.id);
    });

    // After rendering all symbols, set up pump event listeners
    setupPumpEventListeners();
  }
  function setupPumpEventListeners() {
    const pumpSymbols = document.querySelectorAll(".pump-symbol");
    const drawnLines = document.querySelectorAll(".drawn-line");
    const lineMapping = {};
    pumpSymbols.forEach((pump, pumpIndex) => {
      const pumpRect = pump.getBoundingClientRect();
      // By default, consider lines to the right of the pump as downstream and to the left as upstream
      const upstreamLines = [];
      const downstreamLines = [];

      drawnLines.forEach((line, lineIndex) => {
        const lineRect = line.getBoundingClientRect();
        if (lineRect.left >= pumpRect.right) {
          downstreamLines.push(line);
        } else if (lineRect.right <= pumpRect.left) {
          upstreamLines.push(line);
        } else {
          if (lineRect.x < pumpRect.x) {
            upstreamLines.push(line);
          } else {
            downstreamLines.push(line);
          }
        }
      });

      lineMapping[pumpIndex] = {
        upstream: upstreamLines,
        downstream: downstreamLines,
      };
    });

    // Store pump states (we'll use dataset to track state)
    pumpSymbols.forEach((pump, index) => {
      pump.dataset.state = "off";
      pump.addEventListener("click", function () {
        const pumpIndex = index; // Use index to differentiate between pumps
        const currentState = this.dataset.state;

        if (currentState === "off") {
          // Turn pump ON
          console.log(`Turning pump ${pumpIndex + 1} ON`);
          if (pumpIndex === 0 && onPump1) {
            eraWidget.triggerAction(onPump1.action, null);
          } else if (pumpIndex === 1 && onPump2) {
            eraWidget.triggerAction(onPump2.action, null);
          }
          this.dataset.state = "on";
          this.classList.add("pump-active"); // Add visual indicator class

          // When the pump is ON, all lines (both upstream and downstream) are active
          if (lineMapping[pumpIndex]) {
            // Restore color for all lines (upstream and downstream)
            [
              ...lineMapping[pumpIndex].upstream,
              ...lineMapping[pumpIndex].downstream,
            ].forEach((line) => {
              line.style.background = ""; // Remove inline style to use default CSS
              updateLineAnimationColor(line, "rgba(255, 255, 255, 0.8)");
            });
          }
        } else {
          // Turn pump OFF
          console.log(`Turning pump ${pumpIndex + 1} OFF`);
          if (pumpIndex === 0 && offPump1) {
            eraWidget.triggerAction(offPump1.action, null);
          } else if (pumpIndex === 1 && offPump2) {
            eraWidget.triggerAction(offPump2.action, null);
          }
          this.dataset.state = "off";
          this.classList.remove("pump-active"); // Remove visual indicator class

          // When the pump is OFF, only downstream lines turn gray
          if (lineMapping[pumpIndex]) {
            // Keep upstream lines unchanged
            // Change downstream lines to gray
            lineMapping[pumpIndex].downstream.forEach((line) => {
              line.style.background = "#808080"; // Gray color
              updateLineAnimationColor(line, "#808080");
            });
          }
        }
      });
    });
  }

  function updateLineAnimationColor(lineElement, color) {
    // Create a new stylesheet or use an existing one
    let styleEl = document.getElementById("dynamic-line-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "dynamic-line-styles";
      document.head.appendChild(styleEl);
    }

    // Generate a unique ID for this line element if it doesn't already have one
    if (!lineElement.id) {
      lineElement.id = "line-" + Math.random().toString(36).substr(2, 9);
    }

    // Update CSS with a specific selector for this line element
    const cssText = `
    #${lineElement.id}::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      height: 100%;
      width: 100%;
      border-radius: 2px;
      background: linear-gradient(
        to right,
        transparent 0%,
        ${color} 50%,
        transparent 100%
      );
      animation: pump 2s linear infinite;
      filter: blur(1px);
    }
  `;

    styleEl.textContent += cssText;
  }

  // Add CSS for active pump indicators
  const pumpStyleElement = document.createElement("style");
  pumpStyleElement.textContent = `
  .pump-active {
    box-shadow: 0 0 15px rgba(76, 201, 240, 0.8);
    border: 2px solid #4cc9f0;
  }
`;
  document.head.appendChild(pumpStyleElement);

  //========= Function symbols draggable=======
  document
    .querySelector(".dropdown-menu")
    .addEventListener("click", function (e) {
      //check click event button Change Position
      const isDragMode = e.target.id === "changePosition";
      console.log("Value of isDragMode: ", isDragMode);
      //Update drag mode state
      handleDragModeChange(isDragMode);
      changePositionBtn.classList.add("active");
      // If without drag mode
      if (!isDragMode) {
        document.querySelectorAll(".resize-handle").forEach((handle) => {
          handle.style.display = "none";
        });
        changePositionBtn.classList.remove("active");
      }
    });
  function handleDragModeChange(enable) {
    globalDragMode = enable;
  }

  function makeDraggableSymbol(element, symbolId) {
    let isDragging = false;
    let initialX, initialY, currentX, currentY;

    element.addEventListener("mousedown", dragStart);

    function dragStart(e) {
      if (!globalDragMode || e.target !== element) return;

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

      // Save position after drag
      const symbolIndex = collectionSymbol.findIndex((s) => s.id === symbolId);
      if (symbolIndex !== -1) {
        collectionSymbol[symbolIndex].left = element.style.left;
        collectionSymbol[symbolIndex].top = element.style.top;
        saveSymbolCollection();
      }
    }
  }
  // Create Symbol Picker modal
  function createSymbolPickerModal() {
    // Create modal container
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "symbol-modal-overlay";
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "9999";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "symbol-modal-content";
    modalContent.style.setProperty(
      "background",
      "linear-gradient(180deg, rgba(22, 24, 32, 0.5) 0%, rgba(32, 34, 42, 0.7) 100%)",
      "important"
    );

    modalContent.style.borderRadius = "5px";
    modalContent.style.padding = "20px";
    modalContent.style.width = "80%";
    modalContent.style.maxWidth = "600px";
    modalContent.style.maxHeight = "60vh";
    modalContent.style.overflowY = "auto";
    modalContent.style.color = "white";
    modalContent.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";

    // Create modal header
    const modalHeader = document.createElement("div");
    modalHeader.style.display = "flex";
    modalHeader.style.justifyContent = "space-between";
    modalHeader.style.alignItems = "center";
    modalHeader.style.marginBottom = "20px";
    modalHeader.style.borderBottom = "1px solid #444";
    modalHeader.style.paddingBottom = "10px";

    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Select Symbols";
    modalTitle.style.margin = "0";

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.color = "white";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      document.body.removeChild(modalOverlay);
    };

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Create symbols grid
    const symbolsGrid = document.createElement("div");
    symbolsGrid.style.display = "grid";
    symbolsGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(120px, 1fr))";
    symbolsGrid.style.gap = "15px";
    symbolsGrid.style.marginBottom = "20px";

    // Selected symbols tracking
    const selectedSymbols = [];

    // Add symbols to grid
    availableSymbols.forEach((symbol, index) => {
      const symbolItem = document.createElement("div");
      symbolItem.style.border = "2px solid #444";
      symbolItem.style.borderRadius = "5px";
      symbolItem.style.padding = "10px";
      symbolItem.style.textAlign = "center";
      symbolItem.style.cursor = "pointer";
      symbolItem.style.transition = "all 0.2s";

      const symbolImg = document.createElement("img");
      symbolImg.src = symbol.path;
      symbolImg.alt = symbol.name;
      symbolImg.style.width = "100%";
      symbolImg.style.marginBottom = "8px";

      const symbolName = document.createElement("div");
      symbolName.textContent = symbol.name;
      symbolName.style.fontSize = "14px";

      symbolItem.appendChild(symbolImg);
      symbolItem.appendChild(symbolName);

      // Handle symbol selection
      symbolItem.onclick = function () {
        if (symbolItem.classList.contains("selected")) {
          symbolItem.classList.remove("selected");
          symbolItem.style.borderColor = "#444";
          symbolItem.style.backgroundColor = "";

          // Remove from selected symbols
          const selectIndex = selectedSymbols.findIndex(
            (s) => s.path === symbol.path
          );
          if (selectIndex !== -1) {
            selectedSymbols.splice(selectIndex, 1);
          }
        } else {
          symbolItem.classList.add("selected");
          symbolItem.style.borderColor = "#4cc9f0";
          symbolItem.style.backgroundColor = "rgba(76, 201, 240, 0.1)";

          // Add to selected symbols
          selectedSymbols.push({
            path: symbol.path,
            name: symbol.name,
          });
        }
      };

      symbolsGrid.appendChild(symbolItem);
    });

    // Create modal footer with buttons
    const modalFooter = document.createElement("div");
    modalFooter.style.display = "flex";
    modalFooter.style.justifyContent = "flex-end";
    modalFooter.style.gap = "10px";
    modalFooter.style.borderTop = "1px solid #444";
    modalFooter.style.paddingTop = "15px";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.padding = "8px 16px";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "4px";
    cancelButton.style.backgroundColor = "#555";
    cancelButton.style.color = "white";
    cancelButton.style.cursor = "pointer";
    cancelButton.onclick = function () {
      document.body.removeChild(modalOverlay);
    };

    const addButton = document.createElement("button");
    addButton.textContent = "Add Selected";
    addButton.style.padding = "8px 16px";
    addButton.style.border = "none";
    addButton.style.borderRadius = "4px";
    addButton.style.backgroundColor = "#4cc9f0";
    addButton.style.color = "white";
    addButton.style.cursor = "pointer";
    addButton.onclick = function () {
      if (selectedSymbols.length === 0) {
        alert("Please select at least one symbol to add");
        return;
      }

      // Add selected symbols to collection
      selectedSymbols.forEach((symbol) => {
        const newSymbolId =
          "symbol-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        collectionSymbol.push({
          id: newSymbolId,
          path: symbol.path,
          name: symbol.name,
          left: "100px",
          top: "100px",
        });
      });

      // Save and render the updated collection
      saveSymbolCollection();
      renderAddedSymbols();

      // Close the modal
      document.body.removeChild(modalOverlay);
    };

    modalFooter.appendChild(cancelButton);
    modalFooter.appendChild(addButton);

    // Assemble the modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(symbolsGrid);
    modalContent.appendChild(modalFooter);
    modalOverlay.appendChild(modalContent);

    // Add to the document
    document.body.appendChild(modalOverlay);
  }

  // Add event listener to the "Add Symbols" button
  const addSymbolsBtn = document.getElementById("addSymbols");
  if (addSymbolsBtn) {
    addSymbolsBtn.addEventListener("click", function () {
      createSymbolPickerModal();
    });
  }

  // Load existing symbols on page load
  loadSymbolCollection();

  //=============Delete Symbol Feature============
  const symbolsContainer = document.querySelector(".symbols-container");
  const selectSymbolBtn = document.getElementById("selectSymbols");

  let isSymbolSelectMode = false;
  let selectedSymbolsToRemove = [];

  selectSymbolBtn.addEventListener("click", function () {
    console.log("Access to the select symbols");
    isSymbolSelectMode = !isSymbolSelectMode;
    if (isSymbolSelectMode) {
      selectSymbolBtn.classList.add("active");
      symbolsContainer.style.cursor = "pointer";
      //Enable symbol selection
      enableSymbolSelection();
    } else {
      isSymbolSelectMode = false;
      selectSymbolBtn.classList.remove("active");
      symbolsContainer.style.cursor = "default";

      //clear selections when exiting select mode
      selectedSymbolsToRemove = [];
      updateSymbolSelections();
    }
  });

  function enableSymbolSelection() {
    //Get all added symbols - Scan all added symbol
    const addSymbolsRemove = document.querySelectorAll(".symbol-wrapper"); //must using querySelectorAll for scan all symbol

    addSymbolsRemove.forEach((symbol) => {
      //Add click event added symbols
      symbol.addEventListener("click", symbolSelectHandler);

      if (selectedSymbolsToRemove.includes(symbol.dataset.id)) {
        symbol.classList.add("symbol-selected");
      }
    });
  }

  // Handle symbol selection
  function symbolSelectHandler(e) {
    e.stopPropagation();
    if (!modeStates.isSymbolSelectMode) return;
    // if (!isSymbolSelectMode) return;

    const symbolId = this.dataset.id;

    // Toggle selection
    if (selectedSymbolsToRemove.includes(symbolId)) {
      selectedSymbolsToRemove = selectedSymbolsToRemove.filter(
        (id) => id !== symbolId
      );
      this.classList.remove("symbol-selected");
    } else {
      selectedSymbolsToRemove.push(symbolId);
      this.classList.add("symbol-selected");
    }
  }

  // Update visuals for selected symbols
  function updateSymbolSelections() {
    const addedSymbols = document.querySelectorAll(".added-symbol");

    addedSymbols.forEach((symbol) => {
      if (selectedSymbolsToRemove.includes(symbol.dataset.id)) {
        symbol.classList.add("symbol-selected");
      } else {
        symbol.classList.remove("symbol-selected");
      }
    });
  }

  // Delete selected symbols
  function deleteSelectedSymbols() {
    if (selectedSymbolsToRemove.length === 0) {
      return;
    }

    // Filter out selected symbols from collectionSymbol array
    collectionSymbol = collectionSymbol.filter(
      (symbol) => !selectedSymbolsToRemove.includes(symbol.id)
    );

    // Save updated collection to localStorage
    saveSymbolCollection();

    // Clear selection array
    selectedSymbolsToRemove = [];

    // Re-render symbols
    renderAddedSymbols();
  }
  // Add Delete key support
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Delete" &&
      isSymbolSelectMode &&
      selectedSymbolsToRemove.length > 0
    ) {
      deleteSelectedSymbols();
    }
  });

  // Add CSS for selected symbols
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .symbol-selected {
      border: 2px solid #ff3860 !important;
      box-shadow: 0 0 10px rgba(255, 56, 96, 0.7) !important;
    }
  `;
  document.head.appendChild(styleElement);

  /*=========Resize Feature=======*/
  // Function to make symbols resizable
  function makeResizable(element, symbolId) {
    console.log("Access to the makeResizable function");
    // Create resize handles for each corner
    const handles = ["nw", "ne", "sw", "se"];
    const handleElements = {};

    // Add handles to the element
    handles.forEach((position) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${position}-handle`;
      handle.style.position = "absolute";
      handle.style.width = "12px";
      handle.style.height = "12px";
      handle.style.backgroundColor = "#4cc9f0";
      handle.style.border = "1px solid white";
      handle.style.borderRadius = "50%";
      handle.style.cursor = `${position}-resize`;
      handle.style.display = "none"; // Initially hidden
      handle.style.zIndex = "100";

      // Position the handles
      if (position.includes("n")) {
        // Top
        handle.style.top = "-6px";
      } else {
        // Bottom
        handle.style.bottom = "-6px";
      }

      if (position.includes("w")) {
        // Left
        handle.style.left = "-6px";
      } else {
        // Right
        handle.style.right = "-6px";
      }

      element.appendChild(handle);
      handleElements[position] = handle;
    });

    // Toggle handles visibility on double click
    element.addEventListener("dblclick", function (e) {
      const areHandlesVisible = handleElements["nw"].style.display === "block";

      // Toggle all handles
      handles.forEach((position) => {
        handleElements[position].style.display = areHandlesVisible
          ? "none"
          : "block";
      });

      // Add click outside listener if handles are shown
      if (!areHandlesVisible) {
        const clickOutsideHandler = (event) => {
          if (!element.contains(event.target)) {
            handles.forEach((position) => {
              handleElements[position].style.display = "none";
            });
            document.removeEventListener("mousedown", clickOutsideHandler);
          }
        };
        document.addEventListener("mousedown", clickOutsideHandler);
      }
    });

    // Variables for resizing
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    // Add event listeners to handles
    handles.forEach((position) => {
      const handle = handleElements[position];

      handle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        currentHandle = position;

        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startLeft = element.offsetLeft;
        startTop = element.offsetTop;

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
      });
    });

    // Resize function
    function resize(e) {
      if (!isResizing) return;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Adjust based on handle position
      if (currentHandle.includes("e")) newWidth = Math.max(startWidth + dx, 20);
      if (currentHandle.includes("w")) {
        newWidth = Math.max(startWidth - dx, 20);
        newLeft = startLeft + dx;
      }
      if (currentHandle.includes("s"))
        newHeight = Math.max(startHeight + dy, 20);
      if (currentHandle.includes("n")) {
        newHeight = Math.max(startHeight - dy, 20);
        newTop = startTop + dy;
      }

      element.style.width = `${newWidth}px`;
      element.style.height = "auto";
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }

    // Stop resizing
    function stopResize() {
      isResizing = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);

      // Save dimensions
      const symbolIndex = collectionSymbol.findIndex((s) => s.id === symbolId);
      if (symbolIndex !== -1) {
        collectionSymbol[symbolIndex].width = element.style.width;
        collectionSymbol[symbolIndex].height = element.style.height;
        collectionSymbol[symbolIndex].left = element.style.left;
        collectionSymbol[symbolIndex].top = element.style.top;
        saveSymbolCollection();
      }
    }
  }

  //============E-Ra Services=======
  const eraWidget = new EraWidget();
  let lastTank1Value = NaN;
  let lastTank2Value = NaN;
  let configTank1 = null,
    configTank2 = null,
    onPump1 = null,
    offPump1 = null,
    onPump2 = null,
    offPump2 = null;

  eraWidget.init({
    onConfiguration: (configuration) => {
      configTank1 = configuration.realtime_configs[0];
      configTank2 = configuration.realtime_configs[1];
      onPump1 = configuration.actions[0];
      offPump1 = configuration.actions[1];
      onPump2 = configuration.actions[2];
      offPump2 = configuration.actions[3];
    },
    onValues: (values) => {
      if (configTank1 && values[configTank1.id]) {
        const tank1Value = values[configTank1.id].value;
        lastTank1Value = tank1Value;
        waterPump(lastTank1Value);
      }

      if (configTank2 && values[configTank2.id]) {
        const tank2Value = values[configTank2.id].value;
        lastTank2Value = tank2Value;
        waterPump2(lastTank2Value);
      }
    },
  });

  /*=========Full Screen Feature========*/
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const fullscreenIcon = document.getElementById("fullscreenIcon");

  fullscreenBtn.addEventListener("click", toggleFullScreen);

  function toggleFullScreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // Enter fullscreen mode
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
      fullscreenIcon.classList.remove("fa-expand");
      fullscreenIcon.classList.add("fa-compress");
      document.body.classList.add("fullscreen-active");
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      fullscreenIcon.classList.remove("fa-compress");
      fullscreenIcon.classList.add("fa-expand");
      document.body.classList.remove("fullscreen-active");
    }
  }

  // Listen for fullscreen change events from browser
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
  document.addEventListener("mozfullscreenchange", updateFullscreenButton);
  document.addEventListener("MSFullscreenChange", updateFullscreenButton);

  function updateFullscreenButton() {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      fullscreenIcon.classList.remove("fa-expand");
      fullscreenIcon.classList.add("fa-compress");
      document.body.classList.add("fullscreen-active");
    } else {
      fullscreenIcon.classList.remove("fa-compress");
      fullscreenIcon.classList.add("fa-expand");
      document.body.classList.remove("fullscreen-active");
    }
  }
  const gaugeControllers = {};
  Object.keys(gaugeConfig).forEach((gaugeId) => {
    gaugeControllers[gaugeId] = initializeGauge(gaugeId);
  });
  setInterval(() => {
    const gaugeIds = Object.keys(gaugeConfig);
    const randomGaugeId = gaugeIds[Math.floor(Math.random() * gaugeIds.length)];
    const randomValue = Math.floor(
      Math.random() * gaugeConfig[randomGaugeId].maxValue
    );
    gaugeControllers[randomGaugeId](randomValue);
  }, 3000);

  document.getElementById("gauge-oee").classList.add("active");
});
/*==============Gauge==========*/

const gaugeConfig = {
  "gauge-oee": { initialValue: 50, minValue: 0, maxValue: 180 },
  "gauge-performance": { initialValue: 50, minValue: 0, maxValue: 180 },
  "gauge-quality": { initialValue: 50, minValue: 0, maxValue: 180 },
  "gauge-availability": { initialValue: 90, minValue: 0, maxValue: 180 },
};

function initializeGauge(gaugeId) {
  const gauge = document.getElementById(gaugeId);
  const ticks = gauge.querySelector(".ticks");
  const labels = gauge.querySelector(".labels");
  const needle = gauge.querySelector(".needle");
  const borderValueDisplay = gauge.querySelector(".value-display");
  const valueDisplay = gauge.querySelector(".value-display");
  const radius = 120;
  const config = gaugeConfig[gaugeId];

  for (let i = 0; i <= 180; i += 5) {
    const angle = -135 + (i / 180) * 270;
    if (i % 20 === 0) {
      const tick = document.createElement("div");
      tick.className = "tick major-tick";
      tick.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${radius}px)`;
      ticks.appendChild(tick);

      const label = document.createElement("div");
      label.className = "label";
      const labelRadius = 100;
      const angleRad = ((angle - 90) * Math.PI) / 180;
      const x = 150 + labelRadius * Math.cos(angleRad);
      const y = 150 + labelRadius * Math.sin(angleRad);
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.innerHTML = i;
      labels.appendChild(label);
    } else if (i % 10 === 0) {
      const tick = document.createElement("div");
      tick.className = "tick minor-tick";
      tick.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${radius}px)`;
      ticks.appendChild(tick);
    }
  }

  function setGaugeValue(value) {
    if (value < config.minValue) value = config.minValue;
    if (value > config.maxValue) value = config.maxValue;
    const angle = -135 + (value / 180) * 270;
    needle.style.transform = `translate(-50%, 0) rotate(${angle}deg)`;

    valueDisplay.innerHTML = value;

    const colors = ["#00ff22", "#ffd700", "#ff8c00", "#ff0000"];
    const colorIndex = Math.min(Math.floor(value / 45), 3);
    needle.style.borderBottomColor = colors[colorIndex];
    borderValueDisplay.style.borderColor = colors[colorIndex];

    gauge.style.setProperty("--gauge-color", colors[colorIndex]);
  }

  gauge.addEventListener("click", () => {
    document
      .querySelectorAll(".gauge")
      .forEach((g) => g.classList.remove("active"));

    gauge.classList.add("active");

    console.log(
      `Gauge ${gaugeId} clicked with value: ${valueDisplay.innerHTML}`
    );

    setGaugeValue(Math.floor(Math.random() * config.maxValue));
  });

  setGaugeValue(config.initialValue);

  return setGaugeValue;
}
