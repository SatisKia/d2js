/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

function _ScalableGraphics(){
	this.f = _FLIP_NONE;
	this.s = 1.0;
}

_ScalableGraphics.prototype = {
	canUseClip : function(){
		return (!!_context.clip);
	},
	canUseText : function(){
		return (!!_context.fillText);
	},
	setScale : function( scale ){
		this.s = scale;
	},
	scale : function(){
		return this.s;
	},
	getColorOfRGB : function( r, g, b ){
		return "rgb(" + r + "," + g + "," + b + ")";
	},
	setStrokeWidth : function( width ){
		_context.lineWidth = width * this.s;
	},
	setColor : function( color ){
		_color = color;
		_context.fillStyle = _color;
		_context.strokeStyle = _color;
	},
	setAlpha : function( a ){
		_context.globalAlpha = a / 255.0;
	},
	setROP : function( mode ){
		_context.globalCompositeOperation = mode;
	},
	setFont : function( size, family ){
		setFont( Math.floor( size * this.s ), family );
		_context.font = "" + _font_size + "px " + _font_family;
	},
	stringWidth : function( str ){
		return ((this.s == 0.0) ? 0 : stringWidth( str ) / this.s);
	},
	fontHeight : function(){
		return ((this.s == 0.0) ? 0 : fontHeight() / this.s);
	},
	clearClip : function(){
		_context.restore();
		_context.save();
	},
	setClip : function( x, y, width, height ){
		if( !!_context.clip ){
			_context.restore();
			_context.save();
			_context.beginPath();
			_context.moveTo( x * this.s, y * this.s );
			_context.lineTo( (x * this.s) + (width * this.s), y * this.s );
			_context.lineTo( (x * this.s) + (width * this.s), (y * this.s) + (height * this.s) );
			_context.lineTo( x * this.s, (y * this.s) + (height * this.s) );
			_context.closePath();
			_context.clip();
		}
	},
	drawLine : function( x1, y1, x2, y2 ){
		_context.beginPath();
		_context.moveTo( (x1 + 0.5) * this.s, (y1 + 0.5) * this.s );
		_context.lineTo( (x2 + 0.5) * this.s, (y2 + 0.5) * this.s );
		_context.stroke();
		_context.closePath();
	},
	drawRect : function( x, y, width, height ){
		_context.strokeRect( (x + 0.5) * this.s, (y + 0.5) * this.s, width * this.s, height * this.s );
	},
	fillRect : function( x, y, width, height ){
		_context.fillRect( x * this.s, y * this.s, width * this.s, height * this.s );
	},
	drawCircle : function( cx, cy, r ){
		_context.beginPath();
		_context.arc( cx * this.s, cy * this.s, r * this.s, 0.0, Math.PI * 2.0, false );
//		_context.closePath();
		_context.stroke();
	},
	drawString : function( str, x, y ){
		if( !!_context.fillText ){
			_context.fillText( str, x * this.s, y * this.s );
		} else {
			if( _USE_DRAWSTRINGEX ){
				_drawStringEx( str, x * this.s, y * this.s );
			}
		}
	},
	setFlipMode : function( flip ){
		this.f = flip;
	},
	drawScaledImage : function( image, dx, dy, width, height, sx, sy, swidth, sheight ){
		if( this.f == _FLIP_NONE ){
			try {
				_context.drawImage( image, sx, sy, swidth, sheight, dx * this.s, dy * this.s, width * this.s, height * this.s );
			} catch( e ){}
		} else {
			_context.save();
			_context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
			switch( this.f ){
			case _FLIP_HORIZONTAL:
				_context.translate( (dx + width) * this.s, dy * this.s );
				_context.scale( -this.s, this.s );
				break;
			case _FLIP_VERTICAL:
				_context.translate( dx * this.s, (dy + height) * this.s );
				_context.scale( this.s, -this.s );
				break;
			case _FLIP_ROTATE:
				_context.translate( (dx + width) * this.s, (dy + height) * this.s );
				_context.scale( -this.s, -this.s );
				break;
			}
			try {
				_context.drawImage( image, sx, sy, swidth, sheight, 0, 0, width, height );
			} catch( e ){}
			_context.restore();
		}
	},
	drawImage : function( image, x, y ){
		this.drawScaledImage( image, x, y, image.width, image.height, 0, 0, image.width, image.height );
	},
	drawTransImage : function( image, dx, dy, sx, sy, width, height, cx, cy, r360, z128x, z128y ){
		_context.save();
		_context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
		_context.translate( dx * this.s, dy * this.s );
		_context.rotate( (Math.PI * r360) / 180 );
		_context.scale( (z128x * this.s) / 128, (z128y * this.s) / 128 );
		_context.translate( -cx, -cy );
		try {
			_context.drawImage( image, sx, sy, width, height, 0, 0, width, height );
		} catch( e ){}
		_context.restore();
	}
};
