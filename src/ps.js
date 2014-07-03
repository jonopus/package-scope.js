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
		SuperFacade;
		
		function Facade(){
			if(arguments[0] === doNothing){
				return;
			}

			this.public = function(name, value){
				if(typeof arguments[0] === 'object'){
					var object = arguments[0];
					for(var prop in object){
						this.public(prop, object[prop]);
					}
				}else{
					if(!this[name]){
						this[name] = value;
					}
					Facade.prototype[name] = value;
				}
			};

			if(descriptor.s){

				var SuperConstructor = getNameSpace(descriptor.s);
				
				Facade.prototype = new SuperConstructor(doNothing);
				Facade.prototype.constructor = SuperConstructor;
				

				SuperFacade = function(){
					if(this.super.called){
						return this.className;
					}
					
					this.super.called = true;
					SuperConstructor.apply(this, arguments);

					for(var prop in Facade.prototype){
						if(!this.super[prop]){
							this.super[prop] = Facade.prototype[prop];
						}
					}
				};

				this.super = SuperFacade;
			}

			(descriptor.d).apply(null, getImports(descriptor, this)).apply(this, arguments);
			
			if(this.super){
				this.super.apply(this, arguments);
			}
		}

		var StaticConstructor = (descriptor.d).apply(null, getImports(descriptor, Facade));

		for(var prop in StaticConstructor){
			Facade[prop] = StaticConstructor[prop];
		}

		if(nameSpaceString && nameSpaceString.length){
			nameSpace[className] = Facade;
		}

		return Facade;
	}

	function getNameSpace(nameSpaceString, scope){

		if(nameSpaceString === 'scope'){
			if(typeof scope === 'function'){
				return {public:doNothing};
			}else{
				return scope;
			}
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

	/*

	function applyToScope(scope, prop, value){
		if(!scope[prop]){
			scope[prop] = value;
		}
	}
	

	*/

	window.ps =
	window.packageScope =
	window.packagescope =
	packageScope;
})();