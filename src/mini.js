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
function Mini(position) {
	this.state = "idle";
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 64;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/mini_sprites.png';

	this.speed = 2;
	this.direction = position.direction;
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
	this.y += this.direction * this.speed * this.height * time/1000;
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