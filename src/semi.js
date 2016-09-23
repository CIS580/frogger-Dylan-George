"use strict";

const MS_PER_FRAME = 1000/16;

/**
 * @module exports the Semi class
 */
module.exports = exports = Semi;

/**
 * @constructor Semi
 * Creates a new Semi object
 * @param {Postition} position object specifying an x, y, and direction (-1 or 1)
 */
function Semi(position) {
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 192;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/semi_sprites.png';
	this.timer = 0;
	this.frame = 0;

	this.name = "car";
	this.speed = 10;
	this.direction = position.direction;
	this.destroy = false;
}

Semi.prototype.nextLevel = function()
{
	this.speed *= 1.5;
}

/**
 * @function updates the Semi object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Semi.prototype.update = function(time) {
	this.y += this.direction * this.speed * time/100;
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
