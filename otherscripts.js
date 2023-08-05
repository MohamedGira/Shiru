import { isMobile } from "./utils/checkMobile";

let controls = document.getElementById("controlsList");
let overlay = document.getElementById("overlay");
document.getElementById("controls").style.display = isMobile()?"none":"block";

document.getElementById("controls").addEventListener("mouseover", () => {
  controls.style.display = "flex";
  overlay.style.display = "block";
});
document.getElementById("controls").addEventListener("mouseout", () => {
  controls.style.display = "none";
  overlay.style.display = "none";
});
window.addEventListener("keydown", function (e) {
  if (e.target == document.body) {
    if (e.code == "Space" || e.code == "ArrowDown" || e.code == "ArrowUp")
      e.preventDefault();
  }
});