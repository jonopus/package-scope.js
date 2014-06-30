'use strict';
/*global ps:false */
ps(
	'com.ps.example.Main',
	[
		'com.ps.example.FancyMediator'
	],
	function(FancyMediator){
		function Main() {
			new FancyMediator();
		}

		return {
			Main:Main
		};
	}
);