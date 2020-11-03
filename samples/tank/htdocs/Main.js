




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
function _Random(){
}
_Random.prototype = {
 next : function( n ){
  if( Math.random() < 0.5 ){
   return -Math.floor( Math.random() * n );
  }
  return Math.floor( Math.random() * n );
 },
 nextInt : function(){
  if( Math.random() < 0.5 ){
   return -Math.floor( Math.random() * 0x80000000 );
  }
  return Math.floor( Math.random() * 0x80000000 );
 }
};
function _ScalableGraphics(){
 this.f = 0;
 this.s = 1.0;
}
_ScalableGraphics.prototype = {
 canUseClip : function(){
  return (!!_context.clip);
 },
 canUseText : function(){
  return (!!_context.fillText);
 },
 setScale : function( scale ){
  this.s = scale;
 },
 scale : function(){
  return this.s;
 },
 getColorOfRGB : function( r, g, b ){
  return "rgb(" + r + "," + g + "," + b + ")";
 },
 setStrokeWidth : function( width ){
  _context.lineWidth = width * this.s;
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
  setFont( Math.floor( size * this.s ), family );
  _context.font = "" + _font_size + "px " + _font_family;
 },
 stringWidth : function( str ){
  return ((this.s == 0.0) ? 0 : stringWidth( str ) / this.s);
 },
 fontHeight : function(){
  return ((this.s == 0.0) ? 0 : fontHeight() / this.s);
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
   _context.moveTo( x * this.s, y * this.s );
   _context.lineTo( (x * this.s) + (width * this.s), y * this.s );
   _context.lineTo( (x * this.s) + (width * this.s), (y * this.s) + (height * this.s) );
   _context.lineTo( x * this.s, (y * this.s) + (height * this.s) );
   _context.closePath();
   _context.clip();
  }
 },
 drawLine : function( x1, y1, x2, y2 ){
  _context.beginPath();
  _context.moveTo( (x1 + 0.5) * this.s, (y1 + 0.5) * this.s );
  _context.lineTo( (x2 + 0.5) * this.s, (y2 + 0.5) * this.s );
  _context.stroke();
  _context.closePath();
 },
 drawRect : function( x, y, width, height ){
  _context.strokeRect( (x + 0.5) * this.s, (y + 0.5) * this.s, width * this.s, height * this.s );
 },
 fillRect : function( x, y, width, height ){
  _context.fillRect( x * this.s, y * this.s, width * this.s, height * this.s );
 },
 drawCircle : function( cx, cy, r ){
  _context.beginPath();
  _context.arc( cx * this.s, cy * this.s, r * this.s, 0.0, Math.PI * 2.0, false );
  _context.stroke();
 },
 drawString : function( str, x, y ){
  if( !!_context.fillText ){
   _context.fillText( str, x * this.s, y * this.s );
  } else {
   if( _USE_DRAWSTRINGEX ){
    _drawStringEx( str, x * this.s, y * this.s );
   }
  }
 },
 setFlipMode : function( flip ){
  this.f = flip;
 },
 drawScaledImage : function( image, dx, dy, width, height, sx, sy, swidth, sheight ){
  if( this.f == 0 ){
   try {
    _context.drawImage( image, sx, sy, swidth, sheight, dx * this.s, dy * this.s, width * this.s, height * this.s );
   } catch( e ){}
  } else {
   _context.save();
   _context.setTransform( 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 );
   switch( this.f ){
   case 1:
    _context.translate( (dx + width) * this.s, dy * this.s );
    _context.scale( -this.s, this.s );
    break;
   case 2:
    _context.translate( dx * this.s, (dy + height) * this.s );
    _context.scale( this.s, -this.s );
    break;
   case 3:
    _context.translate( (dx + width) * this.s, (dy + height) * this.s );
    _context.scale( -this.s, -this.s );
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
  _context.translate( dx * this.s, dy * this.s );
  _context.rotate( (Math.PI * r360) / 180 );
  _context.scale( (z128x * this.s) / 128, (z128y * this.s) / 128 );
  _context.translate( -cx, -cy );
  try {
   _context.drawImage( image, sx, sy, width, height, 0, 0, width, height );
  } catch( e ){}
  _context.restore();
 }
};
function _Vector( len ){
 this.o = new Array( len );
 this.n = 0;
}
_Vector.prototype = {
 size : function(){
  return this.n;
 },
 isEmpty : function(){
  return (this.n == 0);
 },
 elementAt : function( index ){
  return this.o[index];
 },
 firstElement : function(){
  return this.o[0];
 },
 lastElement : function(){
  return this.o[this.n - 1];
 },
 setElementAt : function( obj, index ){
  if( (index >= 0) && (index < this.n) ){
   this.o[index] = obj;
  }
 },
 removeElementAt : function( index ){
  if( (index >= 0) && (index < this.n) ){
   for( this.i = index; this.i < this.n - 1; this.i++ ){
    this.o[this.i] = this.o[this.i + 1];
   }
   this.n--;
  }
 },
 insertElementAt : function( obj, index ){
  if( (index >= 0) && (index < this.n) ){
   for( this.i = this.n - 1; this.i >= index; this.i-- ){
    this.o[this.i + 1] = this.o[this.i];
   }
   this.o[index] = obj;
   this.n++;
  }
 },
 addElement : function( obj ){
  this.o[this.n] = obj;
  this.n++;
 },
 removeAllElements : function(){
  this.n = 0;
 }
};
function Enemy( x, y, type, interval, shed, damage ){
 this._type = 0;
 this._attack = 0;
 this._w = 0;
 if( type < 4 ){
  this._type = 0;
  this._attack = type;
  this._w = 32;
 } else {
  switch( _DIV( type - 4, 4 ) ){
  case 0: this._type = 1; this._attack = 4; this._w = 26; break;
  case 1: this._type = 2; this._attack = 5 ; this._w = 34; break;
  case 2: this._type = 3; this._attack = 5 ; this._w = 26; break;
  case 3: this._type = 4; this._attack = 6 ; this._w = 32; break;
  case 4: this._type = 5; this._attack = 6 ; this._w = 34; break;
  case 5: this._type = 6; this._attack = 7 ; this._w = 26; break;
  }
 }
 this._x = x;
 this._y = y;
 this._elapse = 0;
 this._col = -1;
 this._tx = 0;
 this._ty = 0;
 this._sx = 0;
 this._sy = 0;
 this._interval = interval;
 this._shed = shed;
 this._damage = 0;
 this.m_damage = damage;
 this._direction = 0;
 this._pattern = 0;
 switch( this._type ){
 case 1:
 case 2:
 case 3:
  switch( _MOD( type - 4, 4 ) ){
  case 0: this._direction = 0; this._pattern = 0; break;
  case 1: this._direction = 1; this._pattern = 4; break;
  case 2: this._direction = 2; this._pattern = 4; break;
  case 3: this._direction = 3; this._pattern = 0; break;
  }
  break;
 case 5:
  this._pattern = 0;
  switch( _MOD( type - 4, 4 ) ){
  case 0: this._direction = 4; break;
  case 1: this._direction = 5; break;
  case 2: this._direction = 6; break;
  case 3: this._direction = 7; break;
  }
  break;
 case 6:
  this._pattern = 0;
  break;
 }
 this._show = false;
}
Enemy.prototype.move = function( w, target ){
 if( target ){
  var cx = this._x;
  var cy = this._y;
  var i;
  var e;
  var dx, dy, sx, sy;
  var w2 = 0;
  var h = 0;
  var d = w * w;
  sx = (this._tx > cx) ? 1 : -1;
  dx = (this._tx > cx) ? this._tx - cx : cx - this._tx;
  sy = (this._ty > cy) ? 1 : -1;
  dy = (this._ty > cy) ? this._ty - cy : cy - this._ty;
  this._x = cx;
  this._y = cy;
  if( dx >= dy ){
   e = -dx;
   for( i = 0; i <= w; i++ ){
    this._x += sx;
    e += 2 * dy;
    if( e >= 0 ){
     this._y += sy;
     e -= 2 * dx;
    }
    w2 = this._x - cx;
    h = this._y - cy;
    if( (w2 * w2 + h * h) >= d ){
     break;
    }
   }
  } else {
   e = -dy;
   for( i = 0; i <= w; i++ ){
    this._y += sy;
    e += 2 * dx;
    if( e >= 0 ){
     this._x += sx;
     e -= 2 * dy;
    }
    w2 = this._x - cx;
    h = this._y - cy;
    if( (w2 * w2 + h * h) >= d ){
     break;
    }
   }
  }
  this._tx += w2;
  this._ty += h;
 } else {
  switch( this._direction ){
  case 0 : this._y += w; this._pattern--; if( this._pattern < 0 ) this._pattern = 0; break;
  case 1 : this._x -= w; this._pattern++; if( this._pattern > 4 ) this._pattern = 4; break;
  case 2 : this._x += w; this._pattern++; if( this._pattern > 4 ) this._pattern = 4; break;
  case 3 : this._y -= w; this._pattern--; if( this._pattern < 0 ) this._pattern = 0; break;
  case 4: this._x -= w; this._y += w; break;
  case 5: this._x -= w; this._y -= w; break;
  case 6: this._x += w; this._y += w; break;
  case 7: this._x += w; this._y -= w; break;
  }
 }
};
Enemy.prototype.spear = function(){
 var x0 = this._x + 12;
 var y0 = this._y + 12;
 var x1 = jiki_x + 12;
 var y1 = jiki_y + 12;
 var i;
 var e;
 var dx, dy, sx, sy;
 var w, h;
 var d = 20 * 20;
 sx = (x1 > x0) ? 1 : -1;
 dx = (x1 > x0) ? x1 - x0 : x0 - x1;
 sy = (y1 > y0) ? 1 : -1;
 dy = (y1 > y0) ? y1 - y0 : y0 - y1;
 this._sx = x0;
 this._sy = y0;
 if( dx >= dy ){
  e = -dx;
  for( i = 0; i <= 20; i++ ){
   this._sx += sx;
   e += 2 * dy;
   if( e >= 0 ){
    this._sy += sy;
    e -= 2 * dx;
   }
   w = this._sx - x0;
   h = this._sy - y0;
   if( (w * w + h * h) >= d ){
    break;
   }
  }
 } else {
  e = -dy;
  for( i = 0; i <= 20; i++ ){
   this._sy += sy;
   e += 2 * dx;
   if( e >= 0 ){
    this._sx += sx;
    e -= 2 * dy;
   }
   w = this._sx - x0;
   h = this._sy - y0;
   if( (w * w + h * h) >= d ){
    break;
   }
  }
 }
};
Enemy.prototype.update = function( stage_clear ){
 if( this._damage >= this.m_damage ){
  this._elapse++;
 } else if( !stage_clear ){
  if(
   (this._type != 0) && (this._type != 4) &&
   (this._x >= _win_x - 132) && (this._x <= _win_x + 324) &&
   (this._y >= _win_y - 132) && (this._y <= _win_y + 324)
  ){
   var old_x = this._x;
   var old_y = this._y;
   switch( this._type ){
   case 1: this.move( 2, false ); break;
   case 2: this.move( 4, false ); break;
   case 3:
    if( _MOD( this._elapse, 15 ) == 0 ){
     if( Math.abs( this._x - jiki_x ) > Math.abs( this._y - jiki_y ) ){
      if( this._x > jiki_x ) this._direction = 1; else this._direction = 2;
     } else {
      if( this._y > jiki_y ) this._direction = 3; else this._direction = 0;
     }
    }
    this.move( 6, false );
    break;
   case 5:
    if( _MOD( this._elapse, 15 ) == 0 ){
     switch( this._direction ){
     case 4:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 5; break;
      case 0: this._direction = 6; break;
      case 1: this._direction = 7; break;
      }
      break;
     case 5:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 4; break;
      case 0: this._direction = 6; break;
      case 1: this._direction = 7; break;
      }
      break;
     case 6:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 4; break;
      case 0: this._direction = 5; break;
      case 1: this._direction = 7; break;
      }
      break;
     case 7:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 4; break;
      case 0: this._direction = 5; break;
      case 1: this._direction = 6; break;
      }
      break;
     }
     break;
    }
    this.move( 6, false );
    break;
   case 6:
    if( _MOD( this._elapse, 5 ) == 0 ){
     this._tx = jiki_x;
     this._ty = jiki_y;
    }
    this.move( 6, true );
    break;
   }
   if( stage_hit( this._x, this._y ) == 4 ){
    this._x = old_x;
    this._y = old_y;
    switch( this._type ){
    case 1:
     switch( this._direction ){
     case 0: this._direction = 3; break;
     case 1: this._direction = 2; break;
     case 2: this._direction = 1; break;
     case 3: this._direction = 0; break;
     }
     break;
    case 2:
    case 3:
     switch( this._direction ){
     case 0:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 1; break;
      case 0: this._direction = 2; break;
      case 1: this._direction = 3; break;
      }
      break;
     case 1:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 0; break;
      case 0: this._direction = 2; break;
      case 1: this._direction = 3; break;
      }
      break;
     case 2:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 0; break;
      case 0: this._direction = 1; break;
      case 1: this._direction = 3; break;
      }
      break;
     case 3:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 0; break;
      case 0: this._direction = 1; break;
      case 1: this._direction = 2; break;
      }
      break;
     }
     break;
    case 5:
     switch( this._direction ){
     case 4:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 5; break;
      case 0: this._direction = 6; break;
      case 1: this._direction = 7; break;
      }
      break;
     case 5:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 4; break;
      case 0: this._direction = 6; break;
      case 1: this._direction = 7; break;
      }
      break;
     case 6:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 4; break;
      case 0: this._direction = 5; break;
      case 1: this._direction = 7; break;
      }
      break;
     case 7:
      switch( rand.next( 2 ) ){
      case -1: this._direction = 4; break;
      case 0: this._direction = 5; break;
      case 1: this._direction = 6; break;
      }
      break;
     }
     break;
    case 6:
     switch( rand.next( 3 ) ){
     case -2: this._tx = this._x - 960; this._ty = this._y; break;
     case -1: this._tx = this._x + 960; this._ty = this._y; break;
     case 0: this._tx = this._x + (this._x - jiki_x); this._ty = this._y + (this._y - jiki_y); break;
     case 1: this._tx = this._x; this._ty = this._y - 960; break;
     case 2: this._tx = this._x; this._ty = this._y + 960; break;
     }
     break;
    }
   }
   if( this._type == 6 ){
    this.spear();
   }
  }
  if(
   (_MOD( this._elapse, this._interval ) == this._shed) &&
   (this._x >= _win_x - 132) && (this._x <= _win_x + 324) &&
   (this._y >= _win_y - 132) && (this._y <= _win_y + 324)
  ){
   switch( this._attack ){
   case 0:
   case 1:
   case 2:
    ring.addElement( new Ring( _DIV( this._x, 12 ) + 1, _DIV( this._y, 12 ) + 1, this._attack ) );
play_sound( 4 );
    break;
   case 3:
    {
     var tmp = rand.next( 2 ) + 1;
     if( tmp == this._col ){
      tmp++; if( tmp > 2 ) tmp = 0;
     }
     this._col = tmp;
     ring.addElement( new Ring( _DIV( this._x, 12 ) + 1, _DIV( this._y, 12 ) + 1, tmp ) );
play_sound( 4 );
    }
    break;
   case 4:
    switch ( this._direction ){
    case 0: shot.addElement( new Shot( this._x + 8, this._y + 8, this._x + 8, 960 ) ); break;
    case 1: shot.addElement( new Shot( this._x + 8, this._y + 8, 0, this._y + 8 ) ); break;
    case 2: shot.addElement( new Shot( this._x + 8, this._y + 8, 960, this._y + 8 ) ); break;
    case 3: shot.addElement( new Shot( this._x + 8, this._y + 8, this._x + 8, 0 ) ); break;
    }
play_sound( 5 );
    break;
   case 5:
    shot.addElement( new Shot( this._x + 8, this._y + 8, jiki_x + 8, jiki_y + 8 ) );
play_sound( 5 );
    break;
   case 6:
    {
     var i;
     for( i = 0; i < 12; i++ ){
      shot.addElement( new Shot( this._x + 8, this._y + 8, this._x + 8 + COS[i], this._y + 8 + SIN[i] ) );
     }
play_sound( 5 );
    }
    break;
   }
  }
  this._elapse++;
 }
};
var chip = 1;
var line = 1;
var base = 1;
var bg_image;
var base_data;
var base_image;
var base_x, base_y;
var back_image = -1;
var enemy;
var enemy_size;
var _attack;
var attack_x, attack_y;
var attack_x1, attack_y1;
var attack_x2, attack_y2;
var pattern;
function stage_init(){
 var i, j;
 base_data = new Array( 41 );
 for( i = 0; i < 41; i++ ){
  base_data[i] = new Array( 41 );
 }
 enemy = new _Vector( 128 );
 _attack = -1;
}
function stage_load(){
 var i, j;
 var stage_data;
 chip = 1;
 line = 1;
 base = 1;
 bg_image = -1;
 dark = false;
 switch( st_index ){
 case 0:
  base_image = IMAGE_BASE0;
  chip = 10;
  line = 2;
  base = chip * line;
  stage_data = new StageData0();
  break;
 case 1:
  base_image = IMAGE_BASE1;
  chip = 12;
  line = 2;
  base = chip * line;
  bg_image = IMAGE_BACK1;
  stage_data = new StageData1();
  break;
 case 2:
  base_image = IMAGE_BASE2;
  dark = true;
  chip = 12;
  line = 2;
  base = chip * line;
  stage_data = new StageData2();
  break;
 case 3:
  base_image = IMAGE_BASE3;
  chip = 7;
  line = 1;
  base = chip * line;
  stage_data = new StageData3();
  break;
 case 4:
  base_image = IMAGE_BASE4;
  chip = 13;
  line = 2;
  base = chip * line;
  stage_data = new StageData4();
  break;
 case 5:
  base_image = IMAGE_BASE5;
  chip = 12;
  line = 10;
  base = chip * line;
  bg_image = IMAGE_BACK5;
  stage_data = new StageData5();
  break;
 }
 for( i = 0; i < 40; i++ ){
  for( j = 0; j < 40; j++ ){
   base_data[j][i] = stage_data.MAP[i][j];
  }
 }
 enemy.removeAllElements();
 enemy_size = 0;
 var val = new Array( 7 );
 for( j = 0; ; j++ ){
  for( i = 0; i < 7; i++ ){
   val[i] = stage_data.ENEMY[j][i];
  }
  if( val[0] == -1 ){
   break;
  }
  val[1] *= 24;
  val[2] *= 24;
  if( val[6] < 10 ) val[6] *= 30;
  switch( val[0] ){
  case 0:
   if( _MOD( level, 2 ) == 1 ){
    if( val[3] < 4 ){
     val[4] = _DIV( val[4] * 2, 3 );
    } else {
     val[4] = _DIV( val[4], 2 );
    }
    val[5] %= val[4];
   }
   enemy.addElement( new Enemy( val[1], val[2], val[3], val[4], val[5], val[6] ) );
   break;
  case 1:
   if( _MOD( level, 2 ) == 0 ){
    enemy.addElement( new Enemy( val[1], val[2], val[3], val[4], val[5], val[6] ) );
   }
   break;
  case 2:
   if( _MOD( level, 2 ) == 1 ){
    enemy.addElement( new Enemy( val[1], val[2], val[3], val[4], val[5], val[6] ) );
   }
   break;
  }
 }
 enemy_size = enemy.size();
}
function stage_create(){
 if( st_index > 5 ){
  new_level();
 }
 stage_load();
 jiki_load_image();
 attack_x = -1;
 pattern = 0;
}
function stage_update( stage_clear ){
 var i;
 var tmp;
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  tmp.update( stage_clear );
 }
 if( !stage_clear ){
  pattern++; if( pattern > 1 ) pattern = 0;
 }
}
function stage_attack(){
 if( t_damage >= m_damage ) return;
var damage = false;
 var i, j;
 var jx = jiki_x + 12;
 var jy = jiki_y + 12;
 var ex, ey;
 var tmp;
 j = -1;
 if( (level < 4) || (level > 5) ){
  var w;
  var h;
  var dist = 96 * 96;
  var tmp_d;
  for( i = enemy_size - 1; i >= 0; i-- ){
   tmp = enemy.elementAt( i );
   if( tmp._damage < tmp.m_damage ){
    ex = tmp._x + 12;
    ey = tmp._y + 12;
    w = jx - ex;
    h = jy - ey;
    tmp_d = w * w + h * h;
    if( tmp_d <= dist ){
     if( !stage_kabe12l( _DIV( ex, 12 ), _DIV( ey, 12 ), _DIV( jx, 12 ), _DIV( jy, 12 ) ) ){
      j = i;
      dist = tmp_d;
     }
    }
   }
  }
  if( j >= 0 ){
   tmp = enemy.elementAt( j );
   if( level < 4 ){
    setCMYColor( _MOD( _elapse, 3 ) );
   } else {
    if( dist <= 32 * 32 ){
     g.setColor( COLOR_W );
    } else if( dist <= 64 * 64 ){
     g.setColor( COLOR_Y );
    } else {
     g.setColor( COLOR_M );
    }
   }
   attack_x = tmp._x + 12 + rand.next( 9 );
   attack_y = tmp._y + 12 + rand.next( 9 );
   if( attack_x >= 0 ){
    if( boost ){
     attack_x1 = jx + _DIV( attack_x - jx, 3 ) + rand.next( 9 );
     attack_y1 = jy + _DIV( attack_y - jy, 3 ) + rand.next( 9 );
     attack_x2 = attack_x - _DIV( attack_x - jx, 3 ) + rand.next( 9 );
     attack_y2 = attack_y - _DIV( attack_y - jy, 3 ) + rand.next( 9 );
     drawLine( jx, jy, attack_x1, attack_y1 );
     drawLine( attack_x1, attack_y1, attack_x2, attack_y2 );
     drawLine( attack_x2, attack_y2, attack_x, attack_y );
    } else {
     drawLine( jx, jy, attack_x, attack_y );
    }
   }
   if( level < 4 ){
    tmp._damage += (boost ? 2 : 1); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
   } else {
    if( dist <= 32 * 32 ){
     tmp._damage += (boost ? 6 : 3); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
    } else if( dist <= 64 * 64 ){
     tmp._damage += (boost ? 4 : 2); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
    } else {
     tmp._damage += (boost ? 2 : 1); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
    }
   }
   if( tmp._damage >= tmp.m_damage ) add_score( tmp.m_damage * 10 );
  }
 } else {
  if( boost ){
   for( i = enemy_size - 1; i >= 0; i-- ){
    tmp = enemy.elementAt( i );
    if( (tmp._damage < tmp.m_damage) && tmp._show ){
     ex = tmp._x + 12;
     ey = tmp._y + 12;
     if( !stage_kabe12l( _DIV( ex, 12 ), _DIV( ey, 12 ), _DIV( jx, 12 ), _DIV( jy, 12 ) ) ){
      setCMYColor( _MOD( _elapse, 3 ) );
      attack_x = rand.next( 9 );
      attack_y = rand.next( 9 );
      drawLine( jx, jy, tmp._x + 12 + attack_x, tmp._y + 12 + attack_y );
      tmp._damage += 1; if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
      if( tmp._damage >= tmp.m_damage ) add_score( tmp.m_damage * 10 );
     }
    }
   }
  } else {
   var k;
   for( k = 0; k < 2; k++ ){
    for( i = _attack + 1; i < enemy_size; i++ ){
     tmp = enemy.elementAt( i );
     if( (tmp._damage < tmp.m_damage) && tmp._show ){
      ex = tmp._x + 12;
      ey = tmp._y + 12;
      if( !stage_kabe12l( _DIV( ex, 12 ), _DIV( ey, 12 ), _DIV( jx, 12 ), _DIV( jy, 12 ) ) ){
       j = i;
       break;
      }
     }
    }
    if( j >= 0 ){
     _attack = j;
     break;
    }
    _attack = -1;
   }
   if( j >= 0 ){
    tmp = enemy.elementAt( j );
    setCMYColor( _MOD( _elapse, 3 ) );
    attack_x = rand.next( 9 );
    attack_y = rand.next( 9 );
    drawLine( jx, jy, tmp._x + 12 + attack_x, tmp._y + 12 + attack_y );
    tmp._damage += 1; if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
    if( tmp._damage >= tmp.m_damage ) add_score( tmp.m_damage * 10 );
   }
  }
 }
 if( damage ){
play_sound( 6 );
 }
}
function stage_destroyed(){
 var i;
 var tmp;
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( (tmp._type == 0) && (tmp._damage < tmp.m_damage) ) return false;
 }
 return true;
}
function stage_hit( x, y ){
 if( (x < 0) || (x > 936) || (y < 0) || (y > 936) ) return 4;
 var x2 = _DIV( x + 12, 24 );
 var y2 = _DIV( y + 12, 24 );
 var x3 = _DIV( x, 24 );
 var y3 = _DIV( y, 24 );
 var x4 = x3 + 1;
 var y4 = y3 + 1;
 var slow = false;
 var i;
 var tmp;
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( tmp._damage >= tmp.m_damage ){
   if( (tmp._type == 0) || (tmp._type == 4) ){
    if( (_DIV( tmp._x, 24 ) == x2) && (_DIV( tmp._y, 24 ) == y2) ) slow = true;
   }
  } else if( (x != tmp._x) || (y != tmp._y) ){
   if( (Math.abs( tmp._x - x ) < 24) && (Math.abs( tmp._y - y ) < 24) ) return 4;
  }
 }
 if( (x != jiki_x) || (y != jiki_y) ){
  if( (Math.abs( jiki_x - x ) < 24) && (Math.abs( jiki_y - y ) < 24) ) return 4;
 }
 if( (_MOD( x, 24 ) != 0) && (_MOD( y, 24 ) != 0) ){
  if( _DIV( base_data[x3][y3], base ) == 4 ) return 4;
  if( _DIV( base_data[x3][y4], base ) == 4 ) return 4;
  if( _DIV( base_data[x4][y3], base ) == 4 ) return 4;
  if( _DIV( base_data[x4][y4], base ) == 4 ) return 4;
  if( _DIV( base_data[x3][y3], base ) == 3 ) return 4;
  if( _DIV( base_data[x3][y4], base ) == 3 ) return 4;
  if( _DIV( base_data[x4][y3], base ) == 3 ) return 4;
  if( _DIV( base_data[x4][y4], base ) == 3 ) return 4;
 } else if( _MOD( x, 24 ) != 0 ){
  if( _DIV( base_data[x3][y3], base ) == 4 ) return 4;
  if( _DIV( base_data[x4][y3], base ) == 4 ) return 4;
  if( _DIV( base_data[x3][y3], base ) == 3 ) return 4;
  if( _DIV( base_data[x4][y3], base ) == 3 ) return 4;
 } else if( _MOD( y, 24 ) != 0 ){
  if( _DIV( base_data[x3][y3], base ) == 4 ) return 4;
  if( _DIV( base_data[x3][y4], base ) == 4 ) return 4;
  if( _DIV( base_data[x3][y3], base ) == 3 ) return 4;
  if( _DIV( base_data[x3][y4], base ) == 3 ) return 4;
 }
 return slow ? 1 : _DIV( base_data[x2][y2], base );
}
function stage_spear(){
 var i;
 var tmp;
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( (tmp._damage < tmp.m_damage) && (tmp._type == 6) ){
   if(
    (tmp._sx >= jiki_x ) &&
    (tmp._sx < jiki_x + 24) &&
    (tmp._sy >= jiki_y ) &&
    (tmp._sy < jiki_y + 24)
   ){
    return true;
   }
  }
 }
 return false;
}
function stage_kabe12l( x0, y0, x1, y1 ){
 var i;
 var e, x, y;
 var dx, dy, sx, sy;
 sx = (x1 > x0) ? 1 : -1;
 dx = (x1 > x0) ? x1 - x0 : x0 - x1;
 sy = (y1 > y0) ? 1 : -1;
 dy = (y1 > y0) ? y1 - y0 : y0 - y1;
 x = x0;
 y = y0;
 if( dx >= dy ){
  e = -dx;
  for( i = 0; i <= dx; i++ ){
   if( _DIV( base_data[_DIV( x, 2 )][_DIV( y, 2 )], base ) == 4 ) return true;
   x += sx;
   e += 2 * dy;
   if( e >= 0 ){
    y += sy;
    e -= 2 * dx;
   }
  }
 } else {
  e = -dy;
  for( i = 0; i <= dy; i++ ){
   if( _DIV( base_data[_DIV( x, 2 )][_DIV( y, 2 )], base ) == 4 ) return true;
   y += sy;
   e += 2 * dx;
   if( e >= 0 ){
    x += sx;
    e -= 2 * dy;
   }
  }
 }
 return false;
}
function stage_baku( x, y, w, elapse ){
 var i;
 if( elapse == 1 ){
  if( w > 26 ){
play_sound( 3 );
  } else {
play_sound( 2 );
  }
 }
 i = _DIV( elapse, 4 ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x + i * 2, y + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
 if( w > 26 ){
  if( i == 0 ) quake = 15;
  i = _DIV( elapse - 2, 4 ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x - 6 + i * 2, y - 6 + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
  i = _DIV( elapse - 4, 4 ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x + 6 + i * 2, y - 2 + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
  i = _DIV( elapse - 6, 4 ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x + 2 + i * 2, y + 6 + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
 }
}
function stage_draw( title ){
 var i, j, x, y, w, h;
 var y2, y3;
 var qx, qy;
 _win_x = jiki_x - 96;
 _win_y = jiki_y - 96;
 if( _win_x < 0 ){
  _win_x = 0;
 } else if( _win_x + 216 > 960 ){
  _win_x = 960 - 216;
 }
 if( _win_y < 0 ){
  _win_y = 0;
 } else if( _win_y + 216 > 960 ){
  _win_y = 960 - 216;
 }
 if( !title && dark ){
  setClip( _light_x - _win_x, _light_y - _win_y, 120, 120 );
 }
 if( quake > 0 ){
  qx = quake_x;
  qy = quake_y;
  setOrigin( 12 + qx, 12 + qy );
 } else {
  qx = 0;
  qy = 0;
 }
 if( bg_image >= 0 ){
  x = _DIV( _win_x, 3 );
  y = _DIV( _win_y, 3 );
  w = 240 - x;
  h = 240 - y;
  if( w > 0 && h > 0 ){ g.drawScaledImage( main_img[bg_image], -x + origin_x, -y + origin_y, 240, 240, 0, 0, 120, 120 ); }
  if( x > 0 && h > 0 ){ g.drawScaledImage( main_img[bg_image], w + origin_x, -y + origin_y, 240, 240, 0, 0, 120, 120 ); }
  if( w > 0 && y > 0 ){ g.drawScaledImage( main_img[bg_image], -x + origin_x, h + origin_y, 240, 240, 0, 0, 120, 120 ); }
  if( x > 0 && y > 0 ){ g.drawScaledImage( main_img[bg_image], w + origin_x, h + origin_y, 240, 240, 0, 0, 120, 120 ); }
 }
 drawScaledImage( main_img[base_image], 0, 0, 960, 960, 0, 0, 480, 480 );
 if( quake > 0 ){
  setOrigin( 12, 12 );
 }
 if( title ){
  return;
 }
 var tmp;
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( tmp._damage >= tmp.m_damage ){
   if( (tmp._type == 0) || (tmp._type == 4) ){
    drawImage( main_img[IMAGE_ENEMY_03], tmp._x - 4 + qx, tmp._y - 4 + qy, 32, 32 );
   }
  } else {
   switch( tmp._type ){
   case 0:
    if( tmp._attack == 3 ){
     tmp._show = drawImage( main_img[IMAGE_ENEMY_00 + _MOD( _elapse, 3 )], tmp._x + qx, tmp._y + qy, 32, 32 );
    } else {
     tmp._show = drawImage( main_img[IMAGE_ENEMY_00 + tmp._attack], tmp._x + qx, tmp._y + qy, 32, 32 );
    }
    break;
   case 4:
    tmp._show = drawImage( main_img[IMAGE_ENEMY_40 + _MOD( _elapse, 3 )], tmp._x - 4 + qx, tmp._y - 4 + qy, tmp._w, tmp._w );
    break;
   case 1:
    tmp._show = drawImage( main_img[IMAGE_ENEMY_10 + pattern * 2 + _DIV( tmp._pattern, 4 )], tmp._x, tmp._y, tmp._w, tmp._w );
    break;
   case 2:
    tmp._show = drawImage( main_img[IMAGE_ENEMY_20 + pattern * 5 + tmp._pattern], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
    break;
   case 3:
    tmp._show = drawImage( main_img[IMAGE_ENEMY_30 + pattern * 5 + tmp._pattern], tmp._x, tmp._y, tmp._w, tmp._w );
    break;
   case 5:
    tmp._show = drawImage( main_img[IMAGE_ENEMY_50], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
    break;
   case 6:
    tmp._show = drawImage( main_img[IMAGE_ENEMY_60], tmp._x, tmp._y, tmp._w, tmp._w );
    break;
   }
  }
 }
 if( dark ){
  drawScaledImage( main_img[IMAGE_LIGHT], _light_x - 200, _light_y - 200, 520, 520, 0, 0, 260, 260 );
  setClip( 0, 0, 216, 216 );
 }
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( tmp._damage >= tmp.m_damage ){
   stage_baku( tmp._x, tmp._y, tmp._w, tmp._elapse );
  } else if( dark ){
   switch( tmp._type ){
   case 0:
    if( tmp._attack == 3 ){
     tmp._show = drawImage( main_img[IMAGE_ENEMYD_00 + _MOD( _elapse, 3 )], tmp._x + qx, tmp._y + qy, 32, 32 );
    } else {
     tmp._show = drawImage( main_img[IMAGE_ENEMYD_00 + tmp._attack], tmp._x + qx, tmp._y + qy, 32, 32 );
    }
    break;
   case 4:
    tmp._show = drawImage( main_img[IMAGE_ENEMYD_40 + _MOD( _elapse, 3 )], tmp._x - 4 + qx, tmp._y - 4 + qy, tmp._w, tmp._w );
    break;
   case 1:
    tmp._show = drawImage( main_img[IMAGE_ENEMYD_10 + _DIV( tmp._pattern, 4 )], tmp._x, tmp._y, tmp._w, tmp._w );
    break;
   case 2:
    tmp._show = drawImage( main_img[IMAGE_ENEMYD_20], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
    break;
   case 3:
    tmp._show = drawImage( main_img[IMAGE_ENEMYD_30 + tmp._pattern], tmp._x, tmp._y, tmp._w, tmp._w );
    break;
   case 5:
    tmp._show = drawImage( main_img[IMAGE_ENEMYD_50], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
    break;
   case 6:
    tmp._show = drawImage( main_img[IMAGE_ENEMYD_60], tmp._x, tmp._y, tmp._w, tmp._w );
    break;
   }
  }
 }
 setCMYColor( _MOD( _elapse, 3 ) );
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( (tmp._damage < tmp.m_damage) && (tmp._type == 6) && tmp._show ){
   drawLine(
    tmp._x + 12, tmp._y + 12,
    tmp._sx, tmp._sy
    );
  }
 }
}
function stage_draw_map( x, y ){
 var i;
 var tmp;
 g.setColor( COLOR_W );
 g.drawRect( x, y, 63, 63 );
 x += 2;
 y += 2;
 g.drawRect( x + _DIV( jiki_x, 16 ), y + _DIV( jiki_y, 16 ), 1, 1 );
 setCMYColor( _MOD( _elapse, 3 ) );
 for( i = enemy_size - 1; i >= 0; i-- ){
  tmp = enemy.elementAt( i );
  if( (tmp._type == 0) && (tmp._damage < tmp.m_damage) ){
   g.drawRect( x + _DIV( tmp._x, 16 ), y + _DIV( tmp._y, 16 ), 1, 1 );
  }
 }
}
function Ring( p1, p2, p3 ){
 this._x = p1;
 this._y = p2;
 this._col = p3;
 this._elapse = 0;
}
Ring.prototype.update = function(){ this._elapse++; };
function Shot( p1, p2, p3, p4 ){
 this._x0 = p1;
 this._y0 = p2;
 this._x1 = p3;
 this._y1 = p4;
 this._x = this._x0;
 this._y = this._y0;
 this._elapse = 0;
 this._col = -1;
}
Shot.prototype.update = function(){
 this._elapse += 6;
 var i;
 var e;
 var dx, dy, sx, sy;
 var w, h;
 var d = this._elapse * this._elapse;
 sx = (this._x1 > this._x0) ? 1 : -1;
 dx = (this._x1 > this._x0) ? this._x1 - this._x0 : this._x0 - this._x1;
 sy = (this._y1 > this._y0) ? 1 : -1;
 dy = (this._y1 > this._y0) ? this._y1 - this._y0 : this._y0 - this._y1;
 this._x = this._x0;
 this._y = this._y0;
 if( dx >= dy ){
  e = -dx;
  for( i = 0; i <= this._elapse; i++ ){
   this._x += sx;
   e += 2 * dy;
   if( e >= 0 ){
    this._y += sy;
    e -= 2 * dx;
   }
   w = this._x - this._x0;
   h = this._y - this._y0;
   if( (w * w + h * h) >= d ){
    break;
   }
  }
 } else {
  e = -dy;
  for( i = 0; i <= this._elapse; i++ ){
   this._y += sy;
   e += 2 * dx;
   if( e >= 0 ){
    this._x += sx;
    e -= 2 * dy;
   }
   w = this._x - this._x0;
   h = this._y - this._y0;
   if( (w * w + h * h) >= d ){
    break;
   }
  }
 }
};
function StageData0(){
 this.MAP = [
  [ 15,11,11,11,11,11,95,15,84,81,35,31,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,84,81,15,11,11,11,11,11,11,11,89,89 ],
  [ 13,0,0,0,0,0,96,13,10,11,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,11,12,89,94,14,0,94,89,14,89,89 ],
  [ 13,0,90,93,14,0,95,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,89,96,13,0,96,89,13,89,89 ],
  [ 13,0,84,81,13,0,95,13,80,81,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,88,89,14,89,95,13,0,95,89,13,10,11 ],
  [ 13,0,10,11,12,0,96,13,94,82,84,81,80,81,84,81,88,14,0,80,81,80,81,89,80,81,89,14,10,94,13,89,96,13,0,96,89,13,0,0 ],
  [ 13,0,0,0,0,0,95,13,96,83,88,80,81,89,80,81,15,12,0,10,88,84,81,80,81,89,88,86,14,96,13,89,97,13,0,97,89,13,89,14 ],
  [ 89,94,14,0,90,93,95,13,95,82,15,11,11,11,11,11,12,1,1,1,10,11,11,11,11,31,31,83,13,95,13,10,11,12,0,10,11,12,89,13 ],
  [ 88,97,13,0,89,88,96,13,95,83,13,0,2,2,2,0,2,2,2,0,2,2,2,4,5,6,24,82,13,95,89,89,89,89,89,89,89,89,89,13 ],
  [ 15,11,12,0,10,11,95,13,96,89,13,5,0,3,3,3,3,3,3,3,3,3,3,4,5,6,4,83,13,96,89,89,89,89,89,89,89,89,89,13 ],
  [ 13,0,0,0,0,0,95,13,95,88,13,5,6,86,89,80,81,84,81,89,80,81,86,14,0,0,0,88,13,95,15,11,11,11,11,11,11,11,89,13 ],
  [ 13,0,80,81,14,0,96,13,95,82,13,5,6,83,94,90,91,92,91,92,93,94,83,13,5,6,4,89,13,95,13,89,94,14,0,94,89,14,89,13 ],
  [ 13,0,90,93,13,0,95,13,96,83,13,0,6,82,95,94,90,92,91,92,93,97,82,13,5,6,4,82,13,96,13,89,96,13,0,96,89,13,10,12 ],
  [ 13,0,10,11,12,0,97,13,95,88,13,5,6,83,96,96,82,89,80,81,89,88,83,13,5,6,4,83,13,95,13,89,95,13,0,95,89,13,0,0 ],
  [ 13,0,0,0,0,0,10,12,95,82,13,5,6,89,97,97,83,88,15,11,11,31,31,32,1,1,1,86,13,95,13,89,96,13,0,96,89,13,89,89 ],
  [ 92,91,91,92,91,91,92,93,97,87,13,5,6,82,90,93,80,85,13,2,2,0,22,2,2,0,2,83,13,96,13,89,97,13,0,97,89,13,89,89 ],
  [ 81,88,89,80,81,84,81,89,80,81,13,0,6,83,89,88,80,81,13,3,3,0,3,3,3,0,3,82,13,97,13,10,11,12,0,10,11,12,89,89 ],
  [ 11,11,31,31,31,11,11,11,11,11,12,1,1,10,11,11,31,31,32,1,1,0,1,1,1,0,21,87,13,90,91,92,91,91,92,91,91,92,91,91 ],
  [ 2,0,2,22,2,0,2,2,2,0,22,22,2,0,2,2,2,20,2,2,2,0,84,81,80,81,88,89,13,10,11,11,11,11,11,11,11,11,11,11 ],
  [ 3,0,3,3,3,0,3,3,3,20,23,23,3,0,3,3,3,0,3,3,3,0,82,80,81,80,81,84,81,88,80,81,89,82,80,81,88,84,81,14 ],
  [ 1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,83,89,88,15,11,11,11,11,11,11,80,81,87,15,11,11,11,12 ],
  [ 2,0,2,2,2,0,2,22,2,0,2,2,2,0,22,2,2,0,2,2,2,0,82,82,86,13,88,80,81,89,88,14,10,11,11,12,80,81,80,85 ],
  [ 3,3,3,3,3,3,23,23,23,3,3,3,3,23,23,23,3,3,3,3,3,3,87,83,83,33,10,84,81,88,80,81,84,81,88,80,81,89,80,81 ],
  [ 0,89,88,14,0,82,80,81,34,0,0,6,82,89,88,88,88,80,81,14,0,6,89,88,15,12,0,10,11,11,11,11,11,11,11,11,11,11,11,11 ],
  [ 0,80,81,13,0,87,88,89,33,26,4,6,83,82,88,89,88,88,89,13,5,6,82,88,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,80,85,13,0,10,11,11,32,6,4,6,82,83,15,11,11,11,11,12,5,6,83,82,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,10,11,12,0,0,0,0,4,6,4,6,87,82,13,82,84,81,14,4,5,6,88,87,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,0,0,0,0,80,81,86,14,0,0,6,88,83,13,83,82,82,88,14,0,6,89,88,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,89,88,14,0,80,81,83,13,6,4,26,82,82,13,89,83,83,82,13,5,6,80,81,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,80,81,13,0,89,88,88,13,6,24,26,83,87,13,10,88,88,83,13,5,6,82,89,13,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
  [ 0,88,88,13,0,10,11,11,12,6,4,26,88,82,13,0,10,11,11,12,5,6,83,82,13,2,2,2,0,2,2,2,0,2,2,2,0,2,2,2 ],
  [ 0,10,11,12,0,0,0,0,4,0,0,6,89,83,13,84,81,82,14,4,0,6,88,83,13,3,3,3,0,3,3,3,0,3,3,3,0,3,3,3 ],
  [ 0,0,0,0,0,0,84,81,14,6,4,6,82,88,13,88,88,83,89,14,5,6,82,86,13,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1 ],
  [ 0,82,80,81,14,0,82,82,13,6,4,6,83,89,13,80,81,88,82,13,5,6,87,83,13,2,2,2,0,2,2,2,0,2,2,2,0,2,2,2 ],
  [ 0,87,88,89,13,0,83,87,13,6,4,6,86,88,13,10,89,88,83,13,5,6,82,88,13,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3 ],
  [ 0,10,11,11,12,0,88,82,13,0,0,6,83,82,13,0,10,11,11,12,0,6,83,89,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,0,0,0,0,0,86,83,13,6,4,6,89,83,13,86,88,89,14,4,5,6,88,82,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,80,81,86,14,0,83,88,80,81,88,84,81,82,13,83,80,81,88,14,5,6,82,83,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,89,88,83,13,0,10,84,81,80,81,80,81,87,13,89,82,88,89,13,5,6,83,88,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,88,80,81,13,0,0,10,11,11,11,11,11,11,12,88,83,84,81,13,0,6,89,82,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 0,10,11,11,12,0,84,81,80,85,88,89,88,14,0,10,11,11,11,12,5,6,88,87,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]
 ];
 this.ENEMY = [
  [ 0,0,17,6,80,0,1 ],
  [ 0,2,18,6,80,0,1 ],
  [ 0,0,19,6,80,0,1 ],
  [ 0,2,20,6,80,0,1 ],
  [ 0,0,21,6,80,0,1 ],
  [ 0,11,17,6,80,0,1 ],
  [ 0,13,18,6,80,0,1 ],
  [ 0,11,19,6,80,0,1 ],
  [ 0,13,20,6,80,0,1 ],
  [ 0,11,21,6,80,0,1 ],
  [ 0,23,6,4,80,0,1 ],
  [ 0,24,8,4,80,0,1 ],
  [ 0,25,6,4,80,0,1 ],
  [ 0,26,8,4,80,0,1 ],
  [ 0,14,24,14,80,20,1 ],
  [ 0,14,29,14,80,20,1 ],
  [ 0,14,34,14,80,20,1 ],
  [ 0,21,24,12,80,20,1 ],
  [ 0,0,22,8,80,0,2 ],
  [ 0,4,22,8,80,20,2 ],
  [ 0,8,22,8,80,0,2 ],
  [ 0,0,26,10,80,20,2 ],
  [ 0,0,30,10,80,0,2 ],
  [ 0,0,34,8,80,20,2 ],
  [ 0,10,6,10,80,0,2 ],
  [ 0,18,13,10,80,20,2 ],
  [ 0,4,1,10,80,0,2 ],
  [ 0,1,4,9,80,20,2 ],
  [ 0,1,9,9,80,0,2 ],
  [ 0,4,12,10,80,20,2 ],
  [ 0,33,5,8,80,0,2 ],
  [ 0,34,5,11,80,20,2 ],
  [ 0,33,10,8,80,0,2 ],
  [ 0,34,10,11,80,20,2 ],
  [ 0,25,22,10,80,0,2 ],
  [ 0,39,22,8,80,20,2 ],
  [ 0,39,39,9,80,0,2 ],
  [ 0,25,39,10,80,20,2 ],
  [ 0,38,27,16,80,0,4 ],
  [ 0,38,34,16,80,40,4 ],
  [ 0,1,1,0,120,0,4 ],
  [ 0,4,4,1,120,40,4 ],
  [ 0,4,9,1,120,0,4 ],
  [ 0,1,12,2,120,40,4 ],
  [ 0,10,0,0,120,0,4 ],
  [ 0,10,3,1,120,40,4 ],
  [ 0,27,0,1,120,40,4 ],
  [ 0,27,3,2,120,80,4 ],
  [ 0,16,5,0,120,0,4 ],
  [ 0,19,5,2,120,40,4 ],
  [ 0,8,35,1,120,0,4 ],
  [ 0,11,35,2,120,40,4 ],
  [ 0,33,1,0,120,0,4 ],
  [ 0,34,1,1,120,40,4 ],
  [ 0,33,14,1,120,40,4 ],
  [ 0,34,14,2,120,0,4 ],
  [ 1,37,27,1,120,0,4 ],
  [ 1,37,34,0,120,30,4 ],
  [ 1,39,27,0,120,60,4 ],
  [ 1,39,34,2,120,90,4 ],
  [ 2,37,27,1,80,0,4 ],
  [ 2,37,34,0,80,20,4 ],
  [ 2,39,27,0,80,40,4 ],
  [ 2,39,34,2,80,60,4 ],
  [ -1,0,0,0,0,0,0 ]
 ];
}
function StageData1(){
 this.MAP = [
  [ 48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,8,5,81,72,104,105,72 ],
  [ 48,75,83,83,83,83,83,83,112,113,100,101,112,113,112,113,83,83,83,112,113,83,100,101,83,83,83,83,112,113,112,113,76,0,5,81,72,106,107,72 ],
  [ 48,81,72,82,25,72,72,77,114,115,102,103,114,115,114,115,78,72,77,114,115,84,102,103,84,84,78,77,114,115,114,115,74,0,5,73,84,84,84,78 ],
  [ 48,81,72,82,48,81,104,97,0,0,0,0,0,0,0,0,96,105,82,0,1,4,4,4,4,0,96,97,0,1,4,4,4,13,14,4,4,4,4,81 ],
  [ 48,81,72,82,48,81,106,99,0,0,0,0,0,0,0,0,98,107,82,0,5,25,72,24,0,5,98,99,0,16,0,0,0,0,0,0,0,8,5,81 ],
  [ 48,81,72,82,48,81,72,82,0,0,0,0,0,0,0,0,81,77,74,0,5,75,83,76,0,5,108,109,0,5,0,0,0,0,0,0,0,0,5,81 ],
  [ 48,73,84,25,48,73,104,97,0,0,0,0,0,0,0,0,81,82,0,0,5,81,77,74,0,5,110,111,0,5,0,87,0,0,0,87,0,0,5,81 ],
  [ 48,48,48,48,48,25,106,99,0,0,0,0,0,0,0,0,81,82,0,0,5,81,82,0,0,5,108,109,0,87,0,89,0,87,0,89,0,87,0,81 ],
  [ 48,24,83,76,48,75,116,109,0,0,0,0,0,0,0,0,81,82,0,0,5,81,82,0,0,5,110,111,0,89,0,89,0,89,0,89,0,89,0,81 ],
  [ 48,81,72,82,48,81,118,111,0,0,0,4,4,0,0,0,81,82,0,0,5,81,82,0,0,5,96,97,0,89,0,89,0,89,0,89,0,89,0,81 ],
  [ 48,81,72,82,48,81,72,79,83,83,76,8,9,75,83,83,80,82,0,0,5,81,82,0,0,5,98,99,0,88,0,89,0,88,0,89,0,88,0,81 ],
  [ 48,81,72,82,48,81,104,105,116,117,82,0,5,73,84,84,84,74,0,0,5,81,82,0,0,5,96,97,0,5,0,88,0,0,0,88,0,0,5,81 ],
  [ 24,81,72,82,48,81,106,107,118,119,82,0,3,4,4,25,72,24,4,13,75,80,82,0,0,5,98,99,0,5,0,0,0,0,0,0,0,0,5,81 ],
  [ 84,84,84,24,48,73,84,84,84,78,82,0,0,0,0,0,0,0,0,0,81,72,79,76,25,5,108,109,4,14,4,4,4,4,4,4,4,13,2,81 ],
  [ 48,48,48,48,48,48,48,48,48,81,82,0,0,0,0,0,0,75,83,83,80,72,72,82,72,5,110,111,0,0,0,0,0,8,9,0,0,0,0,81 ],
  [ 83,83,83,76,48,75,83,76,48,81,79,83,112,113,83,83,83,80,77,84,84,84,84,74,24,5,81,79,112,113,100,101,76,0,5,75,112,113,83,80 ],
  [ 25,72,72,82,48,81,72,82,48,81,72,72,118,119,72,116,117,72,82,0,1,4,4,4,4,5,73,84,114,115,102,103,74,0,5,81,118,119,72,72 ],
  [ 48,81,72,82,48,81,72,82,48,81,72,104,105,72,72,118,119,104,97,0,5,0,0,0,8,5,0,0,0,0,0,0,0,6,5,81,72,72,72,72 ],
  [ 48,81,72,82,48,81,72,82,48,81,72,106,107,72,116,117,72,106,99,0,5,75,100,101,83,83,112,113,83,83,83,112,113,100,101,80,72,116,117,104 ],
  [ 48,81,72,72,25,81,72,82,48,81,72,84,84,84,114,115,84,84,74,13,14,73,102,103,84,84,114,115,84,84,84,114,115,102,103,84,84,114,115,102 ],
  [ 48,24,84,84,84,84,84,74,48,81,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,72,25,0,0,0,0,0,0,0,0 ],
  [ 48,48,48,48,48,48,48,48,48,81,25,25,85,90,90,90,86,0,0,85,90,90,90,86,0,0,85,90,90,90,86,0,0,85,90,90,90,86,0,0 ],
  [ 48,75,83,25,48,75,83,83,83,80,72,24,0,0,0,0,0,0,0,4,4,0,0,0,0,0,4,4,0,0,0,0,0,0,4,4,0,0,0,4 ],
  [ 48,81,72,82,48,81,72,72,72,72,112,113,100,101,83,100,101,83,76,8,9,75,83,112,113,76,8,9,75,83,83,112,113,76,8,9,75,83,76,0 ],
  [ 48,81,72,82,48,73,84,84,84,84,114,115,102,103,84,102,103,84,74,0,5,73,78,118,119,79,76,0,73,78,72,118,119,79,76,0,81,104,97,0 ],
  [ 48,81,72,82,48,48,48,48,48,48,48,48,48,48,48,48,48,48,11,5,5,15,73,84,84,84,74,13,14,73,84,84,78,116,109,0,81,106,99,0 ],
  [ 48,81,72,79,83,83,83,83,83,83,83,100,101,83,83,112,113,76,8,5,5,16,24,72,25,4,0,0,0,0,0,0,81,118,111,0,81,116,109,0 ],
  [ 48,81,72,72,72,72,72,72,72,72,72,106,107,72,72,118,119,79,76,0,5,75,83,76,8,9,75,83,83,83,76,0,81,104,97,0,81,118,111,0 ],
  [ 48,73,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,74,0,5,73,78,82,0,5,81,104,105,77,74,0,81,106,99,0,73,78,82,0 ],
  [ 48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,11,5,5,15,73,74,13,14,73,102,103,74,13,14,73,84,74,13,14,73,74,0 ],
  [ 83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,76,8,5,5,25,72,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 72,72,116,117,72,72,72,116,117,104,105,72,104,105,116,117,72,79,76,0,5,75,112,113,83,83,112,113,100,101,83,83,83,112,113,83,83,100,101,83 ],
  [ 84,84,114,115,84,84,84,114,115,102,103,84,102,103,114,115,84,84,74,13,14,73,114,115,84,84,114,115,102,103,84,84,84,114,115,84,84,102,103,84 ],
  [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 86,0,0,85,90,90,90,86,0,0,85,90,90,90,86,0,0,85,90,90,90,86,0,0,85,90,90,90,86,0,0,85,90,90,90,86,0,0,85,90 ],
  [ 4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4 ],
  [ 0,75,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,76,0 ],
  [ 0,73,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,74,0 ],
  [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,4,4,4,4,11,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,76,12,0,8,9,0,8,75,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83,83 ]
 ];
 this.ENEMY = [
  [ 0,0,35,6,80,20,1 ],
  [ 0,7,35,6,80,20,1 ],
  [ 0,14,35,6,80,20,1 ],
  [ 0,21,35,6,80,20,1 ],
  [ 0,28,35,6,80,20,1 ],
  [ 0,39,33,5,80,20,1 ],
  [ 0,32,33,5,80,20,1 ],
  [ 0,25,33,5,80,20,1 ],
  [ 0,18,33,5,80,20,1 ],
  [ 0,11,33,5,80,20,1 ],
  [ 0,0,7,12,80,20,1 ],
  [ 0,4,7,12,80,20,1 ],
  [ 0,0,14,12,80,40,1 ],
  [ 0,4,14,12,80,40,1 ],
  [ 0,8,14,12,80,40,1 ],
  [ 0,0,21,12,80,60,1 ],
  [ 0,4,21,12,80,60,1 ],
  [ 0,8,21,12,80,60,1 ],
  [ 0,29,5,12,80,0,1 ],
  [ 0,31,4,12,80,0,1 ],
  [ 0,35,4,12,80,0,1 ],
  [ 0,37,5,12,80,0,1 ],
  [ 0,29,12,12,80,0,1 ],
  [ 0,31,13,12,80,0,1 ],
  [ 0,35,13,12,80,0,1 ],
  [ 0,37,12,12,80,0,1 ],
  [ 0,8,9,11,80,0,2 ],
  [ 0,11,3,9,80,20,2 ],
  [ 0,12,3,10,80,0,2 ],
  [ 0,15,9,11,80,20,2 ],
  [ 0,13,20,10,80,0,2 ],
  [ 0,20,20,10,80,20,2 ],
  [ 0,27,20,10,80,0,2 ],
  [ 0,34,20,10,80,20,2 ],
  [ 0,27,22,8,80,0,2 ],
  [ 0,35,22,8,80,20,2 ],
  [ 0,39,22,8,80,0,2 ],
  [ 0,39,30,9,80,20,2 ],
  [ 0,11,14,20,80,0,2 ],
  [ 0,18,6,20,80,20,2 ],
  [ 0,23,7,20,80,40,2 ],
  [ 0,4,3,3,120,0,4 ],
  [ 0,0,11,3,120,40,4 ],
  [ 0,0,17,3,120,0,4 ],
  [ 0,39,20,3,80,0,4 ],
  [ 0,11,6,3,80,0,4 ],
  [ 0,19,18,1,120,0,4 ],
  [ 0,20,18,2,120,40,4 ],
  [ 0,19,31,0,120,0,4 ],
  [ 0,20,31,1,120,40,4 ],
  [ 1,29,4,0,120,0,4 ],
  [ 1,29,13,1,120,30,4 ],
  [ 1,37,4,1,120,60,4 ],
  [ 1,37,13,2,120,90,4 ],
  [ 2,29,4,0,80,0,4 ],
  [ 2,29,13,1,80,20,4 ],
  [ 2,37,4,1,80,40,4 ],
  [ 2,37,13,2,80,60,4 ],
  [ -1,0,0,0,0,0,0 ]
 ];
}
function StageData2(){
 this.MAP = [
  [ 0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,100,1,1,1,1,1,1,1,1,1,1,101,102,102,102,102,102,106 ],
  [ 0,0,0,0,0,0,0,100,1,1,96,97,98,1,1,99,0,0,0,0,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,99 ],
  [ 0,0,0,0,0,0,0,100,1,1,99,0,100,1,1,99,0,0,0,0,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,99 ],
  [ 0,0,0,0,0,0,0,100,1,1,101,102,103,1,1,99,0,0,0,0,107,102,103,1,1,1,96,97,97,98,1,1,1,96,97,98,1,1,1,99 ],
  [ 0,0,0,0,0,0,0,100,1,1,1,1,1,1,1,99,0,0,0,0,100,1,1,1,1,1,99,0,0,100,1,1,1,99,0,100,1,1,1,99 ],
  [ 0,0,0,0,0,0,0,105,98,1,1,96,97,97,97,104,0,0,107,102,103,1,1,1,1,1,99,0,0,105,97,97,97,104,0,100,1,1,1,99 ],
  [ 0,0,0,0,0,0,107,102,103,1,1,99,0,0,0,0,0,0,100,1,1,1,1,1,1,1,99,0,0,0,0,0,0,0,0,100,1,1,1,99 ],
  [ 102,102,102,102,106,0,100,1,1,1,1,101,102,102,106,0,0,0,100,1,1,1,1,96,97,97,104,0,0,0,0,0,0,0,0,100,1,1,1,99 ],
  [ 1,1,1,1,101,102,103,1,1,1,1,1,1,1,101,102,102,102,103,1,1,1,1,99,0,0,0,0,0,0,0,107,102,102,102,103,1,1,1,99 ],
  [ 1,1,1,1,1,96,98,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,101,0,106,0,0,0,0,0,100,1,1,1,1,1,1,1,101 ],
  [ 1,1,1,1,1,99,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,99,0,0,0,0,0,100,1,1,1,1,1,1,1,1 ],
  [ 1,1,1,1,1,99,100,1,1,1,96,98,1,1,1,1,1,1,96,97,98,1,1,1,1,99,0,0,0,0,0,105,98,1,1,1,1,1,1,1 ],
  [ 1,1,1,1,1,99,100,1,1,1,99,100,1,1,96,98,1,1,101,102,103,1,1,1,1,101,102,102,102,102,102,102,103,1,1,1,1,1,1,1 ],
  [ 1,1,1,1,1,99,100,1,1,1,99,100,1,1,101,103,1,1,1,1,1,1,1,1,1,1,1,96,97,97,97,97,98,1,1,1,1,1,1,1 ],
  [ 97,98,1,1,96,104,100,1,1,1,99,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,99,0,0,0,0,100,1,1,1,96,97,97,97 ],
  [ 0,100,1,1,99,0,0,0,97,97,104,105,98,1,1,1,1,1,1,96,98,1,1,1,96,97,97,104,0,0,0,0,100,1,1,1,99,0,0,0 ],
  [ 0,100,1,1,99,0,0,0,0,0,0,0,100,1,1,96,98,1,1,99,100,1,1,1,99,0,0,0,0,0,0,0,100,1,1,1,99,0,0,0 ],
  [ 102,103,1,1,101,106,0,0,0,0,0,0,100,1,1,101,103,1,1,101,103,1,1,1,101,0,106,0,0,0,0,0,100,1,1,1,101,102,102,102 ],
  [ 1,1,1,1,1,99,0,107,102,106,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,99,0,0,0,0,0,100,1,1,1,1,1,1,1 ],
  [ 1,1,1,1,1,99,0,100,1,99,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,101,102,102,102,102,102,103,1,1,1,1,1,1,1 ],
  [ 1,1,1,1,1,99,0,105,97,104,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,96,97,97,98,1,1,1,1,1,1,1 ],
  [ 1,1,1,1,1,99,0,0,0,0,0,0,100,1,1,1,96,97,97,97,97,97,98,1,1,1,1,1,1,99,0,0,105,97,97,97,97,98,1,1 ],
  [ 1,1,1,1,1,101,102,106,0,0,0,0,100,1,1,1,99,0,0,0,0,0,100,1,1,1,72,1,1,99,0,0,0,0,0,0,0,100,1,1 ],
  [ 1,1,1,1,1,1,1,99,0,0,0,0,100,1,1,1,99,0,0,0,0,0,100,1,1,1,99,0,97,104,0,0,0,107,102,102,102,103,1,1 ],
  [ 1,1,1,1,1,1,1,99,0,0,0,0,105,98,96,0,104,0,0,0,0,0,100,1,1,1,99,0,0,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 98,1,1,1,1,1,1,99,0,0,0,0,0,100,99,0,0,0,0,107,102,102,103,1,1,1,101,102,106,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 100,1,1,96,97,97,97,104,0,0,0,0,0,100,99,0,0,0,0,100,1,1,1,1,1,1,1,1,99,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 100,1,1,99,0,0,0,0,0,0,0,0,0,100,99,0,0,0,0,100,1,1,1,1,1,1,1,1,99,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 111,48,48,99,0,0,0,0,0,0,0,107,102,111,110,102,106,0,0,100,1,1,1,73,1,1,1,1,99,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 48,48,48,110,102,106,0,0,0,0,0,100,48,48,48,48,99,0,0,105,97,97,0,100,96,97,97,97,104,0,0,0,0,105,97,98,1,1,1,96 ],
  [ 48,48,48,48,48,99,0,0,0,0,0,100,48,48,48,48,99,0,0,0,0,0,0,100,99,0,0,0,0,0,0,0,0,0,0,100,1,1,1,99 ],
  [ 48,48,48,48,48,99,0,102,102,102,102,111,48,48,48,48,99,0,0,0,0,0,0,100,99,0,0,0,0,0,0,0,0,0,0,100,1,1,1,99 ],
  [ 48,48,48,48,48,86,48,48,48,48,48,48,48,48,48,48,99,0,0,0,0,0,0,100,99,0,0,0,107,102,106,0,0,107,102,103,1,1,1,101 ],
  [ 48,48,48,48,48,48,48,48,48,48,48,48,48,108,97,97,104,0,0,0,0,0,107,103,99,0,0,0,100,1,99,0,0,100,1,1,1,1,1,1 ],
  [ 48,48,48,48,48,48,48,48,48,48,48,48,48,99,0,0,0,0,0,0,0,0,100,96,104,0,0,0,105,97,104,0,0,100,1,1,1,1,1,1 ],
  [ 48,48,48,48,48,48,48,48,48,48,48,48,48,99,0,0,0,0,0,0,0,0,100,99,0,0,0,0,0,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 48,48,48,48,48,48,48,48,48,48,48,48,48,110,102,102,102,102,102,102,102,102,103,99,0,0,0,0,0,0,0,0,0,100,1,1,1,1,1,1 ],
  [ 97,97,97,97,97,97,97,109,48,48,48,48,48,48,48,108,97,97,98,1,1,1,1,101,102,102,102,102,102,102,102,102,102,103,1,1,1,1,1,1 ],
  [ 0,0,0,0,0,0,0,100,48,48,48,48,48,48,48,99,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
  [ 0,0,0,0,0,0,0,100,48,48,48,48,48,48,48,99,0,0,100,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ]
 ];
 this.ENEMY = [
  [ 0,0,13,24,80,0,1 ],
  [ 0,2,13,24,80,0,1 ],
  [ 0,4,13,24,80,0,1 ],
  [ 0,0,18,24,80,0,1 ],
  [ 0,2,18,24,80,0,1 ],
  [ 0,4,18,24,80,0,1 ],
  [ 0,11,16,13,80,20,1 ],
  [ 0,11,18,13,80,20,1 ],
  [ 0,11,20,13,80,20,1 ],
  [ 0,11,22,13,80,20,1 ],
  [ 0,17,22,12,80,0,1 ],
  [ 0,19,22,12,80,0,1 ],
  [ 0,21,22,12,80,0,1 ],
  [ 0,36,5,12,80,20,1 ],
  [ 0,38,5,12,80,20,1 ],
  [ 0,33,14,12,80,0,1 ],
  [ 0,35,14,12,80,0,1 ],
  [ 0,34,24,12,80,20,1 ],
  [ 0,36,24,12,80,20,1 ],
  [ 0,38,24,12,80,20,1 ],
  [ 0,35,33,12,80,0,1 ],
  [ 0,37,33,12,80,0,1 ],
  [ 0,39,33,12,80,0,1 ],
  [ 0,8,0,8,80,20,2 ],
  [ 0,8,4,10,80,20,2 ],
  [ 0,14,0,9,80,20,2 ],
  [ 0,14,4,11,80,20,2 ],
  [ 0,16,13,9,80,60,2 ],
  [ 0,16,15,8,80,60,2 ],
  [ 0,18,13,11,80,60,2 ],
  [ 0,18,15,10,80,60,2 ],
  [ 0,23,0,10,80,20,2 ],
  [ 0,32,0,8,80,60,2 ],
  [ 0,1,1,3,80,0,4 ],
  [ 0,20,1,0,120,0,4 ],
  [ 0,16,6,1,120,40,4 ],
  [ 0,17,14,3,80,0,4 ],
  [ 0,21,27,1,120,0,4 ],
  [ 0,26,27,2,120,40,4 ],
  [ 0,31,0,0,120,0,4 ],
  [ 0,31,3,2,120,40,4 ],
  [ 0,29,10,3,80,0,4 ],
  [ 0,30,15,3,80,0,4 ],
  [ 0,26,31,0,120,0,4 ],
  [ 0,26,35,2,120,40,4 ],
  [ 0,31,31,1,120,40,4 ],
  [ 0,31,35,0,120,0,4 ],
  [ 0,0,36,3,80,0,4 ],
  [ 0,14,39,3,80,0,4 ],
  [ 0,15,29,3,80,0,4 ],
  [ 1,0,8,1,120,0,4 ],
  [ 1,0,9,2,120,30,4 ],
  [ 1,1,8,0,120,60,4 ],
  [ 1,1,9,1,120,90,4 ],
  [ 2,0,8,1,60,0,4 ],
  [ 2,0,9,2,60,20,4 ],
  [ 2,1,8,0,60,40,4 ],
  [ 2,1,9,1,60,0,4 ],
  [ -1,0,0,0,0,0,0 ]
 ];
}
function StageData3(){
 this.MAP = [
  [ 6,2,2,2,2,2,2,2,16,16,28,20,16,16,28,20,16,16,16,16,16,28,28,28,28,28,6,2,28,28,28,28,6,2,28,28,28,28,28,28 ],
  [ 4,0,0,0,0,0,0,0,28,19,28,18,28,19,28,18,28,28,28,28,19,28,28,28,28,28,4,0,28,28,28,28,4,0,28,28,28,28,28,28 ],
  [ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,28,28,18,28,28,28,28,28,4,0,28,28,28,28,4,0,28,28,28,28,28,28 ],
  [ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,20,16,17,28,28,6,2,2,3,0,1,2,2,2,3,0,1,2,2,28,28,28 ],
  [ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,18,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,18,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 4,0,0,0,0,0,0,0,28,18,28,18,28,18,28,18,28,28,18,1,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2 ],
  [ 4,0,0,0,0,0,0,0,28,18,15,17,28,18,15,17,28,28,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 18,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,5,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 18,28,28,28,20,16,16,28,28,28,20,16,16,16,16,16,28,28,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 18,15,16,16,17,28,19,15,16,16,17,28,28,28,19,14,28,28,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 28,28,28,28,28,28,28,28,28,28,28,28,20,16,17,14,15,16,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 20,16,16,16,16,16,16,16,16,16,16,28,18,28,28,28,28,19,28,28,6,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2 ],
  [ 18,28,28,28,28,28,28,28,28,28,19,28,18,15,16,16,16,17,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [ 18,15,16,16,16,28,20,16,16,16,17,28,28,28,19,14,28,28,28,28,28,28,28,5,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 28,28,28,28,19,28,18,28,28,28,28,28,20,16,17,14,15,16,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 20,16,16,16,17,28,18,15,16,16,16,28,18,28,28,28,28,19,28,28,28,28,28,4,0,0,0,0,0,0,0,0,0,0,0,0,0,28,28,28 ],
  [ 18,28,28,28,28,28,28,28,28,28,19,28,18,15,16,16,16,17,28,28,28,28,28,28,28,28,5,0,28,28,28,28,5,0,28,28,28,28,28,28 ],
  [ 18,15,16,16,16,28,20,16,16,16,17,28,28,28,19,14,28,28,28,28,28,28,28,28,28,28,4,0,28,28,28,28,4,0,28,28,28,28,28,28 ],
  [ 28,28,28,28,19,28,18,28,28,28,28,28,20,16,17,14,15,16,28,20,16,16,16,16,28,28,4,0,28,28,28,28,4,0,28,28,20,16,16,16 ],
  [ 20,16,16,16,17,28,18,15,16,16,16,28,18,28,28,28,28,19,28,18,28,28,28,19,28,28,28,28,28,28,28,28,28,28,28,28,18,28,28,19 ],
  [ 18,28,28,28,28,28,28,28,28,28,19,28,18,15,16,16,16,17,28,18,28,28,20,17,28,28,28,28,28,28,28,28,28,28,28,28,18,28,28,18 ],
  [ 18,15,16,16,16,16,16,16,16,28,18,28,28,28,19,14,28,28,28,18,28,28,18,14,15,16,16,16,16,16,16,16,16,16,16,16,17,28,28,18 ],
  [ 28,28,28,28,28,28,28,28,19,28,18,28,28,20,17,14,15,28,28,18,15,28,18,28,28,28,28,28,28,28,28,28,28,28,28,19,14,28,28,18 ],
  [ 20,16,16,16,16,16,16,16,17,28,18,15,16,17,14,14,14,15,16,17,14,28,18,15,16,28,20,16,16,16,16,28,28,28,28,28,19,28,20,17 ],
  [ 18,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,19,28,18,14,14,28,18,28,28,28,19,15,16,28,20,16,17,28,18,28 ],
  [ 18,28,28,20,16,16,16,16,16,16,28,28,28,6,2,2,2,2,2,2,3,28,18,14,14,28,18,15,16,28,18,14,14,28,18,14,14,28,18,28 ],
  [ 18,15,28,18,14,14,14,14,28,19,28,28,28,4,0,0,0,0,0,0,0,28,18,14,14,28,18,14,14,28,18,14,14,28,18,14,14,28,18,28 ],
  [ 18,14,15,17,14,14,14,14,28,18,15,16,28,4,0,0,0,0,0,0,0,28,18,14,14,28,18,14,14,28,18,14,14,28,18,14,14,28,18,28 ],
  [ 18,28,28,28,28,28,28,28,28,18,14,14,28,4,0,0,0,0,0,0,0,28,28,28,19,28,18,14,14,28,18,14,14,28,18,14,14,28,18,15 ],
  [ 18,15,16,16,16,16,16,16,28,18,14,14,28,4,0,0,0,0,0,0,0,28,20,16,17,28,18,14,14,28,28,28,19,15,17,28,28,28,28,19 ],
  [ 28,28,28,28,28,28,28,19,28,18,14,14,28,4,0,0,0,0,0,0,0,28,18,28,28,28,28,28,19,28,28,28,28,28,28,28,28,28,28,18 ],
  [ 6,2,2,2,2,2,2,3,28,18,14,14,28,4,0,0,0,0,0,0,0,28,18,15,16,16,16,28,18,15,16,28,6,2,2,2,2,2,2,3 ],
  [ 4,0,0,0,0,0,0,0,28,28,28,19,28,4,0,0,0,0,0,0,0,28,18,14,14,14,14,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
  [ 4,0,0,0,0,0,0,0,28,20,16,17,28,28,28,28,28,28,28,28,28,28,18,14,14,14,14,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
  [ 4,0,0,0,0,0,0,0,28,18,28,28,28,28,28,20,16,16,16,16,28,28,28,28,28,28,19,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
  [ 4,0,0,0,0,0,0,0,28,18,15,16,16,16,28,18,28,28,28,19,15,16,16,16,16,16,17,28,18,14,14,28,4,0,0,0,0,0,0,0 ],
  [ 4,0,0,0,0,0,0,0,28,18,14,14,14,14,28,18,15,16,28,18,14,28,28,28,28,28,28,28,28,28,19,28,4,0,0,0,0,0,0,0 ],
  [ 4,0,0,0,0,0,0,0,28,18,14,14,14,14,28,28,28,19,28,18,14,28,28,28,20,16,16,16,16,28,18,28,4,0,0,0,0,0,0,0 ],
  [ 4,0,0,0,0,0,0,0,28,28,28,28,28,19,15,16,16,17,28,18,14,15,16,16,17,28,28,28,19,15,17,28,4,0,0,0,0,0,0,0 ]
 ];
 this.ENEMY = [
  [ 0,9,0,4,80,0,1 ],
  [ 0,11,0,4,80,0,1 ],
  [ 0,13,0,4,80,0,1 ],
  [ 0,15,0,4,80,0,1 ],
  [ 0,0,14,6,80,0,1 ],
  [ 0,0,16,6,80,0,1 ],
  [ 0,0,18,6,80,0,1 ],
  [ 0,0,20,6,80,0,1 ],
  [ 0,6,14,6,80,0,1 ],
  [ 0,6,16,6,80,0,1 ],
  [ 0,6,18,6,80,0,1 ],
  [ 0,6,20,6,80,0,1 ],
  [ 0,0,10,6,80,20,1 ],
  [ 0,0,30,6,80,20,1 ],
  [ 0,10,24,6,80,20,1 ],
  [ 0,19,19,4,80,20,1 ],
  [ 0,38,24,4,80,20,1 ],
  [ 0,12,12,8,80,0,2 ],
  [ 0,17,16,8,80,0,2 ],
  [ 0,12,20,8,80,0,2 ],
  [ 0,5,27,8,80,0,2 ],
  [ 0,10,30,8,80,0,2 ],
  [ 0,11,37,8,80,0,2 ],
  [ 0,23,26,8,80,0,2 ],
  [ 0,24,33,8,80,0,2 ],
  [ 0,27,28,8,80,0,2 ],
  [ 0,29,34,8,80,0,2 ],
  [ 0,31,27,8,80,0,2 ],
  [ 0,35,27,8,80,0,2 ],
  [ 0,3,3,20,80,0,2 ],
  [ 0,4,35,20,80,0,2 ],
  [ 0,17,29,20,80,0,2 ],
  [ 0,36,35,20,80,0,2 ],
  [ 0,26,1,12,120,30,15 ],
  [ 0,27,1,12,120,30,15 ],
  [ 0,32,1,12,120,30,15 ],
  [ 0,33,1,12,120,30,15 ],
  [ 0,38,6,13,120,30,15 ],
  [ 0,38,7,13,120,30,15 ],
  [ 0,38,12,13,120,30,15 ],
  [ 0,38,13,13,120,30,15 ],
  [ 0,33,18,15,120,30,15 ],
  [ 0,32,18,15,120,30,15 ],
  [ 0,27,18,15,120,30,15 ],
  [ 0,26,18,15,120,30,15 ],
  [ 0,21,13,14,120,30,15 ],
  [ 0,21,12,14,120,30,15 ],
  [ 0,26,0,8,120,60,15 ],
  [ 0,27,0,8,120,60,15 ],
  [ 0,32,0,8,120,60,15 ],
  [ 0,33,0,8,120,60,15 ],
  [ 0,39,6,9,120,60,15 ],
  [ 0,39,7,9,120,60,15 ],
  [ 0,39,12,9,120,60,15 ],
  [ 0,39,13,9,120,60,15 ],
  [ 0,33,19,11,120,60,15 ],
  [ 0,32,19,11,120,60,15 ],
  [ 0,27,19,11,120,60,15 ],
  [ 0,26,19,11,120,60,15 ],
  [ 0,20,13,10,120,60,15 ],
  [ 0,20,12,10,120,60,15 ],
  [ 0,4,4,3,80,0,4 ],
  [ 0,3,36,3,80,0,4 ],
  [ 0,16,30,3,80,0,4 ],
  [ 0,35,36,3,80,0,4 ],
  [ 1,26,2,0,180,0,1 ],
  [ 1,27,2,0,180,30,1 ],
  [ 1,32,2,1,180,60,1 ],
  [ 1,33,2,1,180,90,1 ],
  [ 1,37,6,2,180,120,1 ],
  [ 1,37,7,2,180,150,1 ],
  [ 1,37,12,0,180,0,1 ],
  [ 1,37,13,0,180,30,1 ],
  [ 1,33,17,1,180,60,1 ],
  [ 1,32,17,1,180,90,1 ],
  [ 1,27,17,2,180,120,1 ],
  [ 1,26,17,2,180,150,1 ],
  [ 1,22,13,0,180,0,1 ],
  [ 1,22,12,0,180,30,1 ],
  [ 1,22,7,1,180,60,1 ],
  [ 1,22,6,1,180,90,1 ],
  [ 2,26,2,0,180,0,1 ],
  [ 2,27,2,0,180,30,1 ],
  [ 2,32,2,1,180,60,1 ],
  [ 2,33,2,1,180,90,1 ],
  [ 2,37,6,2,180,120,1 ],
  [ 2,37,7,2,180,150,1 ],
  [ 2,37,12,0,180,0,1 ],
  [ 2,37,13,0,180,30,1 ],
  [ 2,33,17,1,180,60,1 ],
  [ 2,32,17,1,180,90,1 ],
  [ 2,27,17,2,180,120,1 ],
  [ 2,26,17,2,180,150,1 ],
  [ 2,22,13,0,180,0,1 ],
  [ 2,22,12,0,180,30,1 ],
  [ 2,22,7,1,180,60,1 ],
  [ 2,22,6,1,180,90,1 ],
  [ -1,0,0,0,0,0,0 ]
 ];
}
function StageData4(){
 this.MAP = [
  [ 0,0,0,0,0,0,0,0,11,11,0,81,78,78,78,78,78,78,78,78,78,78,78,78,78,78,80,0,0,0,0,0,0,0,0,0,105,17,0,0 ],
  [ 0,105,105,105,105,105,105,18,11,11,0,81,83,79,79,79,79,79,79,79,79,79,79,79,79,84,80,0,105,105,18,0,0,105,105,18,105,17,105,18 ],
  [ 0,105,19,15,15,15,105,17,81,80,0,81,80,0,0,0,0,0,104,9,0,0,0,0,0,81,80,0,105,19,16,0,0,14,105,17,105,17,105,17 ],
  [ 0,14,16,0,0,0,105,17,81,80,0,81,80,0,117,118,119,5,7,8,0,117,118,119,5,81,80,0,105,17,0,0,0,0,105,17,105,17,105,17 ],
  [ 0,0,0,0,0,0,105,17,81,80,0,81,80,0,120,121,128,119,5,0,117,129,121,122,4,81,80,0,105,17,0,0,0,0,105,17,105,17,105,17 ],
  [ 0,0,0,0,0,0,105,17,81,80,0,81,80,0,123,127,121,128,118,118,129,121,126,125,4,81,80,0,105,17,0,0,0,0,105,17,105,17,105,17 ],
  [ 0,105,18,0,0,0,105,17,81,80,0,81,80,0,1,123,127,121,121,121,121,126,125,6,3,81,80,0,105,105,105,105,105,105,105,17,14,16,105,17 ],
  [ 0,105,105,105,105,105,105,17,81,80,0,81,80,104,9,1,120,121,121,121,121,122,6,3,104,94,80,0,14,15,15,15,15,15,15,16,0,0,105,17 ],
  [ 0,14,15,15,15,15,15,16,81,80,0,81,80,7,8,0,120,121,121,121,121,122,4,0,7,96,80,0,0,105,105,105,105,105,105,105,105,105,19,16 ],
  [ 82,82,82,82,82,10,10,82,86,80,0,81,80,0,0,117,129,121,121,121,121,128,119,5,0,81,80,0,0,81,93,15,15,15,15,15,15,15,16,0 ],
  [ 79,79,79,79,79,10,10,79,84,80,0,81,80,0,117,129,121,126,124,124,127,121,128,119,5,81,80,0,0,81,80,0,105,105,105,105,105,105,105,18 ],
  [ 0,0,0,0,0,0,0,0,81,80,0,81,80,0,120,121,126,125,6,2,123,127,121,122,4,81,80,104,9,81,80,0,105,19,15,15,15,15,105,17 ],
  [ 0,117,118,118,118,118,119,5,81,80,0,81,80,0,123,124,125,6,3,0,1,123,124,125,4,11,11,7,8,81,80,0,105,17,0,0,0,0,14,16 ],
  [ 0,123,124,124,124,127,122,4,81,80,0,81,80,0,1,2,2,3,104,9,0,1,2,2,3,11,11,0,0,81,80,0,105,17,0,0,0,0,0,0 ],
  [ 0,1,2,2,2,120,122,4,81,85,10,86,85,82,82,82,82,82,95,97,82,82,82,82,82,86,85,82,82,86,80,0,105,17,0,0,0,0,105,18 ],
  [ 0,0,0,0,0,120,122,4,81,83,10,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,84,80,0,105,105,105,105,105,105,105,17 ],
  [ 0,0,0,0,0,120,122,4,81,80,0,104,9,0,0,0,0,0,104,9,0,0,0,104,9,0,0,0,0,81,80,0,14,15,15,15,15,15,15,16 ],
  [ 0,0,0,0,0,120,122,4,81,80,0,7,8,0,0,0,104,9,7,8,0,0,0,7,8,0,104,9,0,81,80,0,0,105,105,105,105,105,105,105 ],
  [ 0,0,0,0,0,120,122,4,81,85,82,82,82,82,82,82,95,97,82,82,82,82,82,82,82,82,95,97,10,86,80,0,0,14,15,15,15,15,15,15 ],
  [ 0,0,0,0,0,120,122,4,81,78,83,79,79,79,79,79,79,79,79,79,79,79,79,79,79,79,84,83,10,84,80,0,105,105,105,105,105,105,105,18 ],
  [ 0,117,118,118,118,129,122,4,11,11,11,104,9,0,0,0,0,0,117,118,118,118,118,119,5,104,94,80,0,81,80,0,105,19,15,15,15,15,105,17 ],
  [ 0,123,124,124,124,124,125,4,11,11,11,7,8,0,0,117,119,5,123,124,124,124,124,125,4,7,96,80,0,81,80,0,105,17,0,0,0,0,105,17 ],
  [ 0,1,2,2,2,2,2,3,81,78,80,0,0,0,0,120,122,4,1,2,2,2,2,2,3,0,81,80,0,81,80,0,105,17,0,0,0,0,105,17 ],
  [ 82,82,82,10,10,82,82,82,86,78,80,0,0,0,0,120,122,4,0,0,0,0,0,117,119,5,81,80,0,81,80,0,105,17,0,0,0,0,105,17 ],
  [ 79,79,79,10,10,79,79,79,84,78,80,117,118,118,118,129,122,4,117,119,5,0,0,120,122,4,81,80,0,81,80,0,105,17,0,0,0,0,105,17 ],
  [ 0,0,0,0,0,0,0,0,81,78,80,123,124,124,124,124,125,4,120,122,4,0,0,120,122,4,81,80,0,81,80,0,105,17,0,0,0,0,105,17 ],
  [ 0,117,118,118,118,118,119,5,81,78,80,1,2,2,2,2,2,3,120,122,4,0,0,120,122,4,81,80,0,81,80,0,105,17,0,0,0,0,105,17 ],
  [ 0,120,121,121,121,121,122,4,81,78,80,0,105,105,105,105,18,0,120,128,118,118,118,129,122,4,81,80,0,11,11,0,105,105,18,0,0,105,105,17 ],
  [ 0,123,124,124,124,124,125,4,81,78,80,0,105,19,15,15,16,0,123,124,124,124,124,124,125,4,81,80,0,11,11,0,14,15,16,0,0,14,15,16 ],
  [ 0,1,2,2,2,2,2,3,81,78,80,0,105,17,0,0,0,0,1,2,2,2,2,2,2,3,81,85,82,86,85,82,82,82,82,82,82,82,82,82 ],
  [ 0,104,9,0,0,0,104,9,81,78,80,0,105,17,0,0,0,0,0,0,0,0,0,0,0,0,81,78,78,78,78,78,78,78,78,78,78,78,78,78 ],
  [ 0,7,8,0,0,0,7,8,81,78,80,0,105,17,0,104,9,0,104,9,0,104,9,104,9,104,94,83,79,84,83,79,79,79,79,79,79,79,79,79 ],
  [ 0,0,0,0,0,0,0,0,81,78,80,0,105,17,0,7,8,0,7,8,0,7,8,7,8,7,11,11,0,81,80,0,0,0,0,0,0,0,0,0 ],
  [ 0,0,0,0,0,0,0,0,81,78,80,0,105,17,0,0,0,0,0,104,9,104,9,104,9,104,94,80,0,81,80,0,105,105,105,105,105,105,105,18 ],
  [ 0,104,9,0,0,0,104,9,81,78,80,0,105,17,0,104,9,104,9,7,8,7,8,7,8,7,96,80,0,81,80,0,105,19,15,15,15,15,105,17 ],
  [ 0,7,8,0,0,0,7,8,81,78,80,0,105,17,0,7,8,7,8,0,0,0,0,0,0,0,81,80,0,81,80,0,105,17,0,0,0,0,14,16 ],
  [ 0,117,118,118,118,118,119,5,81,78,80,0,105,17,0,104,9,104,9,0,0,0,0,0,0,0,81,80,0,81,80,0,105,17,0,0,0,0,0,0 ],
  [ 0,120,121,121,121,121,122,4,81,78,80,0,105,17,0,7,8,7,8,0,0,0,0,0,0,0,81,80,0,81,80,0,105,17,0,0,0,0,105,18 ],
  [ 0,123,124,124,124,124,125,4,11,11,11,0,105,17,0,104,9,104,9,0,0,0,0,0,0,0,81,80,0,11,11,0,105,105,105,105,105,105,105,17 ],
  [ 0,1,2,2,2,2,2,3,11,11,11,0,105,17,0,7,8,7,8,0,0,0,0,0,0,0,81,80,0,11,11,0,14,15,15,15,15,15,15,16 ]
 ];
 this.ENEMY = [
  [ 0,2,2,12,80,0,1 ],
  [ 0,2,6,12,80,0,1 ],
  [ 0,5,2,12,80,0,1 ],
  [ 0,5,6,12,80,0,1 ],
  [ 0,1,31,12,80,0,1 ],
  [ 0,1,33,12,80,0,1 ],
  [ 0,6,31,12,80,0,1 ],
  [ 0,6,33,12,80,0,1 ],
  [ 0,13,34,12,80,0,1 ],
  [ 0,13,36,12,80,0,1 ],
  [ 0,13,38,12,80,0,1 ],
  [ 0,21,29,12,80,0,1 ],
  [ 0,23,29,12,80,0,1 ],
  [ 0,25,29,12,80,0,1 ],
  [ 0,29,2,12,80,0,1 ],
  [ 0,29,5,12,80,0,1 ],
  [ 0,33,2,12,80,0,1 ],
  [ 0,33,5,12,80,0,1 ],
  [ 0,33,11,12,80,0,1 ],
  [ 0,33,14,12,80,0,1 ],
  [ 0,37,11,12,80,0,1 ],
  [ 0,37,14,12,80,0,1 ],
  [ 0,33,20,12,80,0,1 ],
  [ 0,33,23,12,80,0,1 ],
  [ 0,33,26,12,80,0,1 ],
  [ 0,37,20,12,80,0,1 ],
  [ 0,37,23,12,80,0,1 ],
  [ 0,37,26,12,80,0,1 ],
  [ 0,33,34,12,80,0,1 ],
  [ 0,33,37,12,80,0,1 ],
  [ 0,37,34,12,80,0,1 ],
  [ 0,37,37,12,80,0,1 ],
  [ 0,4,14,9,80,20,2 ],
  [ 0,4,19,9,80,0,2 ],
  [ 0,12,20,10,80,0,2 ],
  [ 0,14,23,11,80,20,2 ],
  [ 0,20,26,11,80,0,2 ],
  [ 0,22,26,11,80,20,2 ],
  [ 0,25,28,11,80,0,2 ],
  [ 0,3,4,3,80,0,4 ],
  [ 0,3,15,1,120,0,4 ],
  [ 0,3,18,2,120,40,4 ],
  [ 0,3,30,0,120,40,4 ],
  [ 0,3,34,1,120,0,4 ],
  [ 0,13,22,3,80,0,4 ],
  [ 0,21,22,0,120,0,4 ],
  [ 0,21,25,1,120,40,4 ],
  [ 0,24,38,3,80,0,4 ],
  [ 0,31,3,3,80,0,4 ],
  [ 0,35,13,3,80,0,4 ],
  [ 0,35,22,0,120,40,4 ],
  [ 0,35,25,2,120,0,4 ],
  [ 0,35,36,3,80,0,4 ],
  [ 0,19,12,0,120,0,2 ],
  [ 0,18,12,2,120,40,2 ],
  [ 0,19,11,2,120,40,2 ],
  [ 0,18,11,0,120,0,2 ],
  [ 0,14,8,0,120,0,2 ],
  [ 0,14,7,1,120,40,2 ],
  [ 0,15,8,1,120,40,2 ],
  [ 0,15,7,0,120,0,2 ],
  [ 0,18,3,2,120,0,2 ],
  [ 0,19,3,1,120,40,2 ],
  [ 0,18,4,1,120,40,2 ],
  [ 0,19,4,2,120,0,2 ],
  [ 0,23,7,1,120,0,2 ],
  [ 0,23,8,0,120,40,2 ],
  [ 0,22,7,0,120,40,2 ],
  [ 0,22,8,1,120,0,2 ],
  [ -1,0,0,0,0,0,0 ]
 ];
}
function StageData5(){
 this.MAP = [
  [ 360,360,360,360,4,51,34,35,5,34,35,52,6,360,360,360,360,360,114,106,107,116,116,116,116,106,107,116,116,116,116,106,107,116,116,116,116,116,116,118 ],
  [ 1,2,17,360,4,53,54,54,54,54,54,55,6,360,14,2,3,360,115,108,109,117,117,117,117,108,109,117,117,117,117,108,109,117,117,117,117,117,117,119 ],
  [ 4,42,6,360,18,8,8,8,8,8,8,8,21,360,4,44,6,360,360,102,103,360,360,360,360,102,103,360,360,360,360,98,99,360,360,360,360,360,360,360 ],
  [ 4,5,6,360,360,360,360,360,360,360,360,360,360,360,4,5,6,360,360,102,103,360,360,360,360,102,103,360,360,1,2,2,2,2,2,2,2,2,3,360 ],
  [ 4,42,6,360,14,2,2,2,2,2,2,2,17,360,4,44,6,360,360,104,105,360,360,360,360,102,103,360,360,4,40,5,41,5,5,40,5,41,6,360 ],
  [ 4,5,12,2,15,43,5,43,5,43,5,43,16,2,13,5,6,360,360,360,360,360,360,360,360,102,103,360,360,7,8,8,8,8,8,8,8,8,9,360 ],
  [ 4,32,33,5,5,48,49,49,49,49,49,50,5,5,32,33,6,360,360,100,101,360,360,360,360,102,103,360,360,78,79,360,360,78,79,360,360,78,79,360 ],
  [ 4,34,35,5,5,53,54,54,54,54,54,55,5,5,34,35,6,360,114,106,107,116,116,116,116,106,107,118,360,78,79,360,360,78,79,360,360,78,79,360 ],
  [ 7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,360,115,108,109,117,117,117,117,108,109,119,360,82,83,80,80,82,83,80,80,82,83,360 ],
  [ 360,360,96,97,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,102,103,360,360,360,360,104,105,360,360,84,85,81,81,84,85,81,81,84,85,360 ],
  [ 114,116,106,107,116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,106,107,116,118,360,360,360,360,360,360,78,79,360,360,78,79,360,360,78,79,360 ],
  [ 115,117,108,109,117,117,117,117,117,117,117,117,117,117,117,117,117,117,117,108,109,117,119,360,360,360,360,360,360,78,79,360,360,78,79,360,360,78,79,360 ],
  [ 360,360,104,105,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,104,105,360,360,360,360,82,83,80,80,82,83,80,80,82,83,80,80,82,83,360 ],
  [ 360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,84,85,81,81,84,85,81,81,84,85,81,81,84,85,360 ],
  [ 360,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,360,360,360,360,360,360,360,78,79,360,360,78,79,360,360,78,79,360,360,78,79,360 ],
  [ 360,4,24,25,26,24,25,26,24,25,26,24,25,26,24,25,26,6,360,360,360,360,360,360,360,78,79,360,360,78,79,360,360,78,79,360,360,78,79,360 ],
  [ 360,4,38,360,28,27,360,28,27,360,28,27,360,28,27,360,39,6,80,80,82,83,360,360,360,82,83,80,80,82,83,82,83,82,83,80,80,82,83,360 ],
  [ 360,4,29,30,71,90,66,91,90,66,91,90,66,91,70,30,31,6,81,81,84,85,360,360,360,84,85,81,81,84,85,84,85,84,85,81,81,84,85,360 ],
  [ 360,4,24,25,93,24,25,26,24,25,26,24,25,26,92,25,26,6,360,360,78,79,360,360,360,360,360,360,360,360,360,78,79,360,360,360,360,360,360,360 ],
  [ 360,4,38,360,64,27,360,28,38,360,39,27,360,28,63,360,39,6,360,360,78,79,360,360,360,360,360,360,360,360,360,78,79,360,360,360,360,360,360,360 ],
  [ 360,4,29,30,95,29,30,31,29,30,31,29,30,31,94,30,31,6,360,360,78,79,360,360,360,14,2,2,17,360,14,2,2,17,360,14,2,2,17,360 ],
  [ 360,4,24,25,69,88,61,89,88,61,89,88,61,89,68,25,26,6,360,360,78,79,360,360,1,15,36,36,16,2,15,40,41,16,2,15,36,36,16,3 ],
  [ 360,4,38,360,28,27,360,28,27,360,28,27,360,28,27,360,39,6,360,360,78,79,360,360,7,19,37,37,20,8,19,5,5,20,8,19,37,37,20,9 ],
  [ 360,4,29,30,31,29,30,31,29,30,31,29,30,31,29,30,31,6,360,360,78,79,360,360,360,18,8,8,21,360,18,8,8,21,360,18,8,8,21,360 ],
  [ 360,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,360,360,78,79,360,360,360,360,78,79,360,360,360,360,360,360,360,360,78,79,360,360 ],
  [ 360,360,360,360,360,360,360,360,360,360,360,360,360,360,78,79,360,360,360,360,78,79,360,360,360,14,2,2,17,360,14,2,2,17,360,360,78,79,360,360 ],
  [ 360,360,360,360,360,360,360,360,360,360,360,360,360,360,78,79,360,360,360,360,82,83,80,80,1,15,5,5,16,2,15,36,36,16,3,360,78,79,360,360 ],
  [ 1,2,2,2,2,2,3,75,77,1,2,2,2,2,2,3,360,360,360,360,84,85,81,81,7,19,5,5,20,8,19,37,37,20,9,360,78,79,360,360 ],
  [ 4,5,24,25,25,26,6,360,360,4,24,25,25,26,5,6,360,360,360,360,360,360,360,360,360,18,8,8,21,360,18,8,8,21,360,360,78,79,360,360 ],
  [ 4,5,38,360,360,39,6,360,360,4,38,360,360,39,5,6,360,360,360,360,360,360,360,360,360,360,78,79,360,360,360,360,360,360,360,360,78,79,360,360 ],
  [ 4,5,29,30,30,31,6,360,360,4,29,30,30,31,5,6,360,360,360,360,14,2,2,17,360,14,2,2,17,360,14,2,2,17,360,360,78,79,360,360 ],
  [ 7,8,8,8,8,8,9,75,77,7,8,8,8,8,8,9,360,360,360,1,15,36,36,16,2,15,5,5,16,2,15,36,36,16,3,360,78,79,360,360 ],
  [ 72,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,7,19,37,37,20,8,19,5,5,20,8,19,37,37,20,9,360,78,79,360,360 ],
  [ 73,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,18,8,8,21,360,18,8,8,21,360,18,8,8,21,360,360,78,79,360,360 ],
  [ 74,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,78,79,360,360,360,360,360,360,360,360,78,79,360,360 ],
  [ 1,2,2,2,2,2,3,75,77,1,2,2,2,2,2,3,80,82,83,360,360,360,360,360,360,14,2,2,17,360,14,2,2,17,360,14,2,2,17,360 ],
  [ 4,5,24,25,25,26,6,360,360,4,24,25,25,26,5,6,81,84,85,360,360,360,360,360,1,15,36,36,16,2,15,5,5,16,2,15,36,36,16,3 ],
  [ 4,5,38,360,360,39,6,360,360,4,38,360,360,39,5,6,360,78,79,360,360,360,360,360,7,19,37,37,20,8,19,5,5,20,8,19,37,37,20,9 ],
  [ 4,5,29,30,30,31,6,360,360,4,29,30,30,31,5,6,360,82,83,82,83,360,360,360,360,18,8,8,21,360,18,8,8,21,360,18,8,8,21,360 ],
  [ 7,8,8,8,8,8,9,75,77,7,8,8,8,8,8,9,360,84,85,84,85,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360,360 ]
 ];
 this.ENEMY = [
  [ 0,0,35,24,80,0,1 ],
  [ 0,0,39,24,80,0,1 ],
  [ 0,2,35,24,80,0,1 ],
  [ 0,2,39,24,80,0,1 ],
  [ 0,9,35,24,80,0,1 ],
  [ 0,9,39,24,80,0,1 ],
  [ 0,6,27,24,80,0,1 ],
  [ 0,6,31,24,80,0,1 ],
  [ 0,13,27,24,80,0,1 ],
  [ 0,13,31,24,80,0,1 ],
  [ 0,15,27,24,80,0,1 ],
  [ 0,15,31,24,80,0,1 ],
  [ 0,21,32,24,80,0,1 ],
  [ 0,32,27,24,80,0,1 ],
  [ 0,32,32,24,80,0,1 ],
  [ 0,37,37,24,80,0,1 ],
  [ 0,37,22,24,80,0,1 ],
  [ 0,29,3,24,80,0,1 ],
  [ 0,29,5,24,80,0,1 ],
  [ 0,32,3,24,80,0,1 ],
  [ 0,32,5,24,80,0,1 ],
  [ 0,35,3,24,80,0,1 ],
  [ 0,35,5,24,80,0,1 ],
  [ 0,38,3,24,80,0,1 ],
  [ 0,38,5,24,80,0,1 ],
  [ 1,4,17,20,120,0,2 ],
  [ 1,4,21,20,120,30,2 ],
  [ 1,14,21,20,120,60,2 ],
  [ 1,14,17,20,120,90,2 ],
  [ 2,4,17,20,60,0,2 ],
  [ 2,4,21,20,60,15,2 ],
  [ 2,14,21,20,60,30,2 ],
  [ 2,14,17,20,60,45,2 ],
  [ 0,26,21,20,80,0,2 ],
  [ 0,26,37,20,80,0,2 ],
  [ 0,7,19,3,120,0,4 ],
  [ 0,11,19,3,120,40,4 ],
  [ 0,1,29,3,120,0,4 ],
  [ 0,1,37,3,120,0,4 ],
  [ 0,14,29,3,120,0,4 ],
  [ 0,20,31,3,120,0,4 ],
  [ 0,38,21,3,120,0,4 ],
  [ 0,33,26,3,120,40,4 ],
  [ 0,33,31,3,120,0,4 ],
  [ 0,38,36,3,120,40,4 ],
  [ 0,30,4,3,120,40,4 ],
  [ 0,37,4,3,120,0,4 ],
  [ 0,5,0,16,120,0,4 ],
  [ 0,6,1,16,120,30,4 ],
  [ 0,10,1,16,120,0,4 ],
  [ 0,11,0,16,120,30,4 ],
  [ 1,5,1,0,160,0,4 ],
  [ 1,7,1,1,160,40,4 ],
  [ 1,9,1,2,160,80,4 ],
  [ 1,11,1,1,160,120,4 ],
  [ 2,5,1,0,160,0,4 ],
  [ 2,7,1,1,160,40,4 ],
  [ 2,9,1,2,160,80,4 ],
  [ 2,11,1,1,160,120,4 ],
  [ -1,0,0,0,0,0,0 ]
 ];
}
var IMAGE_BACK1 = 0;
var IMAGE_BACK5 = 1;
var IMAGE_BAKU = 2;
var IMAGE_BASE0 = 3;
var IMAGE_BASE1 = 4;
var IMAGE_BASE2 = 5;
var IMAGE_BASE3 = 6;
var IMAGE_BASE4 = 7;
var IMAGE_BASE5 = 8;
var IMAGE_ENEMY_00 = 9;
var IMAGE_ENEMY_01 = 10;
var IMAGE_ENEMY_02 = 11;
var IMAGE_ENEMY_03 = 12;
var IMAGE_ENEMY_10 = 13;
var IMAGE_ENEMY_11 = 14;
var IMAGE_ENEMY_12 = 15;
var IMAGE_ENEMY_13 = 16;
var IMAGE_ENEMY_20 = 17;
var IMAGE_ENEMY_21 = 18;
var IMAGE_ENEMY_22 = 19;
var IMAGE_ENEMY_23 = 20;
var IMAGE_ENEMY_24 = 21;
var IMAGE_ENEMY_25 = 22;
var IMAGE_ENEMY_26 = 23;
var IMAGE_ENEMY_27 = 24;
var IMAGE_ENEMY_28 = 25;
var IMAGE_ENEMY_29 = 26;
var IMAGE_ENEMY_30 = 27;
var IMAGE_ENEMY_31 = 28;
var IMAGE_ENEMY_32 = 29;
var IMAGE_ENEMY_33 = 30;
var IMAGE_ENEMY_34 = 31;
var IMAGE_ENEMY_35 = 32;
var IMAGE_ENEMY_36 = 33;
var IMAGE_ENEMY_37 = 34;
var IMAGE_ENEMY_38 = 35;
var IMAGE_ENEMY_39 = 36;
var IMAGE_ENEMY_40 = 37;
var IMAGE_ENEMY_41 = 38;
var IMAGE_ENEMY_42 = 39;
var IMAGE_ENEMY_50 = 40;
var IMAGE_ENEMY_60 = 41;
var IMAGE_ENEMYD_00 = 42;
var IMAGE_ENEMYD_01 = 43;
var IMAGE_ENEMYD_02 = 44;
var IMAGE_ENEMYD_10 = 45;
var IMAGE_ENEMYD_11 = 46;
var IMAGE_ENEMYD_20 = 47;
var IMAGE_ENEMYD_30 = 48;
var IMAGE_ENEMYD_31 = 49;
var IMAGE_ENEMYD_32 = 50;
var IMAGE_ENEMYD_33 = 51;
var IMAGE_ENEMYD_34 = 52;
var IMAGE_ENEMYD_40 = 53;
var IMAGE_ENEMYD_41 = 54;
var IMAGE_ENEMYD_42 = 55;
var IMAGE_ENEMYD_50 = 56;
var IMAGE_ENEMYD_60 = 57;
var IMAGE_JIKI_0 = 58;
var IMAGE_JIKI_1 = 59;
var IMAGE_JIKI_2 = 60;
var IMAGE_JIKI_3 = 61;
var IMAGE_JIKI_4 = 62;
var IMAGE_JIKI_5 = 63;
var IMAGE_JIKI_6 = 64;
var IMAGE_JIKI_7 = 65;
var IMAGE_JIKI_8 = 66;
var IMAGE_JIKI_9 = 67;
var IMAGE_JIKID_0 = 68;
var IMAGE_JIKID_1 = 69;
var IMAGE_JIKID_2 = 70;
var IMAGE_JIKID_3 = 71;
var IMAGE_JIKID_4 = 72;
var IMAGE_JIKID_5 = 73;
var IMAGE_JIKID_6 = 74;
var IMAGE_JIKID_7 = 75;
var IMAGE_JIKID_8 = 76;
var IMAGE_JIKID_9 = 77;
var IMAGE_JIKIM_0 = 78;
var IMAGE_JIKIM_1 = 79;
var IMAGE_JIKIM_2 = 80;
var IMAGE_JIKIM_3 = 81;
var IMAGE_JIKIM_4 = 82;
var IMAGE_JIKIM_5 = 83;
var IMAGE_JIKIM_6 = 84;
var IMAGE_JIKIM_7 = 85;
var IMAGE_JIKIM_8 = 86;
var IMAGE_JIKIM_9 = 87;
var IMAGE_JIKIP_0 = 88;
var IMAGE_JIKIP_1 = 89;
var IMAGE_JIKIP_2 = 90;
var IMAGE_JIKIP_3 = 91;
var IMAGE_JIKIP_4 = 92;
var IMAGE_JIKIP_5 = 93;
var IMAGE_JIKIP_6 = 94;
var IMAGE_JIKIP_7 = 95;
var IMAGE_JIKIP_8 = 96;
var IMAGE_JIKIP_9 = 97;
var IMAGE_LIGHT = 98;
var IMAGE_MASK = 99;
var IMAGE_SHOT = 100;
var IMAGE_NUM = 101;
var g;
var rand;
var _win_x, _win_y;
var wave_data;
var draw_data;
var ring;
var shot;
var jiki_x, jiki_y;
var dsp_x, dsp_y;
var _light_x, _light_y;
var pattern_x, pattern_y;
var _mode;
var _direction;
var _barrier;
var _damage, t_damage, m_damage;
var _life;
var _muteki;
var _img;
var COLOR_C;
var COLOR_M;
var COLOR_Y;
var COLOR_K;
var COLOR_R;
var COLOR_G;
var COLOR_W;
var _FONT_FAMILY = "ＭＳ ゴシック";
var _FONT_TINY = 12;
var _FONT_SMALL = 16;
var _FONT_MEDIUM = 24;
var _FONT_LARGE = 30;
var COS = [ 1358, 1176, 679, 0, -678, -1176, -1358, -1176, -679, 0, 679, 1176 ];
var SIN = [ 0, 678, 1176, 1358, 1176, 678, 0, -679, -1176, -1358, -1176, -679 ];
var state = -1;
var _elapse;
var boost = false;
var map = true;
var quake = 0;
var quake_x, quake_y;
var origin_x, origin_y;
var clip_x, clip_y;
var clip_w, clip_h;
var st_index;
var st_max;
var level;
var level_max;
var score = 0, hi_score;
var bonus = 0;
var old_score;
var bonus_d;
var best_s;
var new_s;
var new_score;
var old_life;
var miss;
var best_t;
var new_t;
var new_record;
var dark;
var main_img;
var main_se;
var sound_id = -1;
var lock_sound = 0;
function play_sound( id ){
 if( main_se[id] != null ){
  if( canUseAudio() ){
   if( id != sound_id ){
    sound_id = id;
    playAudio( main_se[sound_id], false );
   }
  } else if( _USE_AUDIOEX ){
   if( id == 6 ){
    if( lock_sound <= 0 ){
     sound_id = id;
     playAudio( main_se[sound_id], false );
     lock_sound = 3;
    }
   } else {
    if( id != sound_id ){
     sound_id = id;
     playAudio( main_se[sound_id], false );
    }
   }
  }
 }
}
function load_config(){
 var i;
 st_index = 0;
 hi_score = 68000;
 st_max[0] = 0;
 st_max[1] = 0;
 st_max[2] = 0;
 st_max[3] = 0;
 st_max[4] = 0;
 st_max[5] = 0;
 st_max[6] = 0;
 st_max[7] = 0;
 level = 0;
 level_max = 0;
 for( i = 0; i < 6; i++ ){
  best_s[0][i] = 0;
  best_s[1][i] = 0;
  best_s[2][i] = 0;
  best_s[3][i] = 0;
  best_s[4][i] = 0;
  best_s[5][i] = 0;
  best_s[6][i] = 0;
  best_s[7][i] = 0;
  best_t[0][i] = 99999;
  best_t[1][i] = 99999;
  best_t[2][i] = 99999;
  best_t[3][i] = 99999;
  best_t[4][i] = 99999;
  best_t[5][i] = 99999;
  best_t[6][i] = 99999;
  best_t[7][i] = 99999;
 }
 if( canUseCookie() ){
  var str;
  beginCookieRead( "config" );
  str = cookieRead(); if( str.length > 0 ) st_index = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) hi_score = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) st_max[0] = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) level = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) level_max = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) st_max[1] = parseInt( str );
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[0][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[1][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[0][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[1][i] = parseInt( str );
  }
  str = cookieRead(); if( str.length > 0 ) st_max[2] = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) st_max[3] = parseInt( str );
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[2][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[3][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[2][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[3][i] = parseInt( str );
  }
  str = cookieRead(); if( str.length > 0 ) st_max[4] = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) st_max[5] = parseInt( str );
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[4][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[5][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[4][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[5][i] = parseInt( str );
  }
  str = cookieRead(); if( str.length > 0 ) st_max[6] = parseInt( str );
  str = cookieRead(); if( str.length > 0 ) st_max[7] = parseInt( str );
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[6][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_s[7][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[6][i] = parseInt( str );
  }
  for( i = 0; i < 6; i++ ){
   str = cookieRead(); if( str.length > 0 ) best_t[7][i] = parseInt( str );
  }
  endCookieRead();
 }
 if( best_s[0][6 - 1] != 0 ) level_max = 1;
 if( best_s[1][6 - 1] != 0 ) level_max = 2;
 if( best_s[2][6 - 1] != 0 ) level_max = 3;
 if( best_s[3][6 - 1] != 0 ) level_max = 4;
 if( best_s[4][6 - 1] != 0 ) level_max = 5;
 if( best_s[5][6 - 1] != 0 ) level_max = 6;
 if( best_s[6][6 - 1] != 0 ) level_max = 7;
}
function save_config(){
 if( canUseCookie() ){
  var i;
  beginCookieWrite();
  cookieWrite( "" + st_index );
  cookieWrite( "" + hi_score );
  cookieWrite( "" + st_max[0] );
  cookieWrite( "" + level );
  cookieWrite( "" + level_max );
  cookieWrite( "" + st_max[1] );
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[0][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[1][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[0][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[1][i] );
  }
  cookieWrite( "" + st_max[2] );
  cookieWrite( "" + st_max[3] );
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[2][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[3][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[2][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[3][i] );
  }
  cookieWrite( "" + st_max[4] );
  cookieWrite( "" + st_max[5] );
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[4][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[5][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[4][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[5][i] );
  }
  cookieWrite( "" + st_max[6] );
  cookieWrite( "" + st_max[7] );
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[6][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_s[7][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[6][i] );
  }
  for( i = 0; i < 6; i++ ){
   cookieWrite( "" + best_t[7][i] );
  }
  endCookieWrite( "config" );
 }
}
function set_state( new_state ){
 var old_state = state;
 state = new_state;
 _elapse = 0;
 boost = false;
 switch( old_state ){
 case 0:
  if( state == 2 ){
   score = 0;
   bonus = 0;
   jiki_init( true );
  }
  break;
 case 4:
  add_score( bonus ); bonus = 0;
  if( state != 0 ){
   jiki_init( false );
  }
  st_index++; if( st_index > st_max[level] ) st_max[level] = st_index;
  save_config();
  break;
 }
 switch( state ){
 case 0:
  if( st_index >= 6 ) new_level();
  save_config();
  quake = 0;
  break;
 case 2:
  map = true;
  old_life = _DIV( t_damage + (15 - 1), 15 );
  old_score = score;
  bonus = 6800;
  stage_create();
  wave_clear();
  ring.removeAllElements();
  shot.removeAllElements();
  break;
 case 4:
  bonus_d = bonus;
  new_s = (score + bonus_d) - old_score;
  if( new_s > best_s[level][st_index] ){
   new_score = (best_s[level][st_index] == 0) ? false : true;
   best_s[level][st_index] = new_s;
  } else {
   new_score = false;
  }
  miss = _DIV( t_damage + (15 - 1), 15 ) - old_life;
  new_t = (6800 - bonus_d) + 680 * miss;
  if( new_t < best_t[level][st_index] ){
   new_record = (best_t[level][st_index] == 99999) ? false : true;
   best_t[level][st_index] = new_t;
  } else {
   new_record = false;
  }
  break;
 }
}
function setCMYColor( col ){
 switch( col ){
 case 0: g.setColor( COLOR_C ); break;
 case 1: g.setColor( COLOR_M ); break;
 case 2: g.setColor( COLOR_Y ); break;
 }
}
function setOrigin( x, y ){
 origin_x = x;
 origin_y = y;
}
function setClip( x, y, w, h ){
 clip_x = x;
 clip_y = y;
 clip_w = w;
 clip_h = h;
}
function drawImage( img, x0, y0, w, h ){
 x0 -= _win_x;
 y0 -= _win_y;
 if( (x0 + w > clip_x) && (x0 < clip_x + clip_w) && (y0 + h > clip_y) && (y0 < clip_y + clip_h) ){
  x0 += origin_x;
  y0 += origin_y;
  g.drawImage( img, x0, y0 );
  return true;
 }
 return false;
}
function drawScaledImage( img, x0, y0, w, h, sx, sy, sw, sh ){
 x0 -= _win_x;
 y0 -= _win_y;
 x0 += origin_x;
 y0 += origin_y;
 g.drawScaledImage( img, x0, y0, w, h, sx, sy, sw, sh );
}
function drawLine( x0, y0, x1, y1 ){
 x0 -= _win_x;
 y0 -= _win_y;
 x1 -= _win_x;
 y1 -= _win_y;
 if(
  ((x0 > clip_x) && (x0 < clip_x + clip_w) && (y0 > clip_y) && (y0 < clip_y + clip_h)) ||
  ((x1 > clip_x) && (x1 < clip_x + clip_w) && (y1 > clip_y) && (y1 < clip_y + clip_h))
 ){
  x0 += origin_x;
  y0 += origin_y;
  x1 += origin_x;
  y1 += origin_y;
  g.drawLine( x0, y0, x1, y1 );
 }
}
function drawRect( x, y, w, h ){
 x -= _win_x;
 y -= _win_y;
 if( (x + w > clip_x) && (x < clip_x + clip_w) && (y + h > clip_y) && (y < clip_y + clip_h) ){
  x += origin_x;
  y += origin_y;
  g.drawRect( x, y, w, h );
 }
}
function frameTime(){ return (state == -1) ? 0 : 80; }
var IMAGE = [
 "back1.png",
 "back5.png",
 "baku.png",
 "base0.png",
 "base1.png",
 "base2.png",
 "base3.png",
 "base4.png",
 "base5.png",
 "enemy/00.png",
 "enemy/01.png",
 "enemy/02.png",
 "enemy/03.png",
 "enemy/10.png",
 "enemy/11.png",
 "enemy/12.png",
 "enemy/13.png",
 "enemy/20.png",
 "enemy/21.png",
 "enemy/22.png",
 "enemy/23.png",
 "enemy/24.png",
 "enemy/25.png",
 "enemy/26.png",
 "enemy/27.png",
 "enemy/28.png",
 "enemy/29.png",
 "enemy/30.png",
 "enemy/31.png",
 "enemy/32.png",
 "enemy/33.png",
 "enemy/34.png",
 "enemy/35.png",
 "enemy/36.png",
 "enemy/37.png",
 "enemy/38.png",
 "enemy/39.png",
 "enemy/40.png",
 "enemy/41.png",
 "enemy/42.png",
 "enemy/50.png",
 "enemy/60.png",
 "enemyd/00.png",
 "enemyd/01.png",
 "enemyd/02.png",
 "enemyd/10.png",
 "enemyd/11.png",
 "enemyd/20.png",
 "enemyd/30.png",
 "enemyd/31.png",
 "enemyd/32.png",
 "enemyd/33.png",
 "enemyd/34.png",
 "enemyd/40.png",
 "enemyd/41.png",
 "enemyd/42.png",
 "enemyd/50.png",
 "enemyd/60.png",
 "jiki/0.png",
 "jiki/1.png",
 "jiki/2.png",
 "jiki/3.png",
 "jiki/4.png",
 "jiki/5.png",
 "jiki/6.png",
 "jiki/7.png",
 "jiki/8.png",
 "jiki/9.png",
 "jikid/0.png",
 "jikid/1.png",
 "jikid/2.png",
 "jikid/3.png",
 "jikid/4.png",
 "jikid/5.png",
 "jikid/6.png",
 "jikid/7.png",
 "jikid/8.png",
 "jikid/9.png",
 "jikim/0.png",
 "jikim/1.png",
 "jikim/2.png",
 "jikim/3.png",
 "jikim/4.png",
 "jikim/5.png",
 "jikim/6.png",
 "jikim/7.png",
 "jikim/8.png",
 "jikim/9.png",
 "jikip/0.png",
 "jikip/1.png",
 "jikip/2.png",
 "jikip/3.png",
 "jikip/4.png",
 "jikip/5.png",
 "jikip/6.png",
 "jikip/7.png",
 "jikip/8.png",
 "jikip/9.png",
 "light.png",
 "mask.png",
 "shot.png"
];
var load_cnt;
function start(){
 setCurrent( "canvas0" );
 g = new _ScalableGraphics();
 setGraphics( g );
 document.getElementById( "div0" ).innerHTML = "canvas : " + (canUseCanvas() ? "true" : "false");
 document.getElementById( "div1" ).innerHTML = "text : " + (g.canUseText() ? "true" : "false");
 document.getElementById( "div2" ).innerHTML = "audio : " + (canUseAudio() ? "true" : "false");
 document.getElementById( "div3" ).innerHTML = "audio/mp3 : " + (canPlayType( "audio/mp3" ) ? "true" : "false");
 document.getElementById( "div4" ).innerHTML = "audio/wav : " + (canPlayType( "audio/wav" ) ? "true" : "false");
 g.setScale( 2.0 );
 g.setStrokeWidth( 1.0 );
 var i;
 origin_x = 0;
 origin_y = 0;
 COLOR_C = g.getColorOfRGB( 0, 255, 255 );
 COLOR_M = g.getColorOfRGB( 255, 0, 255 );
 COLOR_Y = g.getColorOfRGB( 255, 255, 0 );
 COLOR_K = g.getColorOfRGB( 0, 0, 0 );
 COLOR_R = g.getColorOfRGB( 255, 0, 0 );
 COLOR_G = g.getColorOfRGB( 0, 255, 0 );
 COLOR_W = g.getColorOfRGB( 255, 255, 255 );
 set_state( -1 );
 st_max = new Array( 8 );
 best_s = new Array( 8 );
 best_t = new Array( 8 );
 for( i = 0; i < 8; i++ ){
  best_s[i] = new Array( 6 );
  best_t[i] = new Array( 6 );
 }
 rand = new _Random();
 stage_init();
 wave_data = new Array( 18 );
 for( i = 0; i < 18; i++ ){
  wave_data[i] = new Array( 18 );
 }
 draw_data = new Array( 18 );
 for( i = 0; i < 18; i++ ){
  draw_data[i] = new Array( 18 );
 }
 ring = new _Vector( 128 );
 shot = new _Vector( 128 );
 main_img = new Array( IMAGE_NUM );
 load_cnt = -1;
 main_se = new Array( 9 );
 for( i = 0; i < 9; i++ ){
  main_se[i] = null;
 }
 if( canUseAudio() ){
  if( canPlayType( "audio/mp3" ) ){
   main_se[0] = loadAudio( "res/mp3/cursor22.mp3" );
   main_se[1] = loadAudio( "res/mp3/cursor07.mp3" );
   main_se[2] = loadAudio( "res/mp3/byoro01_a.mp3" );
   main_se[3] = loadAudio( "res/mp3/bom16.mp3" );
   main_se[4] = loadAudio( "res/mp3/shoot08.mp3" );
   main_se[5] = loadAudio( "res/mp3/gun30.mp3" );
   main_se[6] = loadAudio( "res/mp3/cursor35.mp3" );
   main_se[7] = loadAudio( "res/mp3/noise05.mp3" );
   main_se[8] = loadAudio( "res/mp3/tm2_gun005_minigunlp1.mp3" );
  } else if( canPlayType( "audio/wav" ) ){
   main_se[0] = loadAudio( "res/wav/cursor22.wav" );
   main_se[1] = loadAudio( "res/wav/cursor07.wav" );
   main_se[2] = loadAudio( "res/wav/byoro01_a.wav" );
   main_se[3] = loadAudio( "res/wav/bom16.wav" );
   main_se[4] = loadAudio( "res/wav/shoot08.wav" );
   main_se[5] = loadAudio( "res/wav/gun30.wav" );
   main_se[6] = loadAudio( "res/wav/cursor35.wav" );
   main_se[7] = loadAudio( "res/wav/noise05.wav" );
   main_se[8] = loadAudio( "res/wav/tm2_gun005_minigunlp1.wav" );
  }
 } else if( _USE_AUDIOEX ){
  main_se[0] = loadAudio( "res/wav/cursor22.wav" );
  main_se[1] = loadAudio( "res/wav/cursor07.wav" );
  main_se[2] = loadAudio( "res/wav/byoro01_a.wav" );
  main_se[3] = loadAudio( "res/wav/bom16.wav" );
  main_se[4] = loadAudio( "res/wav/shoot08.wav" );
  main_se[5] = loadAudio( "res/wav/gun30.wav" );
  main_se[6] = loadAudio( "res/wav/cursor35.wav" );
  main_se[7] = loadAudio( "res/wav/noise05.wav" );
 }
 m_damage = 15 * 10;
 jiki_init( true );
 load_config();
 stage_create();
 return true;
}
function add_score( point ){ score += point; if( score > hi_score ) hi_score = score; }
function add_bonus( point ){ add_score( point ); bonus -= point; }
function st_update(){ if( st_index > st_max[level] ) st_index = st_max[level]; }
function new_level(){
 level++; if( level > 7 ) level = 0;
 if( level > level_max ) level_max = level;
 st_index = 0;
}
function centerDrawString( str, type, y ){
 g.setFont( type, _FONT_FAMILY );
 g.drawString( str,
  _DIV( 240 - g.stringWidth( str ), 2 ),
  y + _DIV( g.fontHeight(), 2 )
  );
}
function drawStatusSub( str, x, y ){
 g.setFont( _FONT_SMALL, _FONT_FAMILY );
 g.drawString( str, x - g.stringWidth( str ), y );
}
function drawStage( title ){
 g.setColor( COLOR_K );
 g.fillRect( 0, 0, 240, 240 );
 setOrigin( 12, 12 );
 setClip( 0, 0, 216, 216 );
 stage_draw( title );
}
function drawStatus( title ){
 var y, y2, h, h2;
 if( title || !dark ){
  g.drawImage( main_img[IMAGE_MASK], 0, 0 );
 }
 if( quake > 0 ){
  setOrigin( quake_x, quake_y );
 } else {
  setOrigin( 0, 0 );
 }
 if( title ){
  y = 0;
  h = 25;
 } else {
  h = 25;
  y = ((jiki_y - _win_y) < (120 - 24)) ? (240 - 25) : 0;
 }
 g.setFont( _FONT_SMALL, _FONT_FAMILY );
 var h3 = g.fontHeight();
 y2 = (y == 0) ? h : y + h3;
 g.setColor( COLOR_W );
 g.drawString( (h3 > 16) ? "SC" : "SCORE", 0, y2 );
 drawStatusSub( "" + score, 100, y2 );
 g.setColor( COLOR_M );
 g.drawString( "HI", 106, y2 );
 drawStatusSub( "" + hi_score, 184, y2 );
 g.setColor( boost ? COLOR_Y : COLOR_W );
 g.drawString( "T", 190, y2 );
 drawStatusSub( "" + bonus, 239, y2 );
 if( y == 0 ){
  y2 = 0;
  h2 = h - h3;
 } else {
  y2 = h3;
  h2 = h - y2;
 }
 var w = _DIV( 240 * t_damage, m_damage );
 if ( w < 100 ){ g.setColor( COLOR_G ); }
 else if( w < 200 ){ g.setColor( COLOR_Y ); }
 else { g.setColor( COLOR_R ); }
 g.fillRect( 0, y + y2, w, h2 );
 g.drawRect( 0, y + y2, 239, h2 - 1 );
 if( !title && map ){
  var map_x;
  var map_y;
  map_x = ((jiki_x - _win_x) < 96) ? (240 - 64) : 0;
  if( y == 0 ){
   map_y = h;
  } else if( y == 240 ){
   map_y = ((jiki_y - _win_y) < 96) ? (240 - 64) : 0;
  } else {
   map_y = y - 64;
  }
  stage_draw_map( map_x, map_y );
 }
 if( quake > 0 ){
  setOrigin( 0, 0 );
 }
}
function paint(){
 sound_id = -1;
 if( !canUseAudio() ){
  lock_sound--;
 }
 var key = getKeypadState();
 if( quake > 0 ){
  quake_x = rand.next( _DIV( quake + 2, 3 ) );
  quake_y = rand.next( _DIV( quake + 2, 3 ) );
 }
 switch( state ){
 case -1:
  g.setColor( COLOR_K );
  g.fillRect( 0, 0, 240, 240 );
  g.setColor( COLOR_W );
  centerDrawString( "NOW LOADING...", _FONT_SMALL, 110 );
  if( !isImageBusy() ){
   load_cnt++;
   if( load_cnt >= IMAGE_NUM ){
    set_state( 0 );
   } else {
    main_img[load_cnt] = loadImage( "res/" + IMAGE[load_cnt] );
   }
  }
  g.setColor( COLOR_W );
  g.drawRect( 50, 130, 140, 5 );
  g.fillRect( 50, 130, 140 * load_cnt / IMAGE_NUM, 5 );
  break;
 case 0:
  drawStage( true );
  drawStatus( true );
  setCMYColor( _MOD( _elapse, 3 ) );
  centerDrawString( "TANK BARRIER", _FONT_MEDIUM, 50 );
  switch( level ){
  case 0:
  case 1:
   g.setColor( COLOR_W );
   break;
  case 2:
  case 3:
   g.setColor( COLOR_C );
   break;
  case 4:
  case 5:
   g.setColor( COLOR_M );
   break;
  case 6:
  case 7:
   g.setColor( COLOR_Y );
   break;
  }
  if( _MOD( level, 2 ) == 0 ){
   centerDrawString( "LEVEL EASY", _FONT_SMALL, 90 );
  } else {
   centerDrawString( "LEVEL HARD", _FONT_SMALL, 90 );
  }
  centerDrawString(
   "STAGE " + ((st_index < 9) ? "0" : "") + (st_index + 1),
   _FONT_SMALL,
   115
   );
  g.setColor( COLOR_Y );
  g.drawString( "BEST SCORE ", 145 - g.stringWidth( "BEST SCORE " ), 150 );
  if( best_s[level][st_index] == 0 ){
   g.drawString( "---", 145, 150 );
  } else {
   g.drawString(
    "" + best_s[level][st_index],
    145,
    150
    );
  }
  g.drawString( "BEST TIME ", 145 - g.stringWidth( "BEST TIME " ), 170 );
  if( best_t[level][st_index] == 99999 ){
   g.drawString( "---", 145, 170 );
  } else {
   g.drawString(
    "" + best_t[level][st_index],
    145,
    170
    );
  }
  g.setColor( COLOR_W );
  if(
   ((key & keyBit( 48 )) != 0) ||
   ((key & keyBit( 53 )) != 0) ||
   ((key & keyBit( 90 )) != 0) ||
   ((key & keyBit( 88 )) != 0) ||
   ((key & keyBit( 67 )) != 0)
  ){
   centerDrawString( "LOADING...", _FONT_SMALL, 190 );
  } else {
   if( _MOD( _elapse, 15 ) <= _DIV( 15, 2 ) ){
    centerDrawString( "PRESS [0] OR [5] KEY", _FONT_SMALL, 190 );
   }
  }
  centerDrawString( "COPYRIGHT (C) SatisKia", _FONT_TINY, 220 );
  if(
   ((key & keyBit( 48 )) != 0) ||
   ((key & keyBit( 53 )) != 0) ||
   ((key & keyBit( 90 )) != 0) ||
   ((key & keyBit( 88 )) != 0) ||
   ((key & keyBit( 67 )) != 0)
  ){
   set_state( 2 );
  }
  break;
 case 2:
  drawStage( false );
  jiki_draw( false );
  drawStatus( false );
  g.setColor( COLOR_W );
  centerDrawString(
   "STAGE " + ((st_index < 9) ? "0" : "") + (st_index + 1),
   _FONT_SMALL,
   115
   );
  centerDrawString( "R E A D Y", _FONT_SMALL, 135 );
  if( _elapse > 30 ){
   set_state( 3 );
  }
  break;
 case 3:
  if( (level < 2) || (level > 3) ){
   boost = (
    ((key & keyBit( 53 )) != 0) ||
    ((key & keyBit( 90 )) != 0) ||
    ((key & keyBit( 88 )) != 0) ||
    ((key & keyBit( 67 )) != 0)
    ) ? true : false;
  }
  if( bonus > 0 ){
   bonus -= (boost ? 2 : 1); if( bonus < 0 ) bonus = 0;
  }
  stage_update( false );
  wave_update();
  shots_update();
  if ( ((key & keyBit( 56 )) != 0) || ((key & keyBit( 40 )) != 0) ) jiki_down ();
  else if( ((key & keyBit( 52 )) != 0) || ((key & keyBit( 37 )) != 0) ) jiki_left ();
  else if( ((key & keyBit( 54 )) != 0) || ((key & keyBit( 39 )) != 0) ) jiki_right();
  else if( ((key & keyBit( 50 )) != 0) || ((key & keyBit( 38 )) != 0) ) jiki_up ();
  else jiki_inertia();
  if( wave_hit() || shots_hit() || stage_spear() ){
   if( _muteki <= 0 ){
    if( _damage == 0 ) _damage++;
   }
  }
  drawStage( false );
   wave_draw();
  jiki_draw();
  shots_draw();
  stage_attack();
  drawStatus( false );
  if( _elapse < 30 ){
   g.setColor( COLOR_W );
   centerDrawString( "S T A R T !", _FONT_SMALL, 125 );
  }
  if( stage_destroyed() ){
   set_state( 4 );
  } else if( t_damage >= m_damage ){
   set_state( 5 );
  }
  break;
 case 4:
  if( _MOD( bonus, 200 ) > 0 ){
   add_bonus( _MOD( bonus, 200 ) );
   _elapse = 0;
  } else if( bonus >= 200 ){
   add_bonus( 200 );
   _elapse = 0;
  }
  stage_update( true );
  drawStage( false );
  jiki_draw( false );
  drawStatus( false );
  g.setColor( COLOR_W );
  {
   centerDrawString( "C L E A R !", _FONT_SMALL, 105 );
   var str = ((g.fontHeight() > 16) ? "SC " : "SCORE ") + new_s;
   if( bonus_d > 0 ){
    str = str + "(BONUS " + bonus_d + ")";
   }
   if( new_score ){
    str = str + " UP!";
   }
   centerDrawString( str, _FONT_SMALL, 125 );
   str = "TIME " + new_t;
   if( miss > 0 ){
    str = str + "(MISS " + miss + ")";
   }
   if( new_record ){
    str = str + " UP!";
   }
   centerDrawString( str, _FONT_SMALL, 145 );
  }
  if( _elapse > 30 ){
   set_state( 2 );
  }
  break;
 case 5:
  stage_update( false );
  if( _MOD( _elapse, 4 ) == 0 ){
   wave_update();
  }
  shots_update();
  drawStage( false );
   wave_draw();
  jiki_draw( false );
  shots_draw();
  drawStatus( false );
  g.setColor( COLOR_W );
  centerDrawString( "G A M E  O V E R", _FONT_SMALL, 125 );
  if( _elapse > 60 ){
   set_state( 0 );
  }
  break;
 }
 _elapse++;
 if( quake > 0 ) quake--;
}
function processEvent( type, param ){
 switch( type ){
 case 4:
  switch( state ){
  case -1:
   break;
  case 0:
   {
    var old_level = level;
    var old_st_index = st_index;
    switch( param ){
    case 50:
    case 38:
     level--; if( level < 0 ) level = 0;
     st_update();
     if( level != old_level ){
play_sound( 0 );
     }
     break;
    case 56:
    case 40:
     level++; if( level > level_max ) level = level_max;
     st_update();
     if( level != old_level ){
play_sound( 0 );
     }
     break;
    case 52:
    case 37:
     st_index--; if( st_index < 0 ) st_index = 0;
     if( st_index != old_st_index ){
play_sound( 0 );
     }
     break;
    case 54:
    case 39:
     st_index++; if( st_index >= 6 ) st_index = 6 - 1;
     st_update();
     if( st_index != old_st_index ){
play_sound( 0 );
     }
     break;
    }
   }
   break;
  default:
   switch( param ){
   case 49:
   case 17:
    map = map ? false : true;
    break;
   case 51:
   case 32:
    set_state( 0 );
    break;
   case 90:
    _barrier = 0;
    break;
   case 88:
    _barrier = 1;
    break;
   case 67:
    _barrier = 2;
    break;
   }
   break;
  }
  break;
 }
}
function shots_update(){
 var i;
 var tmp;
 for( i = shot.size() - 1; i >= 0; i-- ){
  tmp = shot.elementAt( i );
  tmp.update();
  var x = tmp._x;
  var y = tmp._y;
  if( x <= -12 || x >= 960 || y <= -12 || y >= 960 ){
   shot.removeElementAt( i );
  } else if( _DIV( base_data[_DIV( _DIV( x + 6, 12 ), 2 )][_DIV( _DIV( y + 6, 12 ), 2 )], base ) == 4 ){
   shot.removeElementAt( i );
  }
 }
}
function shots_hit(){
 var i;
 var _hit = false;
 var x = jiki_x + 6;
 var y = jiki_y + 6;
 var tmp;
 for( i = shot.size() - 1; i >= 0; i-- ){
  tmp = shot.elementAt( i );
  if( (Math.abs( tmp._x - x ) < 12) && (Math.abs( tmp._y - y ) < 12) ){
   _hit = true;
   shot.removeElementAt( i );
  }
 }
 return _hit;
}
function shots_draw(){
 var i;
 var tmp;
 for( i = shot.size() - 1; i >= 0; i-- ){
  tmp = shot.elementAt( i );
  drawImage( main_img[IMAGE_SHOT], tmp._x + 1, tmp._y + 1, 10, 10 );
 }
}
function wave_put12( x0, y0, x1, y1, col ){
 var x2 = x1 - _DIV( _win_x, 12 );
 var y2 = y1 - _DIV( _win_y, 12 );
 if( x2 < 0 || x2 >= 18 || y2 < 0 || y2 >= 18 ) return false;
 if( stage_kabe12l( x0, y0, x1, y1 ) ) return false;
 wave_data[x2][y2] = col;
 return true;
}
function wave_clear(){
 var i, j;
 for( i = 0; i < 18; i++ ){
  for( j = 0; j < 18; j++ ){
   wave_data[i][j] = -1;
  }
 }
}
function wave_update(){
 var i, j;
 var tmp;
 wave_clear();
 for( i = ring.size() - 1; i >= 0; i-- ){
  tmp = ring.elementAt( i );
  if( _MOD( _elapse, 4 ) == 0 ){
   tmp.update();
  }
  var ret = false;
  var x0 = tmp._x;
  var y0 = tmp._y;
  var r = tmp._elapse;
  var col = tmp._col;
  var x = r;
  var y = 0;
  var f = -2 * r + 3;
  while( x >= y ){
   if( wave_put12( x0, y0, x0 + x, y0 + y, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 - x, y0 + y, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 + x, y0 - y, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 - x, y0 - y, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 + y, y0 + x, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 - y, y0 + x, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 + y, y0 - x, col ) ) ret = true;
   if( wave_put12( x0, y0, x0 - y, y0 - x, col ) ) ret = true;
   if( f >= 0 ){
    x--;
    f -= 4 * x;
   }
   y++;
   f += 4 * y + 2;
  }
  if( r > 113 ){
   if( ret == false ){
    ring.removeElementAt( i );
   }
  }
 }
 for( j = 1; j < 17; j++ ){
  for( i = 1; i < 17; i++ ){
   if( wave_data[i][j] >= 0 ){
    if(
     (wave_data[i - 1][j - 1] != wave_data[i][j]) &&
     (wave_data[i ][j - 1] != wave_data[i][j]) &&
     (wave_data[i + 1][j - 1] != wave_data[i][j]) &&
     (wave_data[i - 1][j ] != wave_data[i][j]) &&
     (wave_data[i + 1][j ] != wave_data[i][j]) &&
     (wave_data[i - 1][j + 1] != wave_data[i][j]) &&
     (wave_data[i ][j + 1] != wave_data[i][j]) &&
     (wave_data[i + 1][j + 1] != wave_data[i][j])
    ){
     wave_data[i][j] = -1;
    }
   }
  }
 }
}
function wave_hit(){
 var x = _DIV( jiki_x + 6, 12 );
 var y = _DIV( jiki_y + 6, 12 );
 x -= _DIV( _win_x, 12 );
 y -= _DIV( _win_y, 12 );
 if( (wave_data[x ][y ] >= 0) && (wave_data[x ][y ] != _barrier) ) return true;
 if( (wave_data[x + 1][y ] >= 0) && (wave_data[x + 1][y ] != _barrier) ) return true;
 if( (wave_data[x ][y + 1] >= 0) && (wave_data[x ][y + 1] != _barrier) ) return true;
 if( (wave_data[x + 1][y + 1] >= 0) && (wave_data[x + 1][y + 1] != _barrier) ) return true;
 return false;
}
function wave_draw(){
 var i, j, k, x, y;
 var xx = origin_x - _MOD( _win_x, 12 );
 var yy = origin_y - _MOD( _win_y, 12 );
 g.setAlpha( 192 );
 for( j = 0; j < 18; j++ ){
  y = j * 12;
  for( i = 0; i < 18; ){
   if( wave_data[i][j] >= 0 ){
    for( k = i + 1; k < 18; k++ ){
     if( wave_data[k][j] != wave_data[i][j] ) break;
    }
    if( k - i > 1 ){
     setCMYColor( wave_data[i][j] );
     g.fillRect( i * 12 + xx, y + yy, 12 * (k - i), 12 );
     for( ; i < k; i++ ){
      draw_data[i][j] = -1;
     }
    } else {
     draw_data[i][j] = wave_data[i][j];
     i++;
    }
   } else {
    draw_data[i][j] = -1;
    i++;
   }
  }
 }
 for( i = 0; i < 18; i++ ){
  x = i * 12;
  for( j = 0; j < 18; ){
   if( draw_data[i][j] >= 0 ){
    for( k = j + 1; k < 18; k++ ){
     if( draw_data[i][k] != draw_data[i][j] ) break;
    }
    if( k - j > 1 ){
     setCMYColor( draw_data[i][j] );
     g.fillRect( x + xx, j * 12 + yy, 12, 12 * (k - j) );
     for( ; j < k; j++ ){
      draw_data[i][j] = -1;
     }
    } else {
     j++;
    }
   } else {
    j++;
   }
  }
 }
 for( j = 0; j < 18; j++ ){
  y = j * 12;
  for( i = 0; i < 18; i++ ){
   if( draw_data[i][j] >= 0 ){
    setCMYColor( draw_data[i][j] );
    g.fillRect( i * 12 + xx, y + yy, 12, 12 );
   }
  }
 }
 g.setAlpha( 255 );
}
function jiki_load_image(){
 switch( level ){
 case 0:
 case 1:
  _img = IMAGE_JIKI_0;
  break;
 case 2:
 case 3:
  _img = IMAGE_JIKIP_0;
  break;
 case 4:
 case 5:
  _img = IMAGE_JIKIM_0;
  break;
 case 6:
 case 7:
  _img = IMAGE_JIKID_0;
  break;
 }
}
function jiki_init( start ){
 if( start ){
  _life = 10;
 } else {
  _life++;
  if( _life <= 0 ) _life = 1;
  if( _life > 10 ) _life = 10;
 }
 t_damage = m_damage - (_life * 15);
 jiki_x = 468;
 jiki_y = 924;
 pattern_x = 0;
 pattern_y = 0;
 _mode = 0;
 _direction = 3;
 jiki_set_dsp();
 jiki_set_light( true );
 _barrier = 0;
 _damage = 0;
 _muteki = 0;
}
function jiki_set_dsp(){
 dsp_x = jiki_x;
 dsp_y = jiki_y;
 if( _mode == 1 ){
  dsp_x += rand.next( 3 );
  dsp_y += rand.next( 3 );
play_sound( 8 );
 }
}
function jiki_set_light( force ){
 if( dark || force ){
  _light_x = dsp_x - 48;
  _light_y = dsp_y - 48;
  switch( _direction ){
  case 0: _light_y += 36; break;
  case 1: _light_x -= 36; break;
  case 2: _light_x += 36; break;
  case 3: _light_y -= 36; break;
  }
 }
}
function jiki_down(){
 if( _damage > 0 ) return;
 _direction = 0;
 var old_y = jiki_y;
 switch( _mode ){
 case 0 : jiki_y += 8; break;
 case 1 : jiki_y += 4; break;
 case 2: jiki_y += 8; break;
 }
 _mode = stage_hit( jiki_x, jiki_y );
 if( _mode == 4 ){
  jiki_y = old_y + 4;
  _mode = stage_hit( jiki_x, jiki_y );
  if( _mode == 4 ){
   jiki_y = old_y;
  }
 }
 jiki_set_dsp();
 jiki_set_light( false );
 pattern_x--; if( pattern_x < 0 ) pattern_x = 0;
 pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
 if( _mode != 2 ){
play_sound( 8 );
 }
}
function jiki_left(){
 if( _damage > 0 ) return;
 _direction = 1;
 var old_x = jiki_x;
 switch( _mode ){
 case 0 : jiki_x -= 8; break;
 case 1 : jiki_x -= 4; break;
 case 2: jiki_x -= 8; break;
 }
 _mode = stage_hit( jiki_x, jiki_y );
 if( _mode == 4 ){
  jiki_x = old_x - 4;
  _mode = stage_hit( jiki_x, jiki_y );
  if( _mode == 4 ){
   jiki_x = old_x;
  }
 }
 jiki_set_dsp();
 jiki_set_light( false );
 pattern_x++; if( pattern_x > 4 ) pattern_x = 4;
 pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
 if( _mode != 2 ){
play_sound( 8 );
 }
}
function jiki_right(){
 if( _damage > 0 ) return;
 _direction = 2;
 var old_x = jiki_x;
 switch( _mode ){
 case 0 : jiki_x += 8; break;
 case 1 : jiki_x += 4; break;
 case 2: jiki_x += 8; break;
 }
 _mode = stage_hit( jiki_x, jiki_y );
 if( _mode == 4 ){
  jiki_x = old_x + 4;
  _mode = stage_hit( jiki_x, jiki_y );
  if( _mode == 4 ){
   jiki_x = old_x;
  }
 }
 jiki_set_dsp();
 jiki_set_light( false );
 pattern_x++; if( pattern_x > 4 ) pattern_x = 4;
 pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
 if( _mode != 2 ){
play_sound( 8 );
 }
}
function jiki_up(){
 if( _damage > 0 ) return;
 _direction = 3;
 var old_y = jiki_y;
 switch( _mode ){
 case 0 : jiki_y -= 8; break;
 case 1 : jiki_y -= 4; break;
 case 2: jiki_y -= 8; break;
 }
 _mode = stage_hit( jiki_x, jiki_y );
 if( _mode == 4 ){
  jiki_y = old_y - 4;
  _mode = stage_hit( jiki_x, jiki_y );
  if( _mode == 4 ){
   jiki_y = old_y;
  }
 }
 jiki_set_dsp();
 jiki_set_light( false );
 pattern_x--; if( pattern_x < 0 ) pattern_x = 0;
 pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
 if( _mode != 2 ){
play_sound( 8 );
 }
}
function jiki_inertia(){
 if( _mode == 2 ){
  switch( _direction ){
  case 0: jiki_down (); break;
  case 1: jiki_left (); break;
  case 2: jiki_right(); break;
  case 3: jiki_up (); break;
  }
 }
}
function jiki_draw(){
 var i;
 if( _damage > 0 ){
  if( _life > 0 ){
   drawImage( main_img[_img + pattern_y * 5 + pattern_x], dsp_x, dsp_y, 26, 26 );
   g.setColor( COLOR_W );
   for( i = 0; i < 3; i++ ){
    drawLine(
     dsp_x + 12 + rand.next( 13 ),
     dsp_y + 12 + rand.next( 13 ),
     dsp_x + 12 + rand.next( 13 ),
     dsp_y + 12 + rand.next( 13 )
     );
   }
   if( _damage == 1 ){
play_sound( 7 );
   }
   _damage++;
   t_damage++;
   if( _damage > 15 ){
    _damage = 0;
    _life--;
    if( _life == 0 ){
     if( _muteki <= 0 ){
      if( _damage == 0 ) _damage++;
     }
    } else {
     _muteki = 30;
    }
   }
  } else {
   stage_baku( dsp_x, dsp_y, 99, _damage );
   _damage++;
  }
  return;
 }
 if( _muteki > 0 ){
  _muteki--;
  if( _MOD( _muteki, 2 ) > 0 ){
   drawImage( main_img[_img + pattern_y * 5 + pattern_x], dsp_x, dsp_y, 26, 26 );
  }
 } else {
  drawImage( main_img[_img + pattern_y * 5 + pattern_x], dsp_x, dsp_y, 26, 26 );
 }
 setCMYColor( _barrier );
 drawRect(
  jiki_x - 2 + rand.next( 3 ),
  jiki_y - 2 + rand.next( 3 ),
  26,
  26
  );
}
function error(){
 launch( "error.html" );
}
