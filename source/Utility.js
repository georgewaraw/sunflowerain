import {
	FontLoader,
	TextureLoader,
	AudioLoader
} from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { animate } from "popmotion";


let Utility = {
	Once: null,
	Times: null,
	Random: null,
	Model: null,
	Font: null,
	Texture: null,
	Sound: null,
	Animate: null
};


Utility.Once = ( callback ) => {
	
	let done = false;
	
	return function () {
		
		return ( !done ) && (
			
			done = true,
			
			callback.apply( this, arguments )
		);
	};
};

Utility.Times = ( number, callback ) => [ ...Array( number ) ].map( callback );

Utility.Random = ( from, to = void( 0 ) ) => (
	
	( typeof( to ) === "undefined" ) && (
		
		to = from,
		from = 0
	),
	
	Math.floor( Math.random() * ( to - from ) + from ) // RETURN
);

Utility.Model = ( () => {
	
	const cache = {};
	const loader = new STLLoader();
	
	return ( name ) => cache[ name ] = cache[ name ] || new Promise( ( model ) => loader.load( `build/assets/${ name }.stl`, model ) );
})();

Utility.Font = ( () => {
	
	const cache = {};
	const loader = new FontLoader();
	
	return ( name ) => cache[ name ] = cache[ name ] || new Promise( ( font ) => loader.load( `build/assets/${ name }.json`, font ) );
})();

Utility.Texture = ( () => {
	
	const cache = {};
	const loader = new TextureLoader();
	
	return ( name ) => cache[ name ] = cache[ name ] || loader.load( `build/assets/${ name }.jpg` );
})();

Utility.Sound = ( () => {
	
	const cache = {};
	const loader = new AudioLoader();
	
	return ( name ) => cache[ name ] = cache[ name ] || new Promise( ( buffer ) => loader.load( `build/assets/${ name }.mp3`, buffer ) );
})();

Utility.Animate = ( from, to, duration, onUpdate, onComplete = () => {}, type = "spring" ) => animate({
	from,
	to,
	duration,
	onUpdate,
	onComplete,
	type
});


Utility = Object.freeze( Utility );

export { Utility };
