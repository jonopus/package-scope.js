'use strict';
/*global ps:false */
ps(
	'com.ps.example.Mediator',
	function(){
		function Mediator() {
			console.log('Mediator');
		}

		return {
			Mediator:Mediator
		};
	}
);