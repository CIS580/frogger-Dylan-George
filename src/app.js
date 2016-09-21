"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Semi = require('./semi.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: canvas.height/2 - 32})

var semis = [];
var semi_timer = 0;
var semi_rate = 200;

//Need to initially place several vehicles in game

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
	semi_timer++;

	if(semi_timer > semi_rate)
	{
		semi_timer = 0;
		var semi = new Semi({x: 64, y: -192, direction: 1});
		semis.push(semi);
	}
	player.update(elapsedTime);
	semis.forEach(function(semi) {
    semi.update(elapsedTime);
	});
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
	ctx.drawImage(game.background, 0, 0);
	player.render(elapsedTime, ctx);
	semis.forEach(function(semi) {
	semi.render(elapsedTime, ctx);
	});
}
