"use strict";

var U2 = require("uglify-js"),
	fs = require('fs'),
	path = require('path'),
	minimatch = require("minimatch");

var Compiler = function (name, path, code, options) {
	this.code = code,
	this.name = Compiler.compile_modules[name] = name.replace(/[\.\-]/g, '_'),
	this.path = path,
	this.options = options || {},
	this.ast = U2.parse( code ),
	this.first = false;

	for (var key in this.default_options) {
		if (key === 'concat') {
			this.options[key] = this.convertOptionsPath(this.options[key]) || this.default_options[key];
		} else {
			this.options[key] = (this.options[key] || this.default_options[key]);
		}
	}
}

Compiler.compile_modules = {};
Compiler.ignore_modules = {};

Compiler.prototype.default_options = {
	concat: [],
	inline: []
}

Compiler.prototype.compile = function (code) {
	if ("undefined" === typeof code) code = this.code;

	if (this.isContain(this.path, this.options.concat)){
		code = this.compile_concat();
	} else if (this.isInlineMode(code)) {
		code = this.compile_inline(code);
	} else if (this.isProtectMode(code)) {
		code = this.compile_protect(code);
	} else {
		code = this.compile_naked(code);
	}

	return code;
}

Compiler.prototype.convertOptionsPath = function(paths) {
	var base = __dirname;

	if ("string" === typeof paths) paths = [paths];

	for (var i in paths) {
		var pth = paths[i];
		if (pth[0] !== "\/") // relative path
			paths[i] = path.join(base, pth);
	}

	return paths;
}

Compiler.prototype.isContain = function (name, ary) {
	var ret = false;
	// console.log("Contain:", name, ary);
	for (var i in ary) {
		var pattern = ary[i];
		ret = minimatch(name, pattern);
		if (ret) return ret;
	}

	return ret;
}

Compiler.prototype.isInlineMode = function (code) {
	var ret = false,
		funcs = [],
		define_func;

	if ("undefined" === typeof code) code = this.code;


	funcs = this.lookupSymbols("define", U2.AST_Call)
	define_func = funcs && funcs.length > 0 ? funcs[0] : null;

	if (define_func &&
		define_func.args &&
		define_func.args.length > 0) {

        var results = this.resolveDefine(define_func),
   	    	name = results[0], args = results[1], callback = results[2];
   	    var body;

		body = callback.body;

		for (var i in body){
			var line = body[i];
			if ( line instanceof U2.AST_Directive ) {
				if (line.value === "build inline") {
					ret = true;
					return ret;
				}
			}
			else
				break;
		}

	}

	return ret;
}

Compiler.prototype.isProtectMode = function (code) {
	var ret = false,
		define_func,
		funcs = [];

	if ("undefined" === typeof code) code = this.code;

	funcs = this.lookupSymbols("define", U2.AST_Call)
	define_func = funcs && funcs.length > 0 ? funcs[0] : null;

	if (define_func &&
		define_func.args &&
		define_func.args.length > 0) {

        var results = this.resolveDefine(define_func),
   	    	name = results[0], args = results[1], callback = results[2];
   	    var body;

		body = callback.body;
		var lastCode = body[ body.length - 1 ];
					// console.log("BODY");
		if ( lastCode instanceof U2.AST_Return ) {
			// console.log(name, "RETURN");
			ret = true;
			return ret;
		}
	}

	return ret;
}

// node => define function
Compiler.prototype.remapping = function (node) {
	if ( node.args && node.args.length > 0 ) {
		if ( node.args[0] instanceof U2.AST_String) {
			var lastIndex = node.args.length - 1,
				name = node.args[0].value,
				name = Compiler.compile_modules[name] = name.replace(/[\.\-]/g, '_'),
				lastArg = node.args[lastIndex];

			// define([...]) ;
			if ( node.args[1] instanceof U2.AST_Array
				 && lastArg instanceof U2.AST_Function ) {
				var callback = lastArg,
					requires = node.args[1].elements,
					declares = callback.argnames,
					definitions = [];

				if (declares && declares.length > 0) {

					for (var i in declares) {
						var delcare = declares[i].name,
							file = requires[i].value,
							var_name = Compiler.compile_modules[file];

						if (delcare !==  var_name && !Compiler.ignore_modules[var_name]) {
							definitions.push( new U2.AST_VarDef({
								"name": new U2.AST_Symbol({ "name": delcare }),
								"value": new U2.AST_Symbol({ "name": var_name})
							}));

							console.log("name: ", delcare, "value:", var_name);
						}
					}
				}

				if ( definitions.length > 0) {
					return new U2.AST_Var({
						"definitions": definitions
					});
				}
			}
		}
	}

	return null;
}

Compiler.prototype.walk = function(callback) {
	var ast = this.ast;
	ast.walk(new U2.TreeWalker(callback));
}

Compiler.prototype.lookupSymbols = function(name, token_type, count) {
	var index = 0,
		count = "undefined" === typeof count ? 1.0 / 0 : count,
		symbols = [],
		self = this;

	this.walk(function(node){
		if (self.caseName(name, node) &&
			node instanceof token_type &&
			index < count) {
			index++;
			symbols.push(node);
		}
	})

	return symbols;
}

