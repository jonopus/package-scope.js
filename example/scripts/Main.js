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
		function think(){
			console.log('thinkLikeAAnimal', scope);
			thinkLikeAAnimal();
		}
		scope.public('think', think);

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
			console.log('Mammal', 'thinkLikeAMammal', scope);
			scope.super.thinkLikeAAnimal();
		}
		scope.public('thinkLikeAMammal', thinkLikeAMammal);
		function think(){
			console.log('thinkLikeAMammal', scope);
			thinkLikeAMammal();
		}
		scope.public('think', think);

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

			console.log('super', scope.super);
		}

		function thinkLikeAHuman(){
			console.log('Human', 'thinkLikeAHuman', scope);
			scope.super.thinkLikeAMammal();
		}
		scope.public('thinkLikeAHuman', thinkLikeAHuman);
		function think(){
			console.log('thinkLikeAHuman', scope);
			thinkLikeAHuman();
		}
		scope.public('think', think);

		return Human;
	}
);

ps(
	'com.ps.example.Insect',
	['scope'],
	function(scope){
		function Insect(){
			console.log('Insect');
		}

		function thinkLikeAInsect(){
			console.log('Insect', 'thinkLikeAInsect', scope);
		}
		scope.public('thinkLikeAInsect', thinkLikeAInsect);
		function think(){
			console.log('thinkLikeAInsect', scope);
			thinkLikeAInsect();
		}
		scope.public('think', think);

		return Insect;
	}
);

var jon = new com.ps.example.Human('Adams', 'Jon', 32);
console.log(jon);
console.log(jon.getLastName());
console.log(jon.getFirstName());
console.log(jon.getAge());
console.log('');
jon.think();