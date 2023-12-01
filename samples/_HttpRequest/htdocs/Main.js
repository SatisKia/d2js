






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
var img;
var str;
var http_request_1;
var http_request_2;
var http_request_3;
function frameTime(){ return 1000 / 60 ; }
function init(){
}
function start(){
 var i, j;
 setCurrent( "canvas0" );
 for( i = 0; i < 3; i++ ){
  switch( i ){
  case 0: id = "get" ; break;
  case 1: id = "post"; break;
  case 2: id = "json"; break;
  }
  for( j = 0; j < 4; j++ ){
   addEventListener( document.getElementById( id + j ), "mousedown", imgMouseDown );
   addEventListener( document.getElementById( id + j ), "mouseup" , imgMouseUp );
   addEventListener( document.getElementById( id + j ), "mouseover", imgMouseOver );
   addEventListener( document.getElementById( id + j ), "mouseout" , imgMouseOut );
  }
 }
 img = loadImage( "error.jpg" );
 str = new Array( 5 );
 for( i = 0; i < 5; i++ ){
  str[i] = "";
 }
 http_request_1 = null;
 http_request_2 = null;
 http_request_3 = null;
 return true;
}
function imgMouseDown( e ){
 str[0] = e.target.id + " MOUSE DOWN";
 if(
  (http_request_1 != null) ||
  (http_request_2 != null) ||
  (http_request_3 != null)
 ){
  return;
 }
 var character = "ダミー";
 if( (e.target.id === "get0") || (e.target.id === "post0") || (e.target.id === "json0") ){
  character = "こむ";
 }
 if( (e.target.id === "get1") || (e.target.id === "post1") || (e.target.id === "json1") ){
  character = "ラクス";
 }
 if( (e.target.id === "get2") || (e.target.id === "post2") || (e.target.id === "json2") ){
  character = "レイ";
 }
 if( (e.target.id === "get0") || (e.target.id === "get1") || (e.target.id === "get2") || (e.target.id === "get3") ){
  str[1] = SERVER + "test1.php?character=" + encodeURIComponent( character );
  http_request_1 = httpGet( str[1] );
 }
 if( (e.target.id === "post0") || (e.target.id === "post1") || (e.target.id === "post2") || (e.target.id === "post3") ){
  str[1] = "character=" + encodeURIComponent( character );
  http_request_2 = httpPost( SERVER + "test2.php", str[1], "application/x-www-form-urlencoded" );
 }
 if( (e.target.id === "json0") || (e.target.id === "json1") || (e.target.id === "json2") || (e.target.id === "json3") ){
  jsonInit();
  jsonAddString( "character", character );
  str[1] = jsonOut();
  http_request_3 = httpPost( SERVER + "test3.php", str[1], "application/json" );
 }
}
function imgMouseUp( e ){
 str[0] = e.target.id + " MOUSE UP";
}
function imgMouseOver( e ){
 str[0] = e.target.id + " MOUSE OVER";
}
function imgMouseOut( e ){
 str[0] = e.target.id + " MOUSE OUT";
}
function onHttpSetRequestHeader( header, value ){
}
function onHttpResponse( request, data ){
 str[2] = data;
 if( request == http_request_1 ){
  str[3] = readParameter( data, "character" );
  str[4] = readParameter( data, "image" );
  img.src = SERVER + str[4];
  http_request_1 = null;
 }
 if( request == http_request_2 ){
  var key = readParameters( data );
  str[3] = ("character" in key) ? key["character"] : "";
  str[4] = ("image" in key) ? key["image"] : "";
  img.src = SERVER + str[4];
  http_request_2 = null;
 }
 if( request == http_request_3 ){
  jsonResponse( data );
  str[3] = jsonGetString( 0, "character", "" );
  str[4] = jsonGetString( 0, "image", "" );
  img.src = SERVER + str[4];
  http_request_3 = null;
 }
}
function onHttpError( request, status ){
 str[2] = "通信エラー " + status;
 if( request == http_request_1 ){
  http_request_1 = null;
 }
 if( request == http_request_2 ){
  http_request_2 = null;
 }
 if( request == http_request_3 ){
  http_request_3 = null;
 }
}
function paint( g ){
 g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
 g.fillRect( 0, 0, getWidth(), getHeight() );
 g.drawScaledImage( img, 160, 0, 480, 480, 0, 0, img.width, img.height );
 g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
 g.setFont( 18, "ＭＳ ゴシック" );
 if(
  (http_request_1 != null) ||
  (http_request_2 != null) ||
  (http_request_3 != null)
 ){
  str[2] = "通信中...";
 }
 for( var i = 0; i < 5; i++ ){
  g.drawString( str[i], 0, g.fontHeight() + g.fontHeight() * i );
 }
}
function processEvent( type, param ){
}
function error(){
 launch( "error.html" );
}
