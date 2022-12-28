export class InputHandler {
  constructor(game) {
    this.game = game;

    this.keys = [];

    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrorRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      }

      console.log(e.key, this.keys);
    });

    window.addEventListener("keyup", (e) => {
      console.log(e.key);

      if (
        e.key === "ArrowDown" ||
        e.key === "ArrorRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}
