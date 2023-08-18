export class Button {
  constructor(
    img,
    bottom,
    right,
    onClick,
    options = { width: 10 }
  ) {
    options = { width: 10, ...options };
    this.right = right;
    this.bottom = bottom;
    this.element = document.createElement("button");
    this.img=img.cloneNode(true);
    this.img.style.width = `${options.width}px`;
    this.img.style.aspectRatio = 1;
    this.element.style.position = "absolute";
    this.element.style.right = `${right}px`;
    this.element.style.bottom = `${bottom}px`;
    this.element.classList.add("gamebutton");
    this.element.addEventListener("touchstart", onClick);
    this.element.appendChild(this.img);
    this.radius=options.width/2;
  }
  updateHtml(canvasWidth){
    this.radius=canvasWidth/20;
    this.img.style.width=`${this.radius*2}px`;
  }
}
