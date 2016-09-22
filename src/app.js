"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Semi = require('./semi.js');
const Racer = require('./racer.js');
const Mini = require('./mini.js');
const Van = require('./van.js');
const EntityManager = require('./entity-manager.js');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 64, canvas.height);
var lives = 3;

var player = new Player({x: 0, y: 256})
entities.addEntity(player);

var semis = [];
var semi_rate = 250;
var semi_timer = semi_rate;

var racers = [];
var racer_rate = 150;
var racer_timer = racer_rate;

var minis = [];
var mini_rate = 100;
var mini_timer = mini_rate;

var vans = [];
var van_rate = 150;
var van_timer = van_rate;
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
	racer_timer++;
	mini_timer++;
	van_timer++;
	
	if(player.state == "dead" && lives > 0)
	{
		player.newPlayer();
		//lives--;
	}
	
	
	if(semi_timer > semi_rate)
	{
		semi_timer = 0;
		var semi = new Semi({x: 64, y: -192, direction: 1});
		semis.push(semi);
		entities.addEntity(semi);
	}
	if(racer_timer > racer_rate)
	{
		racer_timer = 0;
		var racer = new Racer({x: 128, y: -64, direction: 1});
		var racer2 = new Racer({x: 320, y: canvas.height + 64, direction: -1});
		racers.push(racer);
		racers.push(racer2);
		entities.addEntity(racer);
	    entities.addEntity(racer2);
	}
	if(mini_timer > mini_rate)
	{
		mini_timer = 0;
		var mini = new Mini({x: 192, y: -64, direction: 1});
		var mini2 = new Mini({x: 448, y: canvas.height + 64, direction: -1});
		minis.push(mini);
		minis.push(mini2);
		entities.addEntity(mini);
	    entities.addEntity(mini2);
	}
	if(van_timer > van_rate)
	{
		van_timer = 0;
		var van = new Van({x: 384, y: -128, direction: 1});
		vans.push(van);
		entities.addEntity(van);
	}
	
	player.update(elapsedTime);
	entities.updateEntity(player);
	
	semis.forEach(function(semi) {
		semi.update(elapsedTime);
		entities.updateEntity(semi);
	});
	racers.forEach(function(racer) {
		racer.update(elapsedTime);
		entities.updateEntity(racer);
	});
	minis.forEach(function(mini) {
		mini.update(elapsedTime);
		entities.updateEntity(mini);
	});
	vans.forEach(function(van) {
		van.update(elapsedTime);
		entities.updateEntity(van);
	});
	
	//Entities can only collide with the player, not each other
	entities.collide(function(entity1, entity2) {
		if(entity1.name == "car" || entity2.name == "car")
		{
			if(player.state != "dead") player.state = "dying";
		}
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
	if(!(player.state == "dying")) player.render(elapsedTime, ctx);
	semis.forEach(function(semi) {
		semi.render(elapsedTime, ctx);
	});
	racers.forEach(function(racer) {
		racer.render(elapsedTime, ctx);
	});
	minis.forEach(function(mini) {
		mini.render(elapsedTime, ctx);
	});
	vans.forEach(function(van) {
		van.render(elapsedTime, ctx);
	});
	if(player.state == "dying") player.render(elapsedTime, ctx);

}
