/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

function buttonElement( button ){
	return button.e;
}
function buttonX( button ){
	return button.x;
}
function buttonY( button ){
	return button.y;
}
function buttonWidth( button ){
	return button.width;
}
function buttonHeight( button ){
	return button.height;
}

function setButtonSrc( button, _src ){
	button.e.src = _src;
}

function updateButtonPos( button ){
	button.e.style.cssText = "position:absolute;left:" + (_getLeft( button.p ) + button.x) + "px;top:" + (_getTop( button.p ) + button.y) + "px;width:" + button.width + "px;height:" + button.height + "px";
}
function setButtonX( button, _x ){
	button.x = _x;
	updateButtonPos( button );
}
function setButtonY( button, _y ){
	button.y = _y;
	updateButtonPos( button );
}
function setButtonPos( button, _x, _y ){
	button.x = _x;
	button.y = _y;
	updateButtonPos( button );
}
function setButtonWidth( button, _width ){
	button.width = _width;
	updateButtonPos( button );
}
function setButtonHeight( button, _height ){
	button.height = _height;
	updateButtonPos( button );
}
function setButtonSize( button, _width, _height ){
	button.width = _width;
	button.height = _height;
	updateButtonPos( button );
}
function setButtonPosSize( button, _x, _y, _width, _height ){
	button.x = _x;
	button.y = _y;
	button.width = _width;
	button.height = _height;
	updateButtonPos( button );
}

function setButtonArea( button, _shape, _coords ){
	if( button.a != null ){
		button.a.setAttribute( "shape", _shape );
		button.a.setAttribute( "coords", _coords );
	}
}

function __Button( parent, element, create, x, y, width, height ){
	this.p = parent;
	this.e = element;
	this.c = create;
	this.m = null;
	this.a = null;
	setButtonPosSize( this, x, y, width, height );
}

function _addButtonEvent( button, area ){
	button.onButtonDown = function( e ){
		processEvent( _BUTTON_DOWN_EVENT, button.e );
	};
	button.onButtonOut = function( e ){
		processEvent( _BUTTON_OUT_EVENT, button.e );
	};
	button.onButtonOver = function( e ){
		processEvent( _BUTTON_OVER_EVENT, button.e );
	};
	button.onButtonUp = function( e ){
		processEvent( _BUTTON_UP_EVENT, button.e );
	};
	var target = area ? button.a : button.e;
	if( _USE_MOUSE ){
		_addEventListener( target, "mousedown", button.onButtonDown );
		_addEventListener( target, "mouseout", button.onButtonOut );
		_addEventListener( target, "mouseover", button.onButtonOver );
		_addEventListener( target, "mouseup", button.onButtonUp );
	}
	if( _USE_TOUCH ){
		_addEventListener( target, "touchstart", button.onButtonDown );
		_addEventListener( target, "touchmove", button.onButtonOver );
		_addEventListener( target, "touchend", button.onButtonUp );
	}
}

function createButton( parent, src, x, y, width, height ){
	var button = new __Button( parent, document.createElement( "img" ), true, x, y, width, height );
	setButtonSrc( button, src );
	document.body.appendChild( button.e );
	_addButtonEvent( button, false );
	return button;
}

function createButtonArea( parent, src, x, y, width, height, areaName, shape, coords ){
	var button = new __Button( parent, document.createElement( "img" ), true, x, y, width, height );

	setButtonSrc( button, src );
	button.e.setAttribute( "usemap", "#" + areaName );
	button.e.setAttribute( "border", "0" );
	document.body.appendChild( button.e );

	button.m = document.createElement( "map" );
	button.m.setAttribute( "name", areaName );
	document.body.appendChild( button.m );

	button.a = document.createElement( "area" );
	setButtonArea( button, shape, coords );
	button.m.appendChild( button.a );

	_addButtonEvent( button, true );

	return button;
}

function attachButton( parent, id, x, y, width, height ){
	var button = new __Button( parent, document.getElementById( id ), false, x, y, width, height );
	_addButtonEvent( button, false );
	return button;
}

function attachButtonArea( parent, id, x, y, width, height, areaId ){
	var button = new __Button( parent, document.getElementById( id ), false, x, y, width, height );
	button.a = document.getElementById( areaId );
	_addButtonEvent( button, true );
	return button;
}

function removeButton( button ){
	if( button.c ){
		var target = (button.a != null) ? button.a : button.e;
		if( _USE_MOUSE ){
			_removeEventListener( target, "mousedown", button.onButtonDown );
			_removeEventListener( target, "mouseout", button.onButtonOut );
			_removeEventListener( target, "mouseover", button.onButtonOver );
			_removeEventListener( target, "mouseup", button.onButtonUp );
		}
		if( _USE_TOUCH ){
			_removeEventListener( target, "touchstart", button.onButtonDown );
			_removeEventListener( target, "touchmove", button.onButtonOver );
			_removeEventListener( target, "touchend", button.onButtonUp );
		}
		document.body.removeChild( button.e );
	}
}
