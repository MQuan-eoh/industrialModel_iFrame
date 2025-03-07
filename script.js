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

  // const dropdownMenu = document.querySelector(".dropdown-menu");
  //=====Clear All Lines=====
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
  // dropdownMenu.appendChild(selectLineBtn);

  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
  // dropdownMenu.appendChild(deleteSelectedBtn);

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

  // Update tank water levels based on latest data point
  const updateWaterLevels = () => {
    const latestValue = data.datasets[0].data[data.datasets[0].data.length - 1];
    const waterElement = document.getElementById("water");
    const water2Element = document.getElementById("water2");
    const levelText = document.getElementById("level-text");

    if (waterElement) {
      waterElement.style.height = `${latestValue}%`;
    }

    if (water2Element) {
      water2Element.style.height = `${latestValue}%`;
    }

    if (levelText) {
      const volumeInLiters = Math.round(latestValue * 150);
      levelText.textContent = `${volumeInLiters}L`;
    }
  };

  updateWaterLevels();

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

    updateWaterLevels();
  }, 5000);

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
    { path: "assets/img/ElevatedTank.png", name: "Bồn chứa" },
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
    const existingAddedSymbols = document.querySelectorAll(".added-symbol");
    existingAddedSymbols.forEach((symbol) => symbol.remove());

    // Add symbols from collection
    collectionSymbol.forEach((symbol) => {
      const newSymbol = document.createElement("img");
      newSymbol.src = symbol.path;
      newSymbol.className = "added-symbol";
      newSymbol.alt = symbol.name;
      newSymbol.style.left = symbol.left || "50px";
      newSymbol.style.top = symbol.top || "50px";
      newSymbol.style.position = "absolute";

      // Apply saved dimensions if available
      if (symbol.width) {
        newSymbol.style.width = symbol.width;
      } else {
        newSymbol.style.width = "64px"; // Default width
      }

      if (symbol.height) {
        newSymbol.style.height = symbol.height;
      } else {
        newSymbol.style.height = "auto"; // Default height
      }

      newSymbol.style.cursor = "move";
      newSymbol.dataset.id = symbol.id;

      // Make the new symbol draggable
      makeDraggableSymbol(newSymbol, symbol.id);

      // Make the new symbol resizable
      makeResizable(newSymbol, symbol.id);

      document.querySelector(".model-container").appendChild(newSymbol);
    });
  }

  // Function to make symbols draggable
  function makeDraggableSymbol(element, symbolId) {
    let isDragging = false;
    let initialX;
    let initialY;
    let currentX;
    let currentY;

    element.addEventListener("mousedown", dragStart);

    function dragStart(e) {
      // Don't start dragging if we clicked on a resize handle
      if (e.target !== element) {
        return;
      }

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
    modalContent.style.maxHeight = "80vh";
    modalContent.style.overflow = "auto";
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
      selectSymbolBtn.classList("active");
      symbolsContainer.style.cursor = "default";

      //clear selections when exiting select mode
      selectedSymbolsToRemove = [];
      updateSymbolSelections();
    }
  });

  function enableSymbolSelection() {
    //Get all added symbols - Scan all added symbol
    const addSymbolsRemove = document.querySelectorAll(".added-symbol"); //must using querySelectorAll for scan all symbol

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

    if (!isSymbolSelectMode) return;

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
      alert("No symbols selected. Please select symbols to delete.");
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

    alert("Selected symbols deleted successfully.");
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

    // Show/hide handles on mouse enter/leave
    element.addEventListener("mouseenter", function () {
      handles.forEach((position) => {
        handleElements[position].style.display = "block";
      });
    });

    element.addEventListener("mouseleave", function (e) {
      // Only hide if we're not currently resizing and not hovering a handle
      if (
        !isResizing &&
        !handles.some((pos) => e.relatedTarget === handleElements[pos])
      ) {
        handles.forEach((position) => {
          handleElements[position].style.display = "none";
        });
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
        e.stopPropagation(); // Prevent dragging from starting

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

      // Calculate new dimensions
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Calculate aspect ratio for proportional resizing
      const aspectRatio = startWidth / startHeight;

      // Adjust based on which handle is being dragged
      if (currentHandle.includes("e")) {
        // Right
        newWidth = startWidth + dx;
        // Maintain minimum size
        newWidth = Math.max(newWidth, 20);
      }
      if (currentHandle.includes("w")) {
        // Left
        const widthChange = Math.min(startWidth - 20, dx);
        newWidth = startWidth - widthChange;
        newLeft = startLeft + widthChange;
      }
      if (currentHandle.includes("s")) {
        // Bottom
        newHeight = startHeight + dy;
        // Maintain minimum size
        newHeight = Math.max(newHeight, 20);
      }
      if (currentHandle.includes("n")) {
        // Top
        const heightChange = Math.min(startHeight - 20, dy);
        newHeight = startHeight - heightChange;
        newTop = startTop + heightChange;
      }

      // Apply new dimensions
      element.style.width = `${newWidth}px`;
      element.style.height = "auto"; // Maintain aspect ratio for image
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }

    // Stop resizing
    function stopResize() {
      if (!isResizing) return;

      isResizing = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);

      // Save the new dimensions to the symbol collection
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
  const resizeStyleElement = document.createElement("style");
  resizeStyleElement.textContent = `
  .added-symbol {
    position: absolute;
    cursor: move;
  }
  
  .resize-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #4cc9f0;
    border: 1px solid white;
    border-radius: 50%;
    z-index: 100;
  }
  
  .nw-handle { cursor: nw-resize; }
  .ne-handle { cursor: ne-resize; }
  .sw-handle { cursor: sw-resize; }
  .se-handle { cursor: se-resize; }
  
  .symbol-selected .resize-handle {
    background-color: #ff3860;
  }
`;
  document.head.appendChild(resizeStyleElement);
});
