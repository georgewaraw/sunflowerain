import {
	PointLight,
	Vector2
} from "three";
import { Game } from "Game";


let Light = { Point: null };


Light.Point = new PointLight( Game.Colors[ 1 ], 25, 50, 2 );
Light.Point.castShadow = true;
Light.Point.shadow.mapSize = new Vector2( 64, 64 );


Light = Object.freeze( Light );

export { Light };
