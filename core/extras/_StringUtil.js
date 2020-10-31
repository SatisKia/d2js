/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _StringUtil(){
	this.h = "";
	this.e = "";
}

_StringUtil.prototype = {

	trim : function( str ){
		var ret = "";
		var i;
		var top = 0;
		for( i = 0; i < str.length; i++ ){
			if( (str.charAt( i ) != " ") && (str.charAt( i ) != "　") ){
				break;
			}
			top++;
		}
		if( top < str.length ){
			var end = str.length - 1;
			for( i = end; i >= 0; i-- ){
				if( (str.charAt( i ) != " ") && (str.charAt( i ) != "　") ){
					break;
				}
				end--;
			}
			ret = str.substring( top, end + 1 );
		}
		return ret;
	},

	truncate : function( str, width, truncation ){
		if( stringWidth( str ) <= width ){
			return str;
		}
		width -= stringWidth( truncation );
		var ret = "";
		for( var i = 0; i < str.length; i++ ){
			ret += str.charAt( i );
			if( stringWidth( ret ) > width ){
				if( ret.length > 1 ){
					ret = ret.substring( 0, ret.length - 1 );
					break;
				}
			}
		}
		return ret + truncation;
	},

	setHeadWrap : function( str ){
		this.h = str;
	},
	setEndWrap : function( str ){
		this.e = str;
	},
	wrap : function( str, width ){
		var ret = new Array();

		var chr;

		var j = 0;
		ret[j] = "";
		for( var i = 0; i < str.length; i++ ){
			ret[j] += str.charAt( i );
			if( stringWidth( ret[j] ) > width ){
				if( ret[j].length > 1 ){
					ret[j] = ret[j].substring( 0, ret[j].length - 1 );
					i--;

					// 行頭禁則
					if( this.h.length > 0 ){
						while( true ){
							if( i + 1 < str.length ){
								chr = str.charAt( i + 1 );
								if( this.h.indexOf( chr ) >= 0 ){
									ret[j] += chr;
									i++;
								} else {
									break;
								}
							} else {
								break;
							}
						}
					}

					// 行末禁則
					if( this.e.length > 0 ){
						while( true ){
							if( ret[j].length > 1 ){
								chr = ret[j].charAt( ret[j].length - 1 );
								if( this.e.indexOf( chr ) >= 0 ){
									ret[j] = ret[j].substring( 0, ret[j].length - 1 );
									i--;
								} else {
									break;
								}
							} else {
								break;
							}
						}
					}
				}

				j++;
				ret[j] = "";
			}
		}

		return ret;
	}

};
