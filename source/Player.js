import {
	Mesh,
	MeshPhongMaterial,
	BackSide,
	Euler,
	Vector3
} from "three";
import { Utility } from "Utility";
import { Shader } from "Shader";
import { Game } from "Game";

const params = Object.freeze({
	LIMIT: 30 * Math.PI / 180, // x-axis turn limit
	SPEED: 7.5 // movement speed
});


const Player = new Mesh();

Player.Init = null;
Player.Position = null;
Player.Look = null;
Player.Move = null;
Player.FadeIn = null;
Player.Animate = null;


Player.Init = Utility.Once( ( geo ) => (
	
	Player.geometry = geo,
	
	Player.material = Shader.Set(
		new MeshPhongMaterial({
			side: BackSide,
			depthWrite: false,
			transparent: true,
			opacity: 0,
			color: Game.Colors[ 1 ],
			emissive: Game.Colors[ 0 ],
			emissiveIntensity: 0.4
		}),
		{
			u_Time: 0,
			u_Speed: 0.25,
			u_Morph: 0.75,
			u_Distort: 0.5
		},
		"PLAYER"
	)
));

Player.Position = Utility.Once( () => Utility.Animate(
	Player.position.z,
	30,
	2000,
	( v ) => Player.position.z = v
));

Player.Look = ( () => {
	
	const euler = new Euler( 0, 0, 0, "YXZ" );
	let xOut = 0;
	let yOut = 0;
	
	return ( xIn = void( 0 ), yIn = void( 0 ) ) => ( ( typeof( xIn ) !== "undefined" ) && ( typeof( yIn ) !== "undefined" ) )
		? (
			
			xOut = ( Math.abs( xIn ) > 0.005 )
				? xIn
				: 0,
			yOut = ( Math.abs( yIn ) > 0.0025 )
				? yIn
				: 0
		)
		: (
			
			euler.setFromQuaternion( Player.quaternion ),
			
			euler.y -= xOut,
			euler.x = Math.max( -params.LIMIT, Math.min( params.LIMIT, euler.x -= yOut ) ),
			
			Player.quaternion.setFromEuler( euler )
		);
})();

Player.Move = ( () => {
	
	const vector = new Vector3();
	let moveForward = false;
	let moveBackward = false;
	let moveRight = false;
	let moveLeft = false;
	
	const move = ( time ) => (
		
		vector.setFromMatrixColumn( Player.matrix, 0 ),
		( moveForward ) && ( Player.position.addScaledVector( vector.crossVectors( Player.up, vector ), params.SPEED * time.Delta ) ),
		( moveBackward ) && ( Player.position.addScaledVector( vector.crossVectors( Player.up, vector ), -params.SPEED * time.Delta ) ),
		( moveRight ) && ( Player.position.addScaledVector( vector, params.SPEED * time.Delta ) ),
		( moveLeft ) && ( Player.position.addScaledVector( vector, -params.SPEED * time.Delta ) ),
		
		( moveForward || moveBackward || moveRight || moveLeft ) && (
			
			Player.position.x += Math.sin( time.Elapsed * 3 ) / 30,
			Player.position.y += Math.sin( time.Elapsed * 6 ) / 40
		)
	);
	move.Forward = ( should = void( 0 ) ) => moveForward = ( typeof( should ) === "undefined" ) // PROP
		? moveForward
		: should;
	move.Backward = ( should = void( 0 ) ) => moveBackward = ( typeof( should ) === "undefined" ) // PROP
		? moveBackward
		: should;
	move.Right = ( should = void( 0 ) ) => moveRight = ( typeof( should ) === "undefined" ) // PROP
		? moveRight
		: should;
	move.Left = ( should = void( 0 ) ) => moveLeft = ( typeof( should ) === "undefined" ) // PROP
		? moveLeft
		: should;
	
	return move;
})();

Player.FadeIn = Utility.Once( () => (
	
	Player.material.depthWrite = true,
	Utility.Animate(
		Player.material.opacity,
		0.5,
		1000,
		( v ) => Player.material.opacity = v
	)
));

Player.Animate = ( time ) => ( Game.Has() === "ENDED" ) && ( Player.position.y = Math.sin( time.Elapsed * 2 ) / 4 );


Game.Scene.add( Player.add( ...Game.Cameras ) );

export { Player };
