import {
	Mesh,
	TextBufferGeometry,
	MeshPhongMaterial
} from "three";
import { Utility } from "Utility";
import { Shader } from "Shader";
import { Game } from "Game";


const Title = new Mesh();

Title.Init = null;
Title.FadeOut = null;


Title.Init = Utility.Once( ( font ) => (
	
	Title.castShadow = true,
	Title.position.set( 0, 0, -1.1 ),
	
	Title.geometry = new TextBufferGeometry(
		"СОЛНЦЕ\nЦВЕТОК\nДОЖДЬ",
		{
			font,
			size: 0.2,
			height: 0.12
		}
	).center(),
	
	Title.material = Shader.Set(
		new MeshPhongMaterial({
			transparent: true,
			opacity: 0.9,
			flatShading: true,
			color: Game.Colors[ 1 ],
			emissive: Game.Colors[ 0 ],
			emissiveIntensity: 0.1
		}),
		{
			u_Time: 0,
			u_Speed: 0.1,
			u_Morph: 0,
			u_Distort: 0.01
		},
		"TITLE"
	)
));

Title.FadeOut = Utility.Once( () => (
	
	Title.castShadow = false,
	
	Title.material.depthWrite = false,
	Utility.Animate(
		Title.material.opacity,
		0,
		1000,
		( v ) => Title.material.opacity = v
	)
));


Game.Scene.add( Title );

export { Title };
