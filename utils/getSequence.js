import Sequence from "../Sequence.js";


export function getSequence(
  imgsrc,
  frameWidth,
  frameHeight,
  framesCount,
  offset
) {
  console.log("loading")
  let image = new Image();
  image.src = imgsrc;
  let sequence = new Sequence(
    image,
    frameWidth,
    frameHeight,
    framesCount,
    offset
  );
  return sequence
}
