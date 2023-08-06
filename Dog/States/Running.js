import { PlayerSpeed } from "../Dog.js";
import { State, states } from "./State.js";

export let run = document.getElementById("runSound");
run.loop = true;
run.volume = .1;
export class Running extends State {
  constructor(player, sequence) {
    super(
      "RUNNING",
      sequence || State.generateSequence(states.RUNNING, 9),
      player
    );
    this.animationSpeed = this.player.animationSpeed;
  }
  enter() {
    super.enter();
    run.play();
  }

  handleInput(lastKey, isPress = false, deltaXPercent =undefined) {
    if (isPress) {
      deltaXPercent ===undefined&& (deltaXPercent=1);
      switch (lastKey) {
        case "left":
          this.player.animationSpeed =
            this.animationSpeed * (1 - 0.2 * deltaXPercent);
          !this.player.isoutOfScreen() &&
            this.player.setVelocityX( Math.min(PlayerSpeed *deltaXPercent,-PlayerSpeed));
          break;
        case "right":
          this.player.animationSpeed =
            this.animationSpeed * (1+ .2 * deltaXPercent);
          !this.player.isoutOfScreen() &&
            this.player.setVelocityX(Math.max(PlayerSpeed *deltaXPercent,this.player.vx));
          break;
        case "up":
          this.player.setState(states.JUMPING);
          break;
        case "down":
          this.player.setState(states.DASHING);
        case "roll":
          this.player.setState(states.ROLLING);
          break;
        case "dash":
          this.player.setState(states.DASHING);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.animationSpeed = this.animationSpeed;
    }
    super.handleInput();
  }
  leave(){
     run.pause();
  }
}
