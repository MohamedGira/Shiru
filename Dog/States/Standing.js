import { PlayerSpeed } from "../Dog.js";
import { State, states } from "./State.js";

export class Standing extends State {
  constructor(player, sequence) {
    super(
      "STANDING",
      sequence || State.generateSequence(states.STANDING, 7),
      player
    );
  }
  enter() {
    this.player.setVelocityX(0);
    super.enter();
  }

  handleInput(lastKey, isPress=false) {
      if (isPress)
      switch (lastKey) {
        case "down":
          this.player.setState(states.SITTING);
          break;
        case "left":
          this.player.setState(states.RUNNING);
          !this.player.isoutOfScreen() && this.player.setVelocityX(-PlayerSpeed);
          break;
        case "right":
          this.player.setState(states.RUNNING);
          !this.player.isoutOfScreen() && this.player.setVelocityX(PlayerSpeed);
          break;
        case "up":
          this.player.setState(states.JUMPING);
          break;
        case "roll":
          this.player.setState(states.ROLLING);
          break;
        case "dash":
          this.player.setState(states.DASHING);
      }
  }
}
