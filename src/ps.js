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
						/*superClassName*/
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
		methods = descriptor.d(),
		constructor = getConstructor(methods, className),
		facade = function(){

			var
			methods = (descriptor.d).apply(null, getImports(descriptor, this)),
			constructor = getConstructor(methods, className);

			if(descriptor.s){
				this.super = function(){
					this.super.superCalled = true;

					var
					superConstructor = getNameSpace(descriptor.s);

					superConstructor.apply(this, arguments);
				};
			}
			
			for(var prop in methods){
				var fn = methods[prop];
				if(prop !== className){

					if(descriptor.s && this[prop]){
						this.super[prop] = this[prop];
					}

					applyToScope(this, prop, fn);
				}
			}

			constructor.apply(this, arguments);

			if(this.super && this.super.superCalled !== true){
				this.super.apply(this, arguments);
			}
		};

		if(nameSpaceString && nameSpaceString.length){
			nameSpace[className] = facade;
		}

		for (var prop in constructor) {
			facade[prop] = constructor[prop];
		}

		return facade;
	}

	function getNameSpace(nameSpaceString){

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
	
	function getConstructor(methods, className){
		var constructor = methods[className];

		if(constructor){
			return constructor;
		}else{
			for (var prop in methods) {
				var char = prop.charAt(0);
				if(char === char.toUpperCase()){
					return methods[prop];
				}
			}
		}
	}
	
	function getImports(descriptor, scope){
		
		var generatedImports = [];

		if(descriptor.i){
			for (var i = 0; i < descriptor.i.length; i++) {
				var referenceName = descriptor.i[i],
				reference = getNameSpace(referenceName) || referenceName;

				if(referenceName === 'scope'){
					reference = scope;
				}

				generatedImports.push(reference);
			}
		}

		return generatedImports;
	}

	function applyToScope(scope, functionName, fn){
		scope[functionName] = function(){
			return fn.apply(scope, arguments);
		};
	}

	window.ps =
	window.packageScope =
	window.packagescope =
	packageScope;
})();