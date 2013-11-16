/*global module:false*/
module.exports = function(grunt) {

  var mountFolder = function (connect, dir) {
      return connect.static(require('path').resolve(dir));
  };

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dist: {
        src: [ 'src/**/*.js', '!src/vendor/**/*.js' ]
      }
    },
    browserify: {
      client: {
        src: ['compile/main.js'],
        dest: 'dist/client.js',
        cwd: 'compile'
      }
    },
    connect: {
      options: {
          port: 9000,
          // change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost'
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'public')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'src'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'dist',
          dest: 'public',
          src: [
            '**/*',
          ]
        }]
      },
      source: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'compile',
          src: [ '**/*', '!**/*.coffee' ]
        }]
      },
      tmp: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.tmp',
          dest: 'compile',
          src: [ '**/*', '!**/*.coffee' ]
        }]
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: './compile',
          name: 'caramal',
          mainConfigFile: 'require.js',
          out: 'dist/client.js',
        }
      }
    },
    coffee: {
      glob_to_multiple: {
        expand: true,
        // flatten: true,
        cwd: 'src',
        src: ['**/*.coffee'],
        dest: '.tmp/',
        ext: '.js'
      }
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html'],
          reporter: 'Landing'
        }
      }
    },
    karma: {
      unit: {
        options: {
          configFile: 'karma.conf.js',
          // files: ['test/spec/**/*_spec.js']
        }
      }
    },
    clean: {
      build: ['compile', '.tmp']
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('copy:compile', function(target) {
    grunt.task.run(['copy:source', 'copy:tmp']);
  });

  grunt.registerTask('build', ['copy:compile', 'requirejs']);

  grunt.registerTask('default', ['coffee', 'build', 'jshint', 'clean']);

  grunt.registerTask('test', [
    'coffee',
    'build',
    'test:chat_server',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('test:chat_server', function(target) {
    var spawn = require('child_process').spawn,
        server = spawn('node', [ 'test/test-server.js' ]);

    console.log('launch child pid: ' + server.pid);

    server.stdout.on('data', function (data) {
      console.log('chat: ' + data);
    });

    server.stderr.on('data', function (data) {
      console.log('chat-err: ' + data);
    });

    server.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
    // test_server.stdin.end();
  });

  grunt.registerTask('test:keep', [ 'connect:test:keepalive' ]);


  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['browserify', "copy:dist", 'connect:dist:keepalive']);
    }
  });

};
