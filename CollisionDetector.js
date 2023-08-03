export class CollisionDetector {
  static detectCollesion(a, b, event) {
    /*
    detects collision between 2 Drawables, emmits "event" on collision 
    */
    let aXStart, aXEnd, aYStart, aYEnd, bXStart, bXEnd, bYStart, bYEnd;

    /* function animate() {
      a.canvas.fillStyle = "green";
      a.canvas.fillRect(bXStart, bYStart, bXEnd - bXStart, bYEnd - bYStart);
        requestAnimationFrame(animate);
    }
    animate(); */
    let interval=setInterval(() => {
      aXStart = a.px + (a.sequence.whiteSpaceX * a.scale) / 2;
      aXEnd = aXStart + a.physicalWidth;
      aYStart = a.py + (a.sequence.whiteSpaceY * a.scale) / 2;
      aYEnd = aYStart + a.physicalHeight;

      bXStart = b.px + (b.sequence.whiteSpaceX * b.scale) / 2;
      bXEnd = bXStart + b.physicalWidth;
      bYStart = b.py + (b.sequence.whiteSpaceY * b.scale) / 2;
      bYEnd = bYStart + b.physicalHeight;
      if (
        aXStart > bXEnd || // x: a begin after my end
        aXEnd < bXStart || // x: a end befire my begin
        aYStart > bYEnd || // y: a begin after my end
        aYEnd < bYStart // y: a end befire my begin
      ) {
      } else {
        document.dispatchEvent(event);
        clearInterval(interval);
      }
    }, 40);
  }
}
