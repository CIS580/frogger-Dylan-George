"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, instructions, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  this.background = new Image();
  this.background.src = 'assets/background.png';
  
  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  //Create the instruction box
  this.instructionsCtx = instructions.getContext('2d');
  this.instructionsCtx.font = "30px Arial";
  this.instructionsCtx.fillText("Instructions", 350, 50);
  this.instructionsCtx.font = "20px Arial";
  this.instructionsCtx.fillText("Use the Arrow Keys or WASD to move.", 250, 125);
  this.instructionsCtx.fillText("Try to reach the end, but be careful. Not only are the vehicles deadly,", 120, 160);
  this.instructionsCtx.fillText("but the threat of drowning also terrifies this frog.", 215, 195)

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}
