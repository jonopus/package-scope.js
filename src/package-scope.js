'use strict';
(function(){
	var descriptor;

	/**
	 * Creates a class by creating a a descriptor and passing it to getFacade.
	 * imports, and super class using revealing module pattern.
	 *
	 * @param {string}		[first string]
	 *						A fully qualified class name.
	 *						
	 * @param {string}		[second string]
	 *						A fully qualified super class name.
	 *					
	 * @param {array}		[array of nameSpaceStrings]
	 *						An array of reference name strings that will be
	 *						referenced by name and passed to the  closure.
	 *						A special reference 'scope' returns a scope object.
	 *						The scope object has a reverence to the 'this' of
	 *						the instance a method public that will expose
	 *						private members and a method super that calles the
	 *						super class constructor.
	 *					
	 * @param {function}	[closure]
	 *						A closure that returns the constructor function of
	 *						the class.
	 *
	 * @return {Class}
	 */
	function packageScope(){

		for (var i = 0; i < arguments.length; i++) {
			var argument = arguments[i];

			switch(true){
				case typeof argument === 'string':
					if(!descriptor.f){
						/*fully qualified class name*/
						descriptor.f = argument;
					}else{
						/*fully qualified super class name*/
						descriptor.s = argument;
					}
					break;

				case argument instanceof Array:
					/*imports*/
					descriptor.i = argument;
					break;

				case typeof argument === 'function':
					/*revealing module closure*/
					descriptor.d = argument;
					break;
			}
		}

		if(descriptor.d){
			return getFacade(descriptor);
		}

		return packageScope;
	}

	/**
	 * Creates a Class from a descriptor.
	 * 
	 * @param  {object}		descriptor
	 *						An object with atrributs for creating a Class.
	 *						
	 * @return {class}
	 */
	function getFacade(descriptor){
		var
		nameSpaceElements = descriptor.f.split('.'),
		className = nameSpaceElements.pop(),
		nameSpaceString = nameSpaceElements.join('.'),
		nameSpace = getNameSpace(nameSpaceString),
		SuperFacade,
		proto = {};

		/**
		 * if fully qualified super class name get reference to super class and
		 * store new reference for class prototype.
		 */
		if(descriptor.s){
			SuperFacade = getNameSpace(descriptor.s);
			proto = new SuperFacade(doNothing);
		}

		/**
		 * Create Class Constructor Facade.
		 */
		var Facade = (function(){
			return function(){
				if(arguments[0] === doNothing){
					return;
				}
				
				var
				isSuperClass,
				args = arguments,
				_this = this,
				scope = {this:this, className:className},
				methods = {};

				/**
				 * If called by super use passed arguments.
				 */
				if(args[0] === isSuper){
					isSuperClass = true;
					args = args[1];
				}


				/**
				 * Adds methods to instance.
				 * @param  {string}		Public function name.
				 * @param  {function}	Function to expose to public.
				 */
				scope.public = function(name, value){
					if(typeof arguments[0] === 'object'){
						var object = arguments[0];
						for(var prop in object){
							scope.public(prop, object[prop]);
						}
						return;
					}

					var applyToScope = function(){
						return function(){
							return value.apply(_this, arguments);
						};
					};

					if(!_this[name]){
						_this[name] = applyToScope();
					}

					methods[name] = applyToScope();
				};
				
				/**
				 * If a fully qualified super class name exists create super.
				 */
				if(descriptor.s){

					/**
					 * Super Constructor Facade.
					 * Methods of super class are accessabe on super.
					 */
					scope.super = function(){
						/**
						 * Only execute once.
						 */
						if(scope.super.called){
							return;
						}
						scope.super.called = true;
						
						var
						superInstance = SuperFacade.apply(_this, [isSuper, arguments]),
						superMethods = superInstance.methods,
						superSuper = superInstance.scope.super;
						
						delete _this.methods;
						delete _this.scope;

						for(var prop in superMethods){
							scope.super[prop] = superMethods[prop];
						}
						if(superSuper){
							scope.super.super = superSuper;
						}
					};
				}

				/**
				 * Get class constructor and call it passing generated imports
				 * and apply constructor arguments.
				 */
				(descriptor.d).apply(null, getImports(descriptor, scope)).apply(_this, args);

				/**
				 * If super has not be called, call with arguments.
				 */
				if(scope.super && !scope.super.called){
					scope.super.apply(_this, args);
				}
				
				/**
				 * Expose methods for sub class.
				 */
				if(isSuperClass){
					_this.methods = methods;
					_this.scope = scope;
				}

				return _this;
			};
		})();

		/**
		 * Get class constructor passing generated imports but pass dummy scope
		 * object so that nothing happens when calling public.
		 */
		var StaticConstructor = (descriptor.d).apply(null, getImports(descriptor, {public:doNothing, super:doNothing}));

		/**
		 * Add all static methods to class facade
		 */
		for(var prop in StaticConstructor){
			Facade[prop] = StaticConstructor[prop];
		}
		
		/**
		 * Apply prototpe so that class is instance of all super classes.
		 */
		Facade.prototype = proto;

		/**
		 * Add class to global namespace so that it can be accessed globally.
		 */
		if(nameSpaceString && nameSpaceString.length){
			nameSpace[className] = Facade;
		}

		newDescriptor();

		return Facade;
	}

	/**
	 * Gets referenced by name or if name is 'scope' return scope object.
	 * 
	 * @param  {string}		nameSpaceString
	 *						Globally accessable reference or scope.
	 *						
	 * @param  {object}		scope
	 *						Special scope object.
	 * 
	 * @return {object || function}
	 */
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

	/**
	 * Returns references from strings
	 * 
	 * @param  {object}		descriptor
	 *						Class descriptor object.
	 * @param  {object}		scope
	 *						Special scope object.
	 * 
	 * @return {array}
	 */
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

	/**
	 * Convience method adds imports to the descriptor.
	 * 
	 * @param {string}		[nameSpaceString]
	 *						An array of fully qualified class
	 *					
	 * @param {array}		[array of nameSpaceStrings]
	 *						An array of reference name strings that will be
	 *						referenced by name and passed to the  closure.
	 *						A special reference 'scope' returns a scope object.
	 *						The scope object has a reverence to the 'this' of
	 *						the instance a method public that will expose
	 *						private members and a method super that calles the
	 *						super class constructor.
	 *
	 * @return {packageScope}
	 */
	packageScope.import = function(nameSpaceString){
		if(typeof arguments[0] !== 'string'){
			var imports = arguments[0];
			
			for (var i = 0; i < imports.length; i++) {
				packageScope.import(imports[i]);
			}

			return packageScope;
		}

		descriptor.i.push(nameSpaceString);
		return packageScope;
	};

	packageScope.class = function(fullyQualifiedClassName){
		descriptor.f = fullyQualifiedClassName;
		return packageScope;
	};

	packageScope.extends = function(fullyQualifiedSuperClassName){
		descriptor.s = fullyQualifiedSuperClassName;
		return packageScope;
	};

	/**
	 * Do nothing allows calling facade for prototype and dummy scope.
	 */
	function doNothing(){}

	/**
	 * Do nothing allows calling facade for prototype and dummy scope.
	 */
	function isSuper(){}

	/**
	 * clears the cached descriptor and created a new one with default values.
	 */
	function newDescriptor() {
		descriptor = {
			f:'',
			i:[]
		};
	}
	
	/**
	 * Initilise the first descriptor.
	 */
	newDescriptor();

	window.ps =
	window.packageScope =
	window.packagescope =
	packageScope;
})();