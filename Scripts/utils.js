/** @type {HTMLCanvasElement} **/

export function drawStatustext(context, game, player) {
  context.font = "50px Helvetica";
  context.fillText("Score  : " + game.score, 20, 50);

  context.fillText("Health  : " + player.health, 20, 100);
}
