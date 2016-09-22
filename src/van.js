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
function Van(position) {
	this.state = "idle";
	this.x = position.x;
	this.y = position.y;
	this.width  = 64;
	this.height = 192;
	this.spritesheet  = new Image();
	this.spritesheet.src = 'assets/van_sprites.png';

	this.speed = 0.7;
	this.direction = position.direction;
}

Van.prototype.nextLevel = function()
{
	this.speed *= 1.5;
}

/**
 * @function updates the Van object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Van.prototype.update = function(time) {

	/*this.timer += time;
	if(this.timer > MS_PER_FRAME) {
		this.timer = 0;
		this.frame += 1;
		if(this.frame > 3) this.frame = 0;
	}*/
	this.y += this.direction * this.speed * this.height * time/1000;
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
