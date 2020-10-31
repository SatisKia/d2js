/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

var _System = {
	arraycopy : function( src, src_pos, dst, dst_pos, length ){
		for( var i = 0; i < length; i++ ){
			dst[dst_pos + i] = src[src_pos + i];
		}
	}
};
