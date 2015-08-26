module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      app: {
        entry: "./app/js/app.jsx",
        output: {
          path: __dirname + '/build',
          filename: 'app.js'
        },
        module: {
          loaders: [
            { test: /\.jsx$/, loader: 'jsx-loader'}
          ]
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          './build/main.min.css': ['./app/js/main.css']
        }
      }
    },

    copy: {
      index: {
        files: [
          {expand: true, flatten: true, src: './app/index.html', dest: './build/'}
        ]
      }
    },

    clean: {
      js: ['./build/*.js'],
      css: ['./build/*.css'],
      index: ['./build/*.html']
    },

    jshint: {
      files: [
        'app/**/*.js',
        'app/**/*.jsx',
        'server/**/.*.js'
      ],
      options: {
        force: 'true',
      }
    },

    watch: {
      server: {
        files: ['server/**/*.js'],
        tasks: ['test']
      },
      client: {
        files: ['app/**/*.js', 'app/**/*.jsx'],
        tasks: ['test', 'webpack:app']
      },
      css: {
        files: ['app/main.css'],
        tasks: ['cssmin']
      },
      index: {
        files: ['app/index.html'],
        tasks: ['copy']
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    }

  });

  // Load in Grunt dependencies
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-webpack');


  grunt.registerTask('server-dev', function(target) {
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });

    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run(['watch']);
  });

  // Helper Tasks ////////////////////////////////////////

  grunt.registerTask('build', function(n) {

    grunt.task.run(['webpack']);
    grunt.task.run(['cssmin']);
    grunt.task.run(['copy']);

  });

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // Do production upload/deployment tasks
    }
    else {
      grunt.task.run(['build']);
      grunt.task.run(['server-dev']);
    }
  });

  // Grunt Tasks ////////////////////////////////////////
  grunt.registerTask('deploy', [
    'test',
    'clean',
    'upload'
  ]);

};