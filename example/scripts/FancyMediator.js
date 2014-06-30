'use strict';
/*global ps:false */
ps(
	'com.ps.example.FancyMediator',
	'com.ps.example.CustomMediator',
	function(){
		function FancyMediator() {
			console.log('FancyMediator');
		}

		return {
			FancyMediator:FancyMediator
		};
	}
);