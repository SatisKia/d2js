




function canUseAudio(){
 return (!!document.createElement( "audio" ).canPlayType);
}

function canPlayType( type ){
 var audio = document.createElement( "audio" );
 if( !!audio.canPlayType ){
  return (audio.canPlayType( type ).replace( new RegExp( "no" ), "" ) != "");
 }
 return false;
}





function __Audio(){
 this.element = null;
 this.state = 0;
 this.volume = 100;
 this.id = currentTimeMillis();
}
function __AudioEx(){
 this.element = null;
 this.src = null;
 this.tag = null;
}

function _useAudioEx(){
 if( _USE_AUDIOEX ){
  if( !canUseAudio() ){
   return true;
  }
 }
 return false;
}

function loadAudio( src ){
 if( _useAudioEx() ){
  return loadAudioEx( src );
 }
 try {
  var audio = new __Audio();
  audio.element = new Audio( "" );
  audio.element.autoplay = false;
  audio.element.src = src;
  audio.element.load();
  return audio;
 } catch( e ){}
 return null;
}
function loadAudioEx( src ){
 var audio = new __AudioEx();
 audio.src = src;
 return audio;
}

function loadAndPlayAudio( src, loop ){
 if( _useAudioEx() ){
  return loadAndPlayAudioEx( src, loop, audioExElement() );
 }
 try {
  var audio = new __Audio();
  audio.element = new Audio( "" );
  audio.element.autoplay = false;
  audio.element.src = src;
  audio.element.loop = loop;
  audio.element.play();
  audio.state = 1;
  return audio;
 } catch( e ){}
 return null;
}
function loadAndPlayAudioEx( src, loop, tag ){
 var audio = loadAudioEx( src );
 playAudioEx( audio, loop, tag );
 return audio;
}

function isLoaded( audio ){
 if( _useAudioEx() ){
  return true;
 }
 if( audio != null ){
  try {
   if( audio.element.readyState >= 4 ){
    return true;
   }
  } catch( e ){}
 }
 return false;
}

function stopAudio( audio ){
 if( _useAudioEx() ){
  stopAudioEx( audio );
  return;
 }
 if( (audio != null) && (audio.state != 0) ){
  try {
   if( audio.state == 2 ){
    audio.element.currentTime = 0;
   } else if( (audio.state == 1) && !audio.element.ended ){
    audio.element.pause();
    audio.element.currentTime = 0;
   }
  } catch( e ){}
  audio.state = 0;
 }
}
function stopAudioEx( audio ){
 if( (audio != null) && (audio.element != null) ){
  audio.element.setAttribute( "src", "" );
  document.body.removeChild( audio.element );
  audio.element = null;
 }
}

function reloadAudio( audio ){
 stopAudio( audio );
 if( _useAudioEx() ){
  return;
 }
 if( audio != null ){
  try {
   audio.element.load();
  } catch( e ){}
 }
}

function playAudio( audio, loop ){
 if( _useAudioEx() ){
  playAudioEx( audio, loop, audioExElement() );
  return;
 }
 if( audio != null ){
  if( audio.state == 1 ){
   try {
    if( !audio.element.ended ){
     audio.element.pause();
     audio.element.currentTime = 0;
    }
   } catch( e ){}
  }
  try {
   audio.element.loop = loop;
   audio.element.play();
   audio.state = 1;
  } catch( e ){}
 }
}
function playAudioEx( audio, loop, tag ){
 if( audio != null ){
  if( audio.element != null ){
   audio.element.setAttribute( "src", "" );
   document.body.removeChild( audio.element );
  }
  audio.tag = tag;
  audio.element = document.createElement( audio.tag );
  audio.element.setAttribute( "src", audio.src );
  if( audio.tag == "audio" ){
   audio.element.setAttribute( "autoplay", "true" );
   if( loop ){
    audio.element.setAttribute( "loop", "true" );
   }
  } else if( audio.tag == "bgsound" ){
   if( loop ){
    audio.element.setAttribute( "loop", "infinite" );
   }
  } else if( audio.tag == "embed" ){
   audio.element.setAttribute( "autostart", "true" );
   audio.element.setAttribute( "hidden", "false" );
   audio.element.setAttribute( "width", "1" );
   audio.element.setAttribute( "height", "1" );
   if( loop ){
    audio.element.setAttribute( "loop", "true" );
    audio.element.setAttribute( "repeat", "true" );
   }
  }
  document.body.appendChild( audio.element );
 }
}

