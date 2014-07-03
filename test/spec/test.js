'use strict';
/* global
describe,
it,
assert,
expect,
should,
ps,
packageScope,
packagescope,
com
 */

(function () {
	describe('Package Scope JS', function () {
		it('should exist', function(){
			console.log('Test', 1);
			ps.should.be.a('function');
			packageScope.should.be.a('function');
			packagescope.should.be.a('function');
			
			ps.should.equal(packageScope);
			ps.should.equal(packagescope);
		});
				
		function testClass(className, Class){

			it('should exist', function(){
				console.log('Test', className, 1.1);
				Class.should.be.a('function');
			});

			it('should do something static', function(){
				console.log('Test', className, 1.2);
				Class.tryToGetSomthingPrivate.should.be.a('function');
			});
			
			describe('private property accessed statically', function () {
				it('should not exist', function(){
					console.log('Test', className, 1.3);
					var propertyAccessedStatically = Class.tryToGetSomthingPrivate();
					assert.equal(propertyAccessedStatically, undefined);
				});
			});

			describe('instance', function () {
				var
				instance;

				it('should instantiate', function(){
					console.log('Test', className, 1.4);
					expect(function(){
						instance = new Class('Instance A');
					}).to.not.throw(Error);
				});

				it('should exist', function(){
					console.log('Test', className, 1.5);
					instance.should.be.a('object');
				});

				it('should be instance of correct Class', function(){
					console.log('Test', className, 1.6);

					console.log('');
					console.log('instance', instance);
					console.log('');
					console.log('Class', Class);
					console.log('');
					assert.equal(instance instanceof Class, true);
				});

				it('should do something public', function(){
					console.log('Test', className, 1.7);
					instance.getSomethingPrivate.should.be.a('function');
				});

				it('should not do something private', function(){
					console.log('Test', className, 1.8);
					should.not.exist(instance.doSomethingPrivate);
				});

			});
		}
				
		function testImports(className, Class){
			describe('import', function () {
				var
				instance = new Class('Instance A');

				it('should exist', function(){
					console.log('Test', className, 2.1);
					should.exist(instance.getImportedClass());
				});

				it('should exist', function(){
					console.log('Test', className, 2.2);
					should.exist(com.ps.test.ClassWithName);
				});

				it('should be instance of correct Class', function(){
					console.log('Test', className, 2.3);
					assert.equal(instance.getImportedClassInstance() instanceof com.ps.test.ClassWithName, true);
				});

				it('should be reference to correct Class', function(){
					console.log('Test', className, 2.4);
					assert.equal(instance.getImportedClass() === com.ps.test.ClassWithName, true);
				});
			});
		}
				
		function testSuper(className, Class){
			describe('super', function () {
				var
				instance = new Class('superValue', 'baseValue');

				it('should exist', function(){
					console.log('Test', className, 3.1);
					should.exist(instance.getSomethingPrivate());
				});

				it('should exist', function(){
					console.log('Test', className, 3.1);
					should.exist(instance.getBaseSomethingPrivate());
				});

				it('should have overwritten method', function(){
					console.log('Test', className, 3.2);
					instance.getSomethingPrivate().should.equal('superValue');
				});

				it('should reference super prop with super method', function(){
					console.log('Test', className, 3.3);
					instance.getBaseSomethingPrivate().should.equal('baseValue');
				});

				it('should reference base prop', function(){
					console.log('Test', className, 3.4);
					instance.getSomethingFromBase().should.equal('fromBase');
				});

				it('should have super', function(){
					console.log('Test', className, 3.5);
					instance.super.should.be.a('function');
				});

				it('should have super method', function(){
					console.log('Test', className, 3.6);
					instance.super.getSomethingPrivate.should.be.a('function');
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

						function getSomethingPrivate() {
							return privateProperty;
						}

						function doSomethingPrivate() {
							
						}

						ClassAnonymous.tryToGetSomthingPrivate = function(){
							return privateProperty;
						};

						scope.public('getSomethingPrivate', getSomethingPrivate);
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

					function getSomethingPrivate() {
						return privateProperty;
					}

					function doSomethingPrivate() {
						
					}

					ClassWithName.tryToGetSomthingPrivate = function(){
						return privateProperty;
					};

					scope.public('getSomethingPrivate', getSomethingPrivate);
					return ClassWithName;
				}
			);

			testClass('ClassWithName', com.ps.test.ClassWithName);
		});
		
		describe('Class with imports', function () {
			ps(
				'com.ps.test.ClassWithImports',
				[
					'scope',
					'com.ps.test.ClassWithName'
				],
				function(scope, ClassWithName){
					var
					privateProperty,
					ClassWithNameInstance;

					function ClassWithImports(val) {
						privateProperty = val;
						ClassWithNameInstance = new ClassWithName();
						doSomethingPrivate();
					}

					function getSomethingPrivate() {
						return privateProperty;
					}

					function doSomethingPrivate() {
						
					}

					function getImportedClass() {
						return ClassWithName;
					}

					function getImportedClassInstance() {
						return ClassWithNameInstance;
					}

					ClassWithImports.tryToGetSomthingPrivate = function(){
						return privateProperty;
					};

					
					scope.public({
						getSomethingPrivate:getSomethingPrivate,
						getImportedClass:getImportedClass,
						getImportedClassInstance:getImportedClassInstance
					});
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

					function getBaseSomethingPrivate() {
						return scope.super.getSomethingPrivate();
					}

					ClassWithSuper.tryToGetSomthingPrivate = function(){
						return privateProperty;
					};

					scope.public('getSomethingPrivate', getSomethingPrivate);
					scope.public('getBaseSomethingPrivate', getBaseSomethingPrivate);
					return ClassWithSuper;
				}
			);

			testClass('ClassWithSuper', com.ps.test.ClassWithSuper);
			testSuper('ClassWithSuper', com.ps.test.ClassWithSuper);
		});
	});
})();
