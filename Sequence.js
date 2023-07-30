class Sequence {
  constructor(image,frameWidth, frameHeight, framesCount, offset,whiteSpaceXPercent,whiteSpaceYPercent) {
    /* */
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.framesCount = framesCount;
    this.whiteSpaceX=(whiteSpaceXPercent||0)*this.frameWidth;
    this.whiteSpaceY=(whiteSpaceYPercent||0)*this.frameHeight;
    this.image = image;
    this.offset = offset;
    this.frames = [];
    for (let i = 0; i < framesCount; i++) {
      this.frames.push({
        x: i * this.frameWidth,
        y: offset * this.frameHeight,
      });
    }
  }
}
export default Sequence;
