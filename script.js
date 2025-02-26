function waterPump(level) {
  const water = document.getElementById("water");
  const levelWater = document.getElementById("level-text");
  const heightPercentage = level + "%";
  water.style.height = heightPercentage;
  levelWater.textContent = level * 150 + "L";
}

setInterval(() => {
  const randomLevel = Math.floor(Math.random() * 101); // Giá trị từ 0 đến 100
  waterPump(randomLevel);
}, 3000);

//===========Listener click Pump============
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
});

//===============Function: Drag and Drop =============
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

  function makeDraggable(element) {
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
    }
  }

  makeDraggable(pumpImage);
  makeDraggable(analogImage);
});
