class Sequence {
  constructor(
    image,
    frameWidth,
    frameHeight,
    framesCount,
    offset,
    whiteSpaceXPercent,
    whiteSpaceYPercent
  ) {
    this.CompressScale=.2
    this.frameWidth = frameWidth*this.CompressScale;
    this.frameHeight = frameHeight*this.CompressScale;
    this.framesCount = framesCount;
    this.whiteSpaceX = (whiteSpaceXPercent || 0) * this.frameWidth;
    this.whiteSpaceY = (whiteSpaceYPercent || 0) * this.frameHeight;
    this.image = image;
    this.offset = offset;
    this.frames = [];
    for (let i = 0; i < framesCount; i++) {
      this.frames.push({
        x: i * this.frameWidth,
        y: offset * this.frameHeight,
      });
    }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const smallWidth = this.image.width*this.CompressScale;
    const smallHeight = this.image.height*this.CompressScale;
    canvas.width = smallWidth;
    canvas.height = smallHeight;
    context.drawImage(this.image, 0, 0, smallWidth, smallHeight);
    this.image = new Image();
    this.image.src = canvas.toDataURL();
  }
}
export default Sequence;
