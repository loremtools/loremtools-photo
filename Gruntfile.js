module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      '  */\n',
    
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['karma']);
};