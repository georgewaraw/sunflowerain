import { Utility } from "Utility";
import { Shader } from "Shader";
import { Game } from "Game";
import { Player } from "Player";
import { Title } from "Title";
import { Lantern } from "Lantern";
import "Ground";
import "Trees";
import { Ghosts } from "Ghosts";
import { Sound } from "Sound";

Utility.Model( "lantern" ).then( ( m_Lantern ) =>
Utility.Model( "ghost" ).then( ( m_Ghost ) =>
Utility.Font( "amatic_sc_bold" ).then( ( f_Amatic_SC_Bold ) =>
Utility.Sound( "music" ).then( ( s_Music ) => {
	
	s_Music.Name = "MUSIC"; // PROP
	
	
	document.getElementById( "LOADSCREEN" ).remove();
	
	const begin = Utility.Once( () => (
		
		Game.Begin(),
		Player.Position(),
		Title.FadeOut(),
		Lantern.FadeIn(),
		Sound.Init(),
		Sound.Play( s_Music, true )
	));
	
	
	window.addEventListener( "resize", Game.Resize );
	window.addEventListener( "orientationchange", Game.Resize );
	
	
	window.addEventListener( "mousedown", begin );
	
	window.addEventListener( "mousemove", ( e ) => {
		
		if( Game.Has() !== "NOT BEGUN" ) {
			
			const x = e.clientX / window.innerWidth * 2 - 1;
			const y = e.clientY / window.innerHeight * -2 + 1;
			
			Player.Look( x / 25, -y / 125 );
			Lantern.Move( x, y );
		}
	});
	
	window.addEventListener( "keyup", ( e ) => {
		
		begin();
		
		switch( e.code ) {
			
			case "ArrowUp": case "KeyW":
				if( Player.Move.Forward() ) Player.Move.Forward( false );
				else {
					
					Player.Move.Forward( true );
					Player.Move.Backward( false );
					Player.Move.Right( false );
					Player.Move.Left( false );
				}
				break;
			case "ArrowDown": case "KeyS":
				if( Player.Move.Backward() ) Player.Move.Backward( false );
				else {
					
					Player.Move.Forward( false );
					Player.Move.Backward( true );
					Player.Move.Right( false );
					Player.Move.Left( false );
				}
				break;
			case "ArrowRight": case "KeyD":
				if( Player.Move.Right() ) Player.Move.Right( false );
				else {
					
					Player.Move.Forward( false );
					Player.Move.Backward( false );
					Player.Move.Right( true );
					Player.Move.Left( false );
				}
				break;
			case "ArrowLeft": case "KeyA":
				if( Player.Move.Left() ) Player.Move.Left( false );
				else {
					
					Player.Move.Forward( false );
					Player.Move.Backward( false );
					Player.Move.Right( false );
					Player.Move.Left( true );
				}
				break;
		}
	});
	
	
	Game.Canvas.addEventListener( "touchstart", ( e ) => e.preventDefault() );
	( () => { // touch controls
		
		let then = 0;
		let xStart = 0;
		let yStart = 0;
		let xEnd = 0;
		let yEnd = 0;
		let xMove = 0;
		let yMove = 0;
		
		window.addEventListener( "touchstart", ( e ) => (
			
			then = Date.now(),
			
			xStart = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1,
			yStart = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1
		));
		window.addEventListener( "touchend", ( e ) => ( Date.now() - then < 200 ) && (
			
			xEnd = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1,
			yEnd = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1,
			
			begin(),
			
			Player.Look( 0, 0 ),
			
			( ( Math.abs( xStart - xEnd ) < 0.1 ) && ( Math.abs( yStart - yEnd ) < 0.1 ) )
				? void( 0 ) // tap
				: ( ( Math.abs( xStart - xEnd ) > 0.1 ) && ( Math.abs( yStart - yEnd ) < 0.2 ) )
					? ( xStart - xEnd > 0 )
						? ( Player.Move.Left() ) // left swipe
							? Player.Move.Left( false )
							: (
								
								Player.Move.Forward( false ),
								Player.Move.Backward( false ),
								Player.Move.Right( false ),
								Player.Move.Left( true )
							)
						: ( Player.Move.Right() ) // right swipe
							? Player.Move.Right( false )
							: (
								
								Player.Move.Forward( false ),
								Player.Move.Backward( false ),
								Player.Move.Right( true ),
								Player.Move.Left( false )
							)
					: ( ( Math.abs( xStart - xEnd ) < 0.2 ) && ( Math.abs( yStart - yEnd ) > 0.1 ) ) && (
						
						( yStart - yEnd < 0 )
							? ( Player.Move.Forward() ) // up swipe
								? Player.Move.Forward( false )
								: (
									
									Player.Move.Forward( true ),
									Player.Move.Backward( false ),
									Player.Move.Right( false ),
									Player.Move.Left( false )
								)
							: ( Player.Move.Backward() ) // down swipe
								? Player.Move.Backward( false )
								: (
									
									Player.Move.Forward( false ),
									Player.Move.Backward( true ),
									Player.Move.Right( false ),
									Player.Move.Left( false )
								)
					)
		));
		
		window.addEventListener( "touchmove", ( e ) => ( ( Game.Has() !== "NOT BEGUN" ) && ( Date.now() - then > 200 ) ) && (
			
			xMove = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1,
			yMove = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1,
			
			Player.Look( xMove / 25, -yMove / 125 ),
			Lantern.Move( xMove, yMove )
		));
	})();
	
	
	Player.Init( m_Ghost );
	Title.Init( f_Amatic_SC_Bold );
	Lantern.Init( m_Lantern );
	Player.add( Lantern );
	Ghosts.Init( m_Ghost );
	
	Game.Render([
		Shader.Update,
		Player.Look,
		Player.Move,
		Player.Animate,
		Lantern.Animate,
		Ghosts.Animate,
		Ghosts.Move,
		Ghosts.FadeOut
	]);
}))));
