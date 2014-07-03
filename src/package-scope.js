'use strict';
(function(){

	function packageScope(){

		var descriptor = {f:''};

		for (var i = 0; i < arguments.length; i++) {
			var argument = arguments[i];

			switch(true){
				case typeof argument === 'string':
					if(!descriptor.f){
						/*fullyQualifiedClassName*/
						descriptor.f = argument;
					}else{
						/*super fullyQualifiedClassName*/
						descriptor.s = argument;
					}
					break;

				case argument instanceof Array:
					/*imports*/
					descriptor.i = argument;
					break;

				case typeof argument === 'function':
					/*definition*/
					descriptor.d = argument;
					break;
			}
		}

		return getFacade(descriptor);
	}

	function getFacade(descriptor){
		var
		nameSpaceElements = descriptor.f.split('.'),
		className = nameSpaceElements.pop(),
		nameSpaceString = nameSpaceElements.join('.'),
		nameSpace = getNameSpace(nameSpaceString),
		consturctor,
		SuperFacade,
		proto = {};

		if(descriptor.s){
			SuperFacade = getNameSpace(descriptor.s);
			proto = new SuperFacade(doNothing);
		}

		function Facade(){
			if(arguments[0] === doNothing){
				return;
			}

			var
			_this = this,
			scope = {},
			methods = {};

			scope.public = function(name, value){
				if(typeof arguments[0] === 'object'){
					var object = arguments[0];
					for(var prop in object){
						scope.public(prop, object[prop]);
					}
				}else{

					var applyToScope = function(){
						return function(){
							return value.apply(_this, arguments);
						};
					};

					if(!_this[name]){
						_this[name] = applyToScope();
					}
					methods[name] = applyToScope();
				}
			};
			
			if(descriptor.s){
				scope.super = function(){
					if(scope.super.called){
						return;
					}
					scope.super.called = true;
					
					var superMethods = SuperFacade.apply(_this, arguments).methods;

					for(var prop in superMethods){
						scope.super[prop] = superMethods[prop];
					}
				};
			}

			consturctor = (descriptor.d).apply(null, getImports(descriptor, scope));
			
			consturctor.apply(_this, arguments);

			if(scope.super){
				scope.super.apply(_this, arguments);
			}
			
			_this.methods = methods;

			return _this;
		}





		var StaticConstructor = (descriptor.d).apply(null, getImports(descriptor, {public:doNothing}));

		for(var prop in StaticConstructor){
			Facade[prop] = StaticConstructor[prop];
		}
		
		Facade.prototype = proto;

		if(nameSpaceString && nameSpaceString.length){
			nameSpace[className] = Facade;
		}

		return Facade;
	}

	function getNameSpace(nameSpaceString, scope){

		if(nameSpaceString === 'scope'){
			return scope;
		}

		if(!nameSpaceString || !nameSpaceString.length){
			return null;
		}
		var nsElements = nameSpaceString.split('.'),
		ns = window;

		for (var i = 0; i < nsElements.length; i++) {
			var name = nsElements[i];
			ns = ns[name] = ns[name] || {};
		}

		return ns;
	}

	function getImports(descriptor, scope){
		
		var generatedImports = [];

		if(descriptor.i){
			for (var i = 0; i < descriptor.i.length; i++) {
				var referenceName = descriptor.i[i];
				generatedImports.push(getNameSpace(referenceName, scope) || referenceName);
			}
		}

		return generatedImports;
	}

	function doNothing(){}

	window.ps =
	window.packageScope =
	window.packagescope =
	packageScope;
})();