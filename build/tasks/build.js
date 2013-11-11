module.exports = function( grunt ) {

	"use strict";

	var fs = require( "fs" ),
		requirejs = require("../r"),
		rdefineEnd = /\}\);[^}\w]*$/,
		Compiler = require("../compile").Compiler,
		config = {
			baseUrl: "src",
			name: "main",
			out: "dist/client.js",
			wrap: {
				start: "(function(window) {",
				end: "}(this));"
			},
			// We have multiple minify steps
			optimize: "none",
			onBuildWrite: convert,
			paths: {
				"socket.io": "../src/vendor/socket.io"
			},
			compile: {
				concat: [ "../src/vendor/**/*.js" ]
			}
			// shim: {
			// 	"socket.io": {
			// 		exports: "io"
			// 	}
			// }
		};


	function convert( name, path, contents ) {

		try {
			var compile = new Compiler(name, path, contents, config.compile);
			contents = compile.compile()
			// contents = compile.compile(contents, config.compile);
		}
		catch (e) {
			console.error(e.stack);
		}

		return contents;
	}


	grunt.registerMultiTask('build', 'Build stuff.', function() {
		var name = this.data.dest;

		// config.out = function( compiled ) {
		// 	compiled = compiled
		// 		// Embed Version
		// 		.replace( /@VERSION/g, version )
		// 		// Embed Date
		// 		// yyyy-mm-ddThh:mmZ
		// 		.replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );

		// 	// Write concatenated source to file
		// 	grunt.file.write( name, compiled );
		// };


		requirejs.optimize(config, function( response ) {
			grunt.verbose.writeln( response );
			grunt.log.ok( "File '" + name + "' created." );
			done();
		}, function( err ) {
			done( err );
		});
	});
};
