import {
	WebGL1Renderer,
	BasicShadowMap,
	Scene,
	FogExp2,
	PerspectiveCamera,
	Clock
} from "three";
import { Utility } from "Utility";


let Game = {
	Colors: null,
	Canvas: null,
	Renderer: null,
	Scene: null,
	Cameras: null,
	
	Render: null,
	Resize: null,
	Has: null,
	Begin: null,
	End: null
};


Game.Colors = [ 0xED1D23, 0xF9CCC9 ]; // [ dark, light ]; generated at poolors.com

Game.Canvas = document.getElementById( "CANVAS" );

Game.Renderer = ( () => {
	
	const renderer = new WebGL1Renderer({ canvas: Game.Canvas });
	renderer.setPixelRatio( 0.125 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setScissorTest( true );
	renderer.sortObjects = false;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = BasicShadowMap;
	
	return renderer;
})();

Game.Scene = ( () => {
	
	const scene = new Scene();
	scene.fog = new FogExp2( "black", 0.001 );
	
	return scene;
})();

Game.Cameras = ( () => {
	
	const cameras = [
		new PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 ), // top-down
		new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 ) // first-person
	];
	cameras[ 0 ].rotation.set( 270 * Math.PI / 180, 0, 0 );
	
	return cameras;
})();


Game.Render = Utility.Once( ( callbacks ) => {
	
	const time = {
		Elapsed: 0,
		Delta: 0
	};
	const clock = new Clock();
	
	Game.Renderer.compile( Game.Scene, Game.Cameras[ 0 ] );
	Game.Renderer.setAnimationLoop( ( elapsed ) => {
		
		time.Elapsed = elapsed / 1000;
		time.Delta = clock.getDelta();
		callbacks.map( ( e ) => e( time ) );
		
		switch( Game.Has() ) {
			
			case "NOT BEGUN":
				Game.Renderer.setScissor( 0, 0, window.innerWidth, window.innerHeight ); // first-person
				Game.Renderer.render( Game.Scene, Game.Cameras[ 1 ] );
				break;
			case "BEGUN":
				Game.Renderer.setScissor( 0, 0, window.innerWidth, window.innerHeight ); // top-down
				Game.Renderer.render( Game.Scene, Game.Cameras[ 0 ] );
				
				Game.Renderer.setScissor( window.innerWidth / 4, window.innerHeight / 4, window.innerWidth * 2 / 4, window.innerHeight * 2 / 4 ); // first-person
				Game.Renderer.render( Game.Scene, Game.Cameras[ 1 ] );
				break;
			case "ENDED":
				Game.Renderer.setScissor( 0, 0, window.innerWidth, window.innerHeight ); // top-down
				Game.Renderer.render( Game.Scene, Game.Cameras[ 0 ] );
				break;
		}
	});
});

Game.Resize = () => (
	
	Game.Renderer.setSize( window.innerWidth, window.innerHeight ),
	
	Game.Cameras.map( ( e ) => (
		
		e.aspect = window.innerWidth / window.innerHeight,
		e.updateProjectionMatrix()
	))
);

Game.Has = ( () => {
	
	let has = "NOT BEGUN"; // "NOT BEGUN", "BEGUN", "ENDED"
	
	return ( state = "" ) => has = state || has;
})();

Game.Begin = () => (
	
	Game.Has( "BEGUN" ),
	Utility.Animate(
		Game.Cameras[ 0 ].position.y,
		Game.Cameras[ 0 ].position.y + 10,
		2000,
		( v ) => Game.Cameras[ 0 ].position.y = v
	)
);

Game.End = () => (
	
	Game.Has( "ENDED" ),
	Utility.Animate(
		Game.Cameras[ 0 ].position.y,
		Game.Cameras[ 0 ].position.y + 20,
		2000,
		( v ) => Game.Cameras[ 0 ].position.y = v
	)
);


Game = Object.freeze( Game );

export { Game };