Compiler.prototype.resolveDefine = function(node) {
	var name, args, callback;
	if (this.caseName("define", node) &&
		node instanceof U2.AST_Call) {

		if (node.args && node.args.length > 1) {

			var start_pos = node.start.pos,
				end_pos = node.end.endpos;

			if (name instanceof U2.AST_String) {
				name = node.args[0].value
				args = node.args[1];
				callback = node.args[2]
			} else {
				name = this.name;
				args = node.args[1];
				callback = node.args[2];
			}

		}
	}

	return [name, args, callback];
}

Compiler.prototype.caseName = function(name, node) {
	var node_name;

	if (node instanceof U2.AST_Lambda) {
		node_name = node.name
	} else if (node instanceof U2.AST_VarDef) {
		node_name = node.name
	} else if (node instanceof U2.AST_Call) {
		node_name = node.expression.name
	} else if (node instanceof U2.AST_New) {
		node_name = node.name
	} else if (node instanceof U2.AST_Symbol) {
		node_name = node.name
	}

	return node_name === name;
}

Compiler.prototype.splice_string = function(str, begin, end, replacement) {
	return str.substr(0, begin) + replacement + str.substr(end);
};

Compiler.prototype.compile_inline = function(code) {
	var ret = false,
		funcs = [],
		define_func;

	if ("undefined" === typeof code) code = this.code;


	funcs = this.lookupSymbols("define", U2.AST_Call)
	define_func = funcs && funcs.length > 0 ? funcs[0] : null;

	if (define_func &&
		define_func.args &&
		define_func.args.length > 0) {

        var start_pos = define_func.start.pos,
   	    	end_pos = define_func.end.endpos,
   	    	results = this.resolveDefine(define_func),
   	    	name = results[0], args = results[1], callback = results[2];
   	    var body, lastCode;

		body = callback.body;
		lastCode = body[body.length - 1];

		var repl = new U2.AST_Var({
			"definitions": [
				new U2.AST_VarDef({
					"name": new U2.AST_Symbol({ "name": name }),
					"value": lastCode.value
				})
			]
		}).print_to_string();

		var arg_node;

		if ( arg_node = this.remapping(define_func) ) {
			repl = arg_node.print_to_string() + ";\n" + repl;
		}

		code = this.splice_string(code, start_pos, end_pos, repl);
	}

	return code;
};


Compiler.prototype.compile_protect = function(code) {

	var ret = false,
		funcs = [],
		define_func;

	if ("undefined" === typeof code) code = this.code;


	funcs = this.lookupSymbols("define", U2.AST_Call)
	define_func = funcs && funcs.length > 0 ? funcs[0] : null;

	if (define_func &&
		define_func.args &&
		define_func.args.length > 0) {

        var start_pos = define_func.start.pos,
   	    	end_pos = define_func.end.endpos,
   	    	results = this.resolveDefine(define_func),
   	    	name = results[0], args = results[1], callback = results[2];
   	    var body, lastCode;

		body = callback.body;
		lastCode = body[body.length - 1];
		// console.log("FUNCTON:", new U2.AST_Call({"expression": new U2.AST_Function({ "argnames": [], "body": body }), "args": []}).print_to_string());

		if ( lastCode instanceof U2.AST_Return ) {
			var repl = "var "+ name + "= (function()" +
				new U2.AST_BlockStatement({
					"body": body
				}).print_to_string() +
			")()"
			// var protect = new U2.AST_BlockStatement({
			// 		"body": body
			// 	}),
			// 	repl = new U2.AST_Var({
			// 		"definitions": [
			// 			new U2.AST_VarDef({
			// 				"name": new U2.AST_Symbol({ "name": name }),
			// 				"value": protect
			// 			})
			// 		]
			// 	}).print_to_string();

			var arg_node;

			if ( arg_node = this.remapping(define_func) ) {
				repl = arg_node.print_to_string() + ";\n" + repl;
			}

			code = this.splice_string(code, start_pos, end_pos, repl);
		}
	}

	return code;
};

Compiler.prototype.compile_naked = function(code) {
	var ret = false,
		funcs = [],
		define_func;

	if ("undefined" === typeof code) code = this.code;

	funcs = this.lookupSymbols("define", U2.AST_Call)
	define_func = funcs && funcs.length > 0 ? funcs[0] : null;

	if (define_func &&
		define_func.args &&
		define_func.args.length > 0) {
	    var start_pos = define_func.start.pos,
	    	end_pos = define_func.end.endpos,
	    	results = this.resolveDefine(define_func),
	    	name = results[0], args = results[1], callback = results[2];

		if (callback instanceof U2.AST_Function) {
			// console.log( "FUNC" );
			var body = callback.body;
			var repl = [];
			for (var i in body) {
				var line = body[i];
				repl.push( line.print_to_string() );
			}
			repl = repl.join('\n');

			var arg_node;

			if (arg_node = this.remapping(define_func)) {
				repl = arg_node.print_to_string() + ";\n" + repl;
			}
			// console.log( typeof replacement );

			code = this.splice_string(code, start_pos, end_pos, repl);
		}
	}

	return code;
};

Compiler.prototype.compile_concat = function(code) {
	if ("undefined" === typeof code) code = this.code;

	Compiler.ignore_modules[this.name] = true;
	return code;
};


exports.Compiler = Compiler;