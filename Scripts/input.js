//This job is to handle inputs from the user
export class InputHandler {
  // all this code is inside a constructor, and since we are adding event listeners
  //Mujna qeshtu me ja bo, qe kur do qe krijohet, fillon punen meniher
  constructor(game) {
    this.game = game;
    this.lastKey = "";

    //We bind this.lastKey via arrow functions.
    //They do it automatically, via "Lexical scoping"
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.lastKey = "PRESS left";
          break;

        case "ArrowUp":
          this.lastKey = "PRESS up";
          break;

        case "ArrowDown":
          this.lastKey = "PRESS down";
          break;

        case "ArrowRight":
          this.lastKey = "PRESS right";
          break;

        case "Control":
          this.lastKey = "PRESS control";
          break;
        case "d":
          this.game.debug = !this.game.debug;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.lastKey = "RELEASE left";
          break;

        case "ArrowUp":
          this.lastKey = "RELEASE up";
          break;

        case "ArrowDown":
          this.lastKey = "RELEASE down";
          break;

        case "ArrowRight":
          this.lastKey = "RELEASE right";
          break;
      }
    });
  }
}
