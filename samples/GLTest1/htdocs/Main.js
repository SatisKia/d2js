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
var _image_load = 0;
function loadImage( src ){
 _image_load++;
 var image = new Image();
 image.onload = function(){
   _image_load--;
 };
 image.src = src;
 return image;
}
function isImageBusy(){
 return (_image_load > 0);
}
function _Image( width, height ){
 this.image = new Image();
 this.canvas = document.createElement( "canvas" );
 this.context = this.canvas.getContext( "2d" );
 this.canvas.width = width;
 this.canvas.height = height;
 this.context.textAlign = "left";
 this.context.textBaseline = "bottom";
}
_Image.prototype = {
 lock : function(){
  this.sav_canvas = _canvas;
  this.sav_context = _context;
  this.sav_lock = _lock;
  _canvas = this.canvas;
  _context = this.context;
  _lock = true;
  _context.clearRect( 0, 0, _canvas.width, _canvas.height );
  _context.save();
 },
 unlock : function(){
  _context.restore();
  _canvas = this.sav_canvas;
  _context = this.sav_context;
  _lock = this.sav_lock;
  this.image.src = this.canvas.toDataURL();
 },
 getWidth : function(){
  return this.canvas.width;
 },
 getHeight : function(){
  return this.canvas.height;
 },
 getImage : function(){
  return this.image;
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
var _Math = {
 int : function( x ){
  if( x < 0 ){
   return Math.ceil( x );
  }
  return Math.floor( x );
 },
 div : function( a, b ){
  if( a < 0 ){
   return Math.ceil( a / b );
  }
  return Math.floor( a / b );
 },
 mod : function( a, b ){
  if( a < 0 ){
   a = -a;
   return -(a - Math.floor( a / b ) * b);
  }
  return a - Math.floor( a / b ) * b;
 }
};
function _INT( x ){
 return _Math.int( x );
}
function _DIV( a, b ){
 return _Math.div( a, b );
}
function _MOD( a, b ){
 return _Math.mod( a, b );
}
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
 _glu = new _GLUtility();
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
function _loadShader( type, source ){
 var shader = _gl.createShader( type );
 _gl.shaderSource( shader, source );
 _gl.compileShader( shader );
 if( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ){
  _gl.deleteShader( shader );
  return null;
 }
 return shader;
}
function createShaderProgram( vsSource, fsSource ){
 var vertexShader = _loadShader( _gl.VERTEX_SHADER, vsSource );
 var fragmentShader = _loadShader( _gl.FRAGMENT_SHADER, fsSource );
 var shaderProgram = _gl.createProgram();
 _gl.attachShader( shaderProgram, vertexShader );
 _gl.attachShader( shaderProgram, fragmentShader );
 _gl.linkProgram( shaderProgram );
 if( !_gl.getProgramParameter( shaderProgram, _gl.LINK_STATUS ) ){
  return null;
 }
 return shaderProgram;
}
function _GLTexture( img_array, gen_num ){
 var i;
 this._img_array = img_array;
 this._num = img_array.length;
 this._gen_num = gen_num;
 this._id = new Array( this._gen_num );
 _glu.genTextures( this._gen_num, this._id );
 this._gen = true;
 this._use_id = new Array( this._gen_num );
 for( i = 0; i < this._gen_num; i++ ){
  this._use_id[i] = false;
 }
 this._index2id = new Array( this._num );
 this._width = new Array( this._num );
 this._height = new Array( this._num );
 this._image_data = new Array( this._num );
 this._t_rgba = new Array( this._num );
 this._t_a = new Array( this._num );
 this._t_trans = new Array( this._num );
 this._t_alpha = new Array( this._num );
 this._tx = new Array( this._num );
 this._ty = new Array( this._num );
 this._apply_tx = new Array( this._num );
 this._apply_ty = new Array( this._num );
 for( i = 0; i < this._num; i++ ){
  this._index2id[i] = -1;
  this._image_data[i] = null;
  this._t_rgba[i] = null;
  this._t_a[i] = null;
  this._tx[i] = 0.0;
  this._ty[i] = 0.0;
  this._apply_tx[i] = 0;
  this._apply_ty[i] = 0;
 }
}
_GLTexture.prototype = {
 _SHIFTL : function( a ){
  return a * 0x1000000;
 },
 _SHIFTR : function( a ){
  return _DIV( a, 0x1000000 );
 },
 bindTexture : function( target, texture ){
  _glu.bindTexture( target, texture );
 },
 dispose : function(){
  for( var i = 0; i < this._num; i++ ){
   this.unuse( i );
  }
  if( this._gen ){
   _glu.deleteTextures( this._gen_num, this._id );
   this._gen = false;
  }
 },
 imageDataFromImage : function( image ){
  var canvas = document.createElement( "canvas" );
  var context = canvas.getContext( "2d" );
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage( image, 0, 0 );
  return context.getImageData( 0, 0, canvas.width, canvas.height );
 },
 imageDataFromPixels : function( pixels, width, height ){
  var canvas = document.createElement( "canvas" );
  var context = canvas.getContext( "2d" );
  canvas.width = width;
  canvas.height = height;
  var x, y, yy;
  var tmp, r, g, b, a;
  for( y = 0; y < height; y++ ){
   yy = y * width;
   for( x = 0; x < width; x++ ){
    tmp = pixels[yy + x];
    r = this._SHIFTR(tmp) & 0xff;
    g = (tmp >> 16) & 0xff;
    b = (tmp >> 8) & 0xff;
    a = tmp & 0xff;
    context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    context.fillRect( x, y, 1, 1 );
   }
  }
  return context.getImageData( 0, 0, canvas.width, canvas.height );
 },
 getTextureSize : function( size ){
  var tmp = 1;
  while( true ){
   if( tmp >= size ){
    break;
   }
   tmp *= 2;
  }
  return tmp;
 },
 use : function( index, use_trans ){
  if( this._index2id[index] >= 0 ){
   return;
  }
  if( use_trans == undefined ){
   use_trans = false;
  }
  var i;
  this._index2id[index] = 0;
  for( i = 0; i < this._gen_num; i++ ){
   if( !this._use_id[i] ){
    this._use_id[i] = true;
    this._index2id[index] = i;
    break;
   }
  }
  this._image_data[index] = this.imageDataFromImage( this._img_array[index] );
  this._width [index] = this._image_data[index].width;
  this._height[index] = this._image_data[index].height;
  if( use_trans ){
   var len = this._width[index] * this._height[index];
   this._t_rgba[index] = new Array( len );
   this._t_a[index] = new Array( len );
   var data = this._image_data[index].data;
   for( i = 0; i < len; i++ ){
    this._t_rgba[index][i] = this._SHIFTL(data[i * 4]) + (data[i * 4 + 1] << 16) + (data[i * 4 + 2] << 8) + data[i * 4 + 3];
    this._t_a[index][i] = data[i * 4 + 3];
   }
  }
  this._t_trans[index] = 1.0;
  this._t_alpha[index] = glTextureAlphaFlag( index );
  _glu.bindTexture( this._id[this._index2id[index]] );
  _gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
  _gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
  _glu.texImage2D( this._image_data[index] );
  _gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, glTextureFilter( _gl, index ) );
  _gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, glTextureFilter( _gl, index ) );
  _gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, glTextureWrap( _gl, index ) );
  _gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, glTextureWrap( _gl, index ) );
 },
 unuse : function( index ){
  if( this._index2id[index] >= 0 ){
   this._use_id[this._index2id[index]] = false;
   this._image_data[index] = null;
   this._t_rgba[index] = null;
   this._t_a[index] = null;
   this._index2id[index] = -1;
  }
 },
 unuseAll : function(){
  for( var i = 0; i < this._num; i++ ){
   this.unuse( i );
  }
  _glu.deleteTextures( this._gen_num, this._id );
  _glu.genTextures( this._gen_num, this._id );
 },
 update : function( index, pixels, length ){
  if( this._index2id[index] >= 0 ){
   var len = this._width[index] * this._height[index];
   if( length == len ){
    this._image_data[index] = this.imageDataFromPixels( pixels, this._width[index], this._height[index] );
    if( (this._t_rgba[index] != null) && (this._t_a[index] != null) ){
     _System.arraycopy( pixels, 0, this._t_rgba[index], 0, len );
     for( var i = 0; i < len; i++ ){
      this._t_a[index][i] = this._t_rgba[index][i] & 0xff;
     }
    }
    this._t_trans[index] = 1.0;
    this._t_alpha[index] = glTextureAlphaFlag( index );
    _gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
    _glu.bindTexture( this._id[this._index2id[index]] );
    _gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
    _glu.texImage2D( this._image_data[index] );
   }
  }
 },
 setTransparency : function( index, trans ){
  if( (this._t_rgba[index] == null) || (this._t_a[index] == null) ){
   return;
  }
  this.use( index );
  if( trans == this._t_trans[index] ){
   return;
  }
  this._t_trans[index] = trans;
  var len = this._width[index] * this._height[index];
  var r, g, b, a;
  for( var i = 0; i < len; i++ ){
   r = this._SHIFTR(this._t_rgba[index][i]) & 0xff;
   g = (this._t_rgba[index][i] >> 16) & 0xff;
   b = (this._t_rgba[index][i] >> 8) & 0xff;
   a = _INT( this._t_a[index][i] * this._t_trans[index] );
   this._t_rgba[index][i] = this._SHIFTL(r) + (g << 16) + (b << 8) + a;
  }
  this._image_data[index] = this.imageDataFromPixels( this._t_rgba[index], this._width[index], this._height[index] );
  this._t_alpha[index] = (this._t_trans[index] == 1.0) ? glTextureAlphaFlag( index ) : true;
  _gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
  _glu.bindTexture( this._id[this._index2id[index]] );
  _gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
  _glu.texImage2D( this._image_data[index] );
 },
 translate : function( index, x, y ){
  this.use( index );
  var width = this._width [index];
  var height = this._height[index];
  this._tx[index] = x * width;
  this._ty[index] = y * height;
  var dx = this._apply_tx[index] - _INT( this._tx[index] );
  var dy = this._apply_ty[index] - _INT( this._ty[index] );
  var repeat = (glTextureWrap( _gl, index ) == _gl.REPEAT);
  var i, j, k;
  if( dx != 0 ){
   this._apply_tx[index] = _INT( this._tx[index] );
   var tmp = new Array( width * 4 );
   var data = this._image_data[index].data;
   var pos;
   for( i = 0; i < height; i++ ){
    pos = i * width;
    for( j = 0; j < width; j++ ){
     k = j - dx;
     if( !repeat ){
      if( (k < 0) || (k >= width) ){
       tmp[j * 4 ] = 0;
       tmp[j * 4 + 1] = 0;
       tmp[j * 4 + 2] = 0;
       tmp[j * 4 + 3] = 0;
      } else {
       tmp[j * 4 ] = data[(pos + k) * 4 ];
       tmp[j * 4 + 1] = data[(pos + k) * 4 + 1];
       tmp[j * 4 + 2] = data[(pos + k) * 4 + 2];
       tmp[j * 4 + 3] = data[(pos + k) * 4 + 3];
      }
     } else {
      while( k < 0 ){
       k += width;
      }
      while( k >= width ){
       k -= width;
      }
      tmp[j * 4 ] = data[(pos + k) * 4 ];
      tmp[j * 4 + 1] = data[(pos + k) * 4 + 1];
      tmp[j * 4 + 2] = data[(pos + k) * 4 + 2];
      tmp[j * 4 + 3] = data[(pos + k) * 4 + 3];
     }
    }
    _System.arraycopy( tmp, 0, data, pos * 4, width * 4 );
   }
  }
  if( dy != 0 ){
   this._apply_ty[index] = _INT( this._ty[index] );
   var tmp = new Array( height );
   for( i = 0; i < height; i++ ){
    tmp[i] = new Array( width * 4 );
   }
   var data = this._image_data[index].data;
   for( i = 0; i < height; i++ ){
    k = i - dy;
    if( !repeat ){
     if( (k < 0) || (k >= width) ){
      for( j = 0; j < width; j++ ){
       tmp[i][j * 4 ] = 0;
       tmp[i][j * 4 + 1] = 0;
       tmp[i][j * 4 + 2] = 0;
       tmp[i][j * 4 + 3] = 0;
      }
     } else {
      _System.arraycopy( data, k * width * 4, tmp[i], 0, width * 4 );
     }
    } else {
     while( k < 0 ){
      k += height;
     }
     while( k >= height ){
      k -= height;
     }
     _System.arraycopy( data, k * width * 4, tmp[i], 0, width * 4 );
    }
   }
   for( i = 0; i < height; i++ ){
    _System.arraycopy( tmp[i], 0, data, i * width * 4, width * 4 );
   }
  }
  if( (dx != 0) || (dy != 0) ){
   if( (this._t_rgba[index] != null) && (this._t_a[index] != null) ){
    var len = width * height;
    var data = this._image_data[index].data;
    for( i = 0; i < len; i++ ){
     this._t_rgba[index][i] = this._SHIFTL(data[i * 4]) + (data[i * 4 + 1] << 16) + (data[i * 4 + 2] << 8) + data[i * 4 + 3];
     this._t_a[index][i] = data[i * 4 + 3];
    }
    var r, g, b, a;
    for( i = 0; i < len; i++ ){
     r = this._SHIFTR(this._t_rgba[index][i]) & 0xff;
     g = (this._t_rgba[index][i] >> 16) & 0xff;
     b = (this._t_rgba[index][i] >> 8) & 0xff;
     a = _INT( this._t_a[index][i] * this._t_trans[index] );
     this._t_rgba[index][i] = this._SHIFTL(r) + (g << 16) + (b << 8) + a;
    }
    this._image_data[index] = this.imageDataFromPixels( this._t_rgba[index], width, height );
   }
   _gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
   _glu.bindTexture( this._id[this._index2id[index]] );
   _gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
   _glu.texImage2D( this._image_data[index] );
  }
 },
 id : function( index ){
  return this._id[this._index2id[index]];
 },
 width : function( index ){
  return this._width[index];
 },
 height : function( index ){
  return this._height[index];
 },
 alpha : function( index ){
  return this._t_alpha[index];
 },
 depth : function( index ){
  return glTextureDepthFlag( index );
 }
};
window._GLUTILITY_TOLERANCE_M = -1.0;
window._GLUTILITY_TOLERANCE = 1.0;
function _GLUtility(){
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
   textures[i] = _gl.createTexture();
  }
 },
 deleteTextures : function( n, textures ){
  for( var i = 0; i < n; i++ ){
   _gl.deleteTexture( textures[i] );
  }
 },
 bindTexture : function( target, texture ){
  if( texture == undefined ){
   texture = target;
   target = _gl.TEXTURE_2D;
  }
  _gl.bindTexture( target, texture );
 },
 texImage2D : function( target, image ){
  if( image == undefined ){
   image = target;
   target = _gl.TEXTURE_2D;
  }
  var level = 0;
  var internalformat = _gl.RGBA;
  var format = _gl.RGBA;
  var type = _gl.UNSIGNED_BYTE;
  _gl.texImage2D( target, level, internalformat, format, type, image );
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
  _gl.viewport( x, y, width, height );
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
var glt;
var img_loaded = false;
var img_array = new Array();
var img_src = [
"data:image/png;base64,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",
];
var imageData;
var textureId;
function frameTime(){ return (disp_img || img_loaded) ? (1000 / 30 ) : 0; }
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
 if( use_texture ){
  if( isImageBusy() ){
   if( disp_img ){
    if( img_array.length > 1 ){
     g.drawImage( img_array[img_array.length - 2], 0, 0 );
    }
   }
   g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
   g.drawString( "" + img_array.length + " loading...", 10, 30 );
  } else if( img_array.length <= img_src.length ){
   var index = img_array.length;
   if( index > 0 ){
    if( disp_img ){
     g.drawImage( img_array[index - 1], 0, 0 );
    }
    g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
    g.drawString( "" + index + " loaded", 10, 30 );
   }
   if( img_array.length < img_src.length ){
    img_array[index] = loadImage( img_src[index] );
   } else if( !img_loaded ){
    img_loaded = true;
    if( disp_img ){
     window.setTimeout( function(){
      document.getElementById( "div0" ).style.display = "none";
      document.getElementById( "div1" ).style.display = "block";
      setCurrent3D( "canvas1" );
     }, 1000 );
    } else {
     document.getElementById( "div0" ).style.display = "none";
     document.getElementById( "div1" ).style.display = "block";
     setCurrent3D( "canvas1" );
    }
   }
  }
 } else {
  img_loaded = true;
  document.getElementById( "div0" ).style.display = "none";
  document.getElementById( "div1" ).style.display = "block";
  setCurrent3D( "canvas1" );
 }
}
var shaderProgram;
var aVertexPosition;
var aVertexColor = null;
var aTextureCoord = null;
var uProjectionMatrix;
var uModelViewMatrix;
var uSampler = null;
var positionBuffer;
var colorBuffer;
var textureCoordBuffer;
var squareRotation = 0.0;
function init3D( gl, glu ){
 if( use_texture ){
  if( use_glt || set_transparency ){
   glt = new _GLTexture( img_array, img_array.length );
   glt.use( 0, set_transparency );
  } else {
   imageData = imageDataFromImage( img_array[0] );
   textureId = gl.createTexture();
   gl.bindTexture( gl.TEXTURE_2D, textureId );
   gl.pixelStorei( gl.UNPACK_ALIGNMENT, 1 );
   gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false );
   var level = 0;
   var internalformat = gl.RGBA;
   var format = gl.RGBA;
   var type = gl.UNSIGNED_BYTE;
   gl.texImage2D( gl.TEXTURE_2D, level, internalformat, format, type, imageData );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
   gl.activeTexture( gl.TEXTURE0 );
   gl.bindTexture( gl.TEXTURE_2D, textureId );
  }
 }
 const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;
  varying lowp vec4 vColor;
  void main(void) {
   gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
   vColor = aVertexColor;
  }
 `;
 const vsSourceTexture = `
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;
  varying highp vec2 vTextureCoord;
  void main(void) {
   gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
   vTextureCoord = aTextureCoord;
  }
 `;
 const fsSource = `
  varying lowp vec4 vColor;
  void main(void) {
   gl_FragColor = vColor;
  }
 `;
 const fsSourceTexture = `
  uniform sampler2D uSampler;
  varying highp vec2 vTextureCoord;
  void main(void) {
   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  }
 `;
 if( use_texture ){
  shaderProgram = createShaderProgram( vsSourceTexture, fsSourceTexture );
  aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
  aTextureCoord = gl.getAttribLocation( shaderProgram, "aTextureCoord" );
  uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
  uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
  uSampler = gl.getUniformLocation( shaderProgram, "uSampler" );
 } else {
  shaderProgram = createShaderProgram( vsSource, fsSource );
  aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
  aVertexColor = gl.getAttribLocation( shaderProgram, "aVertexColor" );
  uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
  uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
 }
 gl.useProgram( shaderProgram );
 if( uSampler != null ){
  gl.uniform1i( uSampler, 0 );
 }
 const positions = [
  -1.0, -1.0, 0.0,
   1.0, -1.0, 0.0,
  -1.0, 1.0, 0.0,
   1.0, 1.0, 0.0,
 ];
 positionBuffer = gl.createBuffer();
 gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
 gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
 gl.vertexAttribPointer( aVertexPosition, 3, gl.FLOAT, false, 0, 0 );
 gl.enableVertexAttribArray( aVertexPosition );
 gl.bindBuffer( gl.ARRAY_BUFFER, null );
 if( aVertexColor != null ){
  const colors = [
   0.0, 0.0, 1.0, 1.0,
   0.0, 1.0, 0.0, 1.0,
   1.0, 0.0, 0.0, 1.0,
   1.0, 1.0, 1.0, 1.0,
  ];
  colorBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
  gl.vertexAttribPointer( aVertexColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( aVertexColor );
  gl.bindBuffer( gl.ARRAY_BUFFER, null );
 }
 if( aTextureCoord != null ){
  var tmp = 240.0 / 256.0;
  const textureCoordinates = [
   0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,
  ];
  textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, textureCoordBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoordinates ), gl.STATIC_DRAW );
  gl.vertexAttribPointer( aTextureCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( aTextureCoord );
  gl.bindBuffer( gl.ARRAY_BUFFER, null );
 }
}
function paint3D( gl, glu ){
 gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
 gl.clearDepth( 1.0 );
 gl.enable( gl.CULL_FACE );
 gl.enable( gl.DEPTH_TEST );
 gl.depthFunc( gl.LEQUAL );
 gl.depthMask( true );
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
 gl.uniformMatrix4fv( uProjectionMatrix, false, glu.glMatrix() );
 glu.setIdentity();
 glu.translate( -0.0, 0.0, -6.0 );
 squareRotation += 1.5;
 glu.rotate( squareRotation, 0, 0, 1 );
 gl.uniformMatrix4fv( uModelViewMatrix, false, glu.glMatrix() );
 if( use_texture ){
  gl.enable( gl.BLEND );
  if( set_transparency ){
   gl.disable( gl.CULL_FACE );
   gl.depthMask( false );
   glt.setTransparency( 0, 0.5 );
  }
 }
 gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
}
function glTextureAlphaFlag( index ){
 return true;
}
function glTextureDepthFlag( index ){
 return true;
}
function glTextureFlipY( index ){
 return false;
}
function glTextureFilter( gl, index ){
 return gl.LINEAR;
}
function glTextureWrap( gl, index ){
 return gl.CLAMP_TO_EDGE;
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
function imageDataFromImage( image ){
 var canvas = document.createElement( "canvas" );
 var context = canvas.getContext( "2d" );
 canvas.width = image.width;
 canvas.height = image.height;
 context.drawImage( image, 0, 0 );
 return context.getImageData( 0, 0, canvas.width, canvas.height );
}
