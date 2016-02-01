'use strict';

module.exports = function(grunt) {
    var pkg, taskName;
    pkg = grunt.file.readJSON('package.json');
    var serveStatic = require('serve-static');
    grunt.initConfig({
        compass: {
            dist: {
                options: {
                    config: 'styles/scss-config.rb'
                }
            }
        },
        watch: {
            sass: {
                files: ['styles/scss/style.scss'],
                tasks: ['compass', 'csscomb'],
                options: {
                    //変更されたらブラウザを更新
                    livereload: true,
                    nospawn: true
                }
            }
        },
        connect: {
            livereload: {
                options: {
                    port: 9001,
                    middleware: function(connect, options) {
                        return [
                          serveStatic('.tmp'),
                          connect().use('/bower_components', serveStatic('./bower_components')),
                          serveStatic(".")
                        ];
                    }
                }
            }
        },
        csscomb:{
            dev:{
                expand: true,
                cwd: 'styles/',
                src: ['*.css'],
                dest: 'styles/css/'
            }
        }
    });
 
    for(taskName in pkg.devDependencies) {
        if(taskName.substring(0, 6) == 'grunt-') {
            grunt.loadNpmTasks(taskName);
        }
    }
 
    grunt.registerTask('default', ['connect', 'watch:sass']);
 
    grunt.registerTask('eatwarnings', function() {
        grunt.warn = grunt.fail.warn = function(warning) {
            grunt.log.error(warning);
        };
    });
};