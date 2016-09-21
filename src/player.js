"use strict";

const MS_PER_FRAME = 1000/16;
const BLINK_MS_PER_FRAME = 1000/4;
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
	this.spritesheet.src = encodeURI('assets/frog_spritesheet.png');
	this.timer = 0;
	this.frame = 0;

	
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
				if (!self.stillMoving) 
				{
					self.currentDirection.up = true;
					self.stillMoving = true;
					self.state = "moving";
				}
				self.nextDirection.up = true;
				self.movingAgain = true;
				event.preventDefault();
				break;
			//down
			case 40:
			case 83:
				if (!self.stillMoving) 
				{
					self.currentDirection.down = true;
					self.stillMoving = true;
					self.state = "moving";
				}
				self.nextDirection.down = true;
				self.movingAgain = true;
				event.preventDefault();
				break;
			//left
			case 37:
			case 65:
				if (!self.stillMoving) 
				{
					self.currentDirection.left = true;
					self.stillMoving = true;
					self.state = "moving";
				}
				self.nextDirection.left = true;
				self.movingAgain = true;
				event.preventDefault();
				break;
			//right
			case 39:
			case 68:
				if (!self.stillMoving) 
				{
					self.currentDirection.right = true;
					self.stillMoving = true;
					self.state = "moving";
				}
				self.nextDirection.right = true;
				self.movingAgain = true;
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
				self.movingAgain = false;
				event.preventDefault();
				break;
			//down
			case 40:
			case 83:
				self.nextDirection.down = false;
				self.movingAgain = false;
				event.preventDefault();
				break;
			//left
			case 37:
			case 65:
				self.nextDirection.left = false;
				self.movingAgain = false;
				event.preventDefault();
				break;
			//right
			case 39:
			case 68:
				self.nextDirection.right = false;
				self.movingAgain = false;
				event.preventDefault();
				break;
		}
	}

}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {


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
					console.log(this.blinkFrame);
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
			if(this.currentDirection.up) this.y -= this.speed * this.height * time/1000;
			else if(this.currentDirection.down) this.y += this.speed * this.height * time/1000;
			else if(this.currentDirection.right) this.x += this.speed * this.width * time/1000;
			else if(this.currentDirection.left) this.x -=  this.speed * this.width * time/1000;
		}
		else if (this.moveTimer < (1000/this.speed) + this.moveDelayTime) this.frame = 0;
		else 
		{	
			this.stillMoving = false;			
			this.moveTimer = 0;
			this.state = "idle";
			this.timer = 0;
			
			this.currentDirection.up = this.nextDirection.up;
			this.currentDirection.down = this.nextDirection.down;
			this.currentDirection.left = this.nextDirection.left;
			this.currentDirection.right = this.nextDirection.right;
		}
 
		break;
    // TODO: Implement your player's update by state
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
		this.blinkFrame * 64, 64, this.width, this.height,
		// destination rectangle
		this.x, this.y, this.width, this.height
		);
		break;
	case "moving":
		ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
		this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's rendering according to state
  }
}