function isPlaying( audio ){
 if( _useAudioEx() ){
  return isPlayingEx( audio );
 }
 if( (audio != null) && (audio.state == 1) ){
  try {
   return !audio.element.ended;
  } catch( e ){}
  return true;
 }
 return false;
}
function isPlayingEx( audio ){
 if( (audio != null) && (audio.element != null) ){
  if( audio.tag == "audio" ){
   try {
    return !audio.element.ended;
   } catch( e ){}
  }
  return true;
 }
 return false;
}

function pauseAudio( audio ){
 if( _useAudioEx() ){
  return;
 }
 if( (audio != null) && (audio.state == 1) ){
  try {
   if( !audio.element.ended ){
    audio.element.pause();
    audio.state = 2;
   }
  } catch( e ){}
 }
}

function restartAudio( audio ){
 if( _useAudioEx() ){
  return;
 }
 if( (audio != null) && (audio.state == 2) ){
  try {
   audio.element.play();
   audio.state = 1;
  } catch( e ){}
 }
}

function setVolume( audio, volume ){
 if( _useAudioEx() ){
  return;
 }
 if( audio != null ){
  audio.volume = volume;
  try {
   audio.element.volume = audio.volume / 100.0;
  } catch( e ){}
 }
}

function getVolume( audio ){
 if( _useAudioEx() ){
  return 0;
 }
 if( audio != null ){
  return audio.volume;
 }
 return 0;
}

function getCurrentTime( audio ){
 if( _useAudioEx() ){
  return 0;
 }
 if( audio != null ){
  try {
   return Math.floor( audio.element.currentTime * 1000.0 );
  } catch( e ){}
 }
 return 0;
}

function _loopAudioSprite( audio, id, startTime, duration ){
 if( (audio != null) && (audio.id == id) && (audio.state == 1) ){
  playAudioSprite( audio, startTime, duration, true );
 }
}
function _pauseAudioSprite( audio, id ){
 if( (audio != null) && (audio.id == id) && (audio.state == 1) ){
  pauseAudio( audio );
 }
}

function loadAndPlayAudioSprite( src, startTime, duration, loop ){
 try {
  var audio = new __Audio();
  audio.element = new Audio( "" );
  audio.element.autoplay = false;
  audio.element.src = src;
  playAudioSprite( audio, startTime, duration, loop );
  return audio;
 } catch( e ){}
 return null;
}

