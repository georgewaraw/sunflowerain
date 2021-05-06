import {
	Mesh,
	MeshPhongMaterial,
	BackSide
} from "three";
import { Utility } from "Utility";
import { Shader } from "Shader";
import { Game } from "Game";
import { Player } from "Player";

const params = Object.freeze({
	OFFSET: 10,
	COUNT: 8 * 8, // 8 directions with 8 ghosts each
	DIRS: 8, // N, NE, E, SE, S, SW, W, NW
	SPACE: 20, // between enemies
	LIMITS: [ 3, 6, 9, 12 ], // how close the ghosts can get to the player
	SPEED: 5, // movement speed
	AGRO: 10,
	END: 375 // the maximum distance ghosts can travel
});

let level = 0;

const offset = () => Utility.Random( 2 )
	? params.OFFSET
	: -params.OFFSET;


const Ghosts = Utility.Times( params.COUNT, () => new Mesh() );

Ghosts.Init = null;
Ghosts.Animate = null;
Ghosts.Move = null;
Ghosts.FadeOut = null;


Ghosts.Init = Utility.Once( ( geo ) => Ghosts.map( ( e, i ) => {
	
	e.Exists = true; // PROP
	e.Follows = false; // PROP
	e.Height = Utility.Random( 2 ); // PROP
	
	e.castShadow = true;
	if( !( i % params.DIRS ) ) level += 2;
	switch( i % params.DIRS ) {
		
		case 0: // N
			e.position.set(
				offset(),
				0,
				-params.SPACE * level
			);
			break;
		case 1: // NE
			e.position.set(
				params.SPACE * level + offset() / 2,
				0,
				-params.SPACE * level + offset() / 2
			);
			break;
		case 2: // E
			e.position.set(
				params.SPACE * level,
				0,
				offset()
			);
			break;
		case 3: // SE
			e.position.set(
				params.SPACE * level + offset() / 2,
				0,
				params.SPACE * level + offset() / 2
			);
			break;
		case 4: // S
			e.position.set(
				offset(),
				0,
				params.SPACE * level
			);
			break;
		case 5: // SW
			e.position.set(
				-params.SPACE * level + offset() / 2,
				0,
				params.SPACE * level + offset() / 2
			);
			break;
		case 6: // W
			e.position.set(
				-params.SPACE * level,
				0,
				offset()
			);
			break;
		case 7: // NW
			e.position.set(
				-params.SPACE * level + offset() / 2,
				0,
				-params.SPACE * level + offset() / 2
			);
			break;
	}
	
	e.geometry = geo;
	
	e.material = Shader.Set(
		new MeshPhongMaterial({
			side: BackSide,
			transparent: true,
			opacity: 0.5,
			color: Game.Colors[ 1 ],
			emissive: Game.Colors[ 0 ],
			emissiveIntensity: 0.4
		}),
		{
			u_Time: 0,
			u_Speed: 0.25,
			u_Morph: Utility.Random( 2 )
				? 0.75
				: 0.5,
			u_Distort: Utility.Random( 2 )
				? 0.5
				: 0.25
		},
		`GHOST_${ i }`
	);
}));

Ghosts.Animate = ( time ) => Ghosts.map( ( e ) => e.position.y = Math.sin( time.Elapsed * 2 ) / 4 + e.Height );

Ghosts.Move = ( time ) => ( Game.Has() === "BEGUN" ) && ( Ghosts.map( ( e, i ) => ( e.Exists ) && ( ( e.Follows )
	? (
		
		( e.position.x < Player.position.x - params.LIMITS[ i % 4 ] )
			? ( e.position.x += params.SPEED * time.Delta )
			: ( e.position.x > Player.position.x + params.LIMITS[ i % 4 ] ) && ( e.position.x -= params.SPEED * time.Delta ),
		
		( e.position.z < Player.position.z - params.LIMITS[ i % 4 ] )
			? ( e.position.z += params.SPEED * time.Delta )
			: ( e.position.z > Player.position.z + params.LIMITS[ i % 4 ] ) && ( e.position.z -= params.SPEED * time.Delta )
	)
	: ( ( Math.abs( e.position.x - Player.position.x ) < params.AGRO ) && ( Math.abs( e.position.z - Player.position.z ) < params.AGRO ) ) && ( e.Follows = true )
)));

Ghosts.FadeOut = () => (
	
	Ghosts.map( ( e ) => ( e.Exists && e.Follows && ( ( Math.abs( Player.position.x ) > params.END ) || ( Math.abs( Player.position.z ) > params.END ) ) ) && (
		
		e.Exists = false,
		e.Follows = false,
		
		e.castShadow = false,
		
		e.material.depthWrite = false,
		Utility.Animate(
			e.material.opacity,
			0,
			1000 * Utility.Random( 2, 6 ),
			( v ) => e.material.opacity = v
		)
	)),
	( !Ghosts.some( ( e ) => e.Exists ) ) && (
		
		Game.End(),
		Player.FadeIn()
	)
);


Game.Scene.add( ...Ghosts );

export { Ghosts };
