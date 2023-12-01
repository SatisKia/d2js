






function buttonElement( button ){
 return button.e;
}
function buttonX( button ){
 return button.x;
}
function buttonY( button ){
 return button.y;
}
function buttonWidth( button ){
 return button.width;
}
function buttonHeight( button ){
 return button.height;
}

function setButtonSrc( button, _src ){
 button.e.src = _src;
}

function updateButtonPos( button ){
 button.e.style.cssText = "position:absolute;left:" + (_getLeft( button.p ) + button.x) + "px;top:" + (_getTop( button.p ) + button.y) + "px;width:" + button.width + "px;height:" + button.height + "px";
}
function setButtonX( button, _x ){
 button.x = _x;
 updateButtonPos( button );
}
function setButtonY( button, _y ){
 button.y = _y;
 updateButtonPos( button );
}
function setButtonPos( button, _x, _y ){
 button.x = _x;
 button.y = _y;
 updateButtonPos( button );
}
function setButtonWidth( button, _width ){
 button.width = _width;
 updateButtonPos( button );
}
function setButtonHeight( button, _height ){
 button.height = _height;
 updateButtonPos( button );
}
function setButtonSize( button, _width, _height ){
 button.width = _width;
 button.height = _height;
 updateButtonPos( button );
}
function setButtonPosSize( button, _x, _y, _width, _height ){
 button.x = _x;
 button.y = _y;
 button.width = _width;
 button.height = _height;
 updateButtonPos( button );
}

function setButtonArea( button, _shape, _coords ){
 if( button.a != null ){
  button.a.setAttribute( "shape", _shape );
  button.a.setAttribute( "coords", _coords );
 }
}

function __Button( parent, element, create, x, y, width, height ){
 this.p = parent;
 this.e = element;
 this.c = create;
 this.m = null;
 this.a = null;
 setButtonPosSize( this, x, y, width, height );
}

function _addButtonEvent( button, area ){
 button.onButtonDown = function( e ){
  processEvent( 0, button.e );
 };
 button.onButtonOut = function( e ){
  processEvent( 1, button.e );
 };
 button.onButtonOver = function( e ){
  processEvent( 2, button.e );
 };
 button.onButtonUp = function( e ){
  processEvent( 3, button.e );
 };
 var target = area ? button.a : button.e;
 if( _USE_MOUSE ){
  _addEventListener( target, "mousedown", button.onButtonDown );
  _addEventListener( target, "mouseout", button.onButtonOut );
  _addEventListener( target, "mouseover", button.onButtonOver );
  _addEventListener( target, "mouseup", button.onButtonUp );
 }
 if( _USE_TOUCH ){
  _addEventListener( target, "touchstart", button.onButtonDown );
  _addEventListener( target, "touchmove", button.onButtonOver );
  _addEventListener( target, "touchend", button.onButtonUp );
 }
}

function createButton( parent, src, x, y, width, height ){
 var button = new __Button( parent, document.createElement( "img" ), true, x, y, width, height );
 setButtonSrc( button, src );
 document.body.appendChild( button.e );
 _addButtonEvent( button, false );
 return button;
}

function createButtonArea( parent, src, x, y, width, height, areaName, shape, coords ){
 var button = new __Button( parent, document.createElement( "img" ), true, x, y, width, height );

 setButtonSrc( button, src );
 button.e.setAttribute( "usemap", "#" + areaName );
 button.e.setAttribute( "border", "0" );
 document.body.appendChild( button.e );

 button.m = document.createElement( "map" );
 button.m.setAttribute( "name", areaName );
 document.body.appendChild( button.m );

 button.a = document.createElement( "area" );
 setButtonArea( button, shape, coords );
 button.m.appendChild( button.a );

 _addButtonEvent( button, true );

 return button;
}

function attachButton( parent, id, x, y, width, height ){
 var button = new __Button( parent, document.getElementById( id ), false, x, y, width, height );
 _addButtonEvent( button, false );
 return button;
}

function attachButtonArea( parent, id, x, y, width, height, areaId ){
 var button = new __Button( parent, document.getElementById( id ), false, x, y, width, height );
 button.a = document.getElementById( areaId );
 _addButtonEvent( button, true );
 return button;
}

