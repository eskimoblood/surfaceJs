module.exports = function(grunt) {

  grunt.initConfig({
    coffee: {
      build: {
        options: {
          join:true
        },
        files: {
          'dist/surfaceLib.js': ['src/Surface.coffee', 'src/*.coffee']
        }
      }
    },
    uglify: {
      build: {
        options: {
          report: 'gzip'
        },
        files: {
          'dist/surfaceLib.min.js': ['dist/surfaceLib.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['coffee:build', 'uglify:build']);

};