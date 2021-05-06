import {
	Group,
	Geometry,
	PlaneGeometry,
	EdgesGeometry,
	NearestFilter,
	MeshPhongMaterial,
	DoubleSide,
	MeshBasicMaterial,
	InstancedMesh,
	Matrix4
} from "three";
import { Utility } from "Utility";
import { Shader } from "Shader";
import { Game } from "Game";

const params = Object.freeze({
	TYPES: 4, // JPGs: tree_0, tree_1, tree_2, tree_3
	COUNT: 1600, // "Math.sqrt( COUNT )" and "COUNT / TYPES" must be valid ints
	SPACE: 20 // between trees; "SPACE / 4" must be a valid int
});


const Trees = new Group();


const geometries = ( () => {
	
	const geometry = new Geometry();
	const plane = new PlaneGeometry( 1.5, 60 );
	
	geometry.merge( plane );
	geometry.merge( plane.rotateY( 90 * Math.PI / 180 ) );
	
	return {
		inner: geometry,
		outer: new EdgesGeometry( geometry )
	};
})();

const materials = ( () => {
	
	const textures = Utility.Times( params.TYPES, ( _, i ) => {
		
		const texture = Utility.Texture( `tree_${ i }` );
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;
		
		return texture;
	});
	
	return {
		inners: Utility.Times( params.TYPES, ( _, i ) => Shader.Set(
			new MeshPhongMaterial({
				side: DoubleSide,
				transparent: true,
				opacity: 0.9,
				map: textures[ i ]
			}),
			{
				u_Time: 0,
				u_Speed: ( i % 2 === 0 )
					? 1
					: 0.6,
				u_Morph: ( i === 1 || i === 3 )
					? 2
					: 1,
				u_Distort: ( i === 2 || i === 3 )
					? 2
					: 1
			},
			`TREES_INNER_${ i }`
		)),
		outer: Shader.Set(
			new MeshBasicMaterial({
				side: DoubleSide,
				transparent: true,
				opacity: 0.2,
				color: Game.Colors[ 0 ]
			}),
			{
				u_Time: 0,
				u_Speed: 0.8,
				u_Morph: 2,
				u_Distort: 2
			},
			"TREES_OUTER"
		)
	};
})();

Trees.add( ...( () => {
	
	const meshes = {
		inners: Utility.Times( params.TYPES, ( _, i ) => {
			
			const mesh = new InstancedMesh( geometries.inner, materials.inners[ i ], params.COUNT / params.TYPES );
			mesh.castShadow = true;
			
			return mesh;
		}),
		outer: ( () => {
			
			const mesh = new InstancedMesh( geometries.outer, materials.outer, params.COUNT / params.TYPES );
			mesh.castShadow = true;
			
			return mesh;
		})()
	};
	
	const positions = Utility.Times( Math.sqrt( params.COUNT ), ( _, x ) => Utility.Times( Math.sqrt( params.COUNT ), ( _, z ) => { return { x, z }; } ) ).flat();
	const variation = () => Utility.Random( 2 )
		? params.SPACE / 4
		: -params.SPACE / 4;
	const matrix = new Matrix4();
	Utility.Times( params.COUNT / params.TYPES, ( _, i ) => Utility.Times( params.TYPES, ( _, j ) => {
		
		const index = Utility.Random( positions.length );
		const position = positions[ index ];
		const x = position.x * params.SPACE + variation() - Math.sqrt( params.COUNT ) * params.SPACE / 2;
		const z = position.z * params.SPACE + variation() - Math.sqrt( params.COUNT ) * params.SPACE / 2;
		
		meshes.inners[ j ].setMatrixAt( i, matrix.makeTranslation( x, 5, z ) );
		if( !j ) meshes.outer.setMatrixAt( i, matrix.makeTranslation( x, 5, z ) );
		
		positions.splice( index, 1 );
	}));
	
	return [
		...meshes.inners,
		meshes.outer
	];
})() ); // TREES_INNER_0, TREES_INNER_1, TREES_INNER_2, TREES_INNER_3, TREES_OUTER


Game.Scene.add( Trees );

export { Trees };
