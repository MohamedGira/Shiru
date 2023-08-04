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
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.framesCount = framesCount;
    this.whiteSpaceX = (whiteSpaceXPercent || 0) * this.frameWidth;
    this.whiteSpaceY = (whiteSpaceYPercent || 0) * this.frameHeight;
    this.image = image;
    this.compressionScale=1
    if(this.image.width>1000||this.image.height>1000){
      let max=Math.max(this.image.width,this.image.height)
      this.compressionScale=1000/max;
    }
    this.offset = offset;
    this.compressedframeHeight = this.frameHeight*this.compressionScale;
    this.compressedframeWidth = this.frameWidth*this.compressionScale;
    this.frames = [];
    for (let i = 0; i < framesCount; i++) {
      this.frames.push({
        x: i * this.frameWidth*this.compressionScale,
        y: offset * this.frameHeight*this.compressionScale,
      });
    }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const smallWidth = this.image.width*this.compressionScale;
    const smallHeight = this.image.height*this.compressionScale;
    console.log(smallHeight,smallWidth,'quantamina')
    canvas.width = smallWidth;
    canvas.height = smallHeight;
    context.drawImage(this.image, 0, 0, smallWidth, smallHeight);
    this.image = new Image();
    this.image.src = canvas.toDataURL();
  }
}
export default Sequence;
