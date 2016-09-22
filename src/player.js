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
	this.y = 256;
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
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {

console.log(this.x);
  switch(this.state) {
    case "idle":
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
		
		if(this.moveTimer <= 1000/this.speed)
		{
		    this.timer += time;
			if(this.timer > MS_PER_FRAME) {
				this.timer = 0;
				this.frame += 1;
				if(this.frame > 3) this.frame = 0;
			}
			
			if(this.currentDirection.up && !(this.y == 0)) this.y -= this.speed * this.height * time/1000;
			else if(this.currentDirection.down && !(this.y == 640)) this.y += this.speed * this.height * time/1000;
			else if(this.currentDirection.right && !(this.x == 768)) this.x += this.speed * this.width * time/1000;
			else if(this.currentDirection.left && !(this.x == 0)) this.x -=  this.speed * this.width * time/1000;
		}
		else if (this.moveTimer < (1000/this.speed) + this.moveDelayTime) this.frame = 0;
		else 
		{	
			this.stillMoving = false;			
			this.moveTimer = 0;
			this.state = "idle";
			this.timer = 0;
			//Account for fractional difference between x and what x should actually be
			this.x = Math.round(this.x);
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
