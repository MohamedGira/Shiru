import Sequence from "../../utils/Sequence.js";

export const states = {
  STANDING: 0,
  JUMPING: 1,
  FALLING: 2,
  RUNNING: 3,
  DAZED: 4,
  SITTING: 5,
  ROLLING: 6,
  DASHING: 7,
  DYING: 8,
  CHILLING: 9,
};

const dog = document.getElementById('dogImg')
export class State {
  constructor(name, sequence, player) {
    this.name = name;
    this.player = player;
    this.sequence = sequence;
    this.number;
  }
  //only for dog now, will be cahnged later
  static generateSequence(
    index,
    framesCount,
    options = { whiteSpaceXPercent: 0.4, whiteSpaceYPercent: 0.4 }
  ) {
    return new Sequence(
      dog,
      575,
      525,
      framesCount,
      index,
      options.whiteSpaceXPercent || 0.4,
      options.whiteSpaceYPercent || 0.4
    );
  }
  enter() {
    this.player.sequence = this.sequence;
    this.player.index=0;
    this.handleInput();

  }
  handleInput() {
    this.player.lives.lives<=0&&this.player.currentStateIndex!=states.DYING&&this.player.setState(states.DYING);
  }
  leave(){}
}
