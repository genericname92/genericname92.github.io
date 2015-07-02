(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }
  var GameView = Asteroids.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
    this.timerId = null;
  };
  GameView.prototype.start = function () {
    key('space', function(){ return false });
    var gameView = this;
    this.timerId = setInterval(
      function () {
        gameView.game.step();
        gameView.game.draw(gameView.ctx);
        if (gameView.game.lifeCounter === 0){
          gameView.stop();
        }
      }, 1000 / Asteroids.Game.FPS
    );
    this.ship.toggleInvulnerable();
  };

  GameView.prototype.stop = function () {
    this.game.gameOver();
    this.game.updateGameStatus();
    document.getElementById("gameOver").innerHTML = "Game Over!\n Your score was " + this.game.score + "\n";
    setTimeout(function(){
      clearInterval(this.timerId);
    }.bind(this), 3000);
  };
})();
