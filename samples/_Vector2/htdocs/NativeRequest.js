function _NativeRequest(){
	this.e = document.createElement( "iframe" );
	this.e.setAttribute( "width", 0 );
	this.e.setAttribute( "height", 0 );
	this.e.setAttribute( "style", "position:absolute;left:0;top:0" );
	this.e.setAttribute( "scrolling", "no" );
	this.e.setAttribute( "frameborder", "no" );
	this.e.setAttribute( "src", "about:blank" );
	document.body.appendChild( this.e );

	this.s = "";
}

_NativeRequest.prototype = {
	setScheme : function( scheme ){
		this.s = scheme;
	},
	send : function( url ){
		if( this.s.length > 0 ){
			this.e.src = this.s + "://" + url;
		} else {
			this.e.src = url;
		}
	}
};
