(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./entity-manager.js":2,"./game.js":3,"./long_log.js":4,"./mini.js":5,"./player.js":6,"./racer.js":7,"./semi.js":8,"./short_log.js":9,"./turtle.js":10,"./van.js":11}],2:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize, heightSize) {
  this.cellSize = cellSize;
  this.heightSize = heightSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / heightSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.heightSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x + entity.width/2, entity.y + entity.height/2);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){

  var index = getIndex.call(this, entity.x + entity.width/2, entity.y + entity.height/2);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.collide = function(callback) {
  this.cells.forEach(function(cell) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
		//console.log(entity1._cell);
        if(entity1 != entity2) checkForCollision(entity1, entity2, callback);
      });
    });
  });
}

//The collision boxes have a slight padding so collisions feel more fair
function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width - 10 < entity2.x ||
                   entity1.x > entity2.x + entity2.width - 10 ||
                   entity1.y + entity1.height - 10 < entity2.y ||
                   entity1.y > entity2.y + entity2.height - 10);
  if(collides) {
    callback(entity1, entity2);
  }
} 

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the FullLog class
 */
module.exports = exports = FullLog;

/**
 * @constructor FullLog
 * Creates a new FullLog object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function FullLog(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 192;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/long_log_sprites.png';

	this.name = "log";
	this.speed = 7;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
}

/**
 * @function updates the FullLog object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
FullLog.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	if(this.y < -192) this.destroy = true;
}

/**
 * @function renders the FullLog into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
FullLog.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	0, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;

/**
 * @module exports the Mini class
 */
module.exports = exports = Mini;

