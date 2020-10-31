function _HttpRequestHeader( header, value ){
	this._header = header;
	this._value  = value;
}
_HttpRequestHeader.prototype = {
	set : function( request ){
		_httpSetRequestHeader( request, this._header, this._value );
	}
};

var _http_header;
function httpInitHeader(){
	_http_header = new Array();
}
function httpAddHeader( header, value ){
	_http_header[_http_header.length] = new _HttpRequestHeader( header, value );
}
function httpHeader(){
	return _http_header;
}

function _httpOpen( method, url ){
	var request = null;
	if( !!XMLHttpRequest ){
		request = new XMLHttpRequest();
	} else if( !!ActiveXObject ){
		try {
			request = new ActiveXObject( "Msxml2.XMLHTTP.6.0" );
		} catch( e ){
			try {
				request = new ActiveXObject( "Msxml2.XMLHTTP.3.0" );
			} catch( e ){
				try {
					request = new ActiveXObject( "Msxml2.XMLHTTP" );
				} catch( e ){
					try {
						request = new ActiveXObject( "Microsoft.XMLHTTP" );
					} catch( e ){}
				}
			}
		}
	}
	if( request != null ){
		request.open( method, url, true );
		request.onreadystatechange = function(){
			if( request.readyState == 4 ){
				if( request.status == 200 ){
					onHttpResponse( request, request.responseText );
				} else {
					onHttpError( request, request.status );
				}
			}
		};
	}
	return request;
}

function _httpSetRequestHeader( request, header, value ){
	request.setRequestHeader( header, value );
	onHttpSetRequestHeader( header, value );
}

function httpGet( url, header ){
	var request = _httpOpen( "GET", url );
	if( request != null ){
		_httpSetRequestHeader( request, "If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT" );
		if( header != undefined ){
			for( var i = 0; i < header.length; i++ ){
				header[i].set( request );
			}
		}
		request.send( null );
	}
	return request;
}

function httpPost( url, data, type, header ){
	var request = _httpOpen( "POST", url );
	if( request != null ){
		_httpSetRequestHeader( request, "If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT" );
		_httpSetRequestHeader( request, "Content-Type", type );
		if( header != undefined ){
			for( var i = 0; i < header.length; i++ ){
				header[i].set( request );
			}
		}
		request.send( data );
	}
	return request;
}

//function onHttpSetRequestHeader( header, value ){}
//function onHttpResponse( request, data ){}
//function onHttpError( request, status ){}
