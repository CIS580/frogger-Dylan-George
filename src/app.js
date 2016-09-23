"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Semi = require('./semi.js');
const Racer = require('./racer.js');
const Mini = require('./mini.js');
const Van = require('./van.js');
const EntityManager = require('./entity-manager.js');
const FullLog = require('./long_log.js');
const ShortLog = require('./short_log.js');
const Turtle = require('./turtle.js');

/* Global variables */
var canvas = document.getElementById('screen');
var instructions = document.getElementById('instructions');
var game = new Game(canvas, instructions, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 64, canvas.height);
var lives = 3;

var player = new Player({x: 0, y: 320});
entities.addEntity(player);

//Each entity has an array of each one on screen, a rate at which they spawn, and timer for spawn timing
var semis = [];
var semi_rate = 250;
var semi_timer = semi_rate;

var racers = [];
var racer_rate = 150;
var racer_timer = racer_rate;

var minis = [];
var mini_rate = 80;
var mini_timer = mini_rate;

var vans = [];
var van_rate = 180;
var van_timer = van_rate; 

var fullLogs = [];
var fullLog_rate = 300;
var fullLog_timer = fullLog_rate;

var shortLogs = [];
var shortLog_rate = 300;
var shortLog_timer = shortLog_rate;

var turtles = [];
var turtle_rate = 300;
var turtle_timer = turtle_rate;

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
	//Update the spawn timers for each obstacle
	semi_timer++;
	racer_timer++;
	mini_timer++;
	van_timer++;
	fullLog_timer++;
	shortLog_timer++;
	turtle_timer++;
	
	//Handle Respawning/Game over
	if(player.state == "dead")
	{
		if(lives > 0)
		{
		player.newPlayer();
		//lives--;
		}
		else
		{
		
		}
	}
	
	//Add certain vehicles if enough time has passed
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
	if(fullLog_timer > fullLog_rate)
	{
		fullLog_timer = 0;
		var fullLog = new FullLog({x: 704, y: canvas.height, direction: -1});
		fullLogs.push(fullLog);
		entities.addEntity(fullLog);
	}
	if(shortLog_timer > shortLog_rate)
	{
		shortLog_timer = 0;
		var shortLog = new ShortLog({x: 640, y: -128, direction: 1});
		shortLogs.push(shortLog);
		entities.addEntity(shortLog);
	}
	if(turtle_timer > turtle_rate)
	{
		turtle_timer = 0;
		var turtle = new Turtle({x: 576, y: canvas.height, direction: -1});
		turtles.push(turtle);
		entities.addEntity(turtle);
	}
	
	//Update all entities, removing ones that no longer serve a purpose
	player.update(elapsedTime);
	entities.updateEntity(player);
	
	updateShorter(semis, elapsedTime);
	updateShorter(racers, elapsedTime);
	updateShorter(minis, elapsedTime);
	updateShorter(vans, elapsedTime);
	updateShorter(fullLogs, elapsedTime);
	updateShorter(shortLogs, elapsedTime);
	updateShorter(turtles, elapsedTime);
	
	//Collision Handling
	//Entities can only collide with the player, not each other
	entities.collide(function(entity1, entity2) {
		if(entity1.name == "car" || entity2.name == "car")
		{
			if(player.state != "dead") player.state = "dying";
		}
		else if(entity1.name == "log" || entity2.name == "log")
		{
			var moving;
			if(entity1.name != "player")
			{			
				moving = entity1;
				player = entity2;
			}
			else 
			{
				moving = entity2;
				player = entity1;
			}
			
			player.floatSpeed = moving.direction * moving.speed * elapsedTime/100;
			if(player.state != "moving") player.isFloating = true;
		}
		else if(entity1.name == "turtle" || entity2.name == "turtle")
		{
			var moving;
			var frog;
			if(entity1.name != "player") 
			{
				moving = entity1;
				frog = entity2;
			}
			else 
			{
				moving = entity2;
				frog = entity1;
			}
			if(moving.state == "up" || moving.state == "rising")
			{
				frog.floatSpeed = moving.direction * moving.speed * elapsedTime/100;
				if(frog.state != "moving") frog.isFloating = true;
			}
			else
			{
				if(frog.state != "dead" && frog.state != "dying") frog.state = "dying";
			}
		}
	});
	
	//Check to see if player won or has drowned
	if(player.x > 512)
	{	
	
		console.log(player.x);
		var adjustedY = player.height * Math.floor((player.y+player.height/2)/player.height);
		if(player.x >= 768 && (Math.floor(adjustedY/64) % 2) == 0)
		{
			//Win
		}
		else if(!player.isFloating && player.state == "idle")
		{
			//Drown
			player.state = "dying";
		}
	}
}

//Function to make update function have less repetition
function updateShorter(entityArray, elapsedTime)
{
	entityArray.forEach(function(entity, i){
	entity.update(elapsedTime);
	if(entity.destroy) 
	{
		entityArray.splice(i,1);
		entities.removeEntity(entity);
	}
	else entities.updateEntity(entity);
	});
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
	//Render all entities. Player is below cars, above water entities. and death animation is on top of everything
	fullLogs.forEach(function(fullLog) {
		fullLog.render(elapsedTime, ctx);
	});
	shortLogs.forEach(function(shortLog)
	{
		shortLog.render(elapsedTime, ctx);
	});
	turtles.forEach(function(turtle)
	{
		turtle.render(elapsedTime, ctx);
	});
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
