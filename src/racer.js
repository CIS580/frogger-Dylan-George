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
function Racer(position) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 64;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/racer_sprites.png';
	
	this.name = "car";
	this.speed = 3;
	this.direction = position.direction;
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
	this.y += this.direction * this.speed * this.height * time/1000;
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
