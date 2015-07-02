(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }
  var Util = Asteroids.Util = {};

  // Normalize the length of the vector to 1, maintaining direction.
  var dir = Util.dir = function (vec) {
    if (vec[0] === 0 && vec[1] === 0){
      return [0, 0];
    }
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  };

  // Find distance between two points.
  var dist = Util.dist = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

  // Find the length of the vector.
  var norm = Util.norm = function (vec) {
    return Util.dist([0, 0], vec);
  };

  // Return a randomly oriented vector with the given length.
  var randomVec = Util.randomVec = function (length) {
    var deg = 2 * Math.PI * Math.random();
    return scale([Math.sin(deg), Math.cos(deg)], length);
  };

  // Scale the length of a vector by the given amount.
  var scale = Util.scale = function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  //spawns on edges only
  Util.spawnLocation = function(game){
    var edges = [
      function(){
        var pos = [0];
        pos.push(game.DIM_Y * Math.random());
        return pos;
      },

      function(){
        var pos = [game.DIM_X];
        pos.push(game.DIM_Y * Math.random());
        return pos;
      },

      function(){
        var pos = [];
        pos.push(game.DIM_X * Math.random());
        pos.push(0);
        return pos;
      },

      function(){
        var pos = [];
        pos.push(game.DIM_X * Math.random());
        pos.push(game.DIM_Y);
        return pos;
      }
    ]

    return edges[Math.floor(edges.length * Math.random())]();
  };
})();
