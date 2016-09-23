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