/**
 * @constructor Mini
 * Creates a new Mini object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function Mini(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 64;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/mini_sprites.png';

	this.name = "car";
	this.speed = 20;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
	if(this.direction == 1)this.frame = 0;
	else this.frame = 1;
}

Mini.prototype.nextLevel = function()
{
	this.speed *= 1.5;
}

/**
 * @function updates the Mini object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Mini.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	if((this.direction == -1 && this.y < -64) || this.direction == 1 && this.y > 704) this.destroy = true;
}

/**
 * @function renders the Mini into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Mini.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	this.frame * 64, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;
const BLINK_MS_PER_FRAME = 1000/4;
const DEATH_MS_PER_FRAME = 1000/6;
/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
	this.state = "idle";
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 64;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/frog_spritesheet.png';
	this.timer = 0;
	this.frame = 0;

	this.name = "player";
	this.speed = 4;
	this.moveTimer = 0;	
	this.moveDelayTime = 150;	
	//Is it finishing a hop
	this.stillMoving = false;
	//Is it hopping again
	this.movingAgain = false;
	//Vars to make blink animation independent 
	this.blinkDelay = 0;
	this.blinkTimer = 0;
	this.blinkFrame = 0;
	
	//Frame modifiers for directional sprites
	this.directionFrame = 0;
	this.nextDirectionFrame = 0;
	
	//Variables for death animation
	this.deathTimer = 0;
	this.deathFrame = 0;
	
	this.isFloating = false;
	this.floatSpeed = 0;
	
	this.collision = false;
	
	//Which direction is it hopping
	this.currentDirection = 
	{
		up: false,
		down: false,
		left: false,
		right: false
	}
	
	//If hopping again, which direction
	this.nextDirection = 
	{
		up: false,
		down: false,
		left: false,
		right: false
	}
	
	var self = this;
	window.onkeydown = function(event)
	{
		//Space to restart
		if(event.keyCode == 32)
		{	
			if(self.state == "game over")
			{
				self.state = "restart";
			}
			event.preventDefault();
		}
		if(self.state != "game over")
		{
			switch(event.keyCode)
			{
				//up
				case 38:
				case 87:
					if(!(self.state == "dying") && !(self.state == "dead"))
					{
						if (!self.stillMoving) 
						{
							self.currentDirection.up = true;
							self.directionFrame = 3;
							self.stillMoving = true;
							self.state = "moving";
						}
						self.nextDirection.up = true;
						self.nextDirectionFrame = 3;
						self.movingAgain = true;
					}
					event.preventDefault();
					break;
				//down
				case 40:
				case 83:
					if(!(self.state == "dying") && !(self.state == "dead"))
					{
						if (!self.stillMoving) 
						{
							self.currentDirection.down = true;
							self.directionFrame = 1;
							self.stillMoving = true;
							self.state = "moving";
						}
						self.nextDirection.down = true;
						self.nextDirectionFrame = 1
						self.movingAgain = true;
					}
					event.preventDefault();
					break;
				//left
				case 37:
				case 65:
					if(!(self.state == "dying") && !(self.state == "dead"))
					{
						if (!self.stillMoving) 
						{
							self.currentDirection.left = true;
							self.directionFrame = 2;
							self.stillMoving = true;
							self.state = "moving";
						}
						self.nextDirection.left = true;
						self.nextDirectionFrame = 2;
						self.movingAgain = true;
					}
					event.preventDefault();
					break;
				//right
				case 39:
				case 68:
					if(!(self.state == "dying") && !(self.state == "dead"))
					{
						if (!self.stillMoving) 
						{
							self.currentDirection.right = true;
							self.directionFrame = 0;
							self.stillMoving = true;
							self.state = "moving";
						}
						self.nextDirection.right = true;
						self.nextDirectionFrame = 0;
						self.movingAgain = true;
					}
					event.preventDefault();
					break;
			}
		}
	}
	
	window.onkeyup = function(event)
	{
		switch(event.keyCode)
		{
			//up
			case 38:
			case 87:
				self.nextDirection.up = false;
				self.nextDirectionFrame = self.directionFrame;
				self.movingAgain = false;
				event.preventDefault();
				break;
			//down
			case 40:
			case 83:
				self.nextDirection.down = false;
				self.nextDirectionFrame = self.directionFrame;
				self.movingAgain = false;
				event.preventDefault();
				break;
			//left
			case 37:
			case 65:
				self.nextDirection.left = false;
				self.nextDirectionFrame = self.directionFrame;
				self.movingAgain = false;
				event.preventDefault();
				break;
			//right
			case 39:
			case 68:
				self.nextDirection.right = false;
				self.nextDirectionFrame = self.directionFrame;
				self.movingAgain = false;
				event.preventDefault();
				break;
		}
	}

}

Player.prototype.newPlayer = function()
{
	this.x = 0;
	this.y = 320;
	this.state = "idle";
	this.moveTimer = 0;	
	this.moveDelayTime = 150;	
	this.stillMoving = false;
	this.movingAgain = false;
	this.blinkDelay = 0;
	this.blinkTimer = 0;
	this.blinkFrame = 0;
	this.directionFrame = 0;
	this.nextDirectionFrame = 0;
	this.deathTimer = 0;
	this.deathFrame = 0;
	this.isFloating = false;
	
	this.currentDirection = 
	{
		up: false,
		down: false,
		left: false,
		right: false
	}
	
	this.currentDirection = 
	{
		up: false,
		down: false,
		left: false,
		right: false
	}
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
	case "idle":
		if(this.isFloating) this.y += this.floatSpeed;
		if(this.movingAgain) this.state = "moving";
		else
		{
			this.blinkDelay+=time;
			if (this.blinkDelay>3000)
			{
				this.blinkTimer += time;
				if(this.blinkTimer > BLINK_MS_PER_FRAME) {
					this.blinkTimer = 0;
					this.blinkFrame += 1;
					if(this.blinkFrame > 3) 
					{
						this.blinkFrame = 0;
						this.blinkDelay = 0;
					}
				}
			}
		}
		break;
	case "moving":
		this.moveTimer += time;
		if(this.moveTimer <= 1030/this.speed)
		{
		    this.timer += time;
			if(this.timer > MS_PER_FRAME) {
				this.timer = 0;
				this.frame += 1;
				if(this.frame > 3) this.frame = 0;
			}
			
			if(!this.isFloating)
			{
				if(this.currentDirection.up && !(this.y == 0)) this.y -= this.speed * this.height * time/1000;
				else if(this.currentDirection.down && !(this.y == 640)) this.y += this.speed * this.height * time/1000;
				else if(this.currentDirection.right && !(this.x == 768)) this.x += this.speed * this.width * time/1000;
				else if(this.currentDirection.left && !(this.x == 0)) this.x -=  this.speed * this.width * time/1000;
			}
			else
			{
				this.isFloating = false;
				if(this.currentDirection.up && !(this.y == 0)) this.y -= (this.speed * this.height * time/1000 - this.floatSpeed);
				else if(this.currentDirection.down && !(this.y == 640)) this.y += (this.speed * this.height * time/1000 + this.floatSpeed);
				else if(this.currentDirection.right && !(this.x == 768)) this.x += this.speed * this.width * time/1000;
				else if(this.currentDirection.left && !(this.x == 0)) this.x -=  this.speed * this.width * time/1000;
			}
		}
		else if (this.moveTimer < (1000/this.speed) + this.moveDelayTime) this.frame = 0;
		else 
		{	
			this.stillMoving = false;			
			this.moveTimer = 0;
			this.state = "idle";
			this.timer = 0;
			//Account for fractional difference between x and what x should actually be
			this.x = Math.round(this.x/64) * 64;
			this.y = Math.round(this.y);
			this.currentDirection.up = this.nextDirection.up;
			this.currentDirection.down = this.nextDirection.down;
			this.currentDirection.left = this.nextDirection.left;
			this.currentDirection.right = this.nextDirection.right;
			this.directionFrame = this.nextDirectionFrame;
		}
 
		break;
    case "dying":
		this.deathTimer += time;
		if(this.deathTimer > DEATH_MS_PER_FRAME) {
			this.deathTimer = 0;
			this.deathFrame += 1;
			if(this.deathFrame > 4) 
			{
				this.deathFrame = 0;
				this.state = "dead";
			}
		}
		break;
  }
  
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
		ctx.drawImage(
		// image
		this.spritesheet,
		// source rectangle
		this.directionFrame * 256 + this.blinkFrame * 64, 64, this.width, this.height,
		// destination rectangle
		this.x, this.y, this.width, this.height
		);
		break;
	case "moving":
		ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
		this.directionFrame * 256 + this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "dying":
		ctx.drawImage(
		// image
		this.spritesheet,
		// source rectangle
		this.deathFrame * 64, 128, this.width, this.height,
		// destination rectangle
		this.x, this.y, this.width, this.height
		);
      break;
	case "dead":
		break;
  }
}

},{}],7:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;
const BLINK_MS_PER_FRAME = 1000/4;
/**
 * @module exports the Racer class
 */
