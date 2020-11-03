function canUseDeviceMotion(){
	return window.DeviceMotionEvent;
}
function canUseDeviceOrientation(){
	return window.DeviceOrientationEvent;
}

var _sensor_accel_x = 0.0;
var _sensor_accel_y = 0.0;
var _sensor_accel_z = 0.0;
var _sensor_gravity_x = 0.0;
var _sensor_gravity_y = 0.0;
var _sensor_gravity_z = 0.0;
var _sensor_linear_accel_x = 0.0;
var _sensor_linear_accel_y = 0.0;
var _sensor_linear_accel_z = 0.0;
var _sensor_azimuth = 0.0;
var _sensor_pitch = 0.0;
var _sensor_roll = 0.0;

function sensorStart(){
	_sensor_accel_x = 0.0;
	_sensor_accel_y = 0.0;
	_sensor_accel_z = 0.0;
	_sensor_gravity_x = 0.0;
	_sensor_gravity_y = 0.0;
	_sensor_gravity_z = 0.0;
	_sensor_linear_accel_x = 0.0;
	_sensor_linear_accel_y = 0.0;
	_sensor_linear_accel_z = 0.0;
	_sensor_azimuth = 0.0;
	_sensor_pitch = 0.0;
	_sensor_roll = 0.0;

	if( window.DeviceMotionEvent ){
		_addEventListener( window, "devicemotion", _onDeviceMotion );
	}
	if( window.DeviceOrientationEvent ){
		_addEventListener( window, "deviceorientation", _onDeviceOrientation );
	}
}

function sensorStop(){
	if( window.DeviceMotionEvent ){
		_removeEventListener( window, "devicemotion", _onDeviceMotion );
	}
	if( window.DeviceOrientationEvent ){
		_removeEventListener( window, "deviceorientation", _onDeviceOrientation );
	}
}

function _onDeviceMotion( e ){
	_sensor_accel_x = e.accelerationIncludingGravity.x;
	_sensor_accel_y = e.accelerationIncludingGravity.y;
	_sensor_accel_z = e.accelerationIncludingGravity.z;
	_sensor_gravity_x = 0.8 * _sensor_gravity_x + 0.2 * _sensor_accel_x;
	_sensor_gravity_y = 0.8 * _sensor_gravity_y + 0.2 * _sensor_accel_y;
	_sensor_gravity_z = 0.8 * _sensor_gravity_z + 0.2 * _sensor_accel_z;
	_sensor_linear_accel_x = _sensor_accel_x - _sensor_gravity_x;
	_sensor_linear_accel_y = _sensor_accel_y - _sensor_gravity_y;
	_sensor_linear_accel_z = _sensor_accel_z - _sensor_gravity_z;
}

function _onDeviceOrientation( e ){
	_sensor_azimuth = e.alpha
	_sensor_pitch = e.beta;
	_sensor_roll = e.gamma;
}

function getAccelX(){
	return _sensor_accel_x;
}
function getAccelY(){
	return _sensor_accel_y;
}
function getAccelZ(){
	return _sensor_accel_z;
}
function getGravityX(){
	return _sensor_gravity_x;
}
function getGravityY(){
	return _sensor_gravity_y;
}
function getGravityZ(){
	return _sensor_gravity_z;
}
function getLinearAccelX(){
	return _sensor_linear_accel_x;
}
function getLinearAccelY(){
	return _sensor_linear_accel_y;
}
function getLinearAccelZ(){
	return _sensor_linear_accel_z;
}
function getAzimuth(){
	return _sensor_azimuth;
}
function getPitch(){
	return _sensor_pitch;
}
function getRoll(){
	return _sensor_roll;
}
