function canUseStorage(){
	try {
		return window.localStorage != null;
	} catch( e ){}
	return false;
}

function storageNum(){
	return window.localStorage.length;
}
function getStorageKey( index ){
	if( index >= storageNum() ){
		return "";
	}
	return window.localStorage.key( index );
}
function getStorage( key, defValue ){
	var value = window.localStorage.getItem( key );
	return (value == null) ? defValue : value;
}

function setStorage( key, value ){
	if( (value != null) && (value.length > 0) ){
		window.localStorage.setItem( key, value );
	} else {
		window.localStorage.removeItem( key );
	}
}

function clearStorage( prefix ){
	if( prefix == undefined ){
		window.localStorage.clear();
	} else {
		var num = storageNum();
		var key;
		for( var i = num - 1; i >= 0; i-- ){
			key = getStorageKey( i );
			if( (prefix == undefined) || (key.indexOf( prefix ) == 0) ){
				setStorage( key, null );
			}
		}
	}
}

var _storage_val;
var _storage_s;
var _storage_str;

function beginStorageRead( key ){
	_storage_val = getStorage( key, "" );
	_storage_s = 0;
}
function storageRead(){
	if( _storage_s >= _storage_val.length ){
		_storage_str = "";
	} else {
		var e = _storage_val.indexOf( "&", _storage_s );
		if( e < 0 ){
			e = _storage_val.length;
		}
		_storage_str = _storage_val.substring( _storage_s, e );
		_storage_s = e + 1;
	}
	return unescape( _storage_str );
}
function endStorageRead(){
	_storage_val = "";
	_storage_str = "";
}

function beginStorageWrite(){
	_storage_val = "";
}
function storageWrite( str ){
	if( _storage_val.length > 0 ){
		_storage_val += "&";
	}
	_storage_val += escape( str );
}
function endStorageWrite( key ){
	setStorage( key, _storage_val );
	_storage_val = "";
}
