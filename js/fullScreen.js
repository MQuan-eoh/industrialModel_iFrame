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
