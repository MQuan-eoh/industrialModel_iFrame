document.addEventListener("DOMContentLoaded", function () {
  // Menu and menu item
  const drawButton = document.getElementById("draw-button");
  const selectLineButton = document.getElementById("select-line-button");
  const clearAllButtonFactory = document.getElementById("clearAllFactory");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const dropdown_FactoryModel = document.getElementById(
    "dropdown_FactoryModel"
  );

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

      lineGroup.path(pathString).attr({
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.4)",
        "stroke-width": 8,
        "stroke-linecap": "round",
        filter: "url(#glow)",
      });

      lineGroup.path(pathString).attr({
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        "stroke-width": 4,
        "stroke-linecap": "round",
        filter: "url(#glow)",
      });

      const mainPath = lineGroup.path(pathString).addClass("main-line").attr({
        fill: "none",
        stroke: "#FFFFFF",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "data-original-width": 2,
      });

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
            hasStartCircle: isCapsLockOn,
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
      const mainPath = selectedLineFactory.findOne(".main-line");
      const pathData = mainPath.array();

      const start = pathData[0];
      const end = pathData[1];
      const lineData = {
        start: { x: start[1], y: start[2] }, // [1] và [2] là vị trí x,y của điểm M
        end: { x: end[1], y: end[2] }, // [1] và [2] là vị trí x,y của điểm L
        hasStartCircle: selectedLineFactory.findOne("circle[cx='6']") !== null,
      };

      removeLineFromStorage(lineData);
      selectedLineFactory.remove();

      //Update linesFactory array
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