function playAudioSprite( audio, startTime, duration, loop ){
 if( audio != null ){
  try {
   var id = currentTimeMillis();
   audio.id = id;

   var currentTime = startTime / 1000.0;
   var setCurrentTime = false;
   if( audio.state != 0 ){
    try {
     if( audio.state == 2 ){
      audio.element.currentTime = currentTime;
      setCurrentTime = true;
     } else if( (audio.state == 1) && !audio.element.ended ){
      audio.element.pause();
      audio.element.currentTime = currentTime;
      setCurrentTime = true;
     }
    } catch( e ){}
   }

   audio.element.loop = false;
   audio.element.play();
   audio.state = 1;

   if( !setCurrentTime ){
    try {
     audio.element.currentTime = currentTime;
    } catch( e ){}
   }

   if( loop ){
    setTimeout( function( a, b, c, d ){ _loopAudioSprite( a, b, c, d ); }, duration, audio, id, startTime, duration );
   } else {
    setTimeout( function( a, b ){ _pauseAudioSprite( a, b ); }, duration, audio, id );
   }
  } catch( e ){}
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
var _canvas;
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
 if( _USE_MOUSE ){
  _addEventListener( _canvas, "mousedown", _onMouseDown );
  _addEventListener( _canvas, "mousemove", _onMouseMove );
  _addEventListener( _canvas, "mouseout", _onMouseOut );
  _addEventListener( _canvas, "mouseover", _onMouseOver );
  _addEventListener( _canvas, "mouseup", _onMouseUp );
 }
 _g = new _Graphics();
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
function _DIV( a, b ){
 return _Math.div( a, b );
}
function _MOD( a, b ){
 return _Math.mod( a, b );
}
window._ANDROID = false;
window._IPHONE = false;
window._SMARTPHONE = false;
var COLOR_BASE_LIGHT;
var COLOR_BASE_FACE;
var COLOR_BASE_SHADOW;
var COLOR_BUTTON_LIGHT;
var COLOR_BUTTON_FACE;
var COLOR_BUTTON_SHADOW;
var COLOR_BUTTON_DSHADOW;
var COLOR_BUTTON_TEXT;
var COLOR_G;
var COLOR_K;
var COLOR_W;
var TYPE = [
 "audio/3gpp",
 "audio/3gpp2",
 "audio/aac",
 "audio/aacp",
 "audio/amr",
 "audio/basic",
 "audio/midi",
 "audio/mp3",
 "audio/mp4",
 "audio/mpeg",
 "audio/ogg",
 "audio/wav",
 "audio/x-aiff",
 "audio/x-wav"
];
var g;
var can_use_audio;
var can_play_type;
var audio;
var audio_pause;
var audio_stop;
var audio_type;
var audio_loop;
function frameTime(){ return 1000 / 15 ; }
function start(){
 var i;
 setCurrent( "canvas0" );
 g = getGraphics();
 g.setStrokeWidth( 2.0 );
 COLOR_BASE_LIGHT = g.getColorOfRGB( 100, 100, 110 );
 COLOR_BASE_FACE = g.getColorOfRGB( 60, 60, 90 );
 COLOR_BASE_SHADOW = g.getColorOfRGB( 20, 20, 30 );
 COLOR_BUTTON_LIGHT = g.getColorOfRGB( 240, 255, 255 );
 COLOR_BUTTON_FACE = g.getColorOfRGB( 190, 200, 210 );
 COLOR_BUTTON_SHADOW = g.getColorOfRGB( 120, 130, 150 );
 COLOR_BUTTON_DSHADOW = g.getColorOfRGB( 90, 100, 120 );
 COLOR_BUTTON_TEXT = g.getColorOfRGB( 50, 60, 80 );
 COLOR_G = g.getColorOfRGB( 0, 230, 0 );
 COLOR_K = g.getColorOfRGB( 0, 0, 0 );
 COLOR_W = g.getColorOfRGB( 255, 255, 255 );
 can_use_audio = canUseAudio();
 can_play_type = new Array( TYPE.length );
 for( i = 0; i < TYPE.length; i++ ){
  can_play_type[i] = canPlayType( TYPE[i] );
 }
 audio = new Array( 4 );
 audio_pause = new Array( 4 );
 audio_stop = new Array( 4 );
 audio_type = new Array( 4 );
 audio_loop = new Array( 4 );
 for( i = 0; i < 4; i++ ){
  if( _IPHONE ){
   audio[i] = null;
  } else {
   audio[i] = loadAudio( AUDIO_SRC[i] );
  }
  audio_pause[i] = false;
  audio_stop [i] = false;
  audio_type [i] = can_use_audio ? 0 : 1;
  audio_loop [i] = false;
  addLayout( 20, 95 + 160 * i, 80, 45, 10 * i );
  addLayout( 100, 95 + 160 * i, 80, 45, 1 + 10 * i );
  addLayout( 180, 95 + 160 * i, 80, 45, 2 + 10 * i );
  if( !_SMARTPHONE ){
   addLayout( 270, 100 + 160 * i, 75, 35, 3 + 10 * i );
   addLayout( 345, 100 + 160 * i, 75, 35, 4 + 10 * i );
   addLayout( 420, 100 + 160 * i, 75, 35, 5 + 10 * i );
   addLayout( 495, 100 + 160 * i, 75, 35, 6 + 10 * i );
  }
  addLayout( 495, 30 + 160 * i, 75, 40, 7 + 10 * i );
 }
 return true;
}
function drawTitleWindow( x, y, w, h, str ){
 g.setColor( COLOR_BASE_SHADOW );
 g.fillRect( x, y, w, h );
 g.setColor( COLOR_BASE_LIGHT );
 g.fillRect( x + 1, y + 1, w - 1, h - 1 );
 g.setColor( COLOR_K );
 g.fillRect( x + 1, y + 1, w - 2, h - 2 );
 g.setColor( COLOR_G );
 g.drawString( str, x + 10, (y + h / 2) + (g.fontHeight() / 2) );
}
function drawButton( x, y, w, h, str, down ){
 if( down ){
  g.setColor( COLOR_BUTTON_SHADOW );
  g.fillRect( x, y, w, h );
  g.setColor( COLOR_BUTTON_FACE );
  g.fillRect( x + 2, y + 2, w - 2, h - 2 );
  g.setColor( COLOR_BUTTON_DSHADOW );
  g.fillRect( x, y, w - 2, h - 2 );
  g.setColor( COLOR_BUTTON_SHADOW );
  g.fillRect( x + 2, y + 2, w - 4, h - 4 );
 } else {
  g.setColor( COLOR_BUTTON_FACE );
  g.fillRect( x, y, w, h );
  g.setColor( COLOR_BUTTON_SHADOW );
  g.fillRect( x + 2, y + 2, w - 2, h - 2 );
  g.setColor( COLOR_BUTTON_LIGHT );
  g.fillRect( x, y, w - 2, h - 2 );
  g.setColor( COLOR_BUTTON_FACE );
  g.fillRect( x + 2, y + 2, w - 4, h - 4 );
 }
 g.setColor( COLOR_BUTTON_TEXT );
 g.drawString( str, (x + w / 2) - (g.stringWidth( str ) / 2), (y + h / 2) + (g.fontHeight() / 2) );
}
function paint( g ){
 var i;
 var tmp;
 g.setColor( COLOR_BASE_FACE );
 g.fillRect( 0, 0, 600, 930 );
 g.setColor( COLOR_BASE_SHADOW );
 g.fillRect( 3, 3, 600 - 3, 640 - 3 );
 g.setColor( COLOR_BASE_LIGHT );
 g.fillRect( 0, 0, 600 - 3, 640 - 3 );
 g.setColor( COLOR_BASE_FACE );
 g.fillRect( 3, 3, 600 - 6, 640 - 6 );
 g.setColor( COLOR_BASE_SHADOW );
 g.drawLine( 0, 158, 599, 158 );
 g.drawLine( 0, 318, 599, 318 );
 g.drawLine( 0, 478, 599, 478 );
 g.setColor( COLOR_BASE_LIGHT );
 g.drawLine( 0, 160, 599, 160 );
 g.drawLine( 0, 320, 599, 320 );
 g.drawLine( 0, 480, 599, 480 );
 g.setFont( 24, "ＭＳ Ｐゴシック" );
 g.setColor( COLOR_W );
 g.drawString( "smartphone : " + (_SMARTPHONE ? "true" : "false"), 15, 670 );
 g.drawString( "audio : " + (can_use_audio ? "true" : "false"), 15, 670 + 28 );
 for( i = 2; i < TYPE.length + 2; i++ ){
  g.drawString( TYPE[i - 2] + " : " + (can_play_type[i - 2] ? "true" : "false"), 300 * _DIV( i, 10 ) + 15, 670 + 28 * _MOD(i, 10) );
 }
 g.setFont( 30, "ＭＳ Ｐゴシック" );
 for( i = 0; i < 4; i++ ){
  if( can_use_audio && (audio_type[i] == 0) ){
   drawTitleWindow( 20, 25 + 160 * i, 600 - 140, 50, AUDIO_SRC[i] + " " + getCurrentTime( audio[i] ) );
  } else {
   drawTitleWindow( 20, 25 + 160 * i, 600 - 140, 50, AUDIO_SRC[i] );
  }
 }
 g.setFont( 24, "ＭＳ Ｐゴシック" );
 for( i = 0; i < 4; i++ ){
  if( (tmp = getLayout( 10 * i )) != null ){
   if( audio[i] == null ){
    drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "LOAD", false );
   } else if( (audio_type[i] != 0) || isLoaded( audio[i] ) ){
    if( audio_type[i] == 0 ){
     drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "PLAY", isPlaying( audio[i] ) );
    } else {
     drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "PLAY", isPlayingEx( audio[i] ) );
    }
   } else {
    if( audio_type[i] == 0 ){
     drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "" + audio[i].element.readyState, false );
    } else {
     drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "", false );
    }
   }
  }
  if( (tmp = getLayout( 1 + 10 * i )) != null ){
   drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "PAUSE", audio_pause[i] );
  }
  if( (tmp = getLayout( 2 + 10 * i )) != null ){
   drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "STOP", audio_stop[i] );
  }
  audio_stop[i] = false;
 }
 if( !_SMARTPHONE ){
  g.setFont( 18, "ＭＳ Ｐゴシック" );
  for( i = 0; i < 4; i++ ){
   if( can_use_audio ){
    if( (tmp = getLayout( 3 + 10 * i )) != null ){
     drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "Audio", audio_type[i] == 0 );
    }
   }
   if( (tmp = getLayout( 4 + 10 * i )) != null ){
    drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "audio", audio_type[i] == 1 );
   }
   if( (tmp = getLayout( 5 + 10 * i )) != null ){
    drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "bgsound", audio_type[i] == 2 );
   }
   if( (tmp = getLayout( 6 + 10 * i )) != null ){
    drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "embed", audio_type[i] == 3 );
   }
  }
 }
 g.setFont( 25, "ＭＳ Ｐゴシック" );
 for( i = 0; i < 4; i++ ){
  if( (tmp = getLayout( 7 + 10 * i )) != null ){
   drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "LOOP", audio_loop[i] );
  }
 }
}
function myStopAudio( i ){
 if( audio_type[i] == 0 ){
  stopAudio( audio[i] );
 } else {
  stopAudioEx( audio[i] );
 }
 audio_pause[i] = false;
}
function processEvent( type, param ){
 if( type == 6 ){
  var i = _DIV( param, 10 );
  switch( _MOD( param, 10 ) ){
  case 0:
   if( audio_pause[i] ){
    restartAudio( audio[i] );
    audio_pause[i] = false;
   } else {
    if( audio[i] == null ){
     switch( audio_type[i] ){
     case 0: audio[i] = loadAndPlayAudio( AUDIO_SRC[i], audio_loop[i] ); break;
     case 1: audio[i] = loadAndPlayAudioEx( AUDIO_SRC[i], audio_loop[i], "audio" ); break;
     case 2: audio[i] = loadAndPlayAudioEx( AUDIO_SRC[i], audio_loop[i], "bgsound" ); break;
     case 3: audio[i] = loadAndPlayAudioEx( AUDIO_SRC[i], audio_loop[i], "embed" ); break;
     }
    } else if( (audio_type[i] != 0) || isLoaded( audio[i] ) ){
     switch( audio_type[i] ){
     case 0: playAudio( audio[i], audio_loop[i] ); break;
     case 1: playAudioEx( audio[i], audio_loop[i], "audio" ); break;
     case 2: playAudioEx( audio[i], audio_loop[i], "bgsound" ); break;
     case 3: playAudioEx( audio[i], audio_loop[i], "embed" ); break;
     }
    }
   }
   break;
  case 1:
   if( can_use_audio ){
    if( audio_type[i] == 0 ){
     if( audio_pause[i] ){
      restartAudio( audio[i] );
      audio_pause[i] = false;
     } else if( isPlaying( audio[i] ) ){
      pauseAudio( audio[i] );
      audio_pause[i] = true;
     }
    }
   }
   break;
  case 2:
   myStopAudio( i );
   audio_stop[i] = true;
   break;
  case 3:
   if( can_use_audio ){
    myStopAudio( i );
    audio_type[i] = 0;
    audio[i] = loadAudio( AUDIO_SRC[i] );
   }
   break;
  case 4:
   myStopAudio( i );
   audio_type[i] = 1;
   audio[i] = loadAudioEx( AUDIO_SRC[i] );
   break;
  case 5:
   myStopAudio( i );
   audio_type[i] = 2;
   audio[i] = loadAudioEx( AUDIO_SRC[i] );
   break;
  case 6:
   myStopAudio( i );
   audio_type[i] = 3;
   audio[i] = loadAudioEx( AUDIO_SRC[i] );
   break;
  case 7:
   myStopAudio( i );
   audio_loop[i] = !audio_loop[i];
   if( !_SMARTPHONE ){
    reloadAudio( audio[i] );
   }
   break;
  }
 }
}
function error(){
 launch( "error.html" );
}