function removeButton( button ){
 if( button.c ){
  var target = (button.a != null) ? button.a : button.e;
  if( _USE_MOUSE ){
   _removeEventListener( target, "mousedown", button.onButtonDown );
   _removeEventListener( target, "mouseout", button.onButtonOut );
   _removeEventListener( target, "mouseover", button.onButtonOver );
   _removeEventListener( target, "mouseup", button.onButtonUp );
  }
  if( _USE_TOUCH ){
   _removeEventListener( target, "touchstart", button.onButtonDown );
   _removeEventListener( target, "touchmove", button.onButtonOver );
   _removeEventListener( target, "touchend", button.onButtonUp );
  }
  document.body.removeChild( button.e );
 }
}
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
var button_1;
var button_2;
var button_3;
var img;
var img_select;
var str1;
var str2;
function frameTime(){ return 1000 / 60 ; }
function init(){
 _USE_TOUCH = true;
}
function start(){
 setCurrent( "canvas0" );
 button_1 = attachButton( getCurrent(), "button0", 20, 20, 120, 120 );
 button_2 = createButton( getCurrent(), "res/rax_button.png", 20, 170, 120, 120 );
 button_3 = createButton( getCurrent(), "res/ray_button.png", 20, 320, 120, 120 );
 img = new Array( 3 );
 img[0] = getResImage( "res_img0" );
 img[1] = getResImage( "res_img1" );
 img[2] = getResImage( "res_img2" );
 img_select = -1;
 str1 = new Array( 3 );
 str1[0] = getResString( "res_str0" );
 str1[1] = getResString( "res_str1" );
 str1[2] = getResString( "res_str2" );
 str2 = "";
 return true;
}
function paint( g ){
 g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
 g.fillRect( 0, 0, getWidth(), getHeight() );
 if( img_select >= 0 ){
  g.drawScaledImage( img[img_select], 160, 0, 480, 480, 0, 0, img[img_select].width, img[img_select].height );
 }
 g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
 g.setFont( 18, "ＭＳ ゴシック" );
 g.drawString( str2, 160, g.fontHeight() );
}
function processEvent( type, param ){
 switch( type ){
 case 0:
  if( param == buttonElement( button_1 ) ){
   str2 = "BUTTON " + str1[0] + " DOWN";
   img_select = 0;
  } else if( param == buttonElement( button_2 ) ){
   str2 = "BUTTON " + str1[1] + " DOWN";
   img_select = 1;
  } else if( param == buttonElement( button_3 ) ){
   str2 = "BUTTON " + str1[2] + " DOWN";
   img_select = 2;
  }
  break;
 case 3:
  if( param == buttonElement( button_1 ) ){
   str2 = "BUTTON " + str1[0] + " UP";
  } else if( param == buttonElement( button_2 ) ){
   str2 = "BUTTON " + str1[1] + " UP";
  } else if( param == buttonElement( button_3 ) ){
   str2 = "BUTTON " + str1[2] + " UP";
  }
  break;
 case 2:
  if( param == buttonElement( button_1 ) ){
   str2 = "BUTTON " + str1[0] + " OVER";
   setButtonPosSize( button_1, 10, 10, 140, 140 );
  } else if( param == buttonElement( button_2 ) ){
   str2 = "BUTTON " + str1[1] + " OVER";
   setButtonPosSize( button_2, 10, 160, 140, 140 );
  } else if( param == buttonElement( button_3 ) ){
   str2 = "BUTTON " + str1[2] + " OVER";
   setButtonPosSize( button_3, 10, 310, 140, 140 );
  }
  break;
 case 1:
  if( param == buttonElement( button_1 ) ){
   str2 = "BUTTON " + str1[0] + " OUT";
   setButtonPosSize( button_1, 20, 20, 120, 120 );
  } else if( param == buttonElement( button_2 ) ){
   str2 = "BUTTON " + str1[1] + " OUT";
   setButtonPosSize( button_2, 20, 170, 120, 120 );
  } else if( param == buttonElement( button_3 ) ){
   str2 = "BUTTON " + str1[2] + " OUT";
   setButtonPosSize( button_3, 20, 320, 120, 120 );
  }
  break;
 case 14:
  updateButtonPos( button_1 );
  updateButtonPos( button_2 );
  updateButtonPos( button_3 );
  break;
 }
}
function error(){
 launch( "error.html" );
}
