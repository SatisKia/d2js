var _json_str;

function jsonInit(){
	_json_str = "";
}

function jsonAdd( key, value ){
	if( _json_str.length > 0 ){
		_json_str += ",";
	}
	_json_str += "\"" + key + "\":" + value;
}

function jsonAddString( key, value, encode ){
	if( encode == undefined ){
		encode = true;
	}
	if( encode ){
		value = encodeURIComponent( value );
	}
	if( _json_str.length > 0 ){
		_json_str += ",";
	}
	_json_str += "\"" + key + "\":\"" + value + "\"";
}

function jsonOut(){
	return "{" + _json_str + "}";
}

var _json_array;

function jsonArrayInit(){
	_json_array = "";
}

function jsonArrayAdd( json ){
	if( _json_array.length > 0 ){
		_json_array += ",";
	}
	_json_array += json;
}

function jsonArrayOut(){
	return "[" + _json_array + "]";
}

var _json_response;

function jsonResponse( data ){
	_json_response = eval( "(" + data + ")" );
	return _json_response;
}

function jsonGetSize(){
	if( _json_response.length != undefined ){
		return _json_response.length;
	}
	return 0;
}

function jsonGetKeys( index ){
	if( _json_response.length != undefined ){
		return Object.keys( _json_response[index] );
	}
	return Object.keys( _json_response );
}

function jsonGetObject( index, key ){
	if( _json_response.length != undefined ){
		return (key in _json_response[index]) ? _json_response[index][key] : null;
	}
	return (key in _json_response) ? _json_response[key] : null;
}

function jsonGetString( index, key, defString, decode ){
	var value = jsonGetObject( index, key );
	if( value == null ){
		value = defString;
	}
	if( decode == undefined ){
		decode = true;
	}
	if( decode ){
		return decodeURIComponent( value );
	}
	return value;
}

function jsonGetInteger( index, key, defInteger ){
	return parseInt( jsonGetString( index, key, "" + defInteger ) );
}
