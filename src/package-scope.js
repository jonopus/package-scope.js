'use strict';
(function(){

	/**
	 * Creates a class by creating a a descriptor and passing it to getFacade.
	 * imports, and super class using revealing module pattern.
	 *
	 * @param {string}		[first string]	A fully qualified class name.
	 * @param {string}		[second string]	A fully qualified super class name.
	 * @param {array}		[imports]		An array of fully qualified class
	 *										names or global functions that will
	 *										be referenced by name and passed to
	 *										the  closure. There is a special
	 *										name 'scope' that will resolve to a
	 *										scope object. The scope object has
	 *										a reverence to the instance created
	 *										a methods public that will expose
	 *										private members and super
	 * @param {function}	[closure]		A closure that returns the
	 *										constructor function of the class.
	 *
	 * @return {Class}
	 */
	function packageScope(){

		var descriptor = {f:''};

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

		return getFacade(descriptor);
	}

	/**
	 * Creates a Class from a descriptor.
	 * @param  {object}	Class descriptor.
	 * @return {Class}
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
				_this = this,
				scope = {this:this},
				methods = {},
				_super;

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
				
				/**
				 * If a fully qualified super class name exists create super.
				 */
				if(descriptor.s){

					/**
					 * Super Constructor Facade.
					 * Methods of super class are accessabe on super.
					 */
					_super = function(){
						/**
						 * Only execute once.
						 */
						if(_super.called){
							return;
						}
						_super.called = true;
						
						var superMethods = SuperFacade.apply(_this, arguments).methods;

						for(var prop in superMethods){
							_super[prop] = superMethods[prop];
						}
					};

					scope.super = _super;
				}

				/**
				 * Get class constructor and call it passing generated imports
				 * and apply constructor arguments.
				 */
				(descriptor.d).apply(null, getImports(descriptor, scope)).apply(_this, arguments);

				/**
				 * If super has not be called, call with arguments.
				 */
				if(_super && !_super.called){
					_super.apply(_this, arguments);
				}
				
				/**
				 * expose methods for super.
				 */
				_this.methods = methods;

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

		return Facade;
	}

	/**
	 * Gets referenced by name or if name is 'scope' return scope object.
	 * @param  {string} nameSpaceString	Globally accessable reference or scope.
	 * @param  {object} scope			Special scope object.
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
	 * @param  {object} descriptor	Class descriptor object.
	 * @param  {object} scope		Special scope object.
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
	 * Do nothing allows calling facade for prototype and dummy scope.
	 */
	function doNothing(){}

	window.ps =
	window.packageScope =
	window.packagescope =
	packageScope;
})();