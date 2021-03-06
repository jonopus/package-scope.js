'use strict';
/* global
describe,
assert,
expect,
it,
should,
ps,
packageScope,
packagescope,
com
 */

(function () {
	describe('Package Scope JS', function () {
		it('1, should exist', function(){
			ps.should.be.a('function');
			packageScope.should.be.a('function');
			packagescope.should.be.a('function');
			
			ps.should.equal(packageScope);
			ps.should.equal(packagescope);
		});
				
		function testClass(className, Class){

			it(className + ' 1.1, should exist', function(){
				Class.should.be.a('function');
			});

			it(className + ' 1.2, should do something static', function(){
				Class.tryToGetSomthingPrivate.should.be.a('function');
			});
			
			describe('private property accessed statically', function () {
				it(className + ' 1.3, should not exist', function(){
					var propertyAccessedStatically = Class.tryToGetSomthingPrivate();
					assert.equal(propertyAccessedStatically, undefined);
				});
			});

			describe('instance', function () {
				var
				instance;

				it(className + ' 1.4, should instantiate', function(){
					expect(function(){
						instance = new Class('Instance A');
					}).to.not.throw(Error);
				});

				it(className + ' 1.5, should exist', function(){
					instance.should.be.a('object');
				});

				it(className + ' 1.6, should be instance of correct Class', function(){
					assert.equal(instance instanceof Class, true);
				});

				it(className + ' 1.7, should do something public', function(){
					instance.getSomethingPrivate.should.be.a('function');
				});

				it(className + ' 1.8, should not do something private', function(){
					should.not.exist(instance.doSomethingPrivate);
				});


				it(className + ' 1.9, scope.this should reference self', function(){
					instance.getThis().should.equal(instance);
				});

			});
		}
		
		function testImports(className, Class){
			describe('import', function () {
				var
				instance = new Class('Instance A');

				it(className + ' 2.1, should exist', function(){
					should.exist(instance.getImportedClass());
				});

				it(className + ' 2.2, should exist', function(){
					should.exist(com.ps.test.ClassWithName);
				});

				it(className + ' 2.3, should be instance of correct Class', function(){
					assert.equal(instance.getImportedClassInstance() instanceof com.ps.test.ClassWithName, true);
				});

				it(className + ' 2.4, should be reference to correct Class', function(){
					assert.equal(instance.getImportedClass() === com.ps.test.ClassWithName, true);
				});
			});
		}
		
		function testSuper(className, Class){
			describe('super', function () {
				
				var
				instance;

				it(className + ' 3.1, should instantiate', function(){
					instance = new Class('superValue', 'baseValue');
				});

				it(className + ' 3.2, should exist', function(){
					should.exist(instance.getSomethingPrivate());
				});

				it(className + ' 3.3, should exist', function(){
					should.exist(instance.getBaseSomethingPrivate());
				});

				it(className + ' 3.4, should have overwritten method', function(){
					instance.getSomethingPrivate().should.equal('superValue');
				});

				it(className + ' 3.5, should reference super prop with super method', function(){
					instance.getBaseSomethingPrivate().should.equal('baseValue');
				});

				it(className + ' 3.6, should reference base prop', function(){
					instance.getSomethingFromBase().should.equal('fromBase');
				});

				it(className + ' 3.8, should be instanceof super Class', function(){
					assert.equal(instance instanceof com.ps.test.MidClass, true);
				});

				it(className + ' 3.9, should be instanceof super super Class', function(){
					assert.equal(instance instanceof com.ps.test.BaseClass, true);
				});

				it(className + ' 3.10, should not be instanceof some other Class', function(){
					assert.equal(instance instanceof com.ps.test.ClassWithName, false);
				});
			});
		}
		
		describe('Class that is anonymous', function () {
			testClass(
				'ClassAnonymous',
				ps(
					['scope'],
					function(scope){
						var privateProperty;

						function ClassAnonymous(val) {
							privateProperty = val;

							doSomethingPrivate();
						}

						function doSomethingPrivate() {
							
						}

						function getSomethingPrivate() {
							return privateProperty;
						}
						scope.public('getSomethingPrivate', getSomethingPrivate);

						function getThis(){
							return scope.this;
						}
						scope.public('getThis', getThis);

						ClassAnonymous.tryToGetSomthingPrivate = function(){
							return privateProperty;
						};

						return ClassAnonymous;
					}
				)
			);
		});
		
		describe('Class with name', function () {
			ps(
				'com.ps.test.ClassWithName',
				['scope'],
				function(scope){
					var
					privateProperty;

					function ClassWithName(val) {
						privateProperty = val;

						doSomethingPrivate();
					}

					function doSomethingPrivate() {
						
					}

					function getSomethingPrivate() {
						return privateProperty;
					}
					scope.public('getSomethingPrivate', getSomethingPrivate);

					function getThis(){
						return scope.this;
					}
					scope.public('getThis', getThis);

					ClassWithName.tryToGetSomthingPrivate = function(){
						return privateProperty;
					};

					return ClassWithName;
				}
			);

			testClass('ClassWithName', com.ps.test.ClassWithName);
		});
		
		describe('Class with imports', function () {
			ps(
				'com.ps.test.ClassWithImports',
				['scope', com.ps.test.ClassWithName],
				function(scope, ClassWithName){
					var
					privateProperty,
					ImportedClass;

					function ClassWithImports(val) {
						privateProperty = val;
						doSomethingPrivate();

						ImportedClass = ClassWithName;
					}

					function doSomethingPrivate() {
						
					}

					function getSomethingPrivate() {
						return privateProperty;
					}
					scope.public('getSomethingPrivate', getSomethingPrivate);

					function getImportedClass() {
						return ImportedClass;
					}
					scope.public('getImportedClass', getImportedClass);

					function getImportedClassInstance() {
						return new ImportedClass();
					}
					scope.public('getImportedClassInstance', getImportedClassInstance);

					function getThis(){
						return scope.this;
					}
					scope.public('getThis', getThis);

					ClassWithImports.tryToGetSomthingPrivate = function(){
						return privateProperty;
					};

					return ClassWithImports;
				}
			);

			testClass('ClassWithImports', com.ps.test.ClassWithImports);
			testImports('ClassWithImports', com.ps.test.ClassWithImports);
		});
		
		describe('class with super:', function () {
			ps(
				'com.ps.test.BaseClass',
				['scope'],
				function(scope){
					function BaseClass() {
						scope.privateBaseProperty = 'fromBase';
					}

					function getSomethingFromBase() {
						return scope.privateBaseProperty;
					}

					scope.public('getSomethingFromBase', getSomethingFromBase);

					function getThis(){
						return scope.this;
					}

					scope.public('getThis', getThis);
					return BaseClass;
				}
			);
			ps(
				'com.ps.test.MidClass',
				'com.ps.test.BaseClass',
				['scope'],
				function(scope){
					var
					privateProperty;

					function MidClass(val) {
						privateProperty = val;

						doSomethingPrivate();
					}

					function doSomethingPrivate() {
						
					}

					function getSomethingPrivate() {
						return privateProperty;
					}

					scope.public('getSomethingPrivate', getSomethingPrivate);

					function getThis(){
						return scope.this;
					}

					scope.public('getThis', getThis);
					return MidClass;
				}
			);
			ps(
				'com.ps.test.ClassWithSuper',
				'com.ps.test.MidClass',
				['scope'],
				function(scope){
					var
					privateProperty;

					function ClassWithSuper(val, val2) {
						scope.super(val2);
						privateProperty = val;
					}

					function getSomethingPrivate() {
						return privateProperty;
					}
					scope.public('getSomethingPrivate', getSomethingPrivate);

					function getBaseSomethingPrivate() {
						return scope.super.getSomethingPrivate();
					}
					scope.public('getBaseSomethingPrivate', getBaseSomethingPrivate);

					function getThis(){
						return scope.this;
					}
					scope.public('getThis', getThis);

					ClassWithSuper.tryToGetSomthingPrivate = function(){
						return privateProperty;
					};

					return ClassWithSuper;
				}
			);

			testClass('ClassWithSuper', com.ps.test.ClassWithSuper);
			testSuper('ClassWithSuper', com.ps.test.ClassWithSuper);
		});
	});
})();
