/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

function _Graphics(){
	this.x = 0;
	this.y = 0;
	this.f = _FLIP_NONE;
}

_Graphics.prototype = {
	canUseClip : function(){
		return (!!_context.clip);
	},
	canUseText : function(){
		return (!!_context.fillText);
	},
	getColorOfRGB : function( r, g, b ){
		return "rgb(" + r + "," + g + "," + b + ")";
	},
	getColorOfRGBA : function( r, g, b, a ){
		return "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
	},
	setStrokeWidth : function( width ){
		_context.lineWidth = width;
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
		setFont( size, family );
		_context.font = "" + _font_size + "px " + _font_family;
	},
	stringWidth : function( str ){
		return stringWidth( str );
	},
	fontHeight : function(){
		return fontHeight();
	},
	clearClip : function(){
		_context.restore();
		_context.save();
	},
	setOrigin : function( x, y ){
		this.x = x;
		this.y = y;
	},
	setClip : function( x, y, width, height ){
		x += this.x;
		y += this.y;
		if( !!_context.clip ){
			_context.restore();
			_context.save();
			_context.beginPath();
			_context.moveTo( x, y );
			_context.lineTo( x + width, y );
			_context.lineTo( x + width, y + height );
			_context.lineTo( x, y + height );
			_context.closePath();
			_context.clip();
		}
	},
	drawLine : function( x1, y1, x2, y2 ){
		x1 += this.x;
		y1 += this.y;
		x2 += this.x;
		y2 += this.y;
		_context.beginPath();
		_context.moveTo( x1 + 0.5, y1 + 0.5 );
		_context.lineTo( x2 + 0.5, y2 + 0.5 );
		_context.stroke();
		_context.closePath();
	},
	drawRect : function( x, y, width, height ){
		x += this.x;
		y += this.y;
		_context.strokeRect( x + 0.5, y + 0.5, width, height );
	},
	fillRect : function( x, y, width, height ){
		x += this.x;
		y += this.y;
		_context.fillRect( x, y, width, height );
	},
	drawCircle : function( cx, cy, r ){
		cx += this.x;
		cy += this.y;
		_context.beginPath();
		_context.arc( cx, cy, r, 0.0, Math.PI * 2.0, false );
//		_context.closePath();
		_context.stroke();
	},
	drawString : function( str, x, y ){
		x += this.x;
		y += this.y;
		if( !!_context.fillText ){
			_context.fillText( str, x, y );
		} else {
			if( _USE_DRAWSTRINGEX ){
				_drawStringEx( str, x, y );
			}
		}
	},
	setFlipMode : function( flip ){
		this.f = flip;
	},
	drawScaledImage : function( image, dx, dy, width, height, sx, sy, swidth, sheight ){
		dx += this.x;
		dy += this.y;
		if( this.f == _FLIP_NONE ){
			try {
				_context.drawImage( image, sx, sy, swidth, sheight, dx, dy, width, height );
			} catch( e ){}
		} else {
			_context.save();
			_context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
			switch( this.f ){
			case _FLIP_HORIZONTAL:
				_context.translate( dx + width, dy );
				_context.scale( -1.0, 1.0 );
				break;
			case _FLIP_VERTICAL:
				_context.translate( dx, dy + height );
				_context.scale( 1.0, -1.0 );
				break;
			case _FLIP_ROTATE:
				_context.translate( dx + width, dy + height );
				_context.scale( -1.0, -1.0 );
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
		dx += this.x;
		dy += this.y;
		_context.save();
		_context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
		_context.translate( dx, dy );
		_context.rotate( (Math.PI * r360) / 180 );
		_context.scale( z128x / 128, z128y / 128 );
		_context.translate( -cx, -cy );
		try {
			_context.drawImage( image, sx, sy, width, height, 0, 0, width, height );
		} catch( e ){}
		_context.restore();
	}
};
