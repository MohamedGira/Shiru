import Sequence from "./Sequence.js";


export function getSequence(
  imgId,
  frameWidth,
  frameHeight,
  framesCount,
  offset
) {
  while(document.getElementById(imgId)==null);
  let sequence = new Sequence(
    document.getElementById(imgId),
    frameWidth,
    frameHeight,
    framesCount,
    offset
  );
  return sequence
}
