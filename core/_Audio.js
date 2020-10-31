/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

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

#define _AUDIO_STATE_STOP	0
#define _AUDIO_STATE_PLAY	1
#define _AUDIO_STATE_PAUSE	2

function __Audio(){
	this.element = null;
	this.state = _AUDIO_STATE_STOP;
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
		audio.state = _AUDIO_STATE_PLAY;
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
	if( (audio != null) && (audio.state != _AUDIO_STATE_STOP) ){
		try {
			if( audio.state == _AUDIO_STATE_PAUSE ){
				audio.element.currentTime = 0;
			} else if( (audio.state == _AUDIO_STATE_PLAY) && !audio.element.ended ){
				audio.element.pause();
				audio.element.currentTime = 0;
			}
		} catch( e ){}
		audio.state = _AUDIO_STATE_STOP;
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
		if( audio.state == _AUDIO_STATE_PLAY ){
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
			audio.state = _AUDIO_STATE_PLAY;
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
	if( (audio != null) && (audio.state == _AUDIO_STATE_PLAY) ){
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
	if( (audio != null) && (audio.state == _AUDIO_STATE_PLAY) ){
		try {
			if( !audio.element.ended ){
				audio.element.pause();
				audio.state = _AUDIO_STATE_PAUSE;
			}
		} catch( e ){}
	}
}

function restartAudio( audio ){
	if( _useAudioEx() ){
		return;
	}
	if( (audio != null) && (audio.state == _AUDIO_STATE_PAUSE) ){
		try {
			audio.element.play();
			audio.state = _AUDIO_STATE_PLAY;
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
	if( (audio != null) && (audio.id == id) && (audio.state == _AUDIO_STATE_PLAY) ){
		playAudioSprite( audio, startTime, duration, true );
	}
}
function _pauseAudioSprite( audio, id ){
	if( (audio != null) && (audio.id == id) && (audio.state == _AUDIO_STATE_PLAY) ){
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
			if( audio.state != _AUDIO_STATE_STOP ){
				try {
					if( audio.state == _AUDIO_STATE_PAUSE ){
						audio.element.currentTime = currentTime;
						setCurrentTime = true;
					} else if( (audio.state == _AUDIO_STATE_PLAY) && !audio.element.ended ){
						audio.element.pause();
						audio.element.currentTime = currentTime;
						setCurrentTime = true;
					}
				} catch( e ){}
			}

			audio.element.loop = false;
			audio.element.play();
			audio.state = _AUDIO_STATE_PLAY;

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

//function audioExElement(){ return "audio"; }
