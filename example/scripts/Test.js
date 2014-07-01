'use strict';
/*global
	ps
*/
ps(
	'com.ps.example.Test',
	[
		'scope'
	],
	function(scope){
		var privateProperty = 'privatePropertyOfTestOrigonalValue';

		function Test(){
			console.log('Test', getPrivateProperty());
		}

		function getPrivateProperty(){
			return privateProperty;
		}

		scope.public({
			'getPrivateProperty': getPrivateProperty
		});
		return Test;
		
	}
);