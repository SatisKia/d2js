/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _EventStep( event_on, event_off ){
	this.n = event_on;
	this.f = event_off;
	this.s = 0;
	this.t = currentTimeMillis();
}

_EventStep.prototype = {

	handleEvent : function( type, param ){
		if( (type == this.n) && this.checkParam( param ) ){
			var now_time = currentTimeMillis();
			if( this.isTimeoutTime( now_time ) ){
				this.s = 1;
			} else {
				if( (this.s % 2) == 0 ){
					this.s++;
				}
			}
			this.t = now_time;
		} else if( (type == this.f) && this.checkParam( param ) ){
			var now_time = currentTimeMillis();
			if( this.isTimeoutTime( now_time ) ){
				this.s = 0;
			} else {
				if( (this.s % 2) == 1 ){
					this.s++;
				}
			}
			this.t = now_time;
		}
	},

	step : function(){
		return this.s;
	},

	reset : function(){
		this.s = 0;
	},

	isTimeoutTime : function( now_time ){
		if( this.s == 0 ){
			return false;
		}
		return ((now_time - this.t) > this.checkTime());
	},
	isTimeout : function(){
		return this.isTimeoutTime( currentTimeMillis() );
	},

	checkParam : function( param ){ return true; },
	checkTime : function(){ return 200/*1000 / 5*/; }

};
