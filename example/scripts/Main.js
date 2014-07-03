'use strict';
/*global
ps,
com
*/

ps(
	'com.ps.example.Animal',
	['scope'],
	function(scope){
		var _age;

		function getAge(){
			return _age;
		}
		scope.public('getAge', getAge);

		function Animal(age){
			console.log('Animal', age);
			_age = age;
		}

		function thinkLikeAAnimal(){
			console.log('Animal', 'thinkLikeAAnimal');
		}
		scope.public('thinkLikeAAnimal', thinkLikeAAnimal);

		return Animal;
	}
);

ps(
	'com.ps.example.Mammal',
	'com.ps.example.Animal',
	['scope'],
	function(scope){
		var _firstName;

		function getFirstName(){
			return _firstName;
		}
		scope.public('getFirstName', getFirstName);

		function Mammal(firstName, age){
			console.log('Mammal', firstName, age);
			_firstName = firstName;
			scope.super(age);
		}

		function thinkLikeAMammal(){
			console.log('Mammal', 'thinkLikeAMammal');
			scope.super.thinkLikeAAnimal();
		}
		scope.public('thinkLikeAMammal', thinkLikeAMammal);

		return Mammal;
	}
);

ps(
	'com.ps.example.Human',
	'com.ps.example.Mammal',
	['scope'],
	function(scope){
		var _lastName;

		function getLastName(){
			return _lastName;
		}
		scope.public('getLastName', getLastName);

		function Human(lastName, firstName, age){
			console.log('Human', lastName, firstName, age);
			_lastName = lastName;
			scope.super(firstName, age);
		}

		function thinkLikeAHuman(){
			console.log('Human', 'thinkLikeAHuman');

			scope.super.thinkLikeAMammal();
		}
		scope.public('thinkLikeAHuman', thinkLikeAHuman);

		return Human;
	}
);

var jon = new com.ps.example.Human('Adams', 'Jon', 32);
console.log(jon);
console.log(jon.getLastName());
console.log(jon.getFirstName());
console.log(jon.getAge());