module.exports = exports = Racer;

/**
 * @constructor Racer
 * Creates a new Racer object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function Racer(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 64;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/racer_sprites.png';
	
	this.name = "car";
	this.speed = 30;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
	if(this.direction == 1)this.frame = 0;
	else this.frame = 1;
}

Racer.prototype.nextLevel = function()
{
	this.speed *= 1.5;
}

/**
 * @function updates the Racer object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Racer.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	if((this.direction == -1 && this.y < -64) || this.direction == 1 && this.y > 704) this.destroy = true;
}

/**
 * @function renders the Racer into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Racer.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	this.frame*64, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}],8:[function(require,module,exports){
"use strict";

/**
 * @module exports the Semi class
 */
module.exports = exports = Semi;

/**
 * @constructor Semi
 * Creates a new Semi object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function Semi(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 192;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/semi_sprites.png';

	this.name = "car";
	this.speed = 10;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
}

/**
 * @function updates the Semi object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Semi.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	if(this.y > 704) this.destroy = true;
}

/**
 * @function renders the Semi into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Semi.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	0, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}],9:[function(require,module,exports){
"use strict";

/**
 * @module exports the ShortLog class
 */
module.exports = exports = ShortLog;

/**
 * @constructor ShortLog
 * Creates a new ShortLog object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function ShortLog(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 192;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/short_log_sprites.png';

	this.name = "log";
	this.speed = 7;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
}

/**
 * @function updates the ShortLog object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
ShortLog.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	if(this.y > 704) this.destroy = true;
}

/**
 * @function renders the ShortLog into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
ShortLog.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	0, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}],10:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/6;

/**
 * @module exports the Turtle class
 */
module.exports = exports = Turtle;

/**
 * @constructor Turtle
 * Creates a new Turtle object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function Turtle(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 192;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/turtle_sprites.png';
	this.timer = 0;
	this.frame = 0;

	this.name = "turtle";
	this.speed = 7;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
	//Delay between dives
	this.diveRate = Math.floor((Math.random()*4) + 2) * 1000;
	this.underTime = 2000;
	this.state = "up";
	
}

/**
 * @function updates the Turtle object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Turtle.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	this.timer += time;
  switch(this.state) {
	case "diving":
		if(this.timer > MS_PER_FRAME)
		{
			this.timer = 0;
			this.frame++;
			if(this.frame > 1)
			{

				this.frame++;
				this.state = "down";
			}
		}
		break;
	case "rising":
		if(this.timer > MS_PER_FRAME)
		{
			this.timer = 0;
			this.frame--;
			if(this.frame < 2)
			{
				this.frame--;
				this.state = "up";
			}
		}
		break;
	case "up":
		if(this.timer >= this.diveRate)
		{
			this.timer = 0;
			this.frame ++;
			this.state = "diving";
		}
		break;
	case "down":
		if(this.timer >= this.underTime)
		{
			this.timer = 0;
			this.frame --;
			this.state = "rising";
		}
		break;
	}
	if(this.y < -192) this.destroy = true;
}

/**
 * @function renders the Turtle into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Turtle.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	this.frame*64, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}],11:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;
const BLINK_MS_PER_FRAME = 1000/4;
/**
 * @module exports the Van class
 */
module.exports = exports = Van;

/**
 * @constructor Van
 * Creates a new Van object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function Van(position, speedMultiplier) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 128;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/van_sprites.png';

	this.name = "car";
	this.speed = 15;
	this.speedMultiplier = speedMultiplier;
	this.direction = position.direction;
	this.destroy = false;
}

/**
 * @function updates the Van object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Van.prototype.update = function(time) {
	this.y += this.direction * this.speed * this.speedMultiplier * time/100;
	if(this.y > 704) this.destroy = true;
}

/**
 * @function renders the Van into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Van.prototype.render = function(time, ctx) {
	ctx.drawImage(
	// image
	this.spritesheet,
	// source rectangle
	0, 0, this.width, this.height,
	// destination rectangle
	this.x, this.y, this.width, this.height
	);
}

},{}]},{},[1]);
