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
  //Management event listener
  const eventListenerRegistry = {
    listeners: {},
    add: function (element, eventType, handler, id) {
      const listenerId =
        id || `${element.id || "unknown"}-${eventType}-${Math.random()}`;
      element.addEventListener(eventType, handler);
      this.listeners[listenerId] = { element, eventType, handler };
      return listenerId;
    },
    remove: function (id) {
      if (this.listeners[id]) {
        const { element, eventType, handler } = this.listeners[id];
        element.removeEventListener(eventType, handler);
        delete this.listeners[id];
      }
    },
    removeAll: function () {
      Object.keys(this.listeners).forEach((id) => this.remove(id));
    },
  };

  function makeDraggableTank(element, tankWaterId) {
    let isDragging = false;
    let initialX, initialY, currentX, currentY;
    let mouseDownListenerId, mouseMoveListenerId, mouseUpListenerId;

    mouseDownListenerId = eventListenerRegistry.add(
      element,
      "mousedown",
      dragStart
    );

    function dragStart(e) {
      if (!globalDragMode) return;

      e.preventDefault();
      initialX = e.clientX;
      initialY = e.clientY;
      currentX = element.offsetLeft;
      currentY = element.offsetTop;
      isDragging = true;

      mouseMoveListenerId = eventListenerRegistry.add(
        document,
        "mousemove",
        drag
      );
      mouseUpListenerId = eventListenerRegistry.add(
        document,
        "mouseup",
        dragEnd
      );
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
      eventListenerRegistry.remove(mouseMoveListenerId);
      eventListenerRegistry.remove(mouseUpListenerId);

      // Lưu vị trí sau khi kéo thả
      saveWaterTankPosition(element, tankWaterId);
    }

    // Trả về hàm để xóa event listener khi không cần thiết
    return function cleanUp() {
      eventListenerRegistry.remove(mouseDownListenerId);
    };
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
  //Add Click Event for Dropdown menu - management active mode
  const dropdownMenu = document.getElementById("drawingToolsDropdown");
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

    //Reset all mode
    Object.keys(modeStates).forEach((key) => (modeStates[key] = false));
    modeButtons.forEach((id) =>
      document.getElementById(id).classList.remove("active")
    );

    //Active selected mode
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
    // Xóa các symbol hiện có
    document.querySelectorAll(".symbol-wrapper").forEach((symbol) => {
      const symbolId = symbol.dataset.id;
      if (symbolId) {
        elementRegistry.remove(symbolId);
      } else {
        symbol.remove();
      }
    });

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
      const dragCleanUp = makeDraggableSymbol(wrapper, symbol.id);
      const resizeCleanUp = makeResizable(wrapper, symbol.id);

      //register element to registry
      elementRegistry.add(symbol.id, wrapper, function () {
        dragCleanUp();
        // resizeCleanUp();
      });
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

  const elementRegistry = {
    elements: {},
    add: function (id, element, cleanUpFunction) {
      this.elements[id] = {
        element,
        cleanUp: cleanUpFunction || function () {},
      };
      return id;
    },
    remove: function (id) {
      if (this.elements[id]) {
        this.elements[id].cleanUp();
        const element = this.elements[id].element;
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        delete this.elements[id];
      }
    },
    removeAll: function () {
      Object.keys(this.elements).forEach((id) => this.remove(id));
    },
  };

  //Management of Animations and Intervals
  const intervalRegistry = {
    intervals: {},
    add: function (callback, delay, id) {
      const intervalId = id || `interval-${Math.random()}`;
      this.intervals[intervalId] = setInterval(callback, delay);
      return intervalId;
    },
    remove: function (id) {
      if (this.intervals[id]) {
        clearInterval(this.intervals[id]);
        delete this.intervals[id];
      }
    },
    removeAll: function () {
      Object.keys(this.intervals).forEach((id) => this.remove(id));
    },
  };

  //Management of Style Elements
  const styleRegistry = {
    styles: {},
    add: function (id, cssText) {
      //Create style element if it does not exist
      if (!this.styles[id]) {
        const styleEl = document.createElement("style");
        styleEl.id = id;
        document.head.appendChild(styleEl);
        this.styles[id] = styleEl;
      }

      //Update SS
      this.styles[id].textContent = cssText;
      return id;
    },
    remove: function (id) {
      if (this.styles[id]) {
        const styleEl = this.styles[id];
        if (styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
        delete this.styles[id];
      }
    },
    removeAll: function () {
      Object.keys(this.styles).forEach((id) => this.remove(id));
    },
  };

  function updateLineAnimationColor(lineElement, color) {
    //Generate a unique ID for lineElement if it doesn't already exist.
    if (!lineElement.id) {
      lineElement.id = "line-" + Math.random().toString(36).substr(2, 9);
    }

    //Create CSS lineElement
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

    //Add or update style element
    styleRegistry.add(`dynamic-line-styles-${lineElement.id}`, cssText);
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
    let mouseDownListenerId, mouseMoveListenerId, mouseUpListenerId;

    mouseDownListenerId = eventListenerRegistry.add(
      element,
      "mousedown",
      dragStart
    );

    function dragStart(e) {
      if (!globalDragMode || e.target !== element) return;

      e.preventDefault();
      initialX = e.clientX;
      initialY = e.clientY;
      currentX = element.offsetLeft;
      currentY = element.offsetTop;
      isDragging = true;

      mouseMoveListenerId = eventListenerRegistry.add(
        document,
        "mousemove",
        drag
      );
      mouseUpListenerId = eventListenerRegistry.add(
        document,
        "mouseup",
        dragEnd
      );
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
      eventListenerRegistry.remove(mouseMoveListenerId);
      eventListenerRegistry.remove(mouseUpListenerId);

      // Save position after drag
      const symbolIndex = collectionSymbol.findIndex((s) => s.id === symbolId);
      if (symbolIndex !== -1) {
        collectionSymbol[symbolIndex].left = element.style.left;
        collectionSymbol[symbolIndex].top = element.style.top;
        saveSymbolCollection();
      }
    }

    //Remove event listener when not needed
    return function cleanUp() {
      eventListenerRegistry.remove(mouseDownListenerId);
    };
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
    modeStates.isSymbolSelectMode = !modeStates.isSymbolSelectMode;

    if (modeStates.isSymbolSelectMode) {
      selectSymbolBtn.classList.add("active");
      symbolsContainer.style.cursor = "pointer";
      enableSymbolSelection();
    } else {
      selectSymbolBtn.classList.remove("active");
      symbolsContainer.style.cursor = "default";
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

  //=============Heath of device =============
  const charts = {};
  const healthData = {
    "gauge-oee": { values: [], timestamps: [] },
    "gauge-performance": { values: [], timestamps: [] },
    "gauge-quality": { values: [], timestamps: [] },
    "gauge-availability": { values: [], timestamps: [] },
  };

  // Time range in minutes (default: 10 minutes)
  let timeRange = 10;

  // Setup charts
  document.querySelectorAll(".device-health-card").forEach((card) => {
    const sourceId = card.dataset.source;
    const canvas = card.querySelector(".health-chart");

    charts[sourceId] = new Chart(canvas, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: { display: false },
          y: {
            display: false,
            min: 0,
            max: 180,
          },
        },
        animation: false,
      },
    });
  });

  // Function to update health status based on value
  function updateHealthStatus(element, value) {
    const statusElement = element.querySelector(".health-status");
    const valueElement = element.querySelector(".health-value");

    valueElement.textContent = value;

    // Remove all status classes
    statusElement.classList.remove(
      "status-good",
      "status-warning",
      "status-alert",
      "status-critical"
    );

    // Add appropriate status class
    if (value >= 0 && value < 45) {
      statusElement.classList.add("status-good");
    } else if (value >= 45 && value < 90) {
      statusElement.classList.add("status-warning");
    } else if (value >= 90 && value < 135) {
      statusElement.classList.add("status-alert");
    } else {
      statusElement.classList.add("status-critical");
    }
  }

  // =====Function to update chart data========
  function updateChartData(sourceId, value) {
    const now = new Date();

    // Add new data point
    healthData[sourceId].values.push(value);
    healthData[sourceId].timestamps.push(now);

    // Remove data points outside the time range
    const cutoffTime = new Date(now.getTime() - timeRange * 60 * 1000);

    while (
      healthData[sourceId].timestamps.length > 0 &&
      healthData[sourceId].timestamps[0] < cutoffTime
    ) {
      healthData[sourceId].values.shift();
      healthData[sourceId].timestamps.shift();
    }

    // Update chart
    const chart = charts[sourceId];
    chart.data.labels = healthData[sourceId].timestamps.map((t) =>
      t.toLocaleTimeString()
    );
    chart.data.datasets[0].data = healthData[sourceId].values;
    chart.update();
  }

  // Override the setGaugeValue function
  Object.keys(gaugeConfig).forEach((gaugeId) => {
    // Store original function for later use
    const originalGaugeController = gaugeControllers[gaugeId];

    // Create wrapper that captures values
    gaugeControllers[gaugeId] = function (value) {
      // Call original function
      originalGaugeController(value);

      // Find the corresponding health card and update it
      const healthCard = document.querySelector(
        `.device-health-card[data-source="${gaugeId}"]`
      );
      if (healthCard) {
        updateHealthStatus(healthCard, value);
        updateChartData(gaugeId, value);
      }

      // Log for health assessment
      console.log(`Health assessment for ${gaugeId}: ${value}`);
    };
  });

  // Initialize with current gauge values
  Object.keys(gaugeConfig).forEach((gaugeId) => {
    const valueDisplay = document.querySelector(`#${gaugeId} .value-display`);
    if (valueDisplay) {
      const value = parseInt(valueDisplay.textContent);
      const healthCard = document.querySelector(
        `.device-health-card[data-source="${gaugeId}"]`
      );
      if (healthCard) {
        updateHealthStatus(healthCard, value);
        updateChartData(gaugeId, value);
      }
    }
  });

  //======Processing timeRange of Health Assessment==========
  // Add this JavaScript to integrate with the existing code

  // Define the time range variable (already used in the existing code)
  let timeRangeHealth = 30; // Default to 30 minutes

  // Initialize the dropdown toggle button
  document
    .getElementById("productGroupDropdownToggle")
    .addEventListener("click", function () {
      document
        .getElementById("productGroupTimeRangeDropdown")
        .classList.toggle("show");
    });

  // Close the dropdown when clicking outside
  window.addEventListener("click", function (event) {
    if (!event.target.matches("#productGroupDropdownToggle")) {
      const dropdown = document.getElementById("productGroupTimeRangeDropdown");
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    }
  });

  // Handle time range selection
  document
    .querySelectorAll("#productGroupTimeRangeDropdown .dropdown-item")
    .forEach((item) => {
      item.addEventListener("click", function () {
        // Update the timeRange value
        timeRangeHealth = parseInt(this.getAttribute("data-minutes"));

        // Update the button text
        document.getElementById("productGroupDropdownToggle").textContent =
          this.textContent;

        // Close the dropdown
        document
          .getElementById("productGroupTimeRangeDropdown")
          .classList.remove("show");

        // Update all charts with the new time range
        updateAllCharts();
      });
    });

  // Function to update all charts with the current time range
  function updateAllCharts() {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeRangeHealth * 60 * 1000);

    // Update all charts
    Object.keys(healthData).forEach((sourceId) => {
      // Filter data based on the new time range
      const filteredData = {
        values: [],
        timestamps: [],
      };

      // Find the index of the first timestamp that's within the new time range
      let startIndex = 0;
      for (let i = 0; i < healthData[sourceId].timestamps.length; i++) {
        if (healthData[sourceId].timestamps[i] >= cutoffTime) {
          startIndex = i;
          break;
        }
      }

      // Copy data from the found index to the end
      filteredData.values = healthData[sourceId].values.slice(startIndex);
      filteredData.timestamps =
        healthData[sourceId].timestamps.slice(startIndex);

      // Update the chart with filtered data
      const chart = charts[sourceId];
      chart.data.labels = filteredData.timestamps.map((t) =>
        t.toLocaleTimeString()
      );
      chart.data.datasets[0].data = filteredData.values;
      chart.update();
    });
  }

  // Update the existing updateChartData function to respect the new time range
  const originalUpdateChartData = updateChartData;
  updateChartData = function (sourceId, value) {
    const now = new Date();

    // Add new data point
    healthData[sourceId].values.push(value);
    healthData[sourceId].timestamps.push(now);

    // Remove data points outside the time range
    const cutoffTime = new Date(now.getTime() - timeRangeHealth * 60 * 1000);

    while (
      healthData[sourceId].timestamps.length > 0 &&
      healthData[sourceId].timestamps[0] < cutoffTime
    ) {
      healthData[sourceId].values.shift();
      healthData[sourceId].timestamps.shift();
    }

    // Update chart
    const chart = charts[sourceId];
    chart.data.labels = healthData[sourceId].timestamps.map((t) =>
      t.toLocaleTimeString()
    );
    chart.data.datasets[0].data = healthData[sourceId].values;
    chart.update();
  };

  // Update the interval for random data generation based on the selected time range
  const originalInterval = setInterval;
  setInterval = function (callback, delay) {
    const intervalId = originalInterval(callback, delay);

    // Store the interval ID so we can clear it later if needed
    if (callback.toString().includes("randomGaugeId")) {
      window.randomDataIntervalId = intervalId;
    }

    return intervalId;
  };

  // Function to adjust the data generation interval based on time range
  function adjustDataGenerationInterval() {
    // Clear existing interval
    if (window.randomDataIntervalId) {
      clearInterval(window.randomDataIntervalId);
    }

    // Set new interval based on time range
    let newInterval = 3000; // Default

    if (timeRangeHealth >= 1440) {
      // 1 day
      newInterval = 30000; // Every 30 seconds for day view
    } else if (timeRangeHealth >= 30) {
      // 30 minutes
      newInterval = 5000; // Every 5 seconds for 30 minute view
    } else if (timeRangeHealth >= 10) {
      // 10 minutes
      newInterval = 3000; // Every 3 seconds for 10 minute view
    } else {
      // Realtime
      newInterval = 1000; // Every second for realtime view
    }

    // Create new interval
    window.randomDataIntervalId = setInterval(() => {
      const gaugeIds = Object.keys(gaugeConfig);
      const randomGaugeId =
        gaugeIds[Math.floor(Math.random() * gaugeIds.length)];
      const randomValue = Math.floor(
        Math.random() * gaugeConfig[randomGaugeId].maxValue
      );
      gaugeControllers[randomGaugeId](randomValue);
    }, newInterval);
  }

  // Update interval when time range changes
  document
    .querySelectorAll("#productGroupTimeRangeDropdown .dropdown-item")
    .forEach((item) => {
      item.addEventListener("click", adjustDataGenerationInterval);
    });

  // Set initial interval
  adjustDataGenerationInterval();
  setInterval(() => {
    const gaugeIds = Object.keys(gaugeConfig);
    const randomGaugeId = gaugeIds[Math.floor(Math.random() * gaugeIds.length)];
    const randomValue = Math.floor(
      Math.random() * gaugeConfig[randomGaugeId].maxValue
    );
    gaugeControllers[randomGaugeId](randomValue);
  }, 3000);

  document.getElementById("gauge-oee").classList.add("active");

  const mainContainer = document.querySelector(".container-fluid");
  const dashboardContainer = document.querySelector(".dashboard-container");
  const sidebar = document.getElementById("sidebar");

  //Go to next page and previous page
  const factoryModelLink = document.getElementById("factoryModelLink");
  const goBackButton = document.getElementById("go-back-button");

  // Menu and menu item
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const dropdown_FactoryModel = document.getElementById(
    "dropdown_FactoryModel"
  );
  const drawButton = document.getElementById("draw-button");
  const selectLineButton = document.getElementById("select-line-button");
  const clearAllButtonFactory = document.getElementById("clearAllFactory");

  function showFactoryModel() {
    mainContainer.style.display = "none";
    dashboardContainer.style.display = "block";
    sidebar.style.display = "none";
    document.querySelector(".factoryModelContainer").style.display = "block"; // Thêm dòng này
  }

  //Back to homePage
  function showMainDashboard() {
    mainContainer.style.display = "block";
    dashboardContainer.style.display = "none";
    sidebar.style.display = "block";
    document.querySelector(".factoryModelContainer").style.display = "none"; // Thêm dòng này
  }

  // Sự kiện click vào liên kết mô hình nhà máy
  factoryModelLink.addEventListener("click", function (e) {
    e.preventDefault();
    showFactoryModel();
  });

  // Sự kiện click vào nút quay lại
  goBackButton.addEventListener("click", function () {
    showMainDashboard();
  });

  //===========Factory Model ===============
  let drawingFactory = false;
  let drawInstance;
  let currentGlowPath;
  let currentMainPath;
  let startPoint;
  let endCircle = null;
  let linesFactory = [];
  let isCapsLockOn = false;
  let currentMiddlePath;
  window.addEventListener("load", () => {
    drawInstance = SVG("#drawing-area").size("100%", "100%");
    const savedLinesFactory =
      JSON.parse(localStorage.getItem("linesFactory")) || [];
    savedLinesFactory.forEach((lineData) => {
      const lineGroup = drawInstance.group().attr({ "data-line-group": true });
      const pathString = `M${lineData.start.x},${lineData.start.y} L${lineData.end.x},${lineData.end.y}`;

      // Tạo glow effect
      lineGroup.path(pathString).attr({
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.4)",
        "stroke-width": 8,
        "stroke-linecap": "round",
        filter: "url(#glow)",
      });

      // Lớp giữa
      lineGroup.path(pathString).attr({
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        "stroke-width": 4,
        "stroke-linecap": "round",
        filter: "url(#glow)",
      });

      // Line chính
      const mainPath = lineGroup.path(pathString).addClass("main-line").attr({
        fill: "none",
        stroke: "#FFFFFF",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "data-original-width": 2,
      });

      // Vẽ lại chấm tròn ở đầu line nếu có
      if (lineData.hasStartCircle) {
        const startCircle = lineGroup.group();
        startCircle.circle(16).attr({
          cx: lineData.start.x,
          cy: lineData.start.y,
          fill: "rgba(255, 255, 255, 0.2)",
          filter: "url(#glow)",
        });
        startCircle.circle(10).attr({
          cx: lineData.start.x,
          cy: lineData.start.y,
          fill: "rgba(255, 255, 255, 0.4)",
          filter: "url(#glow)",
        });
        startCircle.circle(6).attr({
          cx: lineData.start.x,
          cy: lineData.start.y,
          fill: "#FFFFFF",
        });
      }

      linesFactory.push(lineGroup);
      lineGroup.node.addEventListener("click", handleLineClick);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) isCtrlPressed = true;
    if (e.getModifierState("CapsLock")) {
      isCapsLockOn = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (!e.ctrlKey) isCtrlPressed = false;
    if (e.key === "CapsLock") {
      isCapsLockOn = e.getModifierState("CapsLock");
    }
  });

  document.getElementById("draw-button").addEventListener("click", () => {
    drawingFactory = !drawingFactory;
    if (drawingFactory) {
      document.getElementById("draw-button").textContent = "Dừng vẽ";
      startDrawing();
    } else {
      document.getElementById("draw-button").textContent = "Bắt đầu vẽ";
      stopDrawing();
    }
  });

  function startDrawing() {
    if (!drawInstance) {
      drawInstance = SVG("#drawing-area").size("100%", "100%");
    }

    drawInstance.on("mousedown", (e) => {
      if (!drawingFactory) return;
      startPoint = { x: e.offsetX, y: e.offsetY };

      lineGroup = drawInstance.group().attr({ "data-line-group": true });

      if (isCapsLockOn) {
        const startCircle = lineGroup.group();
        startCircle.circle(16).attr({
          cx: startPoint.x,
          cy: startPoint.y,
          fill: "rgba(255, 255, 255, 0.2)",
          filter: "url(#glow)",
        });
        startCircle.circle(10).attr({
          cx: startPoint.x,
          cy: startPoint.y,
          fill: "rgba(255, 255, 255, 0.4)",
          filter: "url(#glow)",
        });
        startCircle.circle(6).attr({
          cx: startPoint.x,
          cy: startPoint.y,
          fill: "#FFFFFF",
        });
      }

      currentGlowPath = lineGroup
        .path(`M${startPoint.x},${startPoint.y}`)
        .attr({
          fill: "none",
          stroke: "rgba(255, 255, 255, 0.4)",
          "stroke-width": 8,
          "stroke-linecap": "round",
          filter: "url(#glow)",
        });

      currentMiddlePath = lineGroup
        .path(`M${startPoint.x},${startPoint.y}`)
        .attr({
          fill: "none",
          stroke: "rgba(255, 255, 255, 0.6)",
          "stroke-width": 4,
          "stroke-linecap": "round",
          filter: "url(#glow)",
        });

      currentMainPath = lineGroup
        .path(`M${startPoint.x},${startPoint.y}`)
        .addClass("main-line")
        .attr({
          fill: "none",
          stroke: "#FFFFFF",
          "stroke-width": 2,
          "stroke-linecap": "round",
          "data-original-width": 2,
        });
    });

    drawInstance.on("mousemove", (e) => {
      if (!drawingFactory || !currentMainPath) return;
      let endPoint = { x: e.offsetX, y: e.offsetY };

      if (isCtrlPressed) {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const length = Math.sqrt(dx * dx + dy * dy);
        endPoint = snapToAngle(startPoint, angle, length);
      }

      const pathString = `M${startPoint.x},${startPoint.y} L${endPoint.x},${endPoint.y}`;
      currentGlowPath.plot(pathString);
      currentMiddlePath.plot(pathString);
      currentMainPath.plot(pathString);

      if (endCircle) endCircle.remove();

      endCircle = drawInstance.group();
      endCircle.circle(16).attr({
        cx: endPoint.x,
        cy: endPoint.y,
        fill: "rgba(255, 255, 255, 0.2)",
        filter: "url(#glow)",
      });
      endCircle.circle(10).attr({
        cx: endPoint.x,
        cy: endPoint.y,
        fill: "rgba(255, 255, 255, 0.4)",
        filter: "url(#glow)",
      });
      endCircle.circle(6).attr({
        cx: endPoint.x,
        cy: endPoint.y,
        fill: "#FFFFFF",
      });
    });
    drawInstance.on("mouseup", () => {
      if (!drawingFactory) return;

      if (lineGroup) {
        linesFactory.push(lineGroup);
        lineGroup.node.addEventListener("click", handleLineClick);

        // Trích xuất tọa độ chính xác từ pathData
        const mainPath = lineGroup.findOne(".main-line");
        const pathData = mainPath.array();
        if (
          pathData.length >= 2 &&
          pathData[0][0] === "M" &&
          pathData[1][0] === "L"
        ) {
          const startX = pathData[0][1]; // Tọa độ x của điểm bắt đầu
          const startY = pathData[0][2]; // Tọa độ y của điểm bắt đầu
          const endX = pathData[1][1]; // Tọa độ x của điểm kết thúc
          const endY = pathData[1][2]; // Tọa độ y của điểm kết thúc
          const lineData = {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            hasStartCircle: isCapsLockOn, // Lưu trạng thái Caps Lock
          };
          saveLineToStorage(lineData);
        } else {
          console.error("Dữ liệu đường line không hợp lệ:", pathData);
        }
      }

      if (endCircle) {
        endCircle.remove();
        endCircle = null;
      }
      currentGlowPath = null;
      currentMiddlePath = null;
      currentMainPath = null;
      lineGroup = null;
    });
  }

  function saveLineToStorage(lineData) {
    const savedLinesFactory =
      JSON.parse(localStorage.getItem("linesFactory")) || [];
    savedLinesFactory.push(lineData);
    localStorage.setItem("linesFactory", JSON.stringify(savedLinesFactory));
  }

  function removeLineFromStorage(lineData) {
    let savedLinesFactory =
      JSON.parse(localStorage.getItem("linesFactory")) || [];
    // Thêm tolerance cho số thực
    savedLinesFactory = savedLinesFactory.filter(
      (lineFactory) =>
        !(
          Math.abs(lineFactory.start.x - lineData.start.x) < 0.1 &&
          Math.abs(lineFactory.start.y - lineData.start.y) < 0.1 &&
          Math.abs(lineFactory.end.x - lineData.end.x) < 0.1 &&
          Math.abs(lineFactory.end.y - lineData.end.y) < 0.1
        )
    );
    localStorage.setItem("linesFactory", JSON.stringify(savedLinesFactory));
  }

  function clearAllLinesFromStorage() {
    localStorage.removeItem("linesFactory");
  }

  function snapToAngle(start, angle, length) {
    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    let closestAngle = snapAngles[0];
    let minDiff = Math.abs(angle - snapAngles[0]);

    for (let i = 1; i < snapAngles.length; i++) {
      const diff = Math.abs(angle - snapAngles[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestAngle = snapAngles[i];
      }
    }

    const radian = closestAngle * (Math.PI / 180);
    const adjustedX = start.x + length * Math.cos(radian);
    const adjustedY = start.y + length * Math.sin(radian);
    return { x: adjustedX, y: adjustedY };
  }

  function stopDrawing() {
    drawInstance.off("mousedown");
    drawInstance.off("mousemove");
    drawInstance.off("mouseup");

    if (endCircle) {
      endCircle.remove();
      endCircle = null;
    }
  }

  let isSelectModeFactory = false;
  let selectedLineFactory = null;

  // const hamburgerMenu = document.getElementById("hamburger-menu");
  const dropdownMenuFactory = document.getElementById("dropdown_FactoryModel");
  // const selectLineButton = document.getElementById("select-line-button");

  hamburgerMenu.addEventListener("click", () => {
    dropdownMenuFactory.classList.toggle("active");
    console.log("Press Hambuger Menu");
  });

  document.addEventListener("click", (e) => {
    if (
      !hamburgerMenu.contains(e.target) &&
      !dropdownMenuFactory.contains(e.target)
    ) {
      dropdownMenuFactory.classList.remove("active");
    }
  });

  function handleLineClick(e) {
    if (!isSelectModeFactory) return;

    const lineElement = e.currentTarget;
    const lineGroup = SVG.adopt(lineElement);

    if (selectedLineFactory) {
      const prevMain = selectedLineFactory.findOne(".main-line");
      prevMain.attr({
        stroke: "#FFFFFF",
        "stroke-width": prevMain.attr("data-original-width"),
      });
    }

    selectedLineFactory = lineGroup;
    const mainPath = selectedLineFactory.findOne(".main-line");
    mainPath.attr({
      stroke: "#4cc9f0",
      "stroke-width": 4,
    });
  }

  document.getElementById("clearAllFactory").addEventListener("click", () => {
    linesFactory.forEach((lineFactory) => lineFactory.remove());
    linesFactory = [];
    selectedLineFactory = null;
    clearAllLinesFromStorage();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentMainPath) {
      if (lineGroup) {
        lineGroup.remove();
        lineGroup = null;
      }
      currentGlowPath = null;
      currentMainPath = null;
      if (endCircle) {
        endCircle.remove();
        endCircle = null;
      }
    }

    if (e.key === "Delete" && selectedLineFactory) {
      // Lấy dữ liệu path chính xác
      const mainPath = selectedLineFactory.findOne(".main-line");
      const pathData = mainPath.array();

      // Sửa cách trích xuất tọa độ
      const start = pathData[0];
      const end = pathData[1];
      const lineData = {
        start: { x: start[1], y: start[2] }, // [1] và [2] là vị trí x,y của điểm M
        end: { x: end[1], y: end[2] }, // [1] và [2] là vị trí x,y của điểm L
        hasStartCircle: selectedLineFactory.findOne("circle[cx='6']") !== null,
      };

      removeLineFromStorage(lineData);
      selectedLineFactory.remove();

      // Cập nhật mảng linesFactory
      const index = linesFactory.indexOf(selectedLineFactory);
      if (index > -1) linesFactory.splice(index, 1);

      selectedLineFactory = null;
    }
  });

  selectLineButton.addEventListener("click", () => {
    isSelectModeFactory = !isSelectModeFactory;
    selectLineButton.classList.toggle("active");
    selectLineButton.textContent = isSelectModeFactory
      ? "Đang chọn line"
      : "Chọn line để xóa";

    const cursorStyle = isSelectModeFactory ? "pointer" : "default";
    linesFactory.forEach(
      (lineFactory) => (lineFactory.node.style.cursor = cursorStyle)
    );
  });
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
//=============Side Bar=============
// document.getElementById("sidebarToggle").addEventListener("click", function () {
//   document.getElementById("sidebar").classList.toggle("active");
// });

// // Xử lý active menu item
// const menuItems = document.querySelectorAll(".sidebar-menu a");
// menuItems.forEach((item) => {
//   item.addEventListener("click", function () {
//     menuItems.forEach((i) => i.classList.remove("active"));
//     this.classList.add("active");

//     // Xử lý chuyển đổi view (có thể thêm sau)
//     const id = this.id;
//     console.log(`Clicked on ${id}`);

//     // Ví dụ về xử lý chuyển đổi view
//     switch (id) {
//       case "dashboardLink":
//         // Hiển thị dashboard
//         break;
//       case "pumpLink":
//         // Hiển thị thông tin máy bơm
//         break;
//       case "waterTreatmentLink":
//         // Hiển thị thông tin trạm xử lý
//         break;
//       // Thêm các case khác tương ứng với các menu item
//     }
//   });
// });

// const fullscreenButton = document.getElementById("fullscreen-button");

// function toggleFullscreen() {
//   if (!document.fullscreenElement) {
//     enterFullscreen();
//   } else {
//     exitFullscreen();
//   }
// }

// function enterFullscreen() {
//   const element = document.documentElement;
//   if (element.requestFullscreen) {
//     element.requestFullscreen();
//   } else if (element.mozRequestFullScreen) {
//     element.mozRequestFullScreen();
//   } else if (element.webkitRequestFullscreen) {
//     element.webkitRequestFullscreen();
//   } else if (element.msRequestFullscreen) {
//     element.msRequestFullscreen();
//   }
// }

// function exitFullscreen() {
//   if (document.exitFullscreen) {
//     document.exitFullscreen();
//   } else if (document.mozCancelFullScreen) {
//     document.mozCancelFullScreen();
//   } else if (document.webkitExitFullscreen) {
//     document.webkitExitFullscreen();
//   } else if (document.msExitFullscreen) {
//     document.msExitFullscreen();
//   }
// }

// function handleFullscreenChange() {
//   if (document.fullscreenElement) {
//     document.body.classList.add("fullscreen-mode");
//   } else {
//     document.body.classList.remove("fullscreen-mode");
//   }
// }

// fullscreenButton.addEventListener("click", toggleFullscreen);
// document.addEventListener("fullscreenchange", handleFullscreenChange);
// document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
// document.addEventListener("mozfullscreenchange", handleFullscreenChange);
// document.addEventListener("MSFullscreenChange", handleFullscreenChange);

//=============E-Ra Service================
// const eraWidget = new EraWidget();
// const lake = document.querySelector(".lakeClo-value");
// const waterFilterPH = document.querySelector(".waterFilter-pH");
// const waterFilterDoDuc = document.querySelector(".waterFilter-doDuc");
// const waterFilterCloDu = document.querySelector(".waterFilter-cloDu");
// const officePower = document.querySelector(".office-powerConsump");
// const factoryTemp = document.querySelector(".factory-temperature");
// const factoryHumid = document.querySelector(".factory-humidity");

// let configLake = null,
//   configwaterFilterPH = null,
//   configwaterFilterDoDuc = null,
//   configwaterFilterCloDu = null,
//   configofficePower = null,
//   configfactoryTemp = null,
//   configfactoryHumid = null;
// eraWidget.init({
//   onConfiguration: (configuration) => {
//     configLake = configuration.realtime_configs[0];
//     configwaterFilterPH = configuration.realtime_configs[1];
//     configwaterFilterDoDuc = configuration.realtime_configs[2];
//     configwaterFilterCloDu = configuration.realtime_configs[3];
//     configofficePower = configuration.realtime_configs[4];
//     configfactoryTemp = configuration.realtime_configs[5];
//     configfactoryHumid = configuration.realtime_configs[6];

//     console.log("Configuration:", {
//       configLake,
//       configwaterFilterPH,
//       configwaterFilterDoDuc,
//       configwaterFilterCloDu,
//       configofficePower,
//       configfactoryTemp,
//       configfactoryHumid,
//     });
//   },
//   onValues: (values) => {
//     if (configLake && values[configLake.id]) {
//       const lakeValue = values[configLake.id].value;
//       if (lake) lake.textContent = lakeValue;
//     }

//     if (configwaterFilterPH && values[configwaterFilterPH.id]) {
//       const pHValue = values[configwaterFilterPH.id].value;
//       if (waterFilterPH) waterFilterPH.textContent = pHValue;
//     }
//     if (configwaterFilterDoDuc && values[configwaterFilterDoDuc.id]) {
//       const doducValue = values[configwaterFilterDoDuc.id].value;
//       if (waterFilterDoDuc) waterFilterDoDuc.textContent = doducValue;
//     }
//     if (configwaterFilterCloDu && values[configwaterFilterCloDu.id]) {
//       const cloValue = values[configwaterFilterCloDu.id].value;
//       if (waterFilterCloDu) waterFilterCloDu.textContent = cloValue;
//     }

//     if (configofficePower && values[configofficePower.id]) {
//       const powerValue = values[configofficePower.id].value;
//       if (officePower) officePower.textContent = powerValue + " kWh";
//     }

//     if (configfactoryTemp && values[configfactoryTemp.id]) {
//       const tempValue = values[configfactoryTemp.id].value;
//       if (factoryTemp) factoryTemp.textContent = tempValue + "℃";
//     }

//     if (configfactoryHumid && values[configfactoryHumid.id]) {
//       const humidValue = values[configfactoryHumid.id].value;
//       if (factoryHumid) factoryHumid.textContent = humidValue + "%";
//     }
//   },
// });
