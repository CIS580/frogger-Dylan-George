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
function Turtle(position) {
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
	this.direction = position.direction;
	this.destroy = false;
	//Delay between dives
	this.diveRate = Math.floor((Math.random()*4) + 2) * 1000;
	this.underTime = 2000;
	this.state = "up";
	
}

Turtle.prototype.nextLevel = function()
{
	this.speed *= 1.5;
}

/**
 * @function updates the Turtle object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Turtle.prototype.update = function(time) {
	this.y += this.direction * this.speed * time/100;
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
