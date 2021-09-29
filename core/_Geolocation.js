window._GEOLOCATION_ERROR                = 0;
window._GEOLOCATION_PERMISSION_DENIED    = 1;
window._GEOLOCATION_POSITION_UNAVAILABLE = 2;
window._GEOLOCATION_TIMEOUT              = 3;
window._GEOLOCATION_SUCCESS              = 4;

function canUseGeolocation(){
	return ("geolocation" in navigator);
}

var _geolocation_watch = false;
var _geolocation_id = 0;

var _geolocation_latitude = 0.0;
var _geolocation_longitude = 0.0;
var _geolocation_accuracy = 0.0;
var _geolocation_altitude = 0.0;
var _geolocation_altitude_accuracy = 0.0;
var _geolocation_heading = 0.0;
var _geolocation_speed = 0.0;
var _geolocation_timestamp = 0;

function _geolocationSuccess( position ){
	var coords = position.coords;
	_geolocation_latitude          = coords.latitude;
	_geolocation_longitude         = coords.longitude;
	_geolocation_accuracy          = coords.accuracy;
	_geolocation_altitude          = coords.altitude;
	_geolocation_altitude_accuracy = coords.altitudeAccuracy;
	_geolocation_heading           = coords.heading;
	_geolocation_speed             = coords.speed;
	_geolocation_timestamp         = position.timestamp;

	onGeolocation( _GEOLOCATION_SUCCESS, "" );
}

function _geolocationError( error ){
	onGeolocation( error.code, error.message );
}

function _Geolocation(){
	this._enable_high_accuracy = false;
	this._maximum_age = 0;
	this._timeout = Number.POSITIVE_INFINITY;
}

_Geolocation.prototype = {

	setEnableHighAccuracy : function( enableHighAccuracy ){
		this._enable_high_accuracy = enableHighAccuracy;
	},
	setMaximumAgeSeconds : function( maximumAge ){
		this._maximum_age = maximumAge * 1000;
	},
	setTimeoutSeconds : function( timeout ){
		this._timeout = timeout * 1000;
	},

	stop : function(){
		if( _geolocation_watch ){
			_geolocation_watch = false;
			navigator.geolocation.clearWatch( _geolocation_id );
		}
	},

	start : function(){
		this.stop();

		var options = {
			'enableHighAccuracy' : this._enable_high_accuracy,
			'maximumAge' : this._maximum_age,
			'timeout' : this._timeout
		};
		_geolocation_id = navigator.geolocation.watchPosition( _geolocationSuccess, _geolocationError, options );
		_geolocation_watch = true;
	},

	latitude : function(){
		return _geolocation_latitude;
	},
	longitude : function(){
		return _geolocation_longitude;
	},
	accuracy : function(){
		return _geolocation_accuracy;
	},
	altitude : function(){
		return _geolocation_altitude;
	},
	altitudeAccuracy : function(){
		return _geolocation_altitude_accuracy;
	},
	heading : function(){
		return _geolocation_heading;
	},
	speed : function(){
		return _geolocation_speed;
	},
	timestamp : function(){
		return _geolocation_timestamp;
	}
};

//function onGeolocation( code, message ){}
