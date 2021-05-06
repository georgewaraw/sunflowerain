const shaders = [];


let Shader = {
	Get: null,
	Set: null,
	Update: null
};


Shader.Get = ( () => {
	
	const cache = {};
	
	return ( name = "", again = false ) => ( name )
		? cache[ name ] = ( cache[ name ] && !again ) || shaders.filter( ( e ) => e.name === name )[ 0 ]
		: shaders;
})();

Shader.Set = ( () => {
	
	const uniforms = `
		uniform float u_Time;
		uniform float u_Speed;
		uniform float u_Morph;
		uniform float u_Distort;
	`;
	const vertexShader = `
		vec3 transformed = position;
		
		float y = sin( position.y + u_Time * u_Speed ) * u_Morph;
		transformed.x += y / 2.0;
		transformed.y += y;
		transformed.z += y / 2.0;
		
		y = fract(
			sin(
				dot( position.y + u_Time * u_Speed * 0.000001, ( 12.9898, 78.233 ) )
			) * 43758.5453123
		) * u_Distort;
		transformed.x += y / 2.0;
		transformed.y += y;
		transformed.z += y / 2.0;
	`;
	
	return ( material, values, name = void( 0 ) ) => (
		
		material.onBeforeCompile = ( shader ) => (
			
			shader.name = name,
			Object.keys( values ).map( ( e ) => shader.uniforms[ e ] = { value: values[ e ] } ),
			shader.vertexShader = uniforms + shader.vertexShader,
			shader.vertexShader = shader.vertexShader.replace( "#include <begin_vertex>", vertexShader ),
			shaders.unshift( shader )
		),
		
		material
	);
})();

Shader.Update = ( time ) => shaders.map( ( e ) => e.uniforms.u_Time.value = time.Elapsed );


Shader = Object.freeze( Shader );

export { Shader };
