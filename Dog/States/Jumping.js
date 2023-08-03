import { PlayerSpeed } from "../Dog.js";
import { State, states } from "./State.js";

export class Jumping extends State {
  constructor(player, sequence) {
    super(
      "JUMPING",
      sequence || State.generateSequence(states.JUMPING, 7),
      player
    );
  }
  enter() {
    this.player.jump()
    super.enter();
  }

  handleInput(lastKey, isPress) {
    if (this.player.vy > 0) this.player.setState(states.FALLING);
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
          this.player.setVelocityY(5);
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
