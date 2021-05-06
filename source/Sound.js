import {
	AudioListener,
	Audio
} from "three";
import { Utility } from "Utility";

let listener = null;


let Sound = {
	Init: null,
	Play: null
};


Sound.Init = Utility.Once( () => listener = new AudioListener() );

Sound.Play = ( () => {
	
	const cache = {};
	
	return ( buffer, loop = false, volume = 1 ) => ( cache[ buffer.Name ] )
		? ( !cache[ buffer.Name ].isPlaying ) && ( cache[ buffer.Name ].play() )
		: (
			
			cache[ buffer.Name ] = new Audio( listener ),
			cache[ buffer.Name ].setBuffer( buffer ),
			cache[ buffer.Name ].setLoop( loop ),
			cache[ buffer.Name ].setVolume( volume ),
			cache[ buffer.Name ].play()
		);
})();


Sound = Object.freeze( Sound );

export { Sound };
