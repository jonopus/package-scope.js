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
		facade = function(){
			var scope = this;
			scope.methods = {};

			var superConstructor;
			if(descriptor.s){
				superConstructor = function(){
					if(this.called){
						return;
					}

					this.called = true;

					//apply super constructor;
					getNameSpace(descriptor.s).apply(scope, arguments);

					for(var prop in scope.methods){
						scope.super[prop] = scope.methods[prop];

					}
				};

				if(scope.super){
					superConstructor.super = scope.super;
				}
				scope.super = superConstructor;
			}
			
			scope.methods = {};

			scope.public = function(){
				if(typeof arguments[0] === 'object'){
					var
					publicProperties = arguments[0];

					for (var prop in publicProperties) {
						applyToScope(scope, prop, publicProperties[prop]);
						applyToScope(scope.methods, prop, publicProperties[prop]);
					}
				}else{
					applyToScope(scope, arguments[0], arguments[1]);
					applyToScope(scope.methods, arguments[0], arguments[1]);
				}
			};

			//apply constructor;
			(descriptor.d).apply(null, getImports(descriptor, scope)).apply(scope, arguments);

			//call super if not called;
			if(descriptor.s){
				scope.super.apply(scope, arguments);
			}
		},
		constructorStaticScope = (descriptor.d).apply(null, getImports(descriptor, facade));

		if(nameSpaceString && nameSpaceString.length){
			nameSpace[className] = facade;
		}

		for (var prop in constructorStaticScope) {
			facade[prop] = constructorStaticScope[prop];
		}

		return facade;
	}

	function applyToScope(scope, prop, value){
		if(!scope[prop]){
			scope[prop] = value;
		}
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
	
	function doNothing(){}

	function getImports(descriptor, scope){
		
		var generatedImports = [];

		if(descriptor.i){
			for (var i = 0; i < descriptor.i.length; i++) {
				var referenceName = descriptor.i[i],
				reference = getNameSpace(referenceName) || referenceName;

				if(referenceName === 'scope'){
					if(typeof scope === 'function'){
						reference = {public:doNothing};
					}else{
						reference = scope;
					}
				}

				generatedImports.push(reference);
			}
		}

		return generatedImports;
	}

	window.ps =
	window.packageScope =
	window.packagescope =
	packageScope;
})();