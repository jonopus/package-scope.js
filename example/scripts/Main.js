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
			console.log('Constructor Animal', arguments);

			console.log('Animal', 'I think', getHowIthink());

			scope.age = age;
		}

		function getAge() {
			return scope.age;
		}

		scope.public('getAge', getAge);

		function getHowIthink(){
			console.log('Animal getHowIthink', scope.super());
			return 'like an Animal';
		}

		scope.public('getHowIthink', getHowIthink);

		return Animal;
	}
);

ps(
	'com.ps.example.Mammal',
	'com.ps.example.Animal',
	['scope'],
	function(scope){
		function Mammal(age, firstName){
			console.log('Constructor Mammal', arguments);
			scope.super(age);

			console.log('Mammal', 'I think', getHowIthink());

			scope.firstName = firstName;
		}

		function getFirstName() {
			return scope.firstName;
		}

		scope.public('getFirstName', getFirstName);

		function getHowIthink(){
			console.log('Mammal getHowIthink', scope.super());
			return 'like a Mammal';
		}

		scope.public('getHowIthink', getHowIthink);

		return Mammal;
	}
);

ps(
	'com.ps.example.Human',
	'com.ps.example.Mammal',
	['scope'],
	function(scope){
		function Human(age, firstName, lastName){
			console.log('Constructor Human', arguments);
			scope.super(age, firstName);

			console.log('Human', 'I think', getHowIthink());

			scope.lastName = lastName;
		}

		function getLastName() {
			return scope.lastName;
		}

		scope.public('getLastName', getLastName);

		function getHowIthink(){
			console.log('Human getHowIthink', scope.super());
			return 'like a Human';
		}

		scope.public('getHowIthink', getHowIthink);

		Human.somethingStatic = function(){
			console.log('somethingStatic');
		};

		return Human;
	}
);

var jon = new com.ps.example.Human('Adams', 'Jon', 23);
console.log(jon, jon.getAge(), jon.getFirstName(), jon.getLastName());

com.ps.example.Human.somethingStatic();
