import {
	Mesh,
	MeshPhongMaterial
} from "three";
import { Utility } from "Utility";
import { Shader } from "Shader";
import { Game } from "Game";
import { Light } from "Light";

const params = Object.freeze({
	SPEED: 0.00125, // movement speed
	LIMIT: 0.1 // x-axis displacement limit
});


const Lantern = new Mesh();

Lantern.Init = null;
Lantern.FadeIn = null;
Lantern.Animate = null;
Lantern.Move = null;


Lantern.Init = Utility.Once( ( geo ) => (
	
	Lantern.position.set( 0, -0.1, -2 ),
	
	Lantern.geometry = geo,
	
	Lantern.material = Shader.Set(
		new MeshPhongMaterial({
			depthWrite: false,
			transparent: true,
			opacity: 0,
			emissive: Game.Colors[ 0 ],
			emissiveIntensity: 0.1
		}),
		{
			u_Time: 0,
			u_Speed: 0.1,
			u_Morph: 0.01,
			u_Distort: 0.04
		},
		"LANTERN"
	)
));

Lantern.FadeIn = Utility.Once( () => (
	
	Lantern.castShadow = true,
	Lantern.receiveShadow = true,
	
	Lantern.material.depthWrite = true,
	Utility.Animate(
		Lantern.material.opacity,
		0.9,
		1000,
		( v ) => Lantern.material.opacity = v
	)
));

Lantern.Animate = ( time ) => (
	
	Lantern.rotation.x = Math.sin( time.Elapsed * 2 ) / 4,
	Lantern.rotation.z = Math.sin( time.Elapsed * 1.5 ) / 6
);

Lantern.Move = ( x, y ) => (
	
	( x < -0.25 )
		? (
			
			Lantern.position.x -= params.SPEED,
			Lantern.position.x = Math.max( -params.LIMIT, Lantern.position.x )
		)
		: ( x > 0.25 ) && (
			
			Lantern.position.x += params.SPEED,
			Lantern.position.x = Math.min( params.LIMIT, Lantern.position.x )
		),
	( y < -0.25 )
		? (
			
			Lantern.position.y -= params.SPEED,
			Lantern.position.y = Math.max( -params.LIMIT, Lantern.position.y )
		)
		: ( y > 0.25 ) && (
			
			Lantern.position.y += params.SPEED,
			Lantern.position.y = Math.min( params.LIMIT, Lantern.position.y )
		)
);


Lantern.add( Light.Point );

export { Lantern };
