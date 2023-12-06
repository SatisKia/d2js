






function _Graphics(){
 this.f = 0;
}

_Graphics.prototype = {
 canUseClip : function(){
  return (!!_context.clip);
 },
 canUseText : function(){
  return (!!_context.fillText);
 },
 getColorOfRGB : function( r, g, b ){
  return "rgb(" + r + "," + g + "," + b + ")";
 },
 getColorOfRGBA : function( r, g, b, a ){
  return "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
 },
 setStrokeWidth : function( width ){
  _context.lineWidth = width;
 },
 setColor : function( color ){
  _color = color;
  _context.fillStyle = _color;
  _context.strokeStyle = _color;
 },
 setAlpha : function( a ){
  _context.globalAlpha = a / 255.0;
 },
 setROP : function( mode ){
  _context.globalCompositeOperation = mode;
 },
 setFont : function( size, family ){
  setFont( size, family );
  _context.font = "" + _font_size + "px " + _font_family;
 },
 stringWidth : function( str ){
  return stringWidth( str );
 },
 fontHeight : function(){
  return fontHeight();
 },
 clearClip : function(){
  _context.restore();
  _context.save();
 },
 setClip : function( x, y, width, height ){
  if( !!_context.clip ){
   _context.restore();
   _context.save();
   _context.beginPath();
   _context.moveTo( x, y );
   _context.lineTo( x + width, y );
   _context.lineTo( x + width, y + height );
   _context.lineTo( x, y + height );
   _context.closePath();
   _context.clip();
  }
 },
 drawLine : function( x1, y1, x2, y2 ){
  _context.beginPath();
  _context.moveTo( x1 + 0.5, y1 + 0.5 );
  _context.lineTo( x2 + 0.5, y2 + 0.5 );
  _context.stroke();
  _context.closePath();
 },
 drawRect : function( x, y, width, height ){
  _context.strokeRect( x + 0.5, y + 0.5, width, height );
 },
 fillRect : function( x, y, width, height ){
  _context.fillRect( x, y, width, height );
 },
 drawCircle : function( cx, cy, r ){
  _context.beginPath();
  _context.arc( cx, cy, r, 0.0, Math.PI * 2.0, false );

  _context.stroke();
 },
 drawString : function( str, x, y ){
  if( !!_context.fillText ){
   _context.fillText( str, x, y );
  } else {
   if( _USE_DRAWSTRINGEX ){
    _drawStringEx( str, x, y );
   }
  }
 },
 setFlipMode : function( flip ){
  this.f = flip;
 },
 drawScaledImage : function( image, dx, dy, width, height, sx, sy, swidth, sheight ){
  if( this.f == 0 ){
   try {
    _context.drawImage( image, sx, sy, swidth, sheight, dx, dy, width, height );
   } catch( e ){}
  } else {
   _context.save();
   _context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
   switch( this.f ){
   case 1:
    _context.translate( dx + width, dy );
    _context.scale( -1.0, 1.0 );
    break;
   case 2:
    _context.translate( dx, dy + height );
    _context.scale( 1.0, -1.0 );
    break;
   case 3:
    _context.translate( dx + width, dy + height );
    _context.scale( -1.0, -1.0 );
    break;
   }
   try {
    _context.drawImage( image, sx, sy, swidth, sheight, 0, 0, width, height );
   } catch( e ){}
   _context.restore();
  }
 },
 drawImage : function( image, x, y ){
  this.drawScaledImage( image, x, y, image.width, image.height, 0, 0, image.width, image.height );
 },
 drawTransImage : function( image, dx, dy, sx, sy, width, height, cx, cy, r360, z128x, z128y ){
  _context.save();
  _context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
  _context.translate( dx, dy );
  _context.rotate( (Math.PI * r360) / 180 );
  _context.scale( z128x / 128, z128y / 128 );
  _context.translate( -cx, -cy );
  try {
   _context.drawImage( image, sx, sy, width, height, 0, 0, width, height );
  } catch( e ){}
  _context.restore();
 }
};
window._USE_AUDIOEX = false;
window._USE_DRAWSTRINGEX = false;
window._USE_EXCANVAS = false;
window._USE_KEY = false;
window._USE_MOUSE = false;
window._USE_TOUCH = false;
window._USE_LAYOUTMOUSE = false;
window._USE_LAYOUTTOUCH = false;
window._USE_REQUESTANIMATIONFRAME = false;
function canUseCanvas(){
 return (!!document.createElement( "canvas" ).getContext);
}
var _kill_timer = false;
var _start_time;
var _end_time;
var _sleep_time;
var _canvas = null;
var _context;
var _lock;
var _g;
var _key = 0;
var _key_array;
var _use_layout = false;
var _layout = new Array();
var _mouse_x;
var _mouse_y;
var _touch_start = false;
var _touch_x = new Array();
var _touch_y = new Array();
var _touch_x0;
var _touch_y0;
var _color;
var _font_size;
var _font_family;
var _stringex = new Array();
var _stringex_num;
var _text;
var _text_style = "visibility:hidden;position:absolute;left:0;top:0";
function d2js_onload(){
 _key_array = new Array();
 _key_array[ 0] = 8;
 _key_array[ 1] = 9;
 _key_array[ 2] = 13;
 _key_array[ 3] = 16;
 _key_array[ 4] = 17;
 _key_array[ 5] = 32;
 _key_array[ 6] = 37;
 _key_array[ 7] = 38;
 _key_array[ 8] = 39;
 _key_array[ 9] = 40;
 _key_array[10] = 48;
 _key_array[11] = 49;
 _key_array[12] = 50;
 _key_array[13] = 51;
 _key_array[14] = 52;
 _key_array[15] = 53;
 _key_array[16] = 54;
 _key_array[17] = 55;
 _key_array[18] = 56;
 _key_array[19] = 57;
 _key_array[20] = 67;
 _key_array[21] = 88;
 _key_array[22] = 90;
 init();
 if( _USE_EXCANVAS || canUseCanvas() ){
  if( _USE_LAYOUTMOUSE ){
   _use_layout = true;
   _USE_MOUSE = true;
  }
  if( _USE_LAYOUTTOUCH ){
   _use_layout = true;
   _USE_TOUCH = true;
  }
  if( _USE_KEY ){
   _addEventListener( document, "keydown", _onKeyDown );
   _addEventListener( document, "keyup", _onKeyUp );
  }
  if( _USE_TOUCH ){
   _addEventListener( document, "touchstart", _onTouchStart );
   _addEventListener( document, "touchmove", _onTouchMove );
   _addEventListener( document, "touchend", _onTouchEnd );
  }
  _text = document.createElement( "span" );
  _text.style.cssText = _text_style;
  document.body.appendChild( _text );
  if( start() ){
   setTimer();
  }
 } else {
  error();
 }
}
function d2js_onorientationchange(){
 processEvent( 13, window.orientation );
}
function d2js_onresize(){
 processEvent( 14, 0 );
}
function setTimer(){
 _kill_timer = false;
 _loop();
}
function killTimer(){
 _kill_timer = true;
}
function repaint(){
 if( _USE_DRAWSTRINGEX ){
  _stringex_num = 0;
 }
 _context.clearRect( 0, 0, getWidth(), getHeight() );
 _context.save();
 paint( _g );
 _context.restore();
 if( _USE_DRAWSTRINGEX ){
  for( var i = _stringex_num; i < _stringex.length; i++ ){
   _stringex[i].innerHTML = "";
  }
 }
}
function _getSleepTime(){
 _sleep_time = frameTime() - (_end_time - _start_time);
 if( _sleep_time < 0 ){
  _sleep_time = 0;
 }
 if( _sleep_time > frameTime() ){
  _sleep_time = frameTime();
 }
}
function _sleep(){
 while( (_end_time > _start_time) && ((_end_time - _start_time) < frameTime()) ){
  _end_time = currentTimeMillis();
 }
}
function _loop(){
 if( _kill_timer ){
  _kill_timer = false;
  return;
 }
 _start_time = currentTimeMillis();
 repaint();
 _end_time = currentTimeMillis();
 if( _USE_REQUESTANIMATIONFRAME ){
  if( !!window.requestAnimationFrame ){
   _sleep();
   window.requestAnimationFrame( _loop );
  } else if( !!window.webkitRequestAnimationFrame ){
   _sleep();
   window.webkitRequestAnimationFrame( _loop );
  } else if( !!window.mozRequestAnimationFrame ){
   _sleep();
   window.mozRequestAnimationFrame( _loop );
  } else if( !!window.oRequestAnimationFrame ){
   _sleep();
   window.oRequestAnimationFrame( _loop );
  } else if( !!window.msRequestAnimationFrame ){
   _sleep();
   window.msRequestAnimationFrame( _loop );
  } else {
   _getSleepTime();
   window.setTimeout( _loop, _sleep_time );
  }
 } else {
  _getSleepTime();
  window.setTimeout( _loop, _sleep_time );
 }
}
function _addEventListener( target, event, func ){
 if( !!target.addEventListener ){
  target.addEventListener( event, func, false );
 } else if( !!target.attachEvent ){
  target.attachEvent( "on" + event, func );
 } else {
  target["on" + event] = func;
 }
}
function _removeEventListener( target, event, func ){
 if( !!target.removeEventListener ){
  target.removeEventListener( event, func, false );
 } else if( !!target.detachEvent ){
  target.detachEvent( "on" + event, func );
 } else {
  target["on" + event] = null;
 }
}
function setCurrent( id ){
 _canvas = document.getElementById( id );
 _context = _canvas.getContext( "2d" );
 _lock = false;
 _context.textAlign = "left";
 _context.textBaseline = "bottom";
 _g = new _Graphics();
 if( _USE_MOUSE ){
  _addEventListener( _canvas, "mousedown", _onMouseDown );
  _addEventListener( _canvas, "mousemove", _onMouseMove );
  _addEventListener( _canvas, "mouseout", _onMouseOut );
  _addEventListener( _canvas, "mouseover", _onMouseOver );
  _addEventListener( _canvas, "mouseup", _onMouseUp );
 }
}
function setGraphics( g ){
 _g = g;
}
function getCurrent(){
 return _canvas;
}
function getCurrentContext(){
 return _context;
}
function getGraphics(){
 return _g;
}
function setCanvasSize( _width, _height ){
 _canvas.width = _width;
 _canvas.height = _height;
 _context.textAlign = "left";
 _context.textBaseline = "bottom";
}
function getWidth(){
 return parseInt( _canvas.width );
}
function getHeight(){
 return parseInt( _canvas.height );
}
function _getLeft( e ){
 var left = 0;
 while( e ){
  left += e.offsetLeft;
  e = e.offsetParent;
 }
 return left;
}
function _getTop( e ){
 var top = 0;
 while( e ){
  top += e.offsetTop;
  e = e.offsetParent;
 }
 return top;
}
function getBrowserWidth(){
 if( (!!document.documentElement) && (document.documentElement.clientWidth > 0) ){
  return document.documentElement.clientWidth;
 } else if( !!document.body ){
  return document.body.clientWidth;
 } else if( !!window.innerWidth ){
  return window.innerWidth;
 }
 return 0;
}
function getBrowserHeight(){
 if( (!!document.documentElement) && (document.documentElement.clientHeight > 0) ){
  return document.documentElement.clientHeight;
 } else if( !!document.body ){
  return document.body.clientHeight;
 } else if( !!window.innerHeight ){
  return window.innerHeight;
 }
 return 0;
}
function getOrientation(){
 return window.orientation;
}
function readParameter( text, key ){
 var ret = "";
 var start = text.indexOf( "?" + key + "=" );
 if( start < 0 ){
  start = text.indexOf( "&" + key + "=" );
 }
 if( start >= 0 ){
  start += key.length + 2;
  var end = text.indexOf( "&", start );
  if( end < 0 ){
   end = text.length;
  }
  ret = text.substring( start, end );
 }
 return decodeURIComponent( ret );
}
function readParameters( text ){
 var params = text.split( "&" );
 var key = new Array();
 for( var i = 0; i < params.length; i++ ){
  var param = params[i].split( "=" );
  key[param[0]] = decodeURIComponent( param[1] );
 }
 return key;
}
function getParameter( key ){
 return readParameter( location.href, key );
}
function getResImage( id ){
 return document.getElementById( id );
}
function getResString( id ){
 var str = document.getElementById( id ).innerHTML;
 str = str.replace( new RegExp( "&lt;", "igm" ), "<" );
 str = str.replace( new RegExp( "&gt;", "igm" ), ">" );
 return str;
}
function currentTimeMillis(){
 return (new Date()).getTime();
}
function setKeyArray( array ){
 var len = array.length;
 _key_array = new Array();
 for( var i = 0; i < len; i++ ){
  _key_array[i] = array[i];
 }
}
function keyBit( key ){
 var len = _key_array.length;
 for( var i = 0; i < len; i++ ){
  if( _key_array[i] == key ){
   return (1 << i);
  }
 }
 return 0;
}
function _onKeyDown( e ){
 var k = keyBit( e.keyCode );
 if( (_key & k) == 0 ){
  _key += k;
 }
 processEvent( 4, e.keyCode );
}
function _onKeyUp( e ){
 var k = keyBit( e.keyCode );
 if( (_key & k) != 0 ){
  _key -= k;
 }
 processEvent( 5, e.keyCode );
}
function getKeypadState(){
 return _key;
}
function __MainLayout( x, y, width, height, id ){
 this.x = x;
 this.y = y;
 this.width = width;
 this.height = height;
 this.id = id;
 this.shape = null;
 this.coords = null;
}
function clearLayout(){
 _layout = new Array();
}
function addLayout( x, y, w, h, id ){
 _layout[_layout.length] = new __MainLayout( x, y, w, h, id );
}
function addLayoutArea( x, y, width, height, id, shape, coords ){
 addLayout( x, y, width, height, id );
 if( !!_context.isPointInPath ){
  _layout[_layout.length - 1].shape = shape;
  var tmp = coords.split( "," );
  _layout[_layout.length - 1].coords = new Array( tmp.length );
  for( var i = 0; i < tmp.length; i++ ){
   _layout[_layout.length - 1].coords[i] = parseInt( tmp[i] );
  }
 }
}
function getLayout( id ){
 if( _layout.length > 0 ){
  for( var i = 0; i < _layout.length; i++ ){
   if( _layout[i].id == id ){
    return _layout[i];
   }
  }
 }
 return null;
}
function checkLayout( x, y ){
 if( _layout.length > 0 ){
  for( var i = 0; i < _layout.length; i++ ){
   if( _layout[i].shape == null ){
    if(
     (x >= _layout[i].x) &&
     (x < _layout[i].x + _layout[i].width) &&
     (y >= _layout[i].y) &&
     (y < _layout[i].y + _layout[i].height)
    ){
     return _layout[i].id;
    }
   } else {
    _context.beginPath();
    if( _layout[i].shape == "circle" ){
     _context.arc(
      _layout[i].x + _layout[i].coords[0],
      _layout[i].y + _layout[i].coords[1],
      _layout[i].coords[2],
      0.0, Math.PI * 2.0, false
      );
    } else if( _layout[i].shape == "poly" ){
     _context.moveTo(
      _layout[i].x + _layout[i].coords[0],
      _layout[i].y + _layout[i].coords[1]
      );
     for( var j = 2; j < _layout[i].coords.length - 1; j += 2 ){
      _context.lineTo(
       _layout[i].x + _layout[i].coords[j],
       _layout[i].y + _layout[i].coords[j + 1]
       );
     }
     _context.closePath();
    } else if( _layout[i].shape == "rect" ){
     _context.moveTo( _layout[i].x + _layout[i].coords[0], _layout[i].y + _layout[i].coords[1] );
     _context.lineTo( _layout[i].x + _layout[i].coords[2], _layout[i].y + _layout[i].coords[1] );
     _context.lineTo( _layout[i].x + _layout[i].coords[2], _layout[i].y + _layout[i].coords[3] );
     _context.lineTo( _layout[i].x + _layout[i].coords[0], _layout[i].y + _layout[i].coords[3] );
     _context.closePath();
    }
    if( _context.isPointInPath( x, y ) ){
     return _layout[i].id;
    }
   }
  }
 }
 return -1;
}
function getLayoutState(){
 var ret = 0;
 var id;
 for( var i = 0; i < _touch_x.length; i++ ){
  id = checkLayout( _touch_x[i], _touch_y[i] );
  if( id >= 0 ){
   ret |= (1 << id);
  }
 }
 return ret;
}
function layoutBit( id ){
 return (1 << id);
}
function _getMouse( e ){
 _mouse_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - _getLeft( _canvas );
 _mouse_y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - _getTop( _canvas );
}
function _onMouseDown( e ){
 _getMouse( e );
 if( _use_layout ){
  if( _layout.length > 0 ){
   var p = checkLayout( _mouse_x, _mouse_y );
   if( p >= 0 ){
    processEvent( 6, p );
    return;
   }
  }
 }
 processEvent( 8, 0 );
}
function _onMouseMove( e ){
 _getMouse( e );
 processEvent( 9, 0 );
}
function _onMouseOut( e ){
 _getMouse( e );
 processEvent( 10, 0 );
}
function _onMouseOver( e ){
 _getMouse( e );
 processEvent( 11, 0 );
}
function _onMouseUp( e ){
 _getMouse( e );
 if( _use_layout ){
  if( _layout.length > 0 ){
   var p = checkLayout( _mouse_x, _mouse_y );
   if( p >= 0 ){
    processEvent( 7, p );
    return;
   }
  }
 }
 processEvent( 12, 0 );
}
function getMouseX(){
 return _mouse_x;
}
function getMouseY(){
 return _mouse_y;
}
function _getTouch( e ){
 _touch_x = new Array();
 _touch_y = new Array();
 for( var i = 0; i < e.touches.length; i++ ){
  _touch_x[i] = e.touches[i].pageX - _getLeft( _canvas );
  _touch_y[i] = e.touches[i].pageY - _getTop( _canvas );
 }
}
function _onTouchStart( e ){
 _getTouch( e );
 _touch_x0 = _touch_x[0];
 _touch_y0 = _touch_y[0];
 if( (_touch_x0 >= 0) && (_touch_x0 < getWidth()) && (_touch_y0 >= 0) && (_touch_y0 < getHeight()) ){
  _touch_start = true;
  if( _use_layout ){
   if( _layout.length > 0 ){
    var p = checkLayout( _touch_x0, _touch_y0 );
    if( p >= 0 ){
     processEvent( 6, p );
     e.preventDefault();
     return;
    }
   }
  }
  processEvent( 15, 0 );
  e.preventDefault();
 }
}
function _onTouchMove( e ){
 if( _touch_start ){
  _getTouch( e );
  _touch_x0 = _touch_x[0];
  _touch_y0 = _touch_y[0];
  processEvent( 16, 0 );
  e.preventDefault();
 }
}
function _onTouchEnd( e ){
 if( _touch_start ){
  _touch_start = false;
  _getTouch( e );
  if( _use_layout ){
   if( _layout.length > 0 ){
    var p = checkLayout( _touch_x0, _touch_y0 );
    if( p >= 0 ){
     processEvent( 7, p );
     e.preventDefault();
     return;
    }
   }
  }
  processEvent( 17, 0 );
  e.preventDefault();
 }
}
function touchNum(){
 return _touch_x.length;
}
function getTouchX( index ){
 return ((index < _touch_x.length) ? _touch_x[index] : _touch_x0);
}
function getTouchY( index ){
 return ((index < _touch_y.length) ? _touch_y[index] : _touch_y0);
}
function launch( url ){
 location.replace( url );
}
function setFont( size, family ){
 _font_size = size;
 _font_family = (family.indexOf( " " ) >= 0) ? "'" + family + "'" : family;
 _text.style.cssText = _text_style + ";font:" + _font_size + "px " + _font_family;
}
function stringWidth( str ){
 _text.innerHTML = "'";
 var tmp = _text.offsetWidth;
 str = str.replace( new RegExp( "<", "igm" ), "&lt;" );
 str = str.replace( new RegExp( ">", "igm" ), "&gt;" );
 _text.innerHTML = "'" + str + "'";
 return _text.offsetWidth - tmp * 2;
}
function fontHeight(){
 return _font_size;
}
function _drawStringEx( str, x, y ){
 if( _lock ){
  return;
 }
 if( _stringex_num >= _stringex.length ){
  _stringex[_stringex_num] = document.createElement( "span" );
  _stringex[_stringex_num].style.cssText = "position:absolute";
  document.body.appendChild( _stringex[_stringex_num] );
  if( _USE_MOUSE ){
   _addEventListener( _stringex[_stringex_num], "mousedown", _onMouseDown );
   _addEventListener( _stringex[_stringex_num], "mousemove", _onMouseMove );
   _addEventListener( _stringex[_stringex_num], "mouseup", _onMouseUp );
  }
 }
 _stringex[_stringex_num].style.cssText = "position:absolute;left:" + (_getLeft( _canvas ) + x) + "px;top:" + (_getTop( _canvas ) + y - _font_size) + "px;color:" + _color + ";font:" + _font_size + "px " + _font_family;
 str = str.replace( new RegExp( "<", "igm" ), "&lt;" );
 str = str.replace( new RegExp( ">", "igm" ), "&gt;" );
 _stringex[_stringex_num].innerHTML = str;
 _stringex_num++;
}
function _GLDrawPrimitive( p, index, tex_index, mat, trans ){
 this._p = p;
 this._index = index;
 this._tex_index = tex_index;
 this._mat = new Array( 16 );
 for( var i = 0; i < 16; i++ ){
  this._mat[i] = mat[i];
 }
 this._trans = (trans >= 0) ? trans : p._glp.transparency();
}
_GLDrawPrimitive.prototype = {
 draw : function( gl, glt , alpha ){
  switch( this._p._glp.type() ){
  case _GLPRIMITIVE_TYPE_MODEL:
   this._p._glp.setTransparency( this._trans );
   this._p.draw( gl, glt, this._index, this._tex_index, alpha );
   break;
  case _GLPRIMITIVE_TYPE_SPRITE:
   this._p._glp.setTransparency( this._trans );
   this._p.draw( gl, glt, this._tex_index, alpha );
   break;
  }
 }
};
function _GLDraw( proj_mat, look_mat ){
 var i;
 this._proj_mat = new Array( 16 );
 if( proj_mat != null ){
  for( i = 0; i < 16; i++ ){
   this._proj_mat[i] = proj_mat[i];
  }
 }
 this._look_mat = new Array( 16 );
 if( look_mat != null ){
  for( i = 0; i < 16; i++ ){
   this._look_mat[i] = look_mat[i];
  }
 }
 this._draw = new Array();
}
_GLDraw.prototype = {
 clear : function(){
  this._draw = new Array();
 },
 add : function( p, index, tex_index, mat, trans ){
  this._draw[this._draw.length] = new _GLDrawPrimitive( p, index, tex_index, mat, trans );
 },
 addSprite : function( glu , p, tex_index, x, y, z, trans ){
  this._draw[this._draw.length] = new _GLDrawPrimitive( p, -1, tex_index, glu.spriteMatrix( x, y, z ), trans );
 },
 draw : function( gl, glt ){
  var i;
  var tmp;
  var count = this._draw.length;
  for( i = 0; i < count; i++ ){
   tmp = this._draw[i];
   glDrawUseProgram( gl, tmp._p, tmp._index );
   glDrawSetProjectionMatrix( gl, this._proj_mat, tmp._p, tmp._index );
   glDrawSetLookMatrix( gl, this._look_mat, tmp._p, tmp._index );
   glDrawSetModelViewMatrix( gl, tmp._mat, tmp._p, tmp._index );
   tmp.draw( gl, glt, false );
  }
  for( i = 0; i < count; i++ ){
   tmp = this._draw[i];
   glDrawUseProgram( gl, tmp._p, tmp._index );
   glDrawSetProjectionMatrix( gl, this._proj_mat, tmp._p, tmp._index );
   glDrawSetLookMatrix( gl, this._look_mat, tmp._p, tmp._index );
   glDrawSetModelViewMatrix( gl, tmp._mat, tmp._p, tmp._index );
   tmp.draw( gl, glt, true );
  }
 }
};
function canUseWebGL(){
 var canvas = document.createElement( "canvas" );
 var context = canvas.getContext( "webgl" );
 return (context != null);
}
var _gl;
var _glu;
var _3d = null;
function setCurrent3D( id, id2D ){
 if( _USE_MOUSE && (_canvas != null) ){
  _removeEventListener( _canvas, "mousedown", _onMouseDown );
  _removeEventListener( _canvas, "mousemove", _onMouseMove );
  _removeEventListener( _canvas, "mouseout", _onMouseOut );
  _removeEventListener( _canvas, "mouseover", _onMouseOver );
  _removeEventListener( _canvas, "mouseup", _onMouseUp );
 }
 _canvas = document.getElementById( id );
 _gl = _canvas.getContext( "webgl" );
 _lock = false;
 if( id2D != undefined ){
  _3d = _canvas;
  _canvas = document.getElementById( id2D );
  _context = _canvas.getContext( "2d" );
  _canvas.width = _3d.width;
  _canvas.height = _3d.height;
  _context.textAlign = "left";
  _context.textBaseline = "bottom";
  _g = new _Graphics();
 }
 if( _USE_MOUSE ){
  _addEventListener( _canvas, "mousedown", _onMouseDown );
  _addEventListener( _canvas, "mousemove", _onMouseMove );
  _addEventListener( _canvas, "mouseout", _onMouseOut );
  _addEventListener( _canvas, "mouseover", _onMouseOver );
  _addEventListener( _canvas, "mouseup", _onMouseUp );
 }
 _glu = new _GLUtility( _gl );
 init3D( _gl, _glu );
 if( _3d != null ){
  init2D();
 }
 window.repaint = function(){
  paint3D( _gl, _glu );
  if( _3d != null ){
   _context.clearRect( 0, 0, getWidth(), getHeight() );
   _context.save();
   paint2D( _g );
   _context.restore();
  }
 };
}
function getCurrent3D(){
 return (_3d == null) ? _canvas : _3d;
}
function getCurrentContext3D(){
 return _gl;
}
function setCanvas3DSize( _width, _height ){
 getCurrent3D().width = _width;
 getCurrent3D().height = _height;
}
function _GLModel( id, depth, lighting ){
 this._glp = new _GLPrimitive();
 this._glp.setType( _GLPRIMITIVE_TYPE_MODEL );
 this._glp.setDepth( depth );
 this._id = id;
 this._lighting = lighting;
 this._material_num = 0;
 this._material_texture = null;
 this._material_diffuse = null;
 this._material_ambient = null;
 this._material_emission = null;
 this._material_specular = null;
 this._material_shininess = null;
 this._object_num = 0;
 this._coord = null;
 this._normal = null;
 this._color = null;
 this._map = null;
 this._strip_num = 0;
 this._strip_material = null;
 this._strip_coord = null;
 this._strip_normal = null;
 this._strip_color = null;
 this._strip_map = null;
 this._strip_len = null;
 this._strip = null;
 this._strip_tx = null;
 this._strip_ty = null;
 this._strip_tz = null;
 this._strip_or = null;
 this._strip_ox = null;
 this._strip_oy = null;
 this._strip_oz = null;
 this._texture_env_mode_flag = false;
 this._texture_env_mode = 0;
 this._position_buffer = null;
 this._normal_buffer = null;
 this._color_buffer = null;
 this._texture_coord_buffer = null;
 this._strip_buffer = null;
}
_GLModel.prototype = {
 type : function(){
  return this._glp.type();
 },
 depth : function(){
  return this._glp.depth();
 },
 setTransparency : function( trans ){
  this._glp.setTransparency( trans );
 },
 transparency : function(){
  return this._glp.transparency();
 },
 setMaterial : function( num, texture , diffuse , ambient , emission , specular , shininess ){
  this._material_num = num;
  this._material_texture = texture;
  this._material_diffuse = diffuse;
  this._material_ambient = ambient;
  this._material_emission = emission;
  this._material_specular = specular;
  this._material_shininess = shininess;
 },
 setObject : function( num, coord , normal , color , map ){
  this._object_num = num;
  this._coord = coord;
  this._normal = normal;
  this._color = color;
  this._map = map;
 },
 setStrip : function( num, material , coord , normal , color , map , len , strip ){
  this._strip_num = num;
  this._strip_material = material;
  this._strip_coord = coord;
  this._strip_normal = normal;
  this._strip_color = color;
  this._strip_map = map;
  this._strip_len = len;
  this._strip = strip;
 },
 setStripTranslate : function( tx, ty, tz ){
  this._strip_tx = tx;
  this._strip_ty = ty;
  this._strip_tz = tz;
 },
 setStripRotate : function( or, ox, oy, oz ){
  this._strip_or = or;
  this._strip_ox = ox;
  this._strip_oy = oy;
  this._strip_oz = oz;
 },
 setTextureEnvMode : function( mode ){
  this._texture_env_mode_flag = true;
  this._texture_env_mode = mode;
 },
 stripNum : function(){
  return this._strip_num;
 },
 textureIndex : function( index ){
  if( this._strip_material[index] < 0 ){
   return -1;
  }
  return this._material_texture[this._strip_material[index]];
 },
 textureAlpha : function( glt , index, tex_index ){
  var alpha = false;
  var depth = this._glp.depth();
  if( tex_index < 0 ){
   tex_index = this.textureIndex( index );
  }
  if( tex_index >= 0 ){
   glt.use( tex_index );
   glt.setTransparency( tex_index, this._glp.transparency() );
   alpha = glt.alpha( tex_index );
   if( depth ){
    depth = glt.depth( tex_index );
   }
  }
  return (alpha && !depth);
 },
 draw : function( gl, glt , index, tex_index, alpha ){
  var alpha2 = this.textureAlpha( glt, index, tex_index );
  if( this._glp.transparency() != 255 ){
   alpha2 = true;
  }
  if( alpha2 != alpha ){
   return;
  }
  if( this._strip_coord[index] >= 0 ){
   this._position_buffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, this._position_buffer );
   gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._coord[this._strip_coord[index]] ), gl.STATIC_DRAW );
   glModelBindPositionBuffer( gl, this._id, this._lighting );
   gl.bindBuffer( gl.ARRAY_BUFFER, null );
  }
  if( (this._normal != null) && (this._strip_normal[index] >= 0) ){
   this._normal_buffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, this._normal_buffer );
   gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._normal[this._strip_normal[index]] ), gl.STATIC_DRAW );
   glModelBindNormalBuffer( gl, this._id, this._lighting );
   gl.bindBuffer( gl.ARRAY_BUFFER, null );
  }
  if( (this._color != null) && (this._strip_color[index] >= 0) ){
   this._color_buffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, this._color_buffer );
   gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._color[this._strip_color[index]] ), gl.STATIC_DRAW );
   glModelBindColorBuffer( gl, this._id, this._lighting );
   gl.bindBuffer( gl.ARRAY_BUFFER, null );
  }
  if( tex_index < 0 ){
   tex_index = this.textureIndex( index );
  }
  if( !glModelSetTexture( gl, glt, index, tex_index, this._id, this._lighting ) ){
   if( (this._map != null) && (this._strip_map[index] >= 0) && (tex_index >= 0) ){
    gl.activeTexture( gl.TEXTURE0 );
    glt.bindTexture( gl.TEXTURE_2D, glt.id( tex_index ) );
    this._texture_coord_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this._texture_coord_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._map[this._strip_map[index]] ), gl.STATIC_DRAW );
    glModelBindTextureCoordBuffer( gl, this._id, this._lighting );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );
   }
  }
  var material_diffuse = null;
  var material_ambient = null;
  var material_emission = null;
  var material_specular = null;
  var material_shininess = null;
  if( (this._material_diffuse != null) && (this._strip_material[index] >= 0) ){
   material_diffuse = new Array( 4 );
   material_diffuse[0] = this._material_diffuse[this._strip_material[index] * 4 ];
   material_diffuse[1] = this._material_diffuse[this._strip_material[index] * 4 + 1];
   material_diffuse[2] = this._material_diffuse[this._strip_material[index] * 4 + 2];
   material_diffuse[3] = this._material_diffuse[this._strip_material[index] * 4 + 3];
  }
  if( (this._material_ambient != null) && (this._strip_material[index] >= 0) ){
   material_ambient = new Array( 4 );
   material_ambient[0] = this._material_ambient[this._strip_material[index] * 4 ];
   material_ambient[1] = this._material_ambient[this._strip_material[index] * 4 + 1];
   material_ambient[2] = this._material_ambient[this._strip_material[index] * 4 + 2];
   material_ambient[3] = this._material_ambient[this._strip_material[index] * 4 + 3];
  }
  if( (this._material_emission != null) && (this._strip_material[index] >= 0) ){
   material_emission = new Array( 4 );
   material_emission[0] = this._material_emission[this._strip_material[index] * 4 ];
   material_emission[1] = this._material_emission[this._strip_material[index] * 4 + 1];
   material_emission[2] = this._material_emission[this._strip_material[index] * 4 + 2];
   material_emission[3] = this._material_emission[this._strip_material[index] * 4 + 3];
  }
  if( (this._material_specular != null) && (this._strip_material[index] >= 0) ){
   material_specular = new Array( 4 );
   material_specular[0] = this._material_specular[this._strip_material[index] * 4 ];
   material_specular[1] = this._material_specular[this._strip_material[index] * 4 + 1];
   material_specular[2] = this._material_specular[this._strip_material[index] * 4 + 2];
   material_specular[3] = this._material_specular[this._strip_material[index] * 4 + 3];
  }
  if( (this._material_shininess != null) && (this._strip_material[index] >= 0) ){
   material_shininess = this._material_shininess[this._strip_material[index]];
  }
  if( alpha2 ){
   gl.enable( gl.BLEND );
   gl.depthMask( false );
  }
  if( glModelBeginDraw( gl, glt, index, tex_index, this._id, this._lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ) ){
   this._strip_buffer = gl.createBuffer();
   gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._strip_buffer );
   gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this._strip[index] ), gl.STATIC_DRAW );
   var count = gl.getBufferParameter( gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE ) / 2 ;
   gl.drawElements( gl.TRIANGLE_STRIP, count, gl.UNSIGNED_SHORT, 0 );
   gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
   glModelEndDraw( gl, glt, index, tex_index, this._id, this._lighting );
  }
  if( alpha2 ){
   gl.disable( gl.BLEND );
   gl.depthMask( true );
  }
 },
};
window._GLPRIMITIVE_TYPE_MODEL = 0;
window._GLPRIMITIVE_TYPE_SPRITE = 1;
function _GLPrimitive(){
 this._type = _GLPRIMITIVE_TYPE_MODEL;
 this._depth = false;
 this._trans = 255;
}
_GLPrimitive.prototype = {
 setType : function( type ){
  this._type = type;
 },
 setDepth : function( depth ){
  this._depth = depth;
 },
 setTransparency : function( trans ){
  this._trans = trans;
 },
 type : function(){
  return this._type;
 },
 depth : function(){
  return this._depth;
 },
 transparency : function(){
  return this._trans;
 }
};
function _GLSprite( gl, depth ){
 this._glp = new _GLPrimitive();
 this._glp.setType( _GLPRIMITIVE_TYPE_SPRITE );
 this._glp.setDepth( depth );
 this._coord = new Array( 12 );
 this._map = new Array( 8 );
 this._uv = new Array( 8 );
 this._uv_f = true;
 this._coord_buffer = gl.createBuffer();
 this._uv_buffer = gl.createBuffer();
 this._coord[0] = -1.0; this._coord[ 1] = -1.0; this._coord[ 2] = 0.0;
 this._coord[3] = 1.0; this._coord[ 4] = -1.0; this._coord[ 5] = 0.0;
 this._coord[6] = -1.0; this._coord[ 7] = 1.0; this._coord[ 8] = 0.0;
 this._coord[9] = 1.0; this._coord[10] = 1.0; this._coord[11] = 0.0;
 this._uv[0] = 0.0; this._uv[1] = 1.0;
 this._uv[2] = 1.0; this._uv[3] = 1.0;
 this._uv[4] = 0.0; this._uv[5] = 0.0;
 this._uv[6] = 1.0; this._uv[7] = 0.0;
}
_GLSprite.prototype = {
 type : function(){
  return this._glp.type();
 },
 depth : function(){
  return this._glp.depth();
 },
 setTransparency : function( trans ){
  this._glp.setTransparency( trans );
 },
 transparency : function(){
  return this._glp.transparency();
 },
 setCoord : function( coord ){
  for( var i = 0; i < 12; i++ ){
   this._coord[i] = coord[i];
  }
 },
 setMap : function( map, uv ){
  if( uv == undefined ){
   uv = false;
  }
  this._uv_f = uv;
  if( this._uv_f ){
   for( var i = 0; i < 8; i++ ){
    this._uv[i] = map[i];
   }
  } else {
   for( var i = 0; i < 8; i++ ){
    this._map[i] = map[i];
   }
  }
 },
 textureAlpha : function( glt , tex_index ){
  glt.use( tex_index );
  glt.setTransparency( tex_index, this._glp.transparency() );
  return (glt.alpha( tex_index ) && !this._glp.depth());
 },
 draw : function( gl, glt , tex_index, alpha ){
  var alpha2 = this.textureAlpha( glt, tex_index );
  if( this._glp.transparency() != 255 ){
   alpha2 = true;
  }
  if( alpha2 != alpha ){
   return;
  }
  gl.bindBuffer( gl.ARRAY_BUFFER, this._coord_buffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._coord ), gl.STATIC_DRAW );
  glSpriteBindPositionBuffer( gl );
  gl.bindBuffer( gl.ARRAY_BUFFER, null );
  if( !this._uv_f ){
   var width = glt.width( tex_index );
   var height = glt.height( tex_index );
   for( var i = 0; i < 4; i++ ){
    this._uv[i * 2 ] = this._map[i * 2 ] / width;
    this._uv[i * 2 + 1] = this._map[i * 2 + 1] / height;
   }
  }
  gl.bindBuffer( gl.ARRAY_BUFFER, this._uv_buffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._uv ), gl.STATIC_DRAW );
  glSpriteBindTextureCoordBuffer( gl );
  gl.bindBuffer( gl.ARRAY_BUFFER, null );
  gl.activeTexture( gl.TEXTURE0 );
  glt.bindTexture( gl.TEXTURE_2D, glt.id( tex_index ) );
  if( alpha2 ){
   gl.enable( gl.BLEND );
   gl.depthMask( false );
  }
  gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
  if( alpha2 ){
   gl.disable( gl.BLEND );
   gl.depthMask( true );
  }
 }
};
window._GLUTILITY_TOLERANCE_M = -1.0;
window._GLUTILITY_TOLERANCE = 1.0;
function _GLUtility( gl ){
 this._gl = gl;
 this.util_mat = new Array( 16 );
 this.tmp_mat = new Array( 16 );
 this.save_mat = new Array( 16 );
 this._rotate = new Array( 16 );
 this._rotate[ 3] = 0.0;
 this._rotate[ 7] = 0.0;
 this._rotate[11] = 0.0;
 this._rotate[12] = 0.0;
 this._rotate[13] = 0.0;
 this._rotate[14] = 0.0;
 this._rotate[15] = 1.0;
 this._scale = new Array( 16 );
 this._scale[ 0] = 1.0; this._scale[ 1] = 0.0; this._scale[ 2] = 0.0; this._scale[ 3] = 0.0;
 this._scale[ 4] = 0.0; this._scale[ 5] = 1.0; this._scale[ 6] = 0.0; this._scale[ 7] = 0.0;
 this._scale[ 8] = 0.0; this._scale[ 9] = 0.0; this._scale[10] = 1.0; this._scale[11] = 0.0;
 this._scale[12] = 0.0; this._scale[13] = 0.0; this._scale[14] = 0.0; this._scale[15] = 1.0;
 this._translate = new Array( 16 );
 this._translate[ 0] = 1.0; this._translate[ 1] = 0.0; this._translate[ 2] = 0.0; this._translate[ 3] = 0.0;
 this._translate[ 4] = 0.0; this._translate[ 5] = 1.0; this._translate[ 6] = 0.0; this._translate[ 7] = 0.0;
 this._translate[ 8] = 0.0; this._translate[ 9] = 0.0; this._translate[10] = 1.0; this._translate[11] = 0.0;
 this._translate[12] = 0.0; this._translate[13] = 0.0; this._translate[14] = 0.0; this._translate[15] = 1.0;
 this.trans_x = 0.0;
 this.trans_y = 0.0;
 this.trans_z = 0.0;
 this.cross_x = 0.0;
 this.cross_y = 0.0;
 this.cross_z = 0.0;
 this.normalize_x = 0.0;
 this.normalize_y = 0.0;
 this.normalize_z = 0.0;
 this.reflect_x = 0.0;
 this.reflect_y = 0.0;
 this.reflect_z = 0.0;
 this.seek_len = 0;
 this.seek_vertex = new Array( 3 );
 this.coord_x = new Array( 3 );
 this.coord_y = new Array( 3 );
 this.coord_z = new Array( 3 );
 this.normal_x = 0.0;
 this.normal_y = 0.0;
 this.normal_z = 0.0;
 this.center_x = 0.0;
 this.center_y = 0.0;
 this.center_z = 0.0;
 this.hit_x = 0.0;
 this.hit_y = 0.0;
 this.hit_z = 0.0;
 this.look_side = new Array( 3 );
 this.look_mat = new Array( 16 );
 this.model_mat = new Array( 16 );
 this.proj_mat = new Array( 16 );
 this.view_mat = new Array( 4 );
 this.project_in = new Array( 4 );
 this.project_out = new Array( 4 );
 this.project_x = 0.0;
 this.project_y = 0.0;
 this.project_z = 0.0;
}
_GLUtility.prototype = {
 genTextures : function( n, textures ){
  for( var i = 0; i < n; i++ ){
   textures[i] = this._gl.createTexture();
  }
 },
 deleteTextures : function( n, textures ){
  for( var i = 0; i < n; i++ ){
   this._gl.deleteTexture( textures[i] );
  }
 },
 bindTexture : function( target, texture ){
  if( texture == undefined ){
   texture = target;
   target = this._gl.TEXTURE_2D;
  }
  this._gl.bindTexture( target, texture );
 },
 texImage2D : function( target, image ){
  if( image == undefined ){
   image = target;
   target = this._gl.TEXTURE_2D;
  }
  var level = 0;
  var internalformat = this._gl.RGBA;
  var format = this._gl.RGBA;
  var type = this._gl.UNSIGNED_BYTE;
  this._gl.texImage2D( target, level, internalformat, format, type, image );
 },
 deg2rad : function( angle ){
  return (angle * 3.14159265358979323846264) / 180.0;
 },
 rad2deg : function( angle ){
  return (angle * 180.0) / 3.14159265358979323846264;
 },
 glMatrix : function(){
  var _matrix = new Float32Array( 16 );
  var i, j, k;
  for( j = 0; j < 4; j++ ){
   k = j * 4;
   for( i = 0; i < 4; i++ ){
    _matrix[k + i] = this.util_mat[i * 4 + j];
   }
  }
  return _matrix;
 },
 utMatrix : function( matrix ){
  var _matrix = new Array( 16 );
  var i, j, k;
  for( j = 0; j < 4; j++ ){
   k = j * 4;
   for( i = 0; i < 4; i++ ){
    _matrix[k + i] = matrix[i * 4 + j];
   }
  }
  return _matrix;
 },
 push : function(){
  for( var i = 0; i < 16; i++ ){
   this.save_mat[i] = this.util_mat[i];
  }
 },
 pop : function(){
  for( var i = 0; i < 16; i++ ){
   this.util_mat[i] = this.save_mat[i];
  }
 },
 invert : function(){
  var det;
  this.tmp_mat[ 0] = this.util_mat[5] * this.util_mat[10] * this.util_mat[15] - this.util_mat[5] * this.util_mat[11] * this.util_mat[14] - this.util_mat[9] * this.util_mat[6] * this.util_mat[15] + this.util_mat[9] * this.util_mat[7] * this.util_mat[14] + this.util_mat[13] * this.util_mat[6] * this.util_mat[11] - this.util_mat[13] * this.util_mat[7] * this.util_mat[10];
  this.tmp_mat[ 4] = -this.util_mat[4] * this.util_mat[10] * this.util_mat[15] + this.util_mat[4] * this.util_mat[11] * this.util_mat[14] + this.util_mat[8] * this.util_mat[6] * this.util_mat[15] - this.util_mat[8] * this.util_mat[7] * this.util_mat[14] - this.util_mat[12] * this.util_mat[6] * this.util_mat[11] + this.util_mat[12] * this.util_mat[7] * this.util_mat[10];
  this.tmp_mat[ 8] = this.util_mat[4] * this.util_mat[ 9] * this.util_mat[15] - this.util_mat[4] * this.util_mat[11] * this.util_mat[13] - this.util_mat[8] * this.util_mat[5] * this.util_mat[15] + this.util_mat[8] * this.util_mat[7] * this.util_mat[13] + this.util_mat[12] * this.util_mat[5] * this.util_mat[11] - this.util_mat[12] * this.util_mat[7] * this.util_mat[ 9];
  this.tmp_mat[12] = -this.util_mat[4] * this.util_mat[ 9] * this.util_mat[14] + this.util_mat[4] * this.util_mat[10] * this.util_mat[13] + this.util_mat[8] * this.util_mat[5] * this.util_mat[14] - this.util_mat[8] * this.util_mat[6] * this.util_mat[13] - this.util_mat[12] * this.util_mat[5] * this.util_mat[10] + this.util_mat[12] * this.util_mat[6] * this.util_mat[ 9];
  this.tmp_mat[ 1] = -this.util_mat[1] * this.util_mat[10] * this.util_mat[15] + this.util_mat[1] * this.util_mat[11] * this.util_mat[14] + this.util_mat[9] * this.util_mat[2] * this.util_mat[15] - this.util_mat[9] * this.util_mat[3] * this.util_mat[14] - this.util_mat[13] * this.util_mat[2] * this.util_mat[11] + this.util_mat[13] * this.util_mat[3] * this.util_mat[10];
  this.tmp_mat[ 5] = this.util_mat[0] * this.util_mat[10] * this.util_mat[15] - this.util_mat[0] * this.util_mat[11] * this.util_mat[14] - this.util_mat[8] * this.util_mat[2] * this.util_mat[15] + this.util_mat[8] * this.util_mat[3] * this.util_mat[14] + this.util_mat[12] * this.util_mat[2] * this.util_mat[11] - this.util_mat[12] * this.util_mat[3] * this.util_mat[10];
  this.tmp_mat[ 9] = -this.util_mat[0] * this.util_mat[ 9] * this.util_mat[15] + this.util_mat[0] * this.util_mat[11] * this.util_mat[13] + this.util_mat[8] * this.util_mat[1] * this.util_mat[15] - this.util_mat[8] * this.util_mat[3] * this.util_mat[13] - this.util_mat[12] * this.util_mat[1] * this.util_mat[11] + this.util_mat[12] * this.util_mat[3] * this.util_mat[ 9];
  this.tmp_mat[13] = this.util_mat[0] * this.util_mat[ 9] * this.util_mat[14] - this.util_mat[0] * this.util_mat[10] * this.util_mat[13] - this.util_mat[8] * this.util_mat[1] * this.util_mat[14] + this.util_mat[8] * this.util_mat[2] * this.util_mat[13] + this.util_mat[12] * this.util_mat[1] * this.util_mat[10] - this.util_mat[12] * this.util_mat[2] * this.util_mat[ 9];
  this.tmp_mat[ 2] = this.util_mat[1] * this.util_mat[ 6] * this.util_mat[15] - this.util_mat[1] * this.util_mat[ 7] * this.util_mat[14] - this.util_mat[5] * this.util_mat[2] * this.util_mat[15] + this.util_mat[5] * this.util_mat[3] * this.util_mat[14] + this.util_mat[13] * this.util_mat[2] * this.util_mat[ 7] - this.util_mat[13] * this.util_mat[3] * this.util_mat[ 6];
  this.tmp_mat[ 6] = -this.util_mat[0] * this.util_mat[ 6] * this.util_mat[15] + this.util_mat[0] * this.util_mat[ 7] * this.util_mat[14] + this.util_mat[4] * this.util_mat[2] * this.util_mat[15] - this.util_mat[4] * this.util_mat[3] * this.util_mat[14] - this.util_mat[12] * this.util_mat[2] * this.util_mat[ 7] + this.util_mat[12] * this.util_mat[3] * this.util_mat[ 6];
  this.tmp_mat[10] = this.util_mat[0] * this.util_mat[ 5] * this.util_mat[15] - this.util_mat[0] * this.util_mat[ 7] * this.util_mat[13] - this.util_mat[4] * this.util_mat[1] * this.util_mat[15] + this.util_mat[4] * this.util_mat[3] * this.util_mat[13] + this.util_mat[12] * this.util_mat[1] * this.util_mat[ 7] - this.util_mat[12] * this.util_mat[3] * this.util_mat[ 5];
  this.tmp_mat[14] = -this.util_mat[0] * this.util_mat[ 5] * this.util_mat[14] + this.util_mat[0] * this.util_mat[ 6] * this.util_mat[13] + this.util_mat[4] * this.util_mat[1] * this.util_mat[14] - this.util_mat[4] * this.util_mat[2] * this.util_mat[13] - this.util_mat[12] * this.util_mat[1] * this.util_mat[ 6] + this.util_mat[12] * this.util_mat[2] * this.util_mat[ 5];
  this.tmp_mat[ 3] = -this.util_mat[1] * this.util_mat[ 6] * this.util_mat[11] + this.util_mat[1] * this.util_mat[ 7] * this.util_mat[10] + this.util_mat[5] * this.util_mat[2] * this.util_mat[11] - this.util_mat[5] * this.util_mat[3] * this.util_mat[10] - this.util_mat[ 9] * this.util_mat[2] * this.util_mat[ 7] + this.util_mat[ 9] * this.util_mat[3] * this.util_mat[ 6];
  this.tmp_mat[ 7] = this.util_mat[0] * this.util_mat[ 6] * this.util_mat[11] - this.util_mat[0] * this.util_mat[ 7] * this.util_mat[10] - this.util_mat[4] * this.util_mat[2] * this.util_mat[11] + this.util_mat[4] * this.util_mat[3] * this.util_mat[10] + this.util_mat[ 8] * this.util_mat[2] * this.util_mat[ 7] - this.util_mat[ 8] * this.util_mat[3] * this.util_mat[ 6];
  this.tmp_mat[11] = -this.util_mat[0] * this.util_mat[ 5] * this.util_mat[11] + this.util_mat[0] * this.util_mat[ 7] * this.util_mat[ 9] + this.util_mat[4] * this.util_mat[1] * this.util_mat[11] - this.util_mat[4] * this.util_mat[3] * this.util_mat[ 9] - this.util_mat[ 8] * this.util_mat[1] * this.util_mat[ 7] + this.util_mat[ 8] * this.util_mat[3] * this.util_mat[ 5];
  this.tmp_mat[15] = this.util_mat[0] * this.util_mat[ 5] * this.util_mat[10] - this.util_mat[0] * this.util_mat[ 6] * this.util_mat[ 9] - this.util_mat[4] * this.util_mat[1] * this.util_mat[10] + this.util_mat[4] * this.util_mat[2] * this.util_mat[ 9] + this.util_mat[ 8] * this.util_mat[1] * this.util_mat[ 6] - this.util_mat[ 8] * this.util_mat[2] * this.util_mat[ 5];
  det = this.util_mat[0] * this.tmp_mat[0] + this.util_mat[1] * this.tmp_mat[4] + this.util_mat[2] * this.tmp_mat[8] + this.util_mat[3] * this.tmp_mat[12];
  if( det == 0.0 ){
   return false;
  }
  det = 1.0 / det;
  for( var i = 0; i < 16; i++ ){
   this.util_mat[i] = this.tmp_mat[i] * det;
  }
  return true;
 },
 multiply : function( matrix ){
  var i, j, k;
  for( j = 0; j < 4; j++ ){
   k = j * 4;
   for( i = 0; i < 4; i++ ){
    this.tmp_mat[k + i] =
     this.util_mat[k ] * matrix[ i] +
     this.util_mat[k + 1] * matrix[ 4 + i] +
     this.util_mat[k + 2] * matrix[ 8 + i] +
     this.util_mat[k + 3] * matrix[12 + i];
   }
  }
  this.set( this.tmp_mat );
 },
 rotate : function( angle, x, y, z ){
  var d = Math.sqrt( x * x + y * y + z * z );
  if( d != 0.0 ){
   x /= d;
   y /= d;
   z /= d;
  }
  var a = this.deg2rad( angle );
  var c = Math.cos( a );
  var s = Math.sin( a );
  var c2 = 1.0 - c;
  this._rotate[ 0] = x * x * c2 + c;
  this._rotate[ 1] = x * y * c2 - z * s;
  this._rotate[ 2] = x * z * c2 + y * s;
  this._rotate[ 4] = y * x * c2 + z * s;
  this._rotate[ 5] = y * y * c2 + c;
  this._rotate[ 6] = y * z * c2 - x * s;
  this._rotate[ 8] = x * z * c2 - y * s;
  this._rotate[ 9] = y * z * c2 + x * s;
  this._rotate[10] = z * z * c2 + c;
  this.multiply( this._rotate );
 },
 scale : function( x, y, z ){
  this._scale[ 0] = x;
  this._scale[ 5] = y;
  this._scale[10] = z;
  this.multiply( this._scale );
 },
 get : function(){
  var _matrix = new Array( 16 );
  for( var i = 0; i < 16; i++ ){
   _matrix[i] = this.util_mat[i];
  }
  return _matrix;
 },
 set : function( matrix ){
  for( var i = 0; i < 16; i++ ){
   this.util_mat[i] = matrix[i];
  }
 },
 setVal : function( index, value ){
  this.util_mat[index] = value;
 },
 setIdentity : function(){
  this.util_mat[ 0] = 1.0; this.util_mat[ 1] = 0.0; this.util_mat[ 2] = 0.0; this.util_mat[ 3] = 0.0;
  this.util_mat[ 4] = 0.0; this.util_mat[ 5] = 1.0; this.util_mat[ 6] = 0.0; this.util_mat[ 7] = 0.0;
  this.util_mat[ 8] = 0.0; this.util_mat[ 9] = 0.0; this.util_mat[10] = 1.0; this.util_mat[11] = 0.0;
  this.util_mat[12] = 0.0; this.util_mat[13] = 0.0; this.util_mat[14] = 0.0; this.util_mat[15] = 1.0;
 },
 translate : function( x, y, z ){
  this._translate[ 3] = x;
  this._translate[ 7] = y;
  this._translate[11] = z;
  this.multiply( this._translate );
 },
 transpose : function(){
  var i, j, k;
  for( j = 0; j < 4; j++ ){
   k = j * 4;
   for( i = 0; i < 4; i++ ){
    this.tmp_mat[k + i] = this.util_mat[i * 4 + j];
   }
  }
  this.set( this.tmp_mat );
 },
 transVector : function( x, y, z ){
  this.trans_x = this.util_mat[0] * x + this.util_mat[1] * y + this.util_mat[ 2] * z + this.util_mat[ 3] * 1.0;
  this.trans_y = this.util_mat[4] * x + this.util_mat[5] * y + this.util_mat[ 6] * z + this.util_mat[ 7] * 1.0;
  this.trans_z = this.util_mat[8] * x + this.util_mat[9] * y + this.util_mat[10] * z + this.util_mat[11] * 1.0;
 },
 cross : function( x1, y1, z1, x2, y2, z2 ){
  this.cross_x = y1 * z2 - z1 * y2;
  this.cross_y = z1 * x2 - x1 * z2;
  this.cross_z = x1 * y2 - y1 * x2;
 },
 dot : function( x1, y1, z1, x2, y2, z2 ){
  return x1 * x2 + y1 * y2 + z1 * z2;
 },
 distance : function( x, y, z ){
  return Math.sqrt( x * x + y * y + z * z );
 },
 normalize : function( x, y, z ){
  var d = Math.sqrt( x * x + y * y + z * z );
  if( d != 0.0 ){
   this.normalize_x = x / d;
   this.normalize_y = y / d;
   this.normalize_z = z / d;
  } else {
   this.normalize_x = 0.0;
   this.normalize_y = 0.0;
   this.normalize_z = 0.0;
  }
 },
 reflect : function( vx, vy, vz, nx, ny, nz ){
  var s = this.dot( -vx, -vy, -vz, nx, ny, nz );
  var px = nx * s;
  var py = ny * s;
  var pz = nz * s;
  this.reflect_x = vx + px + px;
  this.reflect_y = vy + py + py;
  this.reflect_z = vz + pz + pz;
 },
 beginGetTriangle : function(){
  this.seek_len = 2;
 },
 getTriangle : function( model , index, trans ){
  var ret = false;
  while( this.seek_len < model._strip_len[index] ){
   for( var i = 0; i < 3; i++ ){
    this.seek_vertex[i] = model._strip[index][this.seek_len - i];
   }
   this.seek_len++;
   if( (this.seek_vertex[0] != this.seek_vertex[1]) && (this.seek_vertex[0] != this.seek_vertex[2]) && (this.seek_vertex[1] != this.seek_vertex[2]) ){
    ret = true;
    break;
   }
  }
  if( ret ){
   this.getTriangleCoord( model, index, trans );
   this.center_x = (this.coord_x[0] + this.coord_x[1] + this.coord_x[2]) / 3.0;
   this.center_y = (this.coord_y[0] + this.coord_y[1] + this.coord_y[2]) / 3.0;
   this.center_z = (this.coord_z[0] + this.coord_z[1] + this.coord_z[2]) / 3.0;
  }
  return ret;
 },
 getTriangleCoord : function( model , index, trans ){
  var i;
  for( i = 0; i < 3; i++ ){
   this.coord_x[i] = model._coord[model._strip_coord[index]][this.seek_vertex[i] * 3 ];
   this.coord_y[i] = model._coord[model._strip_coord[index]][this.seek_vertex[i] * 3 + 1];
   this.coord_z[i] = model._coord[model._strip_coord[index]][this.seek_vertex[i] * 3 + 2];
  }
  if( trans ){
   for( i = 0; i < 3; i++ ){
    this.transVector( this.coord_x[i], this.coord_y[i], this.coord_z[i] );
    this.coord_x[i] = this.trans_x;
    this.coord_y[i] = this.trans_y;
    this.coord_z[i] = this.trans_z;
   }
  }
 },
 getTriangleNormal : function( model , index, trans ){
  if( model._strip_normal[index] >= 0 ){
   var x = 0.0;
   var y = 0.0;
   var z = 0.0;
   for( var i = 0; i < 3; i++ ){
    x += model._normal[model._strip_normal[index]][this.seek_vertex[i] * 3 ];
    y += model._normal[model._strip_normal[index]][this.seek_vertex[i] * 3 + 1];
    z += model._normal[model._strip_normal[index]][this.seek_vertex[i] * 3 + 2];
   }
   if( trans ){
    this.transVector( x, y, z );
    x = this.trans_x;
    y = this.trans_y;
    z = this.trans_z;
   }
   this.cross(
    this.coord_x[1] - this.coord_x[0],
    this.coord_y[1] - this.coord_y[0],
    this.coord_z[1] - this.coord_z[0],
    this.coord_x[2] - this.coord_x[0],
    this.coord_y[2] - this.coord_y[0],
    this.coord_z[2] - this.coord_z[0]
    );
   this.cross_x = Math.abs( this.cross_x );
   this.cross_y = Math.abs( this.cross_y );
   this.cross_z = Math.abs( this.cross_z );
   if( (this.cross_x < _GLUTILITY_TOLERANCE) || (this.cross_y < _GLUTILITY_TOLERANCE) || (this.cross_z < _GLUTILITY_TOLERANCE) ){
    x = (x < 0.0) ? -this.cross_x : this.cross_x;
    y = (y < 0.0) ? -this.cross_y : this.cross_y;
    z = (z < 0.0) ? -this.cross_z : this.cross_z;
   }
   this.normalize( x, y, z );
   this.normal_x = this.normalize_x;
   this.normal_y = this.normalize_y;
   this.normal_z = this.normalize_z;
  }
 },
 checkTriangle : function( x_min, x_max, y_min, y_max, z_min, z_max ){
  if(
   (this.center_x >= x_min) && (this.center_x <= x_max) &&
   (this.center_y >= y_min) && (this.center_y <= y_max) &&
   (this.center_z >= z_min) && (this.center_z <= z_max)
  ){
   return true;
  }
  return false;
 },
 hitCheck : function( px, py, pz, qx, qy, qz, cx, cy, cz ){
  this.cross(
   cx[1] - cx[0],
   cy[1] - cy[0],
   cz[1] - cz[0],
   cx[2] - cx[0],
   cy[2] - cy[0],
   cz[2] - cz[0]
   );
  var nx = this.cross_x;
  var ny = this.cross_y;
  var nz = this.cross_z;
  var ux = qx - px;
  var uy = qy - py;
  var uz = qz - pz;
  var top = nx * (cx[0] - px) + ny * (cy[0] - py) + nz * (cz[0] - pz);
  var bottom = this.dot( nx, ny, nz, ux, uy, uz );
  if( bottom == 0.0 ){
   return false;
  }
  var t = top / bottom;
  if( (t < 0.0) || (t > 1.0) ){
   return false;
  }
  this.hit_x = px + t * ux;
  this.hit_y = py + t * uy;
  this.hit_z = pz + t * uz;
  for( var i = 0; i < 3; i++ ){
   this.cross(
    cx[(i == 2) ? 0 : i + 1] - cx[i],
    cy[(i == 2) ? 0 : i + 1] - cy[i],
    cz[(i == 2) ? 0 : i + 1] - cz[i],
    this.hit_x - cx[i],
    this.hit_y - cy[i],
    this.hit_z - cz[i]
    );
   if( ((this.cross_x * nx) < _GLUTILITY_TOLERANCE_M) || ((this.cross_y * ny) < _GLUTILITY_TOLERANCE_M) || ((this.cross_z * nz) < _GLUTILITY_TOLERANCE_M) ){
    return false;
   }
  }
  return true;
 },
 lookAt : function( position_x, position_y, position_z, look_x, look_y, look_z, up_x, up_y, up_z ){
  var d;
  look_x -= position_x;
  look_y -= position_y;
  look_z -= position_z;
  d = Math.sqrt( look_x * look_x + look_y * look_y + look_z * look_z );
  if( d != 0.0 ){
   look_x /= d;
   look_y /= d;
   look_z /= d;
  }
  this.look_side[0] = look_y * up_z - look_z * up_y;
  this.look_side[1] = look_z * up_x - look_x * up_z;
  this.look_side[2] = look_x * up_y - look_y * up_x;
  d = Math.sqrt( this.look_side[0] * this.look_side[0] + this.look_side[1] * this.look_side[1] + this.look_side[2] * this.look_side[2] );
  if( d != 0.0 ){
   this.look_side[0] /= d;
   this.look_side[1] /= d;
   this.look_side[2] /= d;
  }
  up_x = this.look_side[1] * look_z - this.look_side[2] * look_y;
  up_y = this.look_side[2] * look_x - this.look_side[0] * look_z;
  up_z = this.look_side[0] * look_y - this.look_side[1] * look_x;
  this.look_mat[ 0] = this.look_side[0]; this.look_mat[ 1] = up_x; this.look_mat[ 2] = -look_x; this.look_mat[ 3] = 0.0;
  this.look_mat[ 4] = this.look_side[1]; this.look_mat[ 5] = up_y; this.look_mat[ 6] = -look_y; this.look_mat[ 7] = 0.0;
  this.look_mat[ 8] = this.look_side[2]; this.look_mat[ 9] = up_z; this.look_mat[10] = -look_z; this.look_mat[11] = 0.0;
  this.look_mat[12] = 0.0 ; this.look_mat[13] = 0.0 ; this.look_mat[14] = 0.0 ; this.look_mat[15] = 1.0;
  var i, j, k;
  for( j = 0; j < 4; j++ ){
   k = j * 4;
   for( i = 0; i < 4; i++ ){
    this.model_mat[k + i] = this.look_mat[i * 4 + j];
   }
  }
  this.set( this.model_mat );
  this.translate( -position_x, -position_y, -position_z );
  for( i = 0; i < 16; i++ ){
   this.model_mat[i] = this.util_mat[i];
  }
 },
 lookMatrix : function(){
  return this.look_mat;
 },
 spriteMatrix : function( x, y, z ){
  this.setIdentity();
  this.translate( x, y, z );
  this.multiply( this.look_mat );
  return this.glMatrix();
 },
 frustum : function( l, r, b, t, n, f ){
  this.proj_mat[ 0] = (2.0 * n) / (r - l);
  this.proj_mat[ 1] = 0.0;
  this.proj_mat[ 2] = (r + l) / (r - l);
  this.proj_mat[ 3] = 0.0;
  this.proj_mat[ 4] = 0.0;
  this.proj_mat[ 5] = (2.0 * n) / (t - b);
  this.proj_mat[ 6] = (t + b) / (t - b);
  this.proj_mat[ 7] = 0.0;
  this.proj_mat[ 8] = 0.0;
  this.proj_mat[ 9] = 0.0;
  this.proj_mat[10] = -(f + n) / (f - n);
  this.proj_mat[11] = -(2.0 * f * n) / (f - n);
  this.proj_mat[12] = 0.0;
  this.proj_mat[13] = 0.0;
  this.proj_mat[14] = -1.0;
  this.proj_mat[15] = 0.0;
  this.setIdentity();
  this.multiply( this.proj_mat );
  for( var i = 0; i < 16; i++ ){
   this.proj_mat[i] = this.util_mat[i];
  }
 },
 viewport : function( x, y, width, height ){
  this._gl.viewport( x, y, width, height );
  this.view_mat[0] = x;
  this.view_mat[1] = y;
  this.view_mat[2] = width;
  this.view_mat[3] = height;
 },
 project : function( obj_x, obj_y, obj_z ){
  this.project_in[0] = obj_x * this.model_mat[ 0] + obj_y * this.model_mat[ 1] + obj_z * this.model_mat[ 2] + this.model_mat[ 3];
  this.project_in[1] = obj_x * this.model_mat[ 4] + obj_y * this.model_mat[ 5] + obj_z * this.model_mat[ 6] + this.model_mat[ 7];
  this.project_in[2] = obj_x * this.model_mat[ 8] + obj_y * this.model_mat[ 9] + obj_z * this.model_mat[10] + this.model_mat[11];
  this.project_in[3] = obj_x * this.model_mat[12] + obj_y * this.model_mat[13] + obj_z * this.model_mat[14] + this.model_mat[15];
  this.project_out[0] = this.project_in[0] * this.proj_mat[ 0] + this.project_in[1] * this.proj_mat[ 1] + this.project_in[2] * this.proj_mat[ 2] + this.project_in[3] * this.proj_mat[ 3];
  this.project_out[1] = this.project_in[0] * this.proj_mat[ 4] + this.project_in[1] * this.proj_mat[ 5] + this.project_in[2] * this.proj_mat[ 6] + this.project_in[3] * this.proj_mat[ 7];
  this.project_out[2] = this.project_in[0] * this.proj_mat[ 8] + this.project_in[1] * this.proj_mat[ 9] + this.project_in[2] * this.proj_mat[10] + this.project_in[3] * this.proj_mat[11];
  this.project_out[3] = this.project_in[0] * this.proj_mat[12] + this.project_in[1] * this.proj_mat[13] + this.project_in[2] * this.proj_mat[14] + this.project_in[3] * this.proj_mat[15];
  if( this.project_out[3] == 0.0 ){
   return false;
  }
  this.project_x = ((this.project_out[0] / this.project_out[3] + 1.0) / 2.0) * this.view_mat[2] + this.view_mat[0];
  this.project_y = ((this.project_out[1] / this.project_out[3] + 1.0) / 2.0) * this.view_mat[3] + this.view_mat[1];
  this.project_z = (this.project_out[2] / this.project_out[3] + 1.0) / 2.0;
  return true;
 },
 unProject : function( win_x, win_y, win_z ){
  this.set( this.model_mat );
  this.multiply( this.proj_mat );
  this.invert();
  this.project_in[0] = (win_x - this.view_mat[0]) * 2.0 / this.view_mat[2] - 1.0;
  this.project_in[1] = (win_y - this.view_mat[1]) * 2.0 / this.view_mat[3] - 1.0;
  this.project_in[2] = win_z * 2.0 - 1.0;
  this.project_out[0] = this.project_in[0] * this.util_mat[ 0] + this.project_in[1] * this.util_mat[ 1] + this.project_in[2] * this.util_mat[ 2] + this.util_mat[ 3];
  this.project_out[1] = this.project_in[0] * this.util_mat[ 4] + this.project_in[1] * this.util_mat[ 5] + this.project_in[2] * this.util_mat[ 6] + this.util_mat[ 7];
  this.project_out[2] = this.project_in[0] * this.util_mat[ 8] + this.project_in[1] * this.util_mat[ 9] + this.project_in[2] * this.util_mat[10] + this.util_mat[11];
  this.project_out[3] = this.project_in[0] * this.util_mat[12] + this.project_in[1] * this.util_mat[13] + this.project_in[2] * this.util_mat[14] + this.util_mat[15];
  if( this.project_out[3] == 0.0 ){
   return false;
  }
  this.project_x = this.project_out[0] / this.project_out[3];
  this.project_y = this.project_out[1] / this.project_out[3];
  this.project_z = this.project_out[2] / this.project_out[3];
  return true;
 },
 transX : function(){
  return this.trans_x;
 },
 transY : function(){
  return this.trans_y;
 },
 transZ : function(){
  return this.trans_z;
 },
 crossX : function(){
  return this.cross_x;
 },
 crossY : function(){
  return this.cross_y;
 },
 crossZ : function(){
  return this.cross_z;
 },
 normalizeX : function(){
  return this.normalize_x;
 },
 normalizeY : function(){
  return this.normalize_y;
 },
 normalizeZ : function(){
  return this.normalize_z;
 },
 reflectX : function(){
  return this.reflect_x;
 },
 reflectY : function(){
  return this.reflect_y;
 },
 reflectZ : function(){
  return this.reflect_z;
 },
 coordX : function( i ){
  return this.coord_x[i];
 },
 coordY : function( i ){
  return this.coord_y[i];
 },
 coordZ : function( i ){
  return this.coord_z[i];
 },
 normalX : function(){
  return this.normal_x;
 },
 normalY : function(){
  return this.normal_y;
 },
 normalZ : function(){
  return this.normal_z;
 },
 centerX : function(){
  return this.center_x;
 },
 centerY : function(){
  return this.center_y;
 },
 centerZ : function(){
  return this.center_z;
 },
 hitX : function(){
  return this.hit_x;
 },
 hitY : function(){
  return this.hit_y;
 },
 hitZ : function(){
  return this.hit_z;
 },
 projectX : function(){
  return this.project_x;
 },
 projectY : function(){
  return this.project_y;
 },
 projectZ : function(){
  return this.project_z;
 }
};
var MODEL_SPHERE = [
1,
-1,0.8,0.6,0,0,5,
0,0,0,
0,0,0,0,
1,
382,
0,100,0,
0,98.76884,15.64345,
4.83409,98.76884,14.8778,
9.19499,98.76884,12.65581,
12.65581,98.76884,9.19499,
14.8778,98.76884,4.83409,
15.64345,98.76884,0,
14.8778,98.76884,-4.83409,
12.65581,98.76884,-9.19499,
9.19499,98.76884,-12.65581,
4.83409,98.76884,-14.8778,
0,98.76884,-15.64345,
-4.83409,98.76884,-14.8778,
-9.19499,98.76884,-12.65581,
-12.65581,98.76884,-9.19499,
-14.8778,98.76884,-4.83409,
-15.64345,98.76884,0,
-14.8778,98.76884,4.83409,
-12.65581,98.76884,9.19499,
-9.19499,98.76884,12.65581,
-4.83409,98.76884,14.8778,
0,95.10565,30.9017,
9.54915,95.10565,29.38926,
18.16356,95.10565,25,
25,95.10565,18.16356,
29.38926,95.10565,9.54915,
30.9017,95.10565,0,
29.38926,95.10565,-9.54915,
25,95.10565,-18.16356,
18.16356,95.10565,-25,
9.54915,95.10565,-29.38926,
0,95.10565,-30.9017,
-9.54915,95.10565,-29.38926,
-18.16356,95.10565,-25,
-25,95.10565,-18.16356,
-29.38926,95.10565,-9.54915,
-30.9017,95.10565,0,
-29.38926,95.10565,9.54915,
-25,95.10565,18.16356,
-18.16356,95.10565,25,
-9.54915,95.10565,29.38926,
0,89.10066,45.39905,
14.02908,89.10066,43.17706,
26.68489,89.10066,36.7286,
36.7286,89.10066,26.68489,
43.17706,89.10066,14.02908,
45.39905,89.10066,0,
43.17706,89.10066,-14.02908,
36.7286,89.10066,-26.68489,
26.68489,89.10066,-36.7286,
14.02908,89.10066,-43.17706,
0,89.10066,-45.39905,
-14.02908,89.10066,-43.17706,
-26.68489,89.10066,-36.7286,
-36.7286,89.10066,-26.68489,
-43.17706,89.10066,-14.02908,
-45.39905,89.10066,0,
-43.17706,89.10066,14.02908,
-36.7286,89.10066,26.68489,
-26.68489,89.10066,36.7286,
-14.02908,89.10066,43.17706,
0,80.9017,58.77853,
18.16356,80.9017,55.9017,
34.54915,80.9017,47.55283,
47.55283,80.9017,34.54915,
55.9017,80.9017,18.16356,
58.77853,80.9017,0,
55.9017,80.9017,-18.16356,
47.55283,80.9017,-34.54915,
34.54915,80.9017,-47.55283,
18.16356,80.9017,-55.9017,
0,80.9017,-58.77853,
-18.16356,80.9017,-55.9017,
-34.54915,80.9017,-47.55283,
-47.55283,80.9017,-34.54915,
-55.9017,80.9017,-18.16356,
-58.77853,80.9017,0,
-55.9017,80.9017,18.16356,
-47.55283,80.9017,34.54915,
-34.54915,80.9017,47.55283,
-18.16356,80.9017,55.9017,
0,70.71068,70.71068,
21.8508,70.71068,67.24985,
41.56269,70.71068,57.20614,
57.20614,70.71068,41.56269,
67.24985,70.71068,21.8508,
70.71068,70.71068,0,
67.24985,70.71068,-21.8508,
57.20614,70.71068,-41.56269,
41.56269,70.71068,-57.20614,
21.8508,70.71068,-67.24985,
0,70.71068,-70.71068,
-21.8508,70.71068,-67.24985,
-41.56269,70.71068,-57.20614,
-57.20614,70.71068,-41.56269,
-67.24985,70.71068,-21.8508,
-70.71068,70.71068,0,
-67.24985,70.71068,21.8508,
-57.20614,70.71068,41.56269,
-41.56269,70.71068,57.20614,
-21.8508,70.71068,67.24985,
0,58.77853,80.9017,
25,58.77853,76.94209,
47.55283,58.77853,65.45084,
65.45084,58.77853,47.55283,
76.94209,58.77853,25,
80.9017,58.77853,0,
76.94209,58.77853,-25,
65.45084,58.77853,-47.55283,
47.55283,58.77853,-65.45084,
25,58.77853,-76.94209,
0,58.77853,-80.9017,
-25,58.77853,-76.94209,
-47.55283,58.77853,-65.45084,
-65.45084,58.77853,-47.55283,
-76.94209,58.77853,-25,
-80.9017,58.77853,0,
-76.94209,58.77853,25,
-65.45084,58.77853,47.55283,
-47.55283,58.77853,65.45084,
-25,58.77853,76.94209,
0,45.39905,89.10066,
27.53362,45.39905,84.73975,
52.37205,45.39905,72.08395,
72.08395,45.39905,52.37205,
84.73975,45.39905,27.53362,
89.10066,45.39905,0,
84.73975,45.39905,-27.53362,
72.08395,45.39905,-52.37205,
52.37205,45.39905,-72.08395,
27.53362,45.39905,-84.73975,
0,45.39905,-89.10066,
-27.53362,45.39905,-84.73975,
-52.37205,45.39905,-72.08395,
-72.08395,45.39905,-52.37205,
-84.73975,45.39905,-27.53362,
-89.10066,45.39905,0,
-84.73975,45.39905,27.53362,
-72.08395,45.39905,52.37205,
-52.37205,45.39905,72.08395,
-27.53362,45.39905,84.73975,
0,30.9017,95.10565,
29.38926,30.9017,90.45084,
55.9017,30.9017,76.94209,
76.94209,30.9017,55.9017,
90.45084,30.9017,29.38926,
95.10565,30.9017,0,
90.45084,30.9017,-29.38926,
76.94209,30.9017,-55.9017,
55.9017,30.9017,-76.94209,
29.38926,30.9017,-90.45084,
0,30.9017,-95.10565,
-29.38926,30.9017,-90.45084,
-55.9017,30.9017,-76.94209,
-76.94209,30.9017,-55.9017,
-90.45084,30.9017,-29.38926,
-95.10565,30.9017,0,
-90.45084,30.9017,29.38926,
-76.94209,30.9017,55.9017,
-55.9017,30.9017,76.94209,
-29.38926,30.9017,90.45084,
0,15.64345,98.76884,
30.52125,15.64345,93.93475,
58.05486,15.64345,79.90566,
79.90566,15.64345,58.05486,
93.93475,15.64345,30.52125,
98.76884,15.64345,0,
93.93475,15.64345,-30.52125,
79.90566,15.64345,-58.05486,
58.05486,15.64345,-79.90566,
30.52125,15.64345,-93.93475,
0,15.64345,-98.76884,
-30.52125,15.64345,-93.93475,
-58.05486,15.64345,-79.90566,
-79.90566,15.64345,-58.05486,
-93.93475,15.64345,-30.52125,
-98.76884,15.64345,0,
-93.93475,15.64345,30.52125,
-79.90566,15.64345,58.05486,
-58.05486,15.64345,79.90566,
-30.52125,15.64345,93.93475,
0,0,100,
30.9017,0,95.10565,
58.77853,0,80.9017,
80.9017,0,58.77853,
95.10565,0,30.9017,
100,0,0,
95.10565,0,-30.9017,
80.9017,0,-58.77853,
58.77853,0,-80.9017,
30.9017,0,-95.10565,
0,0,-100,
-30.9017,0,-95.10565,
-58.77853,0,-80.9017,
-80.9017,0,-58.77853,
-95.10565,0,-30.9017,
-100,0,0,
-95.10565,0,30.9017,
-80.9017,0,58.77853,
-58.77853,0,80.9017,
-30.9017,0,95.10565,
0,-15.64345,98.76884,
30.52125,-15.64345,93.93475,
58.05486,-15.64345,79.90566,
79.90566,-15.64345,58.05486,
93.93475,-15.64345,30.52125,
98.76884,-15.64345,0,
93.93475,-15.64345,-30.52125,
79.90566,-15.64345,-58.05486,
58.05486,-15.64345,-79.90566,
30.52125,-15.64345,-93.93475,
0,-15.64345,-98.76884,
-30.52125,-15.64345,-93.93475,
-58.05486,-15.64345,-79.90566,
-79.90566,-15.64345,-58.05486,
-93.93475,-15.64345,-30.52125,
-98.76884,-15.64345,0,
-93.93475,-15.64345,30.52125,
-79.90566,-15.64345,58.05486,
-58.05486,-15.64345,79.90566,
-30.52125,-15.64345,93.93475,
0,-30.9017,95.10565,
29.38926,-30.9017,90.45084,
55.9017,-30.9017,76.94209,
76.94209,-30.9017,55.9017,
90.45084,-30.9017,29.38926,
95.10565,-30.9017,0,
90.45084,-30.9017,-29.38926,
76.94209,-30.9017,-55.9017,
55.9017,-30.9017,-76.94209,
29.38926,-30.9017,-90.45084,
0,-30.9017,-95.10565,
-29.38926,-30.9017,-90.45084,
-55.9017,-30.9017,-76.94209,
-76.94209,-30.9017,-55.9017,
-90.45084,-30.9017,-29.38926,
-95.10565,-30.9017,0,
-90.45084,-30.9017,29.38926,
-76.94209,-30.9017,55.9017,
-55.9017,-30.9017,76.94209,
-29.38926,-30.9017,90.45084,
0,-45.39905,89.10066,
27.53362,-45.39905,84.73975,
52.37205,-45.39905,72.08395,
72.08395,-45.39905,52.37205,
84.73975,-45.39905,27.53362,
89.10066,-45.39905,0,
84.73975,-45.39905,-27.53362,
72.08395,-45.39905,-52.37205,
52.37205,-45.39905,-72.08395,
27.53362,-45.39905,-84.73975,
0,-45.39905,-89.10066,
-27.53362,-45.39905,-84.73975,
-52.37205,-45.39905,-72.08395,
-72.08395,-45.39905,-52.37205,
-84.73975,-45.39905,-27.53362,
-89.10066,-45.39905,0,
-84.73975,-45.39905,27.53362,
-72.08395,-45.39905,52.37205,
-52.37205,-45.39905,72.08395,
-27.53362,-45.39905,84.73975,
0,-58.77853,80.9017,
25,-58.77853,76.94209,
47.55283,-58.77853,65.45084,
65.45084,-58.77853,47.55283,
76.94209,-58.77853,25,
80.9017,-58.77853,0,
76.94209,-58.77853,-25,
65.45084,-58.77853,-47.55283,
47.55283,-58.77853,-65.45084,
25,-58.77853,-76.94209,
0,-58.77853,-80.9017,
-25,-58.77853,-76.94209,
-47.55283,-58.77853,-65.45084,
-65.45084,-58.77853,-47.55283,
-76.94209,-58.77853,-25,
-80.9017,-58.77853,0,
-76.94209,-58.77853,25,
-65.45084,-58.77853,47.55283,
-47.55283,-58.77853,65.45084,
-25,-58.77853,76.94209,
0,-70.71068,70.71068,
21.8508,-70.71068,67.24985,
41.56269,-70.71068,57.20614,
57.20614,-70.71068,41.56269,
67.24985,-70.71068,21.8508,
70.71068,-70.71068,0,
67.24985,-70.71068,-21.8508,
57.20614,-70.71068,-41.56269,
41.56269,-70.71068,-57.20614,
21.8508,-70.71068,-67.24985,
0,-70.71068,-70.71068,
-21.8508,-70.71068,-67.24985,
-41.56269,-70.71068,-57.20614,
-57.20614,-70.71068,-41.56269,
-67.24985,-70.71068,-21.8508,
-70.71068,-70.71068,0,
-67.24985,-70.71068,21.8508,
-57.20614,-70.71068,41.56269,
-41.56269,-70.71068,57.20614,
-21.8508,-70.71068,67.24985,
0,-80.9017,58.77853,
18.16356,-80.9017,55.9017,
34.54915,-80.9017,47.55283,
47.55283,-80.9017,34.54915,
55.9017,-80.9017,18.16356,
58.77853,-80.9017,0,
55.9017,-80.9017,-18.16356,
47.55283,-80.9017,-34.54915,
34.54915,-80.9017,-47.55283,
18.16356,-80.9017,-55.9017,
0,-80.9017,-58.77853,
-18.16356,-80.9017,-55.9017,
-34.54915,-80.9017,-47.55283,
-47.55283,-80.9017,-34.54915,
-55.9017,-80.9017,-18.16356,
-58.77853,-80.9017,0,
-55.9017,-80.9017,18.16356,
-47.55283,-80.9017,34.54915,
-34.54915,-80.9017,47.55283,
-18.16356,-80.9017,55.9017,
0,-89.10066,45.39905,
14.02908,-89.10066,43.17706,
26.68489,-89.10066,36.7286,
36.7286,-89.10066,26.68489,
43.17706,-89.10066,14.02908,
45.39905,-89.10066,0,
43.17706,-89.10066,-14.02908,
36.7286,-89.10066,-26.68489,
26.68489,-89.10066,-36.7286,
14.02908,-89.10066,-43.17706,
0,-89.10066,-45.39905,
-14.02908,-89.10066,-43.17706,
-26.68489,-89.10066,-36.7286,
-36.7286,-89.10066,-26.68489,
-43.17706,-89.10066,-14.02908,
-45.39905,-89.10066,0,
-43.17706,-89.10066,14.02908,
-36.7286,-89.10066,26.68489,
-26.68489,-89.10066,36.7286,
-14.02908,-89.10066,43.17706,
0,-95.10565,30.9017,
9.54915,-95.10565,29.38926,
18.16356,-95.10565,25,
25,-95.10565,18.16356,
29.38926,-95.10565,9.54915,
30.9017,-95.10565,0,
29.38926,-95.10565,-9.54915,
25,-95.10565,-18.16356,
18.16356,-95.10565,-25,
9.54915,-95.10565,-29.38926,
0,-95.10565,-30.9017,
-9.54915,-95.10565,-29.38926,
-18.16356,-95.10565,-25,
-25,-95.10565,-18.16356,
-29.38926,-95.10565,-9.54915,
-30.9017,-95.10565,0,
-29.38926,-95.10565,9.54915,
-25,-95.10565,18.16356,
-18.16356,-95.10565,25,
-9.54915,-95.10565,29.38926,
0,-98.76884,15.64345,
4.83409,-98.76884,14.8778,
9.19499,-98.76884,12.65581,
12.65581,-98.76884,9.19499,
14.8778,-98.76884,4.83409,
15.64345,-98.76884,0,
14.8778,-98.76884,-4.83409,
12.65581,-98.76884,-9.19499,
9.19499,-98.76884,-12.65581,
4.83409,-98.76884,-14.8778,
0,-98.76884,-15.64345,
-4.83409,-98.76884,-14.8778,
-9.19499,-98.76884,-12.65581,
-12.65581,-98.76884,-9.19499,
-14.8778,-98.76884,-4.83409,
-15.64345,-98.76884,0,
-14.8778,-98.76884,4.83409,
-12.65581,-98.76884,9.19499,
-9.19499,-98.76884,12.65581,
-4.83409,-98.76884,14.8778,
0,-100,0,
1,
382,
0,1,0,
0,0.98769,0.15641,
0.04833,0.98769,0.14876,
0.09194,0.98769,0.12654,
0.12654,0.98769,0.09194,
0.14876,0.98769,0.04833,
0.15641,0.98769,0,
0.14876,0.98769,-0.04833,
0.12654,0.98769,-0.09194,
0.09194,0.98769,-0.12654,
0.04833,0.98769,-0.14876,
0,0.98769,-0.15641,
-0.04833,0.98769,-0.14876,
-0.09194,0.98769,-0.12654,
-0.12654,0.98769,-0.09194,
-0.14876,0.98769,-0.04833,
-0.15641,0.98769,0,
-0.14876,0.98769,0.04833,
-0.12654,0.98769,0.09194,
-0.09194,0.98769,0.12654,
-0.04833,0.98769,0.14876,
0,0.95107,0.30897,
0.09548,0.95107,0.29385,
0.18161,0.95107,0.24996,
0.24996,0.95107,0.18161,
0.29385,0.95107,0.09548,
0.30897,0.95107,0,
0.29385,0.95107,-0.09548,
0.24996,0.95107,-0.18161,
0.18161,0.95107,-0.24996,
0.09548,0.95107,-0.29385,
0,0.95107,-0.30897,
-0.09548,0.95107,-0.29385,
-0.18161,0.95107,-0.24996,
-0.24996,0.95107,-0.18161,
-0.29385,0.95107,-0.09548,
-0.30897,0.95107,0,
-0.29385,0.95107,0.09548,
-0.24996,0.95107,0.18161,
-0.18161,0.95107,0.24996,
-0.09548,0.95107,0.29385,
0,0.89104,0.45393,
0.14027,0.89104,0.43172,
0.26682,0.89104,0.36724,
0.36724,0.89104,0.26682,
0.43172,0.89104,0.14027,
0.45393,0.89104,0,
0.43172,0.89104,-0.14027,
0.36724,0.89104,-0.26682,
0.26682,0.89104,-0.36724,
0.14027,0.89104,-0.43172,
0,0.89104,-0.45393,
-0.14027,0.89104,-0.43172,
-0.26682,0.89104,-0.36724,
-0.36724,0.89104,-0.26682,
-0.43172,0.89104,-0.14027,
-0.45393,0.89104,0,
-0.43172,0.89104,0.14027,
-0.36724,0.89104,0.26682,
-0.26682,0.89104,0.36724,
-0.14027,0.89104,0.43172,
0,0.80906,0.58773,
0.18162,0.80906,0.55896,
0.34546,0.80906,0.47548,
0.47548,0.80906,0.34546,
0.55896,0.80906,0.18162,
0.58773,0.80906,0,
0.55896,0.80906,-0.18162,
0.47548,0.80906,-0.34546,
0.34546,0.80906,-0.47548,
0.18162,0.80906,-0.55896,
0,0.80906,-0.58773,
-0.18162,0.80906,-0.55896,
-0.34546,0.80906,-0.47548,
-0.47548,0.80906,-0.34546,
-0.55896,0.80906,-0.18162,
-0.58773,0.80906,0,
-0.55896,0.80906,0.18162,
-0.47548,0.80906,0.34546,
-0.34546,0.80906,0.47548,
-0.18162,0.80906,0.55896,
0,0.70716,0.70705,
0.21849,0.70716,0.67245,
0.41559,0.70716,0.57202,
0.57202,0.70716,0.41559,
0.67245,0.70716,0.21849,
0.70705,0.70716,0,
0.67245,0.70716,-0.21849,
0.57202,0.70716,-0.41559,
0.41559,0.70716,-0.57202,
0.21849,0.70716,-0.67245,
0,0.70716,-0.70705,
-0.21849,0.70716,-0.67245,
-0.41559,0.70716,-0.57202,
-0.57202,0.70716,-0.41559,
-0.67245,0.70716,-0.21849,
-0.70705,0.70716,0,
-0.67245,0.70716,0.21849,
-0.57202,0.70716,0.41559,
-0.41559,0.70716,0.57202,
-0.21849,0.70716,0.67245,
0,0.58784,0.80898,
0.24999,0.58784,0.76938,
0.4755,0.58784,0.65447,
0.65447,0.58784,0.4755,
0.76938,0.58784,0.24999,
0.80898,0.58784,0,
0.76938,0.58784,-0.24999,
0.65447,0.58784,-0.4755,
0.4755,0.58784,-0.65447,
0.24999,0.58784,-0.76938,
0,0.58784,-0.80898,
-0.24999,0.58784,-0.76938,
-0.4755,0.58784,-0.65447,
-0.65447,0.58784,-0.4755,
-0.76938,0.58784,-0.24999,
-0.80898,0.58784,0,
-0.76938,0.58784,0.24999,
-0.65447,0.58784,0.4755,
-0.4755,0.58784,0.65447,
-0.24999,0.58784,0.76938,
0,0.45404,0.89098,
0.27533,0.45404,0.84737,
0.5237,0.45404,0.72082,
0.72082,0.45404,0.5237,
0.84737,0.45404,0.27533,
0.89098,0.45404,0,
0.84737,0.45404,-0.27533,
0.72082,0.45404,-0.5237,
0.5237,0.45404,-0.72082,
0.27533,0.45404,-0.84737,
0,0.45404,-0.89098,
-0.27533,0.45404,-0.84737,
-0.5237,0.45404,-0.72082,
-0.72082,0.45404,-0.5237,
-0.84737,0.45404,-0.27533,
-0.89098,0.45404,0,
-0.84737,0.45404,0.27533,
-0.72082,0.45404,0.5237,
-0.5237,0.45404,0.72082,
-0.27533,0.45404,0.84737,
0,0.30906,0.95104,
0.29389,0.30906,0.9045,
0.55901,0.30906,0.76941,
0.76941,0.30906,0.55901,
0.9045,0.30906,0.29389,
0.95104,0.30906,0,
0.9045,0.30906,-0.29389,
0.76941,0.30906,-0.55901,
0.55901,0.30906,-0.76941,
0.29389,0.30906,-0.9045,
0,0.30906,-0.95104,
-0.29389,0.30906,-0.9045,
-0.55901,0.30906,-0.76941,
-0.76941,0.30906,-0.55901,
-0.9045,0.30906,-0.29389,
-0.95104,0.30906,0,
-0.9045,0.30906,0.29389,
-0.76941,0.30906,0.55901,
-0.55901,0.30906,0.76941,
-0.29389,0.30906,0.9045,
0,0.15646,0.98769,
0.30521,0.15646,0.93934,
0.58055,0.15646,0.79905,
0.79905,0.15646,0.58055,
0.93934,0.15646,0.30521,
0.98769,0.15646,0,
0.93934,0.15646,-0.30521,
0.79905,0.15646,-0.58055,
0.58055,0.15646,-0.79905,
0.30521,0.15646,-0.93934,
0,0.15646,-0.98769,
-0.30521,0.15646,-0.93934,
-0.58055,0.15646,-0.79905,
-0.79905,0.15646,-0.58055,
-0.93934,0.15646,-0.30521,
-0.98769,0.15646,0,
-0.93934,0.15646,0.30521,
-0.79905,0.15646,0.58055,
-0.58055,0.15646,0.79905,
-0.30521,0.15646,0.93934,
0,0,1,
0.30902,0,0.95106,
0.58779,0,0.80902,
0.80902,0,0.58779,
0.95106,0,0.30902,
1,0,0,
0.95106,0,-0.30902,
0.80902,0,-0.58779,
0.58779,0,-0.80902,
0.30902,0,-0.95106,
0,0,-1,
-0.30902,0,-0.95106,
-0.58779,0,-0.80902,
-0.80902,0,-0.58779,
-0.95106,0,-0.30902,
-1,0,0,
-0.95106,0,0.30902,
-0.80902,0,0.58779,
-0.58779,0,0.80902,
-0.30902,0,0.95106,
0,-0.15646,0.98769,
0.30521,-0.15646,0.93934,
0.58055,-0.15646,0.79905,
0.79905,-0.15646,0.58055,
0.93934,-0.15646,0.30521,
0.98769,-0.15646,0,
0.93934,-0.15646,-0.30521,
0.79905,-0.15646,-0.58055,
0.58055,-0.15646,-0.79905,
0.30521,-0.15646,-0.93934,
0,-0.15646,-0.98769,
-0.30521,-0.15646,-0.93934,
-0.58055,-0.15646,-0.79905,
-0.79905,-0.15646,-0.58055,
-0.93934,-0.15646,-0.30521,
-0.98769,-0.15646,0,
-0.93934,-0.15646,0.30521,
-0.79905,-0.15646,0.58055,
-0.58055,-0.15646,0.79905,
-0.30521,-0.15646,0.93934,
0,-0.30906,0.95104,
0.29389,-0.30906,0.9045,
0.55901,-0.30906,0.76941,
0.76941,-0.30906,0.55901,
0.9045,-0.30906,0.29389,
0.95104,-0.30906,0,
0.9045,-0.30906,-0.29389,
0.76941,-0.30906,-0.55901,
0.55901,-0.30906,-0.76941,
0.29389,-0.30906,-0.9045,
0,-0.30906,-0.95104,
-0.29389,-0.30906,-0.9045,
-0.55901,-0.30906,-0.76941,
-0.76941,-0.30906,-0.55901,
-0.9045,-0.30906,-0.29389,
-0.95104,-0.30906,0,
-0.9045,-0.30906,0.29389,
-0.76941,-0.30906,0.55901,
-0.55901,-0.30906,0.76941,
-0.29389,-0.30906,0.9045,
0,-0.45404,0.89098,
0.27533,-0.45404,0.84737,
0.5237,-0.45404,0.72082,
0.72082,-0.45404,0.5237,
0.84737,-0.45404,0.27533,
0.89098,-0.45404,0,
0.84737,-0.45404,-0.27533,
0.72082,-0.45404,-0.5237,
0.5237,-0.45404,-0.72082,
0.27533,-0.45404,-0.84737,
0,-0.45404,-0.89098,
-0.27533,-0.45404,-0.84737,
-0.5237,-0.45404,-0.72082,
-0.72082,-0.45404,-0.5237,
-0.84737,-0.45404,-0.27533,
-0.89098,-0.45404,0,
-0.84737,-0.45404,0.27533,
-0.72082,-0.45404,0.5237,
-0.5237,-0.45404,0.72082,
-0.27533,-0.45404,0.84737,
0,-0.58784,0.80898,
0.24999,-0.58784,0.76938,
0.4755,-0.58784,0.65447,
0.65447,-0.58784,0.4755,
0.76938,-0.58784,0.24999,
0.80898,-0.58784,0,
0.76938,-0.58784,-0.24999,
0.65447,-0.58784,-0.4755,
0.4755,-0.58784,-0.65447,
0.24999,-0.58784,-0.76938,
0,-0.58784,-0.80898,
-0.24999,-0.58784,-0.76938,
-0.4755,-0.58784,-0.65447,
-0.65447,-0.58784,-0.4755,
-0.76938,-0.58784,-0.24999,
-0.80898,-0.58784,0,
-0.76938,-0.58784,0.24999,
-0.65447,-0.58784,0.4755,
-0.4755,-0.58784,0.65447,
-0.24999,-0.58784,0.76938,
0,-0.70716,0.70705,
0.21849,-0.70716,0.67245,
0.41559,-0.70716,0.57202,
0.57202,-0.70716,0.41559,
0.67245,-0.70716,0.21849,
0.70705,-0.70716,0,
0.67245,-0.70716,-0.21849,
0.57202,-0.70716,-0.41559,
0.41559,-0.70716,-0.57202,
0.21849,-0.70716,-0.67245,
0,-0.70716,-0.70705,
-0.21849,-0.70716,-0.67245,
-0.41559,-0.70716,-0.57202,
-0.57202,-0.70716,-0.41559,
-0.67245,-0.70716,-0.21849,
-0.70705,-0.70716,0,
-0.67245,-0.70716,0.21849,
-0.57202,-0.70716,0.41559,
-0.41559,-0.70716,0.57202,
-0.21849,-0.70716,0.67245,
0,-0.80906,0.58773,
0.18162,-0.80906,0.55896,
0.34546,-0.80906,0.47548,
0.47548,-0.80906,0.34546,
0.55896,-0.80906,0.18162,
0.58773,-0.80906,0,
0.55896,-0.80906,-0.18162,
0.47548,-0.80906,-0.34546,
0.34546,-0.80906,-0.47548,
0.18162,-0.80906,-0.55896,
0,-0.80906,-0.58773,
-0.18162,-0.80906,-0.55896,
-0.34546,-0.80906,-0.47548,
-0.47548,-0.80906,-0.34546,
-0.55896,-0.80906,-0.18162,
-0.58773,-0.80906,0,
-0.55896,-0.80906,0.18162,
-0.47548,-0.80906,0.34546,
-0.34546,-0.80906,0.47548,
-0.18162,-0.80906,0.55896,
0,-0.89104,0.45393,
0.14027,-0.89104,0.43172,
0.26682,-0.89104,0.36724,
0.36724,-0.89104,0.26682,
0.43172,-0.89104,0.14027,
0.45393,-0.89104,0,
0.43172,-0.89104,-0.14027,
0.36724,-0.89104,-0.26682,
0.26682,-0.89104,-0.36724,
0.14027,-0.89104,-0.43172,
0,-0.89104,-0.45393,
-0.14027,-0.89104,-0.43172,
-0.26682,-0.89104,-0.36724,
-0.36724,-0.89104,-0.26682,
-0.43172,-0.89104,-0.14027,
-0.45393,-0.89104,0,
-0.43172,-0.89104,0.14027,
-0.36724,-0.89104,0.26682,
-0.26682,-0.89104,0.36724,
-0.14027,-0.89104,0.43172,
0,-0.95107,0.30897,
0.09548,-0.95107,0.29385,
0.18161,-0.95107,0.24996,
0.24996,-0.95107,0.18161,
0.29385,-0.95107,0.09548,
0.30897,-0.95107,0,
0.29385,-0.95107,-0.09548,
0.24996,-0.95107,-0.18161,
0.18161,-0.95107,-0.24996,
0.09548,-0.95107,-0.29385,
0,-0.95107,-0.30897,
-0.09548,-0.95107,-0.29385,
-0.18161,-0.95107,-0.24996,
-0.24996,-0.95107,-0.18161,
-0.29385,-0.95107,-0.09548,
-0.30897,-0.95107,0,
-0.29385,-0.95107,0.09548,
-0.24996,-0.95107,0.18161,
-0.18161,-0.95107,0.24996,
-0.09548,-0.95107,0.29385,
0,-0.98769,0.15641,
0.04833,-0.98769,0.14876,
0.09194,-0.98769,0.12654,
0.12654,-0.98769,0.09194,
0.14876,-0.98769,0.04833,
0.15641,-0.98769,0,
0.14876,-0.98769,-0.04833,
0.12654,-0.98769,-0.09194,
0.09194,-0.98769,-0.12654,
0.04833,-0.98769,-0.14876,
0,-0.98769,-0.15641,
-0.04833,-0.98769,-0.14876,
-0.09194,-0.98769,-0.12654,
-0.12654,-0.98769,-0.09194,
-0.14876,-0.98769,-0.04833,
-0.15641,-0.98769,0,
-0.14876,-0.98769,0.04833,
-0.12654,-0.98769,0.09194,
-0.09194,-0.98769,0.12654,
-0.04833,-0.98769,0.14876,
0,-1,0,
1,
382,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,1,1,
1,
382,
0.975,0,
1,0.05,
0.05,0.05,
0.1,0.05,
0.15,0.05,
0.2,0.05,
0.25,0.05,
0.3,0.05,
0.35,0.05,
0.4,0.05,
0.45,0.05,
0.5,0.05,
0.55,0.05,
0.6,0.05,
0.65,0.05,
0.7,0.05,
0.75,0.05,
0.8,0.05,
0.85,0.05,
0.9,0.05,
0.95,0.05,
1,0.1,
0.05,0.1,
0.1,0.1,
0.15,0.1,
0.2,0.1,
0.25,0.1,
0.3,0.1,
0.35,0.1,
0.4,0.1,
0.45,0.1,
0.5,0.1,
0.55,0.1,
0.6,0.1,
0.65,0.1,
0.7,0.1,
0.75,0.1,
0.8,0.1,
0.85,0.1,
0.9,0.1,
0.95,0.1,
1,0.15,
0.05,0.15,
0.1,0.15,
0.15,0.15,
0.2,0.15,
0.25,0.15,
0.3,0.15,
0.35,0.15,
0.4,0.15,
0.45,0.15,
0.5,0.15,
0.55,0.15,
0.6,0.15,
0.65,0.15,
0.7,0.15,
0.75,0.15,
0.8,0.15,
0.85,0.15,
0.9,0.15,
0.95,0.15,
1,0.2,
0.05,0.2,
0.1,0.2,
0.15,0.2,
0.2,0.2,
0.25,0.2,
0.3,0.2,
0.35,0.2,
0.4,0.2,
0.45,0.2,
0.5,0.2,
0.55,0.2,
0.6,0.2,
0.65,0.2,
0.7,0.2,
0.75,0.2,
0.8,0.2,
0.85,0.2,
0.9,0.2,
0.95,0.2,
1,0.25,
0.05,0.25,
0.1,0.25,
0.15,0.25,
0.2,0.25,
0.25,0.25,
0.3,0.25,
0.35,0.25,
0.4,0.25,
0.45,0.25,
0.5,0.25,
0.55,0.25,
0.6,0.25,
0.65,0.25,
0.7,0.25,
0.75,0.25,
0.8,0.25,
0.85,0.25,
0.9,0.25,
0.95,0.25,
1,0.3,
0.05,0.3,
0.1,0.3,
0.15,0.3,
0.2,0.3,
0.25,0.3,
0.3,0.3,
0.35,0.3,
0.4,0.3,
0.45,0.3,
0.5,0.3,
0.55,0.3,
0.6,0.3,
0.65,0.3,
0.7,0.3,
0.75,0.3,
0.8,0.3,
0.85,0.3,
0.9,0.3,
0.95,0.3,
1,0.35,
0.05,0.35,
0.1,0.35,
0.15,0.35,
0.2,0.35,
0.25,0.35,
0.3,0.35,
0.35,0.35,
0.4,0.35,
0.45,0.35,
0.5,0.35,
0.55,0.35,
0.6,0.35,
0.65,0.35,
0.7,0.35,
0.75,0.35,
0.8,0.35,
0.85,0.35,
0.9,0.35,
0.95,0.35,
1,0.4,
0.05,0.4,
0.1,0.4,
0.15,0.4,
0.2,0.4,
0.25,0.4,
0.3,0.4,
0.35,0.4,
0.4,0.4,
0.45,0.4,
0.5,0.4,
0.55,0.4,
0.6,0.4,
0.65,0.4,
0.7,0.4,
0.75,0.4,
0.8,0.4,
0.85,0.4,
0.9,0.4,
0.95,0.4,
1,0.45,
0.05,0.45,
0.1,0.45,
0.15,0.45,
0.2,0.45,
0.25,0.45,
0.3,0.45,
0.35,0.45,
0.4,0.45,
0.45,0.45,
0.5,0.45,
0.55,0.45,
0.6,0.45,
0.65,0.45,
0.7,0.45,
0.75,0.45,
0.8,0.45,
0.85,0.45,
0.9,0.45,
0.95,0.45,
1,0.5,
0.05,0.5,
0.1,0.5,
0.15,0.5,
0.2,0.5,
0.25,0.5,
0.3,0.5,
0.35,0.5,
0.4,0.5,
0.45,0.5,
0.5,0.5,
0.55,0.5,
0.6,0.5,
0.65,0.5,
0.7,0.5,
0.75,0.5,
0.8,0.5,
0.85,0.5,
0.9,0.5,
0.95,0.5,
1,0.55,
0.05,0.55,
0.1,0.55,
0.15,0.55,
0.2,0.55,
0.25,0.55,
0.3,0.55,
0.35,0.55,
0.4,0.55,
0.45,0.55,
0.5,0.55,
0.55,0.55,
0.6,0.55,
0.65,0.55,
0.7,0.55,
0.75,0.55,
0.8,0.55,
0.85,0.55,
0.9,0.55,
0.95,0.55,
1,0.6,
0.05,0.6,
0.1,0.6,
0.15,0.6,
0.2,0.6,
0.25,0.6,
0.3,0.6,
0.35,0.6,
0.4,0.6,
0.45,0.6,
0.5,0.6,
0.55,0.6,
0.6,0.6,
0.65,0.6,
0.7,0.6,
0.75,0.6,
0.8,0.6,
0.85,0.6,
0.9,0.6,
0.95,0.6,
1,0.65,
0.05,0.65,
0.1,0.65,
0.15,0.65,
0.2,0.65,
0.25,0.65,
0.3,0.65,
0.35,0.65,
0.4,0.65,
0.45,0.65,
0.5,0.65,
0.55,0.65,
0.6,0.65,
0.65,0.65,
0.7,0.65,
0.75,0.65,
0.8,0.65,
0.85,0.65,
0.9,0.65,
0.95,0.65,
1,0.7,
0.05,0.7,
0.1,0.7,
0.15,0.7,
0.2,0.7,
0.25,0.7,
0.3,0.7,
0.35,0.7,
0.4,0.7,
0.45,0.7,
0.5,0.7,
0.55,0.7,
0.6,0.7,
0.65,0.7,
0.7,0.7,
0.75,0.7,
0.8,0.7,
0.85,0.7,
0.9,0.7,
0.95,0.7,
1,0.75,
0.05,0.75,
0.1,0.75,
0.15,0.75,
0.2,0.75,
0.25,0.75,
0.3,0.75,
0.35,0.75,
0.4,0.75,
0.45,0.75,
0.5,0.75,
0.55,0.75,
0.6,0.75,
0.65,0.75,
0.7,0.75,
0.75,0.75,
0.8,0.75,
0.85,0.75,
0.9,0.75,
0.95,0.75,
1,0.8,
0.05,0.8,
0.1,0.8,
0.15,0.8,
0.2,0.8,
0.25,0.8,
0.3,0.8,
0.35,0.8,
0.4,0.8,
0.45,0.8,
0.5,0.8,
0.55,0.8,
0.6,0.8,
0.65,0.8,
0.7,0.8,
0.75,0.8,
0.8,0.8,
0.85,0.8,
0.9,0.8,
0.95,0.8,
1,0.85,
0.05,0.85,
0.1,0.85,
0.15,0.85,
0.2,0.85,
0.25,0.85,
0.3,0.85,
0.35,0.85,
0.4,0.85,
0.45,0.85,
0.5,0.85,
0.55,0.85,
0.6,0.85,
0.65,0.85,
0.7,0.85,
0.75,0.85,
0.8,0.85,
0.85,0.85,
0.9,0.85,
0.95,0.85,
1,0.9,
0.05,0.9,
0.1,0.9,
0.15,0.9,
0.2,0.9,
0.25,0.9,
0.3,0.9,
0.35,0.9,
0.4,0.9,
0.45,0.9,
0.5,0.9,
0.55,0.9,
0.6,0.9,
0.65,0.9,
0.7,0.9,
0.75,0.9,
0.8,0.9,
0.85,0.9,
0.9,0.9,
0.95,0.9,
1,0.95,
0.05,0.95,
0.1,0.95,
0.15,0.95,
0.2,0.95,
0.25,0.95,
0.3,0.95,
0.35,0.95,
0.4,0.95,
0.45,0.95,
0.5,0.95,
0.55,0.95,
0.6,0.95,
0.65,0.95,
0.7,0.95,
0.75,0.95,
0.8,0.95,
0.85,0.95,
0.9,0.95,
0.95,0.95,
0.975,1,
1,
0,0,0,
0,0,0,0,
0,
0,0,0,0,
2358,0,2,1,1,0,0,3,2,2,0,0,4,3,3,0,0,5,4,4,0,0,6,5,5,0,0,7,6,6,0,0,8,7,7,0,0,9,8,8,0,0,10,9,9,0,0,11,10,10,0,0,12,11,11,0,0,13,12,12,0,0,14,13,13,0,0,15,14,14,0,0,16,15,15,0,0,17,16,16,0,0,18,17,17,0,0,19,18,18,0,0,20,19,19,0,0,1,20,20,1,1,2,21,22,22,2,2,3,22,23,23,3,3,4,23,24,24,4,4,5,24,25,25,5,5,6,25,26,26,6,6,7,26,27,27,7,7,8,27,28,28,8,8,9,28,29,29,9,9,10,29,30,30,10,10,11,30,31,31,11,11,12,31,32,32,12,12,13,32,33,33,13,13,14,33,34,34,14,14,15,34,35,35,15,15,16,35,36,36,16,16,17,36,37,37,17,17,18,37,38,38,18,18,19,38,39,39,19,19,20,39,40,40,20,20,1,40,21,21,21,21,22,41,42,42,22,22,23,42,43,43,23,23,24,43,44,44,24,24,25,44,45,45,25,25,26,45,46,46,26,26,27,46,47,47,27,27,28,47,48,48,28,28,29,48,49,49,29,29,30,49,50,50,30,30,31,50,51,51,31,31,32,51,52,52,32,32,33,52,53,53,33,33,34,53,54,54,34,34,35,54,55,55,35,35,36,55,56,56,36,36,37,56,57,57,37,37,38,57,58,58,38,38,39,58,59,59,39,39,40,59,60,60,40,40,21,60,41,41,41,41,42,61,62,62,42,42,43,62,63,63,43,43,44,63,64,64,44,44,45,64,65,65,45,45,46,65,66,66,46,46,47,66,67,67,47,47,48,67,68,68,48,48,49,68,69,69,49,49,50,69,70,70,50,50,51,70,71,71,51,51,52,71,72,72,52,52,53,72,73,73,53,53,54,73,74,74,54,54,55,74,75,75,55,55,56,75,76,76,56,56,57,76,77,77,57,57,58,77,78,78,58,58,59,78,79,79,59,59,60,79,80,80,60,60,41,80,61,61,61,61,62,81,82,82,62,62,63,82,83,83,63,63,64,83,84,84,64,64,65,84,85,85,65,65,66,85,86,86,66,66,67,86,87,87,67,67,68,87,88,88,68,68,69,88,89,89,69,69,70,89,90,90,70,70,71,90,91,91,71,71,72,91,92,92,72,72,73,92,93,93,73,73,74,93,94,94,74,74,75,94,95,95,75,75,76,95,96,96,76,76,77,96,97,97,77,77,78,97,98,98,78,78,79,98,99,99,79,79,80,99,100,100,80,80,61,100,81,81,81,81,82,101,102,102,82,82,83,102,103,103,83,83,84,103,104,104,84,84,85,104,105,105,85,85,86,105,106,106,86,86,87,106,107,107,87,87,88,107,108,108,88,88,89,108,109,109,89,89,90,109,110,110,90,90,91,110,111,111,91,91,92,111,112,112,92,92,93,112,113,113,93,93,94,113,114,114,94,94,95,114,115,115,95,95,96,115,116,116,96,96,97,116,117,117,97,97,98,117,118,118,98,98,99,118,119,119,99,99,100,119,120,120,100,100,81,120,101,101,101,101,102,121,122,122,102,102,103,122,123,123,103,103,104,123,124,124,104,104,105,124,125,125,105,105,106,125,126,126,106,106,107,126,127,127,107,107,108,127,128,128,108,108,109,128,129,129,109,109,110,129,130,130,110,110,111,130,131,131,111,111,112,131,132,132,112,112,113,132,133,133,113,113,114,133,134,134,114,114,115,134,135,135,115,115,116,135,136,136,116,116,117,136,137,137,117,117,118,137,138,138,118,118,119,138,139,139,119,119,120,139,140,140,120,120,101,140,121,121,121,121,122,141,142,142,122,122,123,142,143,143,123,123,124,143,144,144,124,124,125,144,145,145,125,125,126,145,146,146,126,126,127,146,147,147,127,127,128,147,148,148,128,128,129,148,149,149,129,129,130,149,150,150,130,130,131,150,151,151,131,131,132,151,152,152,132,132,133,152,153,153,133,133,134,153,154,154,134,134,135,154,155,155,135,135,136,155,156,156,136,136,137,156,157,157,137,137,138,157,158,158,138,138,139,158,159,159,139,139,140,159,160,160,140,140,121,160,141,141,141,141,142,161,162,162,142,142,143,162,163,163,143,143,144,163,164,164,144,144,145,164,165,165,145,145,146,165,166,166,146,146,147,166,167,167,147,147,148,167,168,168,148,148,149,168,169,169,149,149,150,169,170,170,150,150,151,170,171,171,151,151,152,171,172,172,152,152,153,172,173,173,153,153,154,173,174,174,154,154,155,174,175,175,155,155,156,175,176,176,156,156,157,176,177,177,157,157,158,177,178,178,158,158,159,178,179,179,159,159,160,179,180,180,160,160,141,180,161,161,161,161,162,181,182,182,162,162,163,182,183,183,163,163,164,183,184,184,164,164,165,184,185,185,165,165,166,185,186,186,166,166,167,186,187,187,167,167,168,187,188,188,168,168,169,188,189,189,169,169,170,189,190,190,170,170,171,190,191,191,171,171,172,191,192,192,172,172,173,192,193,193,173,173,174,193,194,194,174,174,175,194,195,195,175,175,176,195,196,196,176,176,177,196,197,197,177,177,178,197,198,198,178,178,179,198,199,199,179,179,180,199,200,200,180,180,161,200,181,181,181,181,182,201,202,202,182,182,183,202,203,203,183,183,184,203,204,204,184,184,185,204,205,205,185,185,186,205,206,206,186,186,187,206,207,207,187,187,188,207,208,208,188,188,189,208,209,209,189,189,190,209,210,210,190,190,191,210,211,211,191,191,192,211,212,212,192,192,193,212,213,213,193,193,194,213,214,214,194,194,195,214,215,215,195,195,196,215,216,216,196,196,197,216,217,217,197,197,198,217,218,218,198,198,199,218,219,219,199,199,200,219,220,220,200,200,181,220,201,201,201,201,202,221,222,222,202,202,203,222,223,223,203,203,204,223,224,224,204,204,205,224,225,225,205,205,206,225,226,226,206,206,207,226,227,227,207,207,208,227,228,228,208,208,209,228,229,229,209,209,210,229,230,230,210,210,211,230,231,231,211,211,212,231,232,232,212,212,213,232,233,233,213,213,214,233,234,234,214,214,215,234,235,235,215,215,216,235,236,236,216,216,217,236,237,237,217,217,218,237,238,238,218,218,219,238,239,239,219,219,220,239,240,240,220,220,201,240,221,221,221,221,222,241,242,242,222,222,223,242,243,243,223,223,224,243,244,244,224,224,225,244,245,245,225,225,226,245,246,246,226,226,227,246,247,247,227,227,228,247,248,248,228,228,229,248,249,249,229,229,230,249,250,250,230,230,231,250,251,251,231,231,232,251,252,252,232,232,233,252,253,253,233,233,234,253,254,254,234,234,235,254,255,255,235,235,236,255,256,256,236,236,237,256,257,257,237,237,238,257,258,258,238,238,239,258,259,259,239,239,240,259,260,260,240,240,221,260,241,241,241,241,242,261,262,262,242,242,243,262,263,263,243,243,244,263,264,264,244,244,245,264,265,265,245,245,246,265,266,266,246,246,247,266,267,267,247,247,248,267,268,268,248,248,249,268,269,269,249,249,250,269,270,270,250,250,251,270,271,271,251,251,252,271,272,272,252,252,253,272,273,273,253,253,254,273,274,274,254,254,255,274,275,275,255,255,256,275,276,276,256,256,257,276,277,277,257,257,258,277,278,278,258,258,259,278,279,279,259,259,260,279,280,280,260,260,241,280,261,261,261,261,262,281,282,282,262,262,263,282,283,283,263,263,264,283,284,284,264,264,265,284,285,285,265,265,266,285,286,286,266,266,267,286,287,287,267,267,268,287,288,288,268,268,269,288,289,289,269,269,270,289,290,290,270,270,271,290,291,291,271,271,272,291,292,292,272,272,273,292,293,293,273,273,274,293,294,294,274,274,275,294,295,295,275,275,276,295,296,296,276,276,277,296,297,297,277,277,278,297,298,298,278,278,279,298,299,299,279,279,280,299,300,300,280,280,261,300,281,281,281,281,282,301,302,302,282,282,283,302,303,303,283,283,284,303,304,304,284,284,285,304,305,305,285,285,286,305,306,306,286,286,287,306,307,307,287,287,288,307,308,308,288,288,289,308,309,309,289,289,290,309,310,310,290,290,291,310,311,311,291,291,292,311,312,312,292,292,293,312,313,313,293,293,294,313,314,314,294,294,295,314,315,315,295,295,296,315,316,316,296,296,297,316,317,317,297,297,298,317,318,318,298,298,299,318,319,319,299,299,300,319,320,320,300,300,281,320,301,301,301,301,302,321,322,322,302,302,303,322,323,323,303,303,304,323,324,324,304,304,305,324,325,325,305,305,306,325,326,326,306,306,307,326,327,327,307,307,308,327,328,328,308,308,309,328,329,329,309,309,310,329,330,330,310,310,311,330,331,331,311,311,312,331,332,332,312,312,313,332,333,333,313,313,314,333,334,334,314,314,315,334,335,335,315,315,316,335,336,336,316,316,317,336,337,337,317,317,318,337,338,338,318,318,319,338,339,339,319,319,320,339,340,340,320,320,301,340,321,321,321,321,322,341,342,342,322,322,323,342,343,343,323,323,324,343,344,344,324,324,325,344,345,345,325,325,326,345,346,346,326,326,327,346,347,347,327,327,328,347,348,348,328,328,329,348,349,349,329,329,330,349,350,350,330,330,331,350,351,351,331,331,332,351,352,352,332,332,333,352,353,353,333,333,334,353,354,354,334,334,335,354,355,355,335,335,336,355,356,356,336,336,337,356,357,357,337,337,338,357,358,358,338,338,339,358,359,359,339,339,340,359,360,360,340,340,321,360,341,341,341,341,342,361,362,362,342,342,343,362,363,363,343,343,344,363,364,364,344,344,345,364,365,365,345,345,346,365,366,366,346,346,347,366,367,367,347,347,348,367,368,368,348,348,349,368,369,369,349,349,350,369,370,370,350,350,351,370,371,371,351,351,352,371,372,372,352,352,353,372,373,373,353,353,354,373,374,374,354,354,355,374,375,375,355,355,356,375,376,376,356,356,357,376,377,377,357,357,358,377,378,378,358,358,359,378,379,379,359,359,360,379,380,380,360,360,341,380,361,361,361,361,362,381,381,362,362,363,381,381,363,363,364,381,381,364,364,365,381,381,365,365,366,381,381,366,366,367,381,381,367,367,368,381,381,368,368,369,381,381,369,369,370,381,381,370,370,371,381,381,371,371,372,381,381,372,372,373,381,381,373,373,374,381,381,374,374,375,381,381,375,375,376,381,381,376,376,377,381,381,377,377,378,381,381,378,378,379,381,381,379,379,380,381,381,380,380,361,381,
760,
];
var model_sphere;
function frameTime(){ return 1000 / 30 ; }
function init(){
 _USE_KEY = true;
 _USE_MOUSE = true;
}
function start(){
 setCurrent( "canvas0" );
 return true;
}
function paint( g ){
 g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
 g.fillRect( 0, 0, getWidth(), getHeight() );
 g.setFont( 24, "ＭＳ ゴシック" );
 document.getElementById( "div0" ).style.display = "none";
 document.getElementById( "div1" ).style.display = "block";
 setCurrent3D( "canvas1" );
}
function _loadShader( gl, type, source ){
 var shader = gl.createShader( type );
 gl.shaderSource( shader, source );
 gl.compileShader( shader );
 if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
  gl.deleteShader( shader );
  return null;
 }
 return shader;
}
function createShaderProgram( gl, vsSource, fsSource ){
 var vertexShader = _loadShader( gl, gl.VERTEX_SHADER, vsSource );
 var fragmentShader = _loadShader( gl, gl.FRAGMENT_SHADER, fsSource );
 var shaderProgram = gl.createProgram();
 gl.attachShader( shaderProgram, vertexShader );
 gl.attachShader( shaderProgram, fragmentShader );
 gl.linkProgram( shaderProgram );
 if( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ){
  return null;
 }
 return shaderProgram;
}
var shaderProgram;
var aVertexPosition;
var aVertexColor = null;
var aVertexNormal = null;
var uProjectionMatrix;
var uModelViewMatrix;
var uNormalMatrix = null;
var uAmbientLightColor;
var uDirectionalLightColor;
var uDirectionalLightPosition;
var uEyeDirection;
var uSpecularLightColor;
var uShininess;
var rotation = 0.0;
function rotate( glu ){
 glu.rotate( 30, 1, 0, 0 );
 glu.rotate( rotation * 180 / Math.PI, 0, 1, 0 );
}
function init3D( gl, glu ){
 const vsSource = `
  attribute vec3 aVertexPosition;
  attribute vec4 aVertexColor;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;
  varying lowp vec4 vColor;
  void main(void) {
   gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
   vColor = aVertexColor;
  }
 `;
 const vsSourceLighting = `
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uNormalMatrix;
  uniform vec3 uAmbientLightColor;
  uniform vec3 uDirectionalLightColor;
  uniform vec3 uDirectionalLightPosition;
  uniform vec3 uEyeDirection;
  uniform vec3 uSpecularLightColor;
  uniform float uShininess;
  varying lowp vec4 vColor;
  varying lowp vec3 vAmbient;
  varying highp vec3 vDiffuse;
  varying highp vec3 vSpecular;
  void main(void) {
   gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
   vColor = aVertexColor;
   vAmbient = uAmbientLightColor;
   highp vec3 directionalLightPosition = normalize(uDirectionalLightPosition);
   highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
   highp float diffuse = clamp(dot(transformedNormal.xyz, directionalLightPosition), 0.0, 1.0);
   highp vec3 eyeDirection = normalize(uEyeDirection);
   highp float specular = pow(clamp(dot(aVertexNormal, eyeDirection), 0.0, 1.0), uShininess);
   vDiffuse = uDirectionalLightColor * diffuse;
   vSpecular = uSpecularLightColor * specular;
  }
 `;
 const fsSource = `
  varying lowp vec4 vColor;
  void main(void) {
   gl_FragColor = vColor;
  }
 `;
 const fsSourceLighting = `
  varying lowp vec4 vColor;
  varying lowp vec3 vAmbient;
  varying highp vec3 vDiffuse;
  varying highp vec3 vSpecular;
  void main(void) {
   gl_FragColor = vec4(vColor.rgb * (vAmbient + vDiffuse + vSpecular), vColor.a);
  }
 `;
 if( use_lighting ){
  shaderProgram = createShaderProgram( gl, vsSourceLighting, fsSourceLighting );
 } else {
  shaderProgram = createShaderProgram( gl, vsSource, fsSource );
 }
 gl.useProgram( shaderProgram );
 aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
 if( use_lighting ){
  aVertexNormal = gl.getAttribLocation( shaderProgram, "aVertexNormal" );
 }
 aVertexColor = gl.getAttribLocation( shaderProgram, "aVertexColor" );
 uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
 uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
 if( use_lighting ){
  uNormalMatrix = gl.getUniformLocation( shaderProgram, "uNormalMatrix" );
  uAmbientLightColor = gl.getUniformLocation( shaderProgram, "uAmbientLightColor" );
  uDirectionalLightColor = gl.getUniformLocation( shaderProgram, "uDirectionalLightColor" );
  uDirectionalLightPosition = gl.getUniformLocation( shaderProgram, "uDirectionalLightPosition" );
  uEyeDirection = gl.getUniformLocation( shaderProgram, "uEyeDirection" );
  uSpecularLightColor = gl.getUniformLocation( shaderProgram, "uSpecularLightColor" );
  uShininess = gl.getUniformLocation( shaderProgram, "uShininess" );
 }
 model_sphere = new Array( 3 );
 model_sphere[0] = createModel( glu, MODEL_SPHERE, 0.015, 0, true );
 model_sphere[1] = createModel( glu, MODEL_SPHERE, 0.015, 1, true );
 model_sphere[2] = createModel( glu, MODEL_SPHERE, 0.015, 2, true );
}
function paint3D( gl, glu ){
 gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
 gl.clearDepth( 1.0 );
 gl.enable( gl.DEPTH_TEST );
 gl.depthFunc( gl.LEQUAL );
 gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE );
 gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
 var fieldOfView = (45 * Math.PI) / 180;
 var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
 var zNear = 0.1;
 var zFar = 100.0;
 glu.setIdentity();
 var t = Math.tan( fieldOfView / 2 ) * zNear;
 var b = -t;
 var r = t * aspect;
 var l = -r;
 glu.frustum( l, r, b, t, zNear, zFar );
 glu.translate( 0.0, 1.0, -15.0 );
 rotation += 0.03;
 rotate( glu );
 glu.translate( 0.0, -1.0, 15.0 );
 var projectionMatrix = glu.glMatrix();
 gl.uniformMatrix4fv( uProjectionMatrix, false, projectionMatrix );
 glu.setIdentity();
 glu.translate( 0.0, 1.0, -15.0 );
 var modelViewMatrix = glu.glMatrix();
 gl.uniformMatrix4fv( uModelViewMatrix, false, modelViewMatrix );
 if( use_lighting ){
  glu.push();
  glu.set( glu.utMatrix( modelViewMatrix ) );
  glu.invert();
  glu.transpose();
  gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
  glu.pop();
  gl.uniform3fv(uAmbientLightColor, ambientLightColor);
  gl.uniform3fv(uDirectionalLightColor, directionalLightColor);
  gl.uniform3fv(uDirectionalLightPosition, directionalLightPosition);
  gl.uniform3fv(uEyeDirection, [-projectionMatrix[2], -projectionMatrix[6], -projectionMatrix[10]]);
 }
 var i;
 var gld = new _GLDraw( null, null );
 for ( i = model_sphere[0].stripNum() - 1; i >= 0; i-- ) {
  gld.add( model_sphere[0], i, -1, modelViewMatrix, -1 );
 }
 glu.push();
 glu.set( glu.utMatrix( modelViewMatrix ) );
 glu.translate( -5.0, 0.0, 0.0 );
 for ( i = model_sphere[1].stripNum() - 1; i >= 0; i-- ) {
  gld.add( model_sphere[1], i, -1, glu.glMatrix(), -1 );
 }
 glu.pop();
 glu.push();
 glu.set( glu.utMatrix( modelViewMatrix ) );
 glu.translate( 5.0, 0.0, 0.0 );
 for ( i = model_sphere[2].stripNum() - 1; i >= 0; i-- ) {
  gld.add( model_sphere[2], i, -1, glu.glMatrix(), -1 );
 }
 glu.pop();
 gld.draw( gl );
}
function glModelBindPositionBuffer( gl ){
 gl.vertexAttribPointer( aVertexPosition, 3, gl.FLOAT, false, 0, 0 );
 gl.enableVertexAttribArray( aVertexPosition );
}
function glModelBindNormalBuffer( gl ){
 if( aVertexNormal != null ){
  gl.vertexAttribPointer( aVertexNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( aVertexNormal );
 }
}
function glModelBindColorBuffer( gl ){
 if( aVertexColor != null ){
  gl.vertexAttribPointer( aVertexColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( aVertexColor );
 }
}
function glModelBindTextureCoordBuffer( gl ){
}
function glModelSetTexture( gl, glt , index, tex_index ){
 return false;
}
function glModelBeginDraw( gl, glt , index, tex_index, id, lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ){
 if( lighting ){
  gl.uniform3fv(uSpecularLightColor, specularLightColor[id]);
  gl.uniform1f(uShininess, shininess[id]);
 } else {
 }
 if( material_diffuse != null ){
 }
 if( material_ambient != null ){
 }
 if( material_emission != null ){
 }
 if( material_specular != null ){
 }
 if( material_shininess != null ){
 }
 return true;
}
function glModelEndDraw( gl, glt , index, tex_index ){
}
function glDrawUseProgram( gl, p, index ){
}
function glDrawSetProjectionMatrix( gl, mat, p, index ){
}
function glDrawSetLookMatrix( gl, mat, p, index ){
}
function glDrawSetModelViewMatrix( gl, mat ){
 gl.uniformMatrix4fv( uModelViewMatrix, false, mat );
}
function processEvent( type, param ){
 switch( type ){
 case 4:
  break;
 case 5:
  break;
 case 8:
  break;
 case 9:
  break;
 case 12:
  break;
 }
}
function error(){
 launch( "error.html" );
}
function createModel( glu, data, scale, id, depth ){
 var model = new _GLModel( id, depth, use_lighting );
 var cur = 0;
 var i, j, k;
 var coord_count;
 var normal_count;
 var color_count;
 var map_count;
 var texture_num = data[cur++];
 var texture_index = new Array(texture_num);
 var material_dif = new Array(texture_num * 4);
 var material_amb = new Array(texture_num * 4);
 var material_emi = new Array(texture_num * 4);
 var material_spc = new Array(texture_num * 4);
 var material_power = new Array(texture_num);
 for ( i = 0; i < texture_num; i++ ) {
  texture_index[i] = data[cur++];
  material_dif[i * 4] = data[cur++];
  material_dif[i * 4 + 1] = material_dif[i * 4];
  material_dif[i * 4 + 2] = material_dif[i * 4];
  material_dif[i * 4 + 3] = 1.0;
  material_amb[i * 4] = data[cur++];
  material_amb[i * 4 + 1] = material_amb[i * 4];
  material_amb[i * 4 + 2] = material_amb[i * 4];
  material_amb[i * 4 + 3] = 1.0;
  material_emi[i * 4] = data[cur++];
  material_emi[i * 4 + 1] = material_emi[i * 4];
  material_emi[i * 4 + 2] = material_emi[i * 4];
  material_emi[i * 4 + 3] = 1.0;
  material_spc[i * 4] = data[cur++];
  material_spc[i * 4 + 1] = material_spc[i * 4];
  material_spc[i * 4 + 2] = material_spc[i * 4];
  material_spc[i * 4 + 3] = 1.0;
  material_power[i] = data[cur++] * 128.0 / 100.0;
 }
 model.setMaterial(texture_num, texture_index, null, null, null, null, null);
 var group_tx = data[cur++] * scale;
 var group_ty = data[cur++] * scale;
 var group_tz = data[cur++] * scale;
 var group_or = data[cur++];
 var group_ox = data[cur++];
 var group_oy = data[cur++];
 var group_oz = data[cur++];
 glu.setIdentity();
 glu.translate(group_tx, group_ty, group_tz);
 glu.rotate(group_ox, group_oy, group_oz, group_or);
 var x, y, z;
 var coord_num = data[cur++];
 coord_count = null;
 var coord = null;
 if ( coord_num > 0 ) {
  coord_count = new Array(coord_num);
  coord = new Array(coord_num);
  for ( j = 0; j < coord_num; j++ ) {
   coord_count[j] = data[cur++];
   if ( coord_count[j] <= 0 ) {
    coord[j] = null;
   } else {
    coord[j] = new Array(coord_count[j] * 3);
    for ( i = 0; i < coord_count[j]; i++ ) {
     x = data[cur++] * scale;
     y = data[cur++] * scale;
     z = data[cur++] * scale;
     glu.transVector(x, y, z);
     coord[j][i * 3 ] = glu.transX();
     coord[j][i * 3 + 1] = glu.transY();
     coord[j][i * 3 + 2] = glu.transZ();
    }
   }
  }
 }
 var num = data[cur++];
 normal_count = null;
 var normal = null;
 if ( num > 0 ) {
  normal_count = new Array(coord_num);
  normal = new Array(coord_num);
  for ( j = 0; j < coord_num; j++ ) {
   normal_count[j] = data[cur++];
   if ( normal_count[j] <= 0 ) {
    normal[j] = null;
   } else {
    normal[j] = new Array(normal_count[j] * 3);
    for ( i = 0; i < normal_count[j]; i++ ) {
     x = data[cur++];
     y = data[cur++];
     z = data[cur++];
     glu.transVector(x, y, z);
     normal[j][i * 3 ] = glu.transX();
     normal[j][i * 3 + 1] = glu.transY();
     normal[j][i * 3 + 2] = glu.transZ();
    }
   }
  }
 }
 num = data[cur++];
 color_count = null;
 var color = null;
 if ( num > 0 ) {
  color_count = new Array(coord_num);
  color = new Array(coord_num);
  for ( j = 0; j < coord_num; j++ ) {
   color_count[j] = data[cur++];
   if ( color_count[j] <= 0 ) {
    color[j] = null;
   } else {
    color[j] = new Array(color_count[j] * 4);
    for ( i = 0; i < color_count[j]; i++ ) {
     color[j][i * 4 ] = data[cur++];
     color[j][i * 4 + 1] = data[cur++];
     color[j][i * 4 + 2] = data[cur++];
     color[j][i * 4 + 3] = 1.0;
    }
   }
  }
 }
 num = data[cur++];
 map_count = null;
 var map = null;
 if ( num > 0 ) {
  map_count = new Array(coord_num);
  map = new Array(coord_num);
  for ( j = 0; j < coord_num; j++ ) {
   map_count[j] = data[cur++];
   if ( map_count[j] <= 0 ) {
    map[j] = null;
   } else {
    map[j] = new Array(map_count[j] * 2);
    for ( i = 0; i < map_count[j]; i++ ) {
     map[j][i * 2 ] = data[cur++];
     map[j][i * 2 + 1] = data[cur++];
    }
   }
  }
 }
 model.setObject(coord_num, coord, normal, color, map);
 var strip_num = data[cur++];
 var strip_tx = new Array(strip_num);
 var strip_ty = new Array(strip_num);
 var strip_tz = new Array(strip_num);
 var strip_or = new Array(strip_num);
 var strip_ox = new Array(strip_num);
 var strip_oy = new Array(strip_num);
 var strip_oz = new Array(strip_num);
 var strip_texture = new Array(strip_num);
 var strip_coord = new Array(strip_num);
 var strip_normal = new Array(strip_num);
 var strip_color = new Array(strip_num);
 var strip_map = new Array(strip_num);
 var strip_len = new Array(strip_num);
 var strip = new Array(strip_num);
 for ( j = 0; j < strip_num; j++ ) {
  strip_tx[j] = data[cur++] * scale;
  strip_ty[j] = data[cur++] * scale;
  strip_tz[j] = data[cur++] * scale;
  strip_or[j] = data[cur++];
  strip_ox[j] = data[cur++];
  strip_oy[j] = data[cur++];
  strip_oz[j] = data[cur++];
  strip_texture[j] = data[cur++];
  strip_coord[j] = data[cur++];
  strip_normal[j] = data[cur++];
  strip_color[j] = data[cur++];
  strip_map[j] = data[cur++];
  strip_len[j] = data[cur++];
  strip[j] = new Array(strip_len[j]);
  for ( k = 0; k < strip_len[j]; k++ ) {
   strip[j][k] = data[cur++];
  }
 }
 model.setStrip(strip_num, strip_texture, strip_coord, strip_normal, strip_color, strip_map, strip_len, strip);
 return model;
}
