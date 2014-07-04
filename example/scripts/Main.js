'use strict';
/*global
ps*/

/**
 * Main inster point for App.
 */
ps(
	'com.ps.example.Main',
	[
		'$on',
		'app.AppFacade'
	],
	function(
		on,
		AppFacade
	){
		var appFacade;
		
		function Main(){
			appFacade = new AppFacade('todos-vanillajs');

			on(window, 'load', setView);
			on(window, 'hashchange', setView);
		}

		function setView() {
			appFacade.controller.setView(document.location.hash);
		}

		return Main;
	}
);