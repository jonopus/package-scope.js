'use strict';
/*global ps:false */
ps(
	'com.ps.example.Main',
	[
		'scope',
		'com.ps.example.FancyTest'
	],
	function(scope, FancyTest){
		function Main() {
			console.log('Main');
			var fancyTest = new FancyTest();
			
			console.log('fancyTest.getPrivateProperty', fancyTest.getPrivateProperty());
			console.log('fancyTest.getPrivatePropertyOfTest', fancyTest.getPrivatePropertyOfTest());
		}

		return Main;
	}
);