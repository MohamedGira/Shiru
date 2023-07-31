export class Physical {
  constructor(px = 0, py = 0, vx = 0, vy = 0, ax = 0, ay = 0) {
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;

    setInterval(() => {
      this.px += this.vx;
      this.py += this.vy;
      this.vx += this.ax;
      this.vy += this.ay;
    }, 1000 / 60);
  }
  setPosition(x, y) {
    this.px = x;
    this.py = y;
  }
  setAcceleration(x,y){
    this.ax=x;
    this.ay=y;
  }
  setVelocity(x, y) {
    this.vx = x;
    this.vy = y;
  }
  setpositionX(x) {
    this.px = x;
  }
  setpositionY(y) {
    this.py = y;
  }
  changeVelocity(dx = 0, dy = 0) {
    this.vx += dx;
    this.vy += dy;
  }
  setVelocityX(dx) {
    this.vx = dx;
  }
  setVelocityY(dy) {
    this.vy = dy;
  }
  noiseMoveX(strengthx = 1) {
    this.changeVelocity(Math.random() * strengthx - strengthx / 2, 0);
  }
  noiseMoveY(strengthy = 1) {
    this.changeVelocity(0, Math.random() * strengthy - strengthy / 2);
  }
  oscillateX(amplitude = 1, speedMs = 50) {
    let i = 0;
    setInterval(() => {
      this.setVelocityX(Math.sin((i++ * 180) / 3.14) * amplitude);
      this.noiseMoveX(amplitude * 0.6);
    }, speedMs);
  }
  oscillateY(amplitude = 1, speedMs = 1) {
    let i = 0;
    setInterval(() => {
      this.setVelocityY(Math.sin((i++ * 180) / 3.14) * amplitude);
    }, speedMs);
  }
  
}
