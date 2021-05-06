import {
	Mesh,
	PlaneGeometry,
	NearestFilter,
	MirroredRepeatWrapping,
	MeshPhongMaterial
} from "three";
import { Utility } from "Utility";
import { Game } from "Game";

const params = Object.freeze({
	SIZE: [ 10000, 10000 ],
	FRAMES: 25, // JPGs: ground_0 ... ground_24
	REPEAT: [ 1000, 1000 ],
	FPS: 15
});


const Ground = ( () => {
	
	const mesh = new Mesh();
	
	mesh.receiveShadow = true;
	
	mesh.rotation.set( 270 * Math.PI / 180, 0, 0 );
	mesh.position.set( 0, -10, 0 );
	
	return mesh;
})();

Ground.geometry = new PlaneGeometry( ...params.SIZE ).center();

( () => { // material
	
	const textures = Utility.Times( params.FRAMES, ( _, i ) => {
		
		const texture = Utility.Texture( `ground_${ i }` );
		
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		
		texture.wrapS = MirroredRepeatWrapping;
		texture.wrapT = MirroredRepeatWrapping;
		texture.repeat.set( ...params.REPEAT );
		
		return texture;
	});
	
	Ground.material = new MeshPhongMaterial({
		transparent: true,
		opacity: 0.75,
		map: textures[ 0 ]
	});
	
	let order = "normal";
	let i = 0;
	setInterval( () => (
		
		( order === "normal" ) && (
			
			i += 1,
			( i === 24 ) && ( order = "reverse" )
		),
		( order === "reverse" ) && (
			
			i -= 1,
			( i === 0 ) && ( order = "normal" )
		),
		
		Ground.material.map = textures[ i ],
		Ground.material.needsUpdate = true
	), 1000 / params.FPS );
})();


Game.Scene.add( Ground );

export { Ground };
