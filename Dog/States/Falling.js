import { PlayerSpeed } from "../Dog.js";
import { State, states } from "./State.js";

export class Falling extends State {
  constructor(player, sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.FALLING, 7),
      player
    );
  }
  enter() {
    super.enter();
  }

  handleInput(lastKey, isPress) {
    this.player.isGrounded && this.player.setState(states.RUNNING);
    if (isPress)
      switch (lastKey) {
        case "left":
          !this.player.isoutOfScreen() &&
            this.player.setVelocityX(-PlayerSpeed);
          break;
        case "right":
          !this.player.isoutOfScreen() && this.player.setVelocityX(PlayerSpeed);
          break;
        case "down":
          this.player.setVelocityY(20);
          this.player.setState(states.ROLLING);
          break;
        case "roll":
          this.player.setState(states.ROLLING);
          break;
        case "dash":
          this.player.setState(states.DASHING);
      }
    super.handleInput();
  }
}
