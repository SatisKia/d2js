/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

var _image_load = 0;

function loadImage( src ){
	_image_load++;
	var image = new Image();
	image.onload = function(){
//		window.setTimeout( function(){
			_image_load--;
//		}, 100 );
	};
	image.src = src;
	return image;
}

function isImageBusy(){
	return (_image_load > 0);
}

function _Image( width, height ){
	this.image = new Image();

	this.canvas = document.createElement( "canvas" );
	this.context = this.canvas.getContext( "2d" );

	this.canvas.width = width;
	this.canvas.height = height;
	this.context.textAlign = "left";
	this.context.textBaseline = "bottom";
}

_Image.prototype = {
	lock : function(){
		this.sav_canvas = _canvas;
		this.sav_context = _context;
		this.sav_lock = _lock;

		_canvas = this.canvas;
		_context = this.context;
		_lock = true;

		_context.clearRect( 0, 0, _canvas.width, _canvas.height );
		_context.save();
	},
	unlock : function(){
		_context.restore();

		_canvas = this.sav_canvas;
		_context = this.sav_context;
		_lock = this.sav_lock;

		this.image.src = this.canvas.toDataURL();
	},
	getWidth : function(){
		return this.canvas.width;
	},
	getHeight : function(){
		return this.canvas.height;
	},
	getImage : function(){
		return this.image;
	}
};
