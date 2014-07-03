'use strict';
/*global
ps,
com
*/

ps(
	'com.ps.example.Animal',
	['scope'],
	function(scope){
		function Animal(age){
			console.log('Constructor Animal', scope);
			scope.age = age;
		}

		function getAge() {
			return scope.age;
		}

		scope.public('getAge', getAge);

		function thinkLikeAAnimal(){
			console.log('Think like a Animal');
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
		function Mammal(age, firstName){
			console.log('Constructor Mammal', scope);
			scope.super(age);
			scope.firstName = firstName;
		}

		function getFirstName() {
			return scope.firstName;
		}

		scope.public('getFirstName', getFirstName);

		function thinkLikeAMammal(){
			console.log('Think like a Mammal');
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
		function Human(age, firstName, lastName){
			console.log('Constructor Human', scope);
			scope.super(age, firstName);
			scope.lastName = lastName;
		}

		function getLastName() {
			return scope.lastName;
		}

		scope.public('getLastName', getLastName);

		function thinkLikeAHuman(){
			console.log('Think like a Human');
		}

		scope.public('thinkLikeAHuman', thinkLikeAHuman);

		Human.somethingStatic = function(){
			console.log('somethingStatic');
		};

		return Human;
	}
);

var jon = new com.ps.example.Human('Adams', 'Jon', 23);
console.log(jon, jon.getAge(), jon.getFirstName(), jon.getLastName());

com.ps.example.Human.somethingStatic();
