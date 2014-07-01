'use strict';
/*global ps:false,
com */
ps(
	'com.ps.example.Animal',
	['scope'],
	function(scope){
		var asd = 'asd';
		scope.age = 5;

		function getAge(){
			return scope.age;
		}

		scope.public({
			'getAge': getAge
		});
		
		return function(age){
			console.log('Animal', asd);
			scope.age = age;
		};
	}
);

ps(
	'com.ps.example.Mammal',
	'com.ps.example.Animal',
	['scope'],
	function(scope){
		function getFirstName(){
			return scope.firstName;
		}

		scope.public('getFirstName', getFirstName);
		
		return function(firstName, age){
			console.log('Mammal');
			scope.super(age);
			scope.firstName = firstName;
		};
	}
);

ps(
	'com.ps.example.Human',
	'com.ps.example.Mammal',
	['scope'],
	function(scope){
		function getLastName(){
			return scope.lastName;
		}
		scope.public('getLastName', getLastName);

		return function(lastName, firstName, age){
			console.log('Human');
			scope.super(firstName, age);
			scope.lastName = lastName;
		};
	}
);

var jamie = new com.ps.example.Human('Adams', 'Jamie', 23);

console.log(jamie);
console.log(jamie.getFirstName(), jamie.getLastName(), jamie.getAge());





function Animal(age){
	this.age = age;
}
Animal.prototype.getAge = function() {
	return this.age;
};

function Mammal(firstName, age){
	this.firstName = firstName;
	Animal.apply(this, [age]);
}
Mammal.prototype = new Animal();
Mammal.prototype.constructor = Animal;
Mammal.prototype.getFirstName = function() {
	return this.firstName;
};



function Human(lastName, firstName, age){
	this.lastName = lastName;
	Mammal.apply(this, [firstName, age]);
}
Human.prototype = new Mammal();
Human.prototype.constructor = Mammal;
Human.prototype.getLastName = function() {
	return this.lastName;
};

var jon = new Human('Adams', 'Jon', 34);
console.log(jon);
console.log(jon.getFirstName(), jon.getLastName(), jon.getAge());