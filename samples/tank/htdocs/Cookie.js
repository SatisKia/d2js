/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function canUseCookie(){
	return navigator.cookieEnabled;
}

var _cookie_expires = "Tue, 01 Jan 2030 00:00:00 GMT";

function setExpiresDate( date ){
	_cookie_expires = (new Date( currentTimeMillis() + date * 86400000 )).toGMTString();
}

function _getCookieArray(){
	return document.cookie.split( ";" );
}
function _getCookieParam( cookie ){
	var param = cookie.split( "=" );
	param[0] = param[0].replace( new RegExp( "^\\s+" ), "" );
	return param;
}

function cookieNum(){
	if( document.cookie.length == 0 ){
		return 0;
	}
	return _getCookieArray().length;
}
function getCookieKey( index ){
	if( document.cookie.length == 0 ){
		return "";
	}
	var cookie = _getCookieArray();
	if( index >= cookie.length ){
		return "";
	}
	var param = _getCookieParam( cookie[index] );
	return param[0];
}
function getCookie( key, defValue ){
	var cookie = _getCookieArray();
	for( var i = 0; i < cookie.length; i++ ){
		var param = _getCookieParam( cookie[i] );
		if( param[0] == key ){
			return unescape( param[1] );
		}
	}
	return defValue;
}

function setCookie( key, value ){
	if( value == null ){
		value = "";
	}
	var expires = _cookie_expires;
	if( value.length == 0 ){
		var date = new Date();
		date.setTime( 0 );
		expires = date.toGMTString();
	}
	document.cookie = key + "=" + escape( value ) + "; expires=" + expires;
}

function clearCookie( prefix ){
	var cookie = _getCookieArray();
	for( var i = cookie.length - 1; i >= 0; i-- ){
		var param = _getCookieParam( cookie[i] );
		if( (prefix == undefined) || (param[0].indexOf( prefix ) == 0) ){
			setCookie( param[0], "" );
		}
	}
}

var _cookie_val;
var _cookie_s;
var _cookie_str;

function beginCookieRead( key ){
	_cookie_val = getCookie( key, "" );
	_cookie_s = 0;
}
function cookieRead(){
	if( _cookie_s >= _cookie_val.length ){
		_cookie_str = "";
	} else {
		var e = _cookie_val.indexOf( "&", _cookie_s );
		if( e < 0 ){
			e = _cookie_val.length;
		}
		_cookie_str = _cookie_val.substring( _cookie_s, e );
		_cookie_s = e + 1;
	}
	return unescape( _cookie_str );
}
function endCookieRead(){
	_cookie_val = "";
	_cookie_str = "";
}

function beginCookieWrite(){
	_cookie_val = "";
}
function cookieWrite( str ){
	if( _cookie_val.length > 0 ){
		_cookie_val += "&";
	}
	_cookie_val += escape( str );
}
function endCookieWrite( key ){
	setCookie( key, _cookie_val );
	_cookie_val = "";
}
