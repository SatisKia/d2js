/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

window._GAMEPAD_BUTTON_PRESSED_EVENT  = 0;
window._GAMEPAD_BUTTON_RELEASED_EVENT = 1;

function canUseGamepad(){
	return ("getGamepads" in navigator);
}

function _Gamepad(){
	this._gamepad = null;
	this._pressed = null;
	this._min = 0.0;
	this._max = 1.0;
}

_Gamepad.prototype = {

	setTolerance : function( min, max ){
		this._min = min;
		this._max = max;
	},

	fetch : function( index ){
		var gamepads = navigator.getGamepads();
		if( index < gamepads.length && gamepads[index] != null ){
			this._gamepad = gamepads[index];
			var id = this.id();

			var num = this.buttonNum();
			if( this._pressed == null || num != this._pressed.length ){
				this._pressed = new Array( num );
				for( var i = 0; i < num; i++ ){
					this._pressed[i] = this.isButtonPressed( i );
					if( this._pressed[i] ){
						processGamepadEvent( _GAMEPAD_BUTTON_PRESSED_EVENT, id, i );
					}
				}
			} else {
				var tmp;
				for( var i = 0; i < num; i++ ){
					tmp = this.isButtonPressed( i );
					if( this._pressed[i] == false && tmp == true ){
						processGamepadEvent( _GAMEPAD_BUTTON_PRESSED_EVENT, id, i );
					}
					if( this._pressed[i] == true && tmp == false ){
						processGamepadEvent( _GAMEPAD_BUTTON_RELEASED_EVENT, id, i );
					}
					this._pressed[i] = tmp;
				}
			}
		} else {
			if( this._gamepad != null ){
				var id = this.id();
				for( var i = 0; i < this._pressed.length; i++ ){
					if( this._pressed[i] ){
						processGamepadEvent( _GAMEPAD_BUTTON_RELEASED_EVENT, id, i );
					}
				}
			}
			this._gamepad = null;
			this._pressed = null;
		}
		return this._gamepad;
	},

	id : function(){
		return this._gamepad.id;
	},

	axisNum : function(){
		return this._gamepad.axes.length;
	},

	axisValue : function( axisIndex ){
		if( axisIndex < this._gamepad.axes.length ){
			var value = this._gamepad.axes[axisIndex];
			var minus = false;
			if( value < 0.0 ){
				value = 0.0 - value;
				minus = true;
			}
			value = (value - this._min) / (this._max - this._min);
			if( value > 1.0 ){
				value = 1.0;
			}
			if( value < 0.0 ){
				value = 0.0;
			}
			return minus ? -value : value;
		}
		return 0.0;
	},

	buttonNum : function(){
		return this._gamepad.buttons.length;
	},

	isButtonPressed : function( buttonIndex ){
		if( buttonIndex < this._gamepad.buttons.length ){
			return this._gamepad.buttons[buttonIndex].pressed;
		}
		return false;
	},

	isButtonTouched : function( buttonIndex ){
		if( buttonIndex < this._gamepad.buttons.length ){
			return this._gamepad.buttons[buttonIndex].touched;
		}
		return false;
	},

	buttonValue : function( buttonIndex ){
		if( buttonIndex < this._gamepad.buttons.length ){
			var value = this._gamepad.buttons[buttonIndex].value;
			value = (value - this._min) / (this._max - this._min);
			if( value > 1.0 ){
				value = 1.0;
			}
			if( value < 0.0 ){
				value = 0.0;
			}
			return value;
		}
		return 0.0;
	}

};

//function processGamepadEvent( type, id, param ){}
