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
    this.player.setVelocityX(-4.2);
    super.enter();
  }

  handleInput() {
    super.handleInput();
    if(this.player.index>=this.sequence.framesCount-1)
      this.player.index=this.sequence.framesCount-1
  }
}
