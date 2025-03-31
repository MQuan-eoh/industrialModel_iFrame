document.addEventListener("DOMContentLoaded", function () {
  // Menu and menu item
  const drawButtonFactory = document.getElementById("draw-button");
  const selectLineButtonFactory = document.getElementById("select-line-button");
  const clearAllButtonFactory = document.getElementById("clearAllFactory");
  const hamburgerMenuFactory = document.getElementById("hamburger-menu");
  const dropdown_FactoryModel = document.getElementById(
    "dropdown_FactoryModel"
  );

  let drawingFactory = false;
  let drawInstanceFactory;
  let currentGlowPathFactory;
  let currentMainPathFactory;
  let startPointFactory;
  let endCircleFactory = null;
  let linesFactoryArray = [];
  let isCapsLockOnFactory = false;
  let currentMiddlePathFactory;
  let isSelectModeFactory = false;
  let selectedLineFactory = null;
  let isAreaSelectingFactory = false;
  let selectionBoxFactory = null;
  let selectedLinesFactoryArray = [];
  // Add missing isCtrlPressed variable declaration
  let isCtrlPressedFactory = false;
  let lineGroupFactory;

  window.addEventListener("load", () => {
    drawInstanceFactory = SVG("#drawing-area").size("100%", "100%");
    const savedLinesFactory =
      JSON.parse(localStorage.getItem("linesFactory")) || [];
    savedLinesFactory.forEach((lineData) => {
      const lineGroup = drawInstanceFactory
        .group()
        .attr({ "data-line-group-factory": true });
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

      const mainPath = lineGroup
        .path(pathString)
        .addClass("main-line-factory")
        .attr({
          fill: "none",
          stroke: "#FFFFFF",
          "stroke-width": 2,
          "stroke-linecap": "round",
          "data-original-width-factory": 2,
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

      linesFactoryArray.push(lineGroup);
      lineGroup.node.addEventListener("click", handleLineClickFactory);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) isCtrlPressedFactory = true;
    if (e.getModifierState("CapsLock")) {
      isCapsLockOnFactory = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (!e.ctrlKey) isCtrlPressedFactory = false;
    if (e.key === "CapsLock") {
      isCapsLockOnFactory = e.getModifierState("CapsLock");
    }
  });

  if (drawButtonFactory) {
    drawButtonFactory.addEventListener("click", () => {
      drawingFactory = !drawingFactory;
      if (drawingFactory) {
        drawButtonFactory.textContent = "Dừng vẽ";
        startDrawingFactory();
      } else {
        drawButtonFactory.textContent = "Bắt đầu vẽ";
        stopDrawingFactory();
      }
    });
  }

  function startDrawingFactory() {
    if (!drawInstanceFactory) {
      drawInstanceFactory = SVG("#drawing-area").size("100%", "100%");
    }

    drawInstanceFactory.on("mousedown", (e) => {
      if (!drawingFactory) return;
      startPointFactory = { x: e.offsetX, y: e.offsetY };

      lineGroupFactory = drawInstanceFactory
        .group()
        .attr({ "data-line-group-factory": true });

      if (isCapsLockOnFactory) {
        const startCircle = lineGroupFactory.group();
        startCircle.circle(16).attr({
          cx: startPointFactory.x,
          cy: startPointFactory.y,
          fill: "rgba(255, 255, 255, 0.2)",
          filter: "url(#glow)",
        });
        startCircle.circle(10).attr({
          cx: startPointFactory.x,
          cy: startPointFactory.y,
          fill: "rgba(255, 255, 255, 0.4)",
          filter: "url(#glow)",
        });
        startCircle.circle(6).attr({
          cx: startPointFactory.x,
          cy: startPointFactory.y,
          fill: "#FFFFFF",
        });
      }

      currentGlowPathFactory = lineGroupFactory
        .path(`M${startPointFactory.x},${startPointFactory.y}`)
        .attr({
          fill: "none",
          stroke: "rgba(255, 255, 255, 0.4)",
          "stroke-width": 8,
          "stroke-linecap": "round",
          filter: "url(#glow)",
        });

      currentMiddlePathFactory = lineGroupFactory
        .path(`M${startPointFactory.x},${startPointFactory.y}`)
        .attr({
          fill: "none",
          stroke: "rgba(255, 255, 255, 0.6)",
          "stroke-width": 4,
          "stroke-linecap": "round",
          filter: "url(#glow)",
        });

      currentMainPathFactory = lineGroupFactory
        .path(`M${startPointFactory.x},${startPointFactory.y}`)
        .addClass("main-line-factory")
        .attr({
          fill: "none",
          stroke: "#FFFFFF",
          "stroke-width": 2,
          "stroke-linecap": "round",
          "data-original-width-factory": 2,
        });
    });

    drawInstanceFactory.on("mousemove", (e) => {
      if (!drawingFactory || !currentMainPathFactory) return;
      let endPoint = { x: e.offsetX, y: e.offsetY };

      if (isCtrlPressedFactory) {
        const dx = endPoint.x - startPointFactory.x;
        const dy = endPoint.y - startPointFactory.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const length = Math.sqrt(dx * dx + dy * dy);
        endPoint = snapToAngleFactory(startPointFactory, angle, length);
      }

      const pathString = `M${startPointFactory.x},${startPointFactory.y} L${endPoint.x},${endPoint.y}`;
      currentGlowPathFactory.plot(pathString);
      currentMiddlePathFactory.plot(pathString);
      currentMainPathFactory.plot(pathString);

      if (endCircleFactory) endCircleFactory.remove();

      endCircleFactory = drawInstanceFactory.group();
      endCircleFactory.circle(16).attr({
        cx: endPoint.x,
        cy: endPoint.y,
        fill: "rgba(255, 255, 255, 0.2)",
        filter: "url(#glow)",
      });
      endCircleFactory.circle(10).attr({
        cx: endPoint.x,
        cy: endPoint.y,
        fill: "rgba(255, 255, 255, 0.4)",
        filter: "url(#glow)",
      });
      endCircleFactory.circle(6).attr({
        cx: endPoint.x,
        cy: endPoint.y,
        fill: "#FFFFFF",
      });
    });

    drawInstanceFactory.on("mouseup", (e) => {
      if (!drawingFactory) return;

      if (lineGroupFactory) {
        linesFactoryArray.push(lineGroupFactory);
        lineGroupFactory.node.addEventListener("click", handleLineClickFactory);

        // Fix path data extraction
        const mainPath = lineGroupFactory.findOne(".main-line-factory");

        try {
          // Access the path data directly instead of using array() method
          const pathElement = mainPath.node;
          const startX = startPointFactory.x;
          const startY = startPointFactory.y;

          // Get end point coordinates from the last circle
          let endX, endY;
          if (endCircleFactory) {
            const lastCircle = endCircleFactory.first();
            endX = lastCircle.attr("cx");
            endY = lastCircle.attr("cy");
          } else {
            // Fallback if no end circle exists
            const d = pathElement.getAttribute("d");
            const match = d.match(/L\s*([0-9.-]+)\s*,?\s*([0-9.-]+)/);
            if (match) {
              endX = parseFloat(match[1]);
              endY = parseFloat(match[2]);
            } else {
              // If we can't extract L coordinates, use startPoint as fallback
              endX = startPointFactory.x;
              endY = startPointFactory.y;
            }
          }

          const lineData = {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            hasStartCircle: isCapsLockOnFactory,
          };

          saveLineToStorageFactory(lineData);
        } catch (err) {
          console.error("Error saving line data:", err);
        }
      }

      if (endCircleFactory) {
        endCircleFactory.remove();
        endCircleFactory = null;
      }
      currentGlowPathFactory = null;
      currentMiddlePathFactory = null;
      currentMainPathFactory = null;
      lineGroupFactory = null;
    });
  }

  function saveLineToStorageFactory(lineData) {
    const savedLinesFactory =
      JSON.parse(localStorage.getItem("linesFactory")) || [];
    savedLinesFactory.push(lineData);
    localStorage.setItem("linesFactory", JSON.stringify(savedLinesFactory));
  }

  function removeLineFromStorageFactory(lineData) {
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

  function clearAllLinesFromStorageFactory() {
    localStorage.removeItem("linesFactory");
  }

  function snapToAngleFactory(start, angle, length) {
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

  function stopDrawingFactory() {
    drawInstanceFactory.off("mousedown");
    drawInstanceFactory.off("mousemove");
    drawInstanceFactory.off("mouseup");

    if (endCircleFactory) {
      endCircleFactory.remove();
      endCircleFactory = null;
    }
  }

  // Dropdown menu handling
  const dropdownMenuFactory = document.getElementById("dropdown_FactoryModel");

  if (hamburgerMenuFactory) {
    hamburgerMenuFactory.addEventListener("click", () => {
      dropdownMenuFactory.classList.toggle("active");
      console.log("Press Hambuger Menu");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      dropdownMenuFactory &&
      hamburgerMenuFactory &&
      !hamburgerMenuFactory.contains(e.target) &&
      !dropdownMenuFactory.contains(e.target)
    ) {
      dropdownMenuFactory.classList.remove("active");
    }
  });

  // Chức năng chọn line để xóa đã được sửa đổi
  function handleLineClickFactory(e) {
    if (!isSelectModeFactory) return;
    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền

    const lineElement = e.currentTarget;
    const lineGroup = SVG.adopt(lineElement);

    console.log("Line clicked in factory model:", lineGroup);

    // If shift key is pressed, add to selection
    if (e.shiftKey) {
      if (
        !selectedLinesFactoryArray.some((item) => item.node === lineGroup.node)
      ) {
        selectedLinesFactoryArray.push(lineGroup);
        const mainPath = lineGroup.findOne(".main-line-factory");
        if (mainPath) {
          mainPath.attr({
            stroke: "#4cc9f0",
            "stroke-width": 4,
          });
        }
      }
    } else {
      // Clear previous selection
      selectedLinesFactoryArray.forEach((group) => {
        const main = group.findOne(".main-line-factory");
        if (main) {
          main.attr({
            stroke: "#FFFFFF",
            "stroke-width": main.attr("data-original-width-factory") || 2,
          });
        }
      });

      selectedLinesFactoryArray = [];
      selectedLineFactory = lineGroup; // Set the current selected line
      selectedLinesFactoryArray.push(lineGroup);

      const mainPath = lineGroup.findOne(".main-line-factory");
      if (mainPath) {
        mainPath.attr({
          stroke: "#4cc9f0",
          "stroke-width": 4,
        });
      }
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentMainPathFactory) {
      if (lineGroupFactory) {
        lineGroupFactory.remove();
        lineGroupFactory = null;
      }
      currentGlowPathFactory = null;
      currentMainPathFactory = null;
      if (endCircleFactory) {
        endCircleFactory.remove();
        endCircleFactory = null;
      }
    }

    // Xử lý xóa line đã chọn khi nhấn Delete
    if (
      e.key === "Delete" &&
      (selectedLineFactory || selectedLinesFactoryArray.length > 0)
    ) {
      // Nếu có các line đã chọn, xóa tất cả chúng
      if (selectedLinesFactoryArray.length > 0) {
        selectedLinesFactoryArray.forEach((lineToDelete) => {
          try {
            // Fix path data extraction for Delete operation
            const mainPath = lineToDelete.findOne(".main-line-factory");
            if (mainPath && mainPath.node) {
              const pathElement = mainPath.node;
              const d = pathElement.getAttribute("d");

              // Parse the d attribute to extract start and end coordinates
              const mMatch = d.match(/M\s*([0-9.-]+)\s*,?\s*([0-9.-]+)/);
              const lMatch = d.match(/L\s*([0-9.-]+)\s*,?\s*([0-9.-]+)/);

              if (mMatch && lMatch) {
                const lineData = {
                  start: { x: parseFloat(mMatch[1]), y: parseFloat(mMatch[2]) },
                  end: { x: parseFloat(lMatch[1]), y: parseFloat(lMatch[2]) },
                  hasStartCircle: lineToDelete.findOne("circle") !== null,
                };

                removeLineFromStorageFactory(lineData);

                // Xóa line từ DOM
                lineToDelete.remove();

                // Cập nhật mảng linesFactoryArray
                const index = linesFactoryArray.indexOf(lineToDelete);
                if (index > -1) linesFactoryArray.splice(index, 1);
              }
            }
          } catch (err) {
            console.error("Error deleting line:", err);
          }
        });

        // Reset selections
        selectedLinesFactoryArray = [];
        selectedLineFactory = null;
      }
    }
  });

  if (selectLineButtonFactory) {
    selectLineButtonFactory.addEventListener("click", () => {
      isSelectModeFactory = !isSelectModeFactory;
      selectLineButtonFactory.classList.toggle("active");
      selectLineButtonFactory.textContent = isSelectModeFactory
        ? "Đang chọn line"
        : "Chọn line để xóa";

      // Thay đổi con trỏ cho tất cả các line
      const cursorStyle = isSelectModeFactory ? "pointer" : "default";
      linesFactoryArray.forEach((lineFactory) => {
        if (lineFactory && lineFactory.node) {
          lineFactory.node.style.cursor = cursorStyle;
        }
      });

      // Reset selection khi tắt chế độ chọn
      if (!isSelectModeFactory) {
        selectedLinesFactoryArray.forEach((group) => {
          if (group) {
            const main = group.findOne(".main-line-factory");
            if (main) {
              main.attr({
                stroke: "#FFFFFF",
                "stroke-width": main.attr("data-original-width-factory") || 2,
              });
            }
          }
        });
        selectedLinesFactoryArray = [];
        selectedLineFactory = null;
      }
    });
  }

  // Add clear all functionality
  if (clearAllButtonFactory) {
    clearAllButtonFactory.addEventListener("click", () => {
      linesFactoryArray.forEach((line) => {
        if (line && line.remove) line.remove();
      });
      linesFactoryArray = [];
      clearAllLinesFromStorageFactory();
    });
  }
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
  if (!gauge) return null;

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
