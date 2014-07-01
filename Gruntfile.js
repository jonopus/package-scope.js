// Generated on 2014-06-23 using generator-webexample 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths
	var config = {
		src: 'src',
		dist: 'dist',
		mocha: 'node_modules/mocha',
		chai: 'node_modules/chai',
		example: 'example',
		test: 'test'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: config,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			build: {
				files: [
					'<%= config.src %>/ps.js',
					'Gruntfile.js'
				],
				tasks: [
					'dist'
				]
			},
			example: {
				files: [
					'<%= config.example %>/index.html',
					'<%= config.example %>/scripts/{,*/..}*.js',
					'<%= config.src %>/ps.js',
					'Gruntfile.js'
				],
				tasks: [
					'example'
				],
				options: {
					livereload: true
				}
			},
			test: {
				files: [
					'<%= config.test %>/spec/index.html',
					'<%= config.test %>/spec/test.js',
					'<%= config.src %>/ps.js',
					'Gruntfile.js'
				],
				tasks: [
					'test'
				]
			}
		},
		
		uglify: {
			dist: {
				/*
				options: {
					mangle:false,
					compress:false,
					beautify:true
				},
				*/
				files: {
					'<%= config.dist %>/ps.min.js': [
						'<%= config.src %>/ps.js'
					]
				}
			},
			example: {
				options: {
					mangle:false,
					compress:false,
					beautify:true
				},
				files: {
					'<%= config.dist %>/Main.js': [
						'<%= config.example %>/scripts/{,*/..}*.js'
					]
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= config.dist %>/*'
					]
				}]
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= config.example %>/scripts/{,*/}*.js',
				'<%= config.src %>/ps.js',
				'test/spec/{,*/}*.js'
			]
		},

		// Mocha testing framework configuration options
		mocha: {
			all: {
				options: {
					run: true,
					log: true,
					urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
				}
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function(connect) {
						return [
							connect.static(config.example),
							connect.static(config.dist),
							connect.static(config.src)
						];
					}
				}
			},
			test: {
				options: {
					open: false,
					port: 9001,
					middleware: function(connect) {
						return [
							connect.static(config.mocha),
							connect.static(config.chai),
							connect.static(config.test),
							connect.static(config.src),
							connect.static(config.dist)
						];
					}
				}
			}
		}
		
	});

	grunt.registerTask('serve', [
		'example',
		'connect:livereload',
		'watch:example'
	]);

	grunt.registerTask('test', [
		'dist',
		'connect:test',
		'mocha'
	]);

	grunt.registerTask('example', [
		'dist',
		'uglify:example'
	]);

	grunt.registerTask('dist', [
		'clean',
		'jshint',
		'uglify:dist'
	]);
};