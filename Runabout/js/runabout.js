Function.prototype.bind = function () {
	if (arguments.length < 2 && arguments[0] === undefined) {
		return this;
	}
	var thisObj = this,
    args = Array.prototype.slice.call(arguments),
    obj = args.shift();
	return function () {
		return thisObj.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
	};
};

Function.bind = function () {
	var args = Array.prototype.slice.call(arguments);
	return Function.prototype.bind.apply(args.shift(), args);
}

var KeyCodes = {};
KeyCodes.UpArrow = 38;
KeyCodes.LeftArrow = 37;
KeyCodes.DownArrow = 40;
KeyCodes.RightArrow = 39;
KeyCodes.SpaceBar = 32;
KeyCodes.A = 65;
KeyCodes.Z = 90;

function Cartman(sprite) {

	this.sounds = {};
	this.sounds['respect'] = new Audio("/sfx/respect.mp3");
	this.sounds['kickass'] = new Audio("/sfx/kickass.mp3");
	this.sounds['sweet'] = new Audio("/sfx/sweet.mp3");

	var speed = 1;

	this.sprite = sprite;
	this.position = { top: 0, left: 0 };
	this.velocity = { dx: 0, dy: 0 };

	this.css = { backgroundPosition: '-32px 0px' };

	this.moveUp = function () {
		this.velocity.dy = -1;
		this.updateCss();
	}
	this.moveDown = function() {
		this.velocity.dy = 1;
		this.updateCss();
	}
	this.moveLeft = function() {
		this.velocity.dx = -1;
		this.updateCss();
	}
	this.moveRight = function() {
		this.velocity.dx = 1;
		this.updateCss();
	}

	this.verticalStop = function() {
		this.velocity.dy = 0;
		this.updateCss();
	}
	this.horizontalStop = function() {
		this.velocity.dx = 0;
		this.updateCss();
	}

	this.fullStop = function () {
		this.velocity.dx = 0;
		this.velocity.dy = 0;
		this.updateCss();
	}

	this.aButton = function () {
		alert(this.sounds["respect"]);
		this.sounds["respect"].play();
	}
	this.zButton = function() {
		this.sounds["kickass"].play();
	}

	this.updateCss = function () {
		var frameIndex = 0;
		switch ((10 * this.velocity.dx) + this.velocity.dy) {
			case 0: return;
			case -11: frameIndex = 5; break;
			case -10: frameIndex = 6; break;
			case -9: frameIndex = 7; break;
			case -1: frameIndex = 4; break;
			case 1: frameIndex = 0; break;
			case 9: frameIndex = 3; break;
			case 10: frameIndex = 2; break;
			case 11: frameIndex = 1; break;
		}
		var backgroundLeftPosition = -1 * frameIndex * this.sprite.width();
		this.css = { backgroundPosition : backgroundLeftPosition + 'px 0px' };
	}


	this.update = function (canvas) {
		var dx = this.velocity.dx;
		var dy = this.velocity.dy;
		if (dx || dy) {

			dx = (isNaN(dx) ? 0 : dx);
			dy = (isNaN(dy) ? 0 : dy);
			var actualSpeed = (speed * (dx && dy ? 2 : 3));
			this.position.top += (actualSpeed * dy);
			this.position.left += (actualSpeed * dx);
			if (this.position.left < 0) this.position.left = 0;
			if (this.position.top < 0) this.position.top = 0;
			if (this.position.left + this.sprite.width() > canvas.width()) this.position.left = (canvas.width() - this.sprite.width());
			if (this.position.top + this.sprite.height() > canvas.height()) this.position.top = (canvas.height() - this.sprite.height());
		}
	}
}

function Simulator(canvas, sprite) {
	this.canvas = canvas;
	this.sprite = sprite;
	this.origin = canvas.offset();

	this.player = new Cartman(sprite);

	this.update = function () {
		$("#velocityTextBox").val(this.player.velocity.dx + ", " + this.player.velocity.dy);

		$("#positionTextBox").val(this.player.position.top + ", " + this.player.position.left);
		this.player.update(this.canvas);
		var offset = { top: this.origin.top + this.player.position.top, left: this.origin.left + this.player.position.left };
		this.sprite.offset(offset);
		this.sprite.css(this.player.css);
	}

	this.keydown = function (e) {
		switch (e.which) {
			case KeyCodes.A: this.player.aButton.call(this.player); break;
			case KeyCodes.Z: this.player.zButton.call(this.player); break;
			case KeyCodes.UpArrow: this.player.moveUp.call(this.player); break;
			case KeyCodes.DownArrow: this.player.moveDown.call(this.player); break;
			case KeyCodes.LeftArrow: this.player.moveLeft.call(this.player); break;
			case KeyCodes.RightArrow: this.player.moveRight.call(this.player); break;
		}
	}
	this.keyup = function (e) {
		switch (e.which) {

			case KeyCodes.UpArrow:
			case KeyCodes.DownArrow:
				this.player.verticalStop.call(this.player);
				break;
			case KeyCodes.LeftArrow:
			case KeyCodes.RightArrow:
				this.player.horizontalStop.call(this.player);
				break;
		}
	}

	this.buttondown = function (e) {
		var button = $(e.target);
		alert(button.attr('rel'));
		switch (button.attr('rel')) {
			case 'a': this.player.aButton.call(this.player); break;
			case 'z': this.player.zButton.call(this.player); break;
			case 'moveUp': this.player.moveUp.call(this.player); break;
			case 'moveDown': this.player.moveDown.call(this.player); break;
			case 'moveLeft': this.player.moveLeft.call(this.player); break;
			case 'moveRight': this.player.moveRight.call(this.player); break;
			case 'moveUpRight':
				this.player.moveUp.call(this.player); this.player.moveRight.call(this.player); break;
			case 'moveUpLeft':
				this.player.moveUp.call(this.player); this.player.moveLeft.call(this.player); break;
			case 'moveDownRight':
				this.player.moveDown.call(this.player); this.player.moveRight.call(this.player); break;
			case 'moveDownLeft':
				this.player.moveDown.call(this.player); this.player.moveLeft.call(this.player); break;
		}
	}

	this.buttonup = function (e) {
		var button = $(e.target);
		switch (button.attr('rel')) {
			case 'moveUp':
			case 'moveDown':
				this.player.verticalStop.call(this.player);
				break;
			case 'moveLeft':
			case 'moveRight':
				this.player.horizontalStop.call(this.player);
				break;
			case 'moveUpRight':
			case 'moveUpLeft':
			case 'moveDownRight':
			case 'moveDownLeft':
				this.player.fullStop.call(this.player);
				break;
		}
	}

	this.start = function () {
		window.setInterval(this.update.bind(this), 20);
	}

	this.updateOrientation = function () {
		this.origin = canvas.offset();
		this.update();
	}
}


$(function () {
	var canvas = $("#canvas");
	//	if (!window.navigator.standalone) {
	//		canvas.width(200);
	//		canvas.height(200);
	//	}

	var sprite = $("#sprite");
	var engine = new Simulator(canvas, sprite);
	$("html").bind('keydown', engine.keydown.bind(engine));
	$("html").bind('keyup', engine.keyup.bind(engine));

	$("div#keypad button").bind('touchstart', engine.buttondown.bind(engine));
	$("div#keypad button").bind('touchend', engine.buttonup.bind(engine));

	$("#div#azButtons button").bind('touchstart', engine.buttondown.bind(engine));

	engine.start();

	window.onorientationchange = engine.updateOrientation.bind(engine);

});
