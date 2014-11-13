module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    coffee:
      compile:
        files:
          'twinky.js': 'twinky.coffee'
          'spec/twinky.spec.js': 'spec/twinky.spec.coffee'

    watch:
      coffee:
        files: ['twinky.coffee', 'spec/twinky.spec.coffee']
        tasks: ["coffee", "uglify"]

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= pkg.version %> */\n"

      dist:
        src: 'twinky.js'
        dest: 'twinky.min.js'

    jasmine:
      options:
        specs: ['spec/twinky.spec.js']
      src: [
        'spec/vendor/sinon-1.7.3/sinon.js',
        'twinky.js'
      ]

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['coffee', 'uglify']
  grunt.registerTask 'build', ['coffee', 'uglify', 'jasmine']
  grunt.registerTask 'test', ['coffee', 'uglify', 'jasmine']
