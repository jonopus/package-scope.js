'use strict';
/*global ps:false */
ps(
	'com.ps.example.CustomMediator',
	'com.ps.example.Mediator',
	function(){
		function CustomMediator() {
			console.log('CustomMediator');
		}

		return {
			CustomMediator:CustomMediator
		};
	}
);