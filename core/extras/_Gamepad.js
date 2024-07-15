/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

window._GAMEPAD_BUTTON_PRESSED_EVENT      = 0;
window._GAMEPAD_BUTTON_RELEASED_EVENT     = 1;
window._GAMEPAD_AXIS_MINUS_INPUTTED_EVENT = 2;
window._GAMEPAD_AXIS_MINUS_RELEASED_EVENT = 3;
window._GAMEPAD_AXIS_PLUS_INPUTTED_EVENT  = 4;
window._GAMEPAD_AXIS_PLUS_RELEASED_EVENT  = 5;

function canUseGamepad(){
	return ("getGamepads" in navigator);
}

function _Gamepad(){
	this._gamepad = null;
	this._pressed = null;
	this._inputted_minus = null;
	this._inputted_plus = null;
	this._min = 0.0;
	this._max = 1.0;
}

_Gamepad.prototype = {

	setTolerance : function( min, max ){
		this._min = min;
		this._max = max;
	},

	fetch : function( index ){
		var i;

		var gamepads = navigator.getGamepads();
		if( index < gamepads.length && gamepads[index] != null ){
			var num;

			this._gamepad = gamepads[index];
			var id = this.id();

			num = this.buttonNum();
			if( this._pressed == null || num != this._pressed.length ){
				this._pressed = new Array( num );
				for( i = 0; i < num; i++ ){
					this._pressed[i] = this.isButtonPressed( i );
					if( this._pressed[i] ){
						processGamepadEvent( _GAMEPAD_BUTTON_PRESSED_EVENT, id, i );
					}
				}
			} else {
				var tmp;
				for( i = 0; i < num; i++ ){
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

			num = this.axisNum();
			if( this._inputted_minus == null || num != this._inputted_minus.length ){
				this._inputted_minus = new Array( num );
				for( i = 0; i < num; i++ ){
					this._inputted_minus[i] = (this.axisValue( i ) < 0.0);
					if( this._inputted_minus[i] ){
						processGamepadEvent( _GAMEPAD_AXIS_MINUS_INPUTTED_EVENT, id, i );
					}
				}
			} else {
				var tmp;
				for( i = 0; i < num; i++ ){
					tmp = (this.axisValue( i ) < 0.0);
					if( this._inputted_minus[i] == false && tmp == true ){
						processGamepadEvent( _GAMEPAD_AXIS_MINUS_INPUTTED_EVENT, id, i );
					}
					if( this._inputted_minus[i] == true && tmp == false ){
						processGamepadEvent( _GAMEPAD_AXIS_MINUS_RELEASED_EVENT, id, i );
					}
					this._inputted_minus[i] = tmp;
				}
			}
			if( this._inputted_plus == null || num != this._inputted_plus.length ){
				this._inputted_plus = new Array( num );
				for( i = 0; i < num; i++ ){
					this._inputted_plus[i] = (this.axisValue( i ) > 0.0);
					if( this._inputted_plus[i] ){
						processGamepadEvent( _GAMEPAD_AXIS_PLUS_INPUTTED_EVENT, id, i );
					}
				}
			} else {
				var tmp;
				for( i = 0; i < num; i++ ){
					tmp = (this.axisValue( i ) > 0.0);
					if( this._inputted_plus[i] == false && tmp == true ){
						processGamepadEvent( _GAMEPAD_AXIS_PLUS_INPUTTED_EVENT, id, i );
					}
					if( this._inputted_plus[i] == true && tmp == false ){
						processGamepadEvent( _GAMEPAD_AXIS_PLUS_RELEASED_EVENT, id, i );
					}
					this._inputted_plus[i] = tmp;
				}
			}
		} else {
			if( this._gamepad != null ){
				var id = this.id();
				for( i = 0; i < this._pressed.length; i++ ){
					if( this._pressed[i] ){
						processGamepadEvent( _GAMEPAD_BUTTON_RELEASED_EVENT, id, i );
					}
				}
				for( i = 0; i < this._inputted_minus.length; i++ ){
					if( this._inputted_minus[i] ){
						processGamepadEvent( _GAMEPAD_AXIS_MINUS_RELEASED_EVENT, id, i );
					}
				}
				for( i = 0; i < this._inputted_plus.length; i++ ){
					if( this._inputted_plus[i] ){
						processGamepadEvent( _GAMEPAD_AXIS_PLUS_RELEASED_EVENT, id, i );
					}
				}
			}
			this._gamepad = null;
			this._pressed = null;
			this._inputted_minus = null;
			this._inputted_plus = null;
		}
		return this._gamepad;
	},

	id : function(){
		try {
			return this._gamepad.id;
		} catch( e ){}
		return "";
	},

	axisNum : function(){
		try {
			return this._gamepad.axes.length;
		} catch( e ){}
		return 0;
	},

	axisValue : function( axisIndex ){
		try {
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
		} catch( e ){}
		return 0.0;
	},

	buttonNum : function(){
		try {
			return this._gamepad.buttons.length;
		} catch( e ){}
		return 0;
	},

	isButtonPressed : function( buttonIndex ){
		try {
			if( buttonIndex < this._gamepad.buttons.length ){
				return this._gamepad.buttons[buttonIndex].pressed;
			}
		} catch( e ){}
		return false;
	},

	isButtonTouched : function( buttonIndex ){
		try {
			if( buttonIndex < this._gamepad.buttons.length ){
				return this._gamepad.buttons[buttonIndex].touched;
			}
		} catch( e ){}
		return false;
	},

	buttonValue : function( buttonIndex ){
		try {
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
		} catch( e ){}
		return 0.0;
	}

};

//function processGamepadEvent( type, id, param ){}
