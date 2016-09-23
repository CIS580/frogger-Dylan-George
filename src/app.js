/* app.js
 * Main js file for Frogger game.
 * Author: Dylan George
 */

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
var level = 1;
var lives = 3;
var score = 0;
var lost = false;
var speedMultiplier = 1;

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
	if(!lost)
	{
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
			lives--;
			if(lives > 0)
			{
				player.newPlayer();
			}
			else 
			{
				lost = true;
				player.state = "game over";
			}
		}
		
		//Add certain vehicles if enough time has passed
		if(semi_timer > semi_rate)
		{
			semi_timer = 0;
			var semi = new Semi({x: 64, y: -192, direction: 1}, speedMultiplier);
			semis.push(semi);
			entities.addEntity(semi);
		}
		if(racer_timer > racer_rate)
		{
			racer_timer = 0;
			var racer = new Racer({x: 128, y: -64, direction: 1}, speedMultiplier);
			var racer2 = new Racer({x: 320, y: canvas.height + 64, direction: -1}, speedMultiplier);
			racers.push(racer);
			racers.push(racer2);
			entities.addEntity(racer);
			entities.addEntity(racer2);
		}
		if(mini_timer > mini_rate)
		{
			mini_timer = 0;
			var mini = new Mini({x: 192, y: -64, direction: 1}, speedMultiplier);
			var mini2 = new Mini({x: 448, y: canvas.height + 64, direction: -1}, speedMultiplier);
			minis.push(mini);
			minis.push(mini2);
			entities.addEntity(mini);
			entities.addEntity(mini2);
		}
		if(van_timer > van_rate)
		{
			van_timer = 0;
			var van = new Van({x: 384, y: -128, direction: 1}, speedMultiplier);
			vans.push(van);
			entities.addEntity(van);
		}
		if(fullLog_timer > fullLog_rate)
		{
			fullLog_timer = 0;
			var fullLog = new FullLog({x: 704, y: canvas.height, direction: -1}, speedMultiplier);
			fullLogs.push(fullLog);
			entities.addEntity(fullLog);
		}
		if(shortLog_timer > shortLog_rate)
		{
			shortLog_timer = 0;
			var shortLog = new ShortLog({x: 640, y: -128, direction: 1}, speedMultiplier);
			shortLogs.push(shortLog);
			entities.addEntity(shortLog);
		}
		if(turtle_timer > turtle_rate)
		{
			turtle_timer = 0;
			var turtle = new Turtle({x: 576, y: canvas.height, direction: -1}, speedMultiplier);
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
				if(!(entity1.name == "car" && entity2.name == "car"))
				{
					if(player.state != "dead" && player.state != "dying" && player.state != "game over") player.state = "dying";
				}
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
				
				player.floatSpeed = moving.direction * moving.speed * moving.speedMultiplier * elapsedTime/100;
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
					frog.floatSpeed = moving.direction * moving.speed * moving.speedMultiplier * elapsedTime/100;
					if(frog.state != "moving") frog.isFloating = true;
				}
				else
				{
					if(frog.state != "dead" && frog.state != "dying" && frog.state != "game over") frog.state = "dying";
				}
			}
		});
		
		//Check to see if player won or has drowned
		if(player.x > 512)
		{	
			var adjustedY = player.height * Math.floor((player.y+player.height/2)/player.height);
			if(player.x >= 768 && (Math.floor(adjustedY/64) % 2) == 0)
			{
				//Win
				score += 50;
				lives = 3;
				level++;
				//speed up the obstacles
				speedMultiplier*=1.1;
				player.newPlayer();
			}
			else if(!player.isFloating && player.state == "idle")
			{
				//Drown
				player.state = "dying";
			}
		}
	}
	else 
	{
		if(player.state == "restart")
		{
			lost = false;
			score = 0;
			level = 1;
			lives = 3;
			speedMultiplier = 1;
			player.newPlayer();
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
	
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.fillRect(0, canvas.height-40, canvas.width, 40);
	ctx.fillStyle = 'black';
	ctx.font = "25px Arial"; 
	ctx.fillText("Lives: "+ lives, 10, canvas.height-10);
	ctx.fillText("Score: " + score, canvas.width - 150, canvas.height-10);
	ctx.fillText("Level: " + level, canvas.width - 275, canvas.height-10);
	
	if(lost)
	{
		ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
		ctx.fillRect(0, canvas.height/4, canvas.width, 320);
		ctx.fillStyle = 'black';
		ctx.font = "40px Arial"; 
		ctx.fillText("Game over :(", canvas.width/3 + 5, canvas.height/3 + 60);
		ctx.fillText("Press Space to try again.", canvas.width/5 + 20, canvas.height/3+140);
	}
	
}
