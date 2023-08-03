import { State, states } from "./State.js";

export class Dying extends State {
  constructor(player,sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.DYING, 12),
      player
    );
  }
  enter() {
    this.player.setVelocityX(-3.6);
    super.enter();
  }

  handleInput() {    super.handleInput();

    if(Math.floor(this.player.index*this.player.animationSpeed)>=this.sequence.framesCount-1)
      this.player.index--;
  }
}