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
		nameSpace = getNameSpace(nameSpaceString);
		
		function Facade(){
			if(arguments[0] === doNothing){
				return;
			}

			var _this = this,
			scope = {this:this, className:className};

			if(descriptor.s){
				scope.super = function(){
					if(scope.super.called){
						return _this.className;
					}
					
					scope.super.called = true;
					getNameSpace(descriptor.s).apply(_this, arguments);
				};
			}

			var _public = function(name, value){
				if(typeof arguments[0] === 'object'){
					var object = arguments[0];
					for(var prop in object){
						_this.public(prop, object[prop]);
					}
				}else{
					if(!_this[name]){
						_this[name] = value;
					}
					console.log('_super', _this._super, name);
					if(_this._super){
						_this._super[name] = value;
					}
					Facade.prototype[name] = value;
				}
			};
			
			scope.public = _public;

			(descriptor.d).apply(null, getImports(descriptor, scope)).apply(this, arguments);
			
			if(scope.super){
				scope.super.apply(this, arguments);
			}

			_this._super = scope.super;
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