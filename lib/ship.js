(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  function randomColor() {
    var hexDigits = "0123456789ABCDEF";

    var color = "#";
    for (var i = 0; i < 3; i ++) {
      color += hexDigits[Math.floor((Math.random() * 16))];
    }

    return color;
  }

  var Ship = Asteroids.Ship = function (options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    this.firedRecently = false;
    this.invulnerable = false;
    this.frameCounter = 0;
    Asteroids.MovingObject.call(this, options)
  };

  Ship.RADIUS = 15;

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.fireBullet = function () {
    if (this.firedRecently){
      return;
    }
    this.game.playSoundEffect("sound/fire.wav");
    var norm = Asteroids.Util.norm(this.vel);

    if (norm == 0) {
      // Can't fire unless moving.
      return;
    }

    var relVel = Asteroids.Util.scale(
      Asteroids.Util.dir(this.vel),
      Asteroids.Bullet.SPEED
    );

    var bulletVel = [
      relVel[0] + this.vel[0], relVel[1] + this.vel[1]
    ];

    var bullet = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVel,
      color: this.color,
      game: this.game,
      owner: this
    });

    this.game.add(bullet);
    this.firedRecently = true;
    setTimeout(function(){
      this.firedRecently = false;
    }.bind(this), 200);
  };


    Ship.prototype.power = function(impulse){
      var MAX_SHIP_SPEED = 9;
      if ((impulse[0] < 0 && this.vel[0] > 0) || (impulse[0] > 0 && this.vel[0] < 0)){
        this.vel[0] = impulse[0];
      }
      else if ((impulse[0] > 0 && this.vel[0] <= MAX_SHIP_SPEED) || (impulse[0] < 0 && this.vel[0] >= MAX_SHIP_SPEED * -1) ){
        this.vel[0] += impulse[0];
      }
      if ((impulse[1] < 0 && this.vel[1] > 0) || (impulse[1] > 0 && this.vel[1] < 0)){
        this.vel[1] = impulse[1];
      }
      else if ((impulse[1] > 0 && this.vel[1] <= MAX_SHIP_SPEED) || (impulse[1] < 0 && this.vel[1] >= -1 * MAX_SHIP_SPEED) ){
        this.vel[1] += impulse[1];
      }
    };
  Ship.prototype.relocate = function () {
    if (this.invulnerable){
      return;
    }
    this.game.loseShipLife();
    if (this.game.lifeCounter > 0){
      this.pos = this.game.randomPosition();
      this.vel = [0, 0];
      this.toggleInvulnerable();
    } else {
      for (var i = 0; i < 8; i++){
        var rubble = new Asteroids.Asteroid({ game: this.game, pos: this.pos, radius: 3, color: this.color, isWrappable: false });
        this.game.add(rubble);
      }
      this.game.remove(this);
    }

  };

  Ship.prototype.toggleInvulnerable = function () {
    this.invulnerable = true;
    setTimeout(function(){
      this.invulnerable = false;
      this.frameCounter = 0;
    }.bind(this), 4000);
  }

  Ship.prototype.draw = function(ctx){
    if (this.invulnerable){
      var FPS = Asteroids.Game.FPS;
      this.frameCounter = (this.frameCounter + 1) % FPS;
      if ((this.frameCounter > FPS / 8 && this.frameCounter <= FPS / 4) ||
        (this.frameCounter > FPS / (3/8) && this.frameCounter <= FPS / 2) ||
        (this.frameCounter > FPS / (5/8) && this.frameCounter <= FPS / (3/4)) ||
        (this.frameCounter > FPS / (7/8))){
        return;
      }
    }
    var r = this.radius;
    var direction = Asteroids.Util.dir(this.vel);
    //kinda hacky way of ensuring render of ship when it's not moving
    if (direction[0] === 0 && direction[1] === 0){
      direction = [0, -1];
    }
    var perp1 = [-1 * direction[1], direction[0]];
    var perp2 = [direction[1], -1 * direction[0]];
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "white";
    var tipPoint = [
      (this.pos[0] + direction[0] * r),
      (this.pos[1] + direction[1] * r)
    ];
    var nextPoint = [
      (tipPoint[0] - perp1[0] * r - direction[0] * 2 * r),
      (tipPoint[1] - perp1[1] * r - direction[1] * 2 * r)
    ];
    var thirdPoint = [
      (tipPoint[0] - perp2[0] * r - direction[0] * 2 * r),
      (tipPoint[1] - perp2[1] * r - direction[1] * 2 * r)
    ];
    ctx.moveTo(tipPoint[0], tipPoint[1]);
    ctx.lineTo(nextPoint[0], nextPoint[1]);
    ctx.lineTo(thirdPoint[0], thirdPoint[1]);
    ctx.lineTo(tipPoint[0], tipPoint[1]);
    ctx.fill();
  };
})();
