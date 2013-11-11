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
        src: ['src/main.js'],
        dest: 'dist/client.js',
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-browserify');
  // grunt.loadNpmTasks('grunt-contrib-qunit');

  // grunt.loadTasks("build/tasks");

  // These plugins provide necessary tasks.

  // Default task.
  grunt.registerTask('default', ['browserify', 'jshint']);

  grunt.registerTask('test', [
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('test:keep', [ 'connect:test:keepalive' ]);


  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['browserify', "copy:dist", 'connect:dist:keepalive']);
    }
  });

};
