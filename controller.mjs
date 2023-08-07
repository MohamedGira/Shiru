export class Contoller {
  constructor(
    outerColor = "rgba(255, 255, 255, 0.6)",
    innerColor = "rgba(0, 0, 0, 0.6)"
  ) {
    this.element = document.createElement("div");
    this.element.id = this.element.className = "controller";
    this.element.style.position = "absolute";
    this.outerDiameter = 160;
    this.innerDiameter = this.outerDiameter / 4;
    this.middleDiameter = (this.outerDiameter + this.innerDiameter) / 2;
    this.element.style.left = `${this.outerDiameter / 2 + 10}px`;
    this.element.style.bottom = `${this.outerDiameter / 2 + 10}px`;
    this.element.innerHTML = `
    <div id="outerCircle" class="circle" style="background-color:${outerColor};">
        <div id="middleCircle" class="circle" style="border :1px solid rgba(255, 255, 255, 0.6);">
            <div id="innerCircle" class="circle" style="background-color:${innerColor};">
            </div>
        </div>
    </div>
    `;
    this.outerCircle = this.element.querySelector("#outerCircle");
    this.middleCircle = this.element.querySelector("#middleCircle");
    this.innerCircle = this.element.querySelector("#innerCircle");
    this.outerCircle.style.width = `${this.outerDiameter}px`;
    this.middleCircle.style.width = `${this.middleDiameter}px`;
    this.innerCircle.style.width = `${this.innerDiameter}px`;
    this.deltaXPercent = undefined;
    this.deltaYPercent = undefined;
    this.touchStart = null;

    this.element.addEventListener("touchstart", (event) => {
      this.touchStart = this.touchCurrent = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    });
    window.addEventListener("touchmove", (event) => {
      if (this.touchStart) {
        this.touchCurrent = {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        };
        this.handleTouch(this.touchCurrent);
      }
    });
    window.addEventListener("touchend", (event) => {
      if (!event.touches.length) {
        this.touchCurrent = null;
        this.touchStart = null;
        this.isPress = false;
      }
      this.handleTouch(this.touchCurrent);
    });
  }
  updateHtml(canvasWidth) {
    this.outerDiameter = canvasWidth / 6;
    this.innerDiameter = this.outerDiameter / 4;
    this.middleDiameter = (this.outerDiameter + this.innerDiameter) / 2;
    this.outerCircle.style.width = `${this.outerDiameter}px`;
    this.middleCircle.style.width = `${this.middleDiameter}px`;
    this.innerCircle.style.width = `${this.innerDiameter}px`;
    this.element.style.left = `${this.outerDiameter / 2 + 10}px`;
    this.element.style.bottom = `${this.outerDiameter / 2 + 10}px`;
  }
  handleInnerPos(screenX, screenY) {
    let parentRect = this.middleCircle.getBoundingClientRect();
    let { x: centerx, y: centery } = this.element.getBoundingClientRect();

    let r = Math.sqrt((screenX - centerx) ** 2 + (screenY - centery) ** 2);
    let x = 0,
      y = 0;
    if (r < this.middleDiameter / 2) {
      x = screenX - parentRect.left;
      y = screenY - parentRect.top;
      this.innerCircle.style.left = `${x}px`;
      this.innerCircle.style.top = `${y}px`;
    } else {
      x =
        (Math.cos(Math.atan2(screenY - centery, screenX - centerx)) *
          this.middleDiameter) /
          2 +
        this.middleDiameter / 2;
      this.innerCircle.style.left = `${x}px`;
      y =
        (Math.sin(Math.atan2(screenY - centery, screenX - centerx)) *
          this.middleDiameter) /
          2 +
        this.middleDiameter / 2;
      this.innerCircle.style.top = `${y}px`;
    }

    this.deltaXPercent =
      (x - this.middleDiameter / 2) / (this.middleDiameter / 2);
    this.deltaYPercent =
      (y - this.middleDiameter / 2) / (this.middleDiameter / 2);
  }
  resetInnerPos() {
    this.deltaXPercent = undefined;
    this.deltaYPercent = undefined;
    this.innerCircle.style.position = "absloute";
    this.innerCircle.style.left = `${50}%`;
    this.innerCircle.style.top = `${50}%`;
    this.innerCircle.style.transform = "translate(-50%, -50%)";
  }
  handleTouch(touchCurrent) {
    touchCurrent
      ? this.handleInnerPos(touchCurrent.x, touchCurrent.y)
      : this.resetInnerPos();
  }
}
