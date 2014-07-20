module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: [
                'build/'
            ],
            deploy: [
                '../../prod/'
            ]
        },
        cssmin: {
            build: {
                expand: true,
                src: ['css/**/*.css'],
                dest: 'build/',
                ext: '.css'
            }
        },
        uglify: {
            build: {
                expand: true,
                src: ['js/**/*.js'],
                dest: 'build/',
                ext: '.js'
            }
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        src: ['img/**/*'],
                        dest: 'build'
                    }, {
                        expand: true,
                        src: ['tmpl/**/*'],
                        dest: 'build'
                    }, {
                        expand: true,
                        src: ['bower_components/**/*'],
                        dest: 'build'
                    }, {
                        expand: true,
                        src: ['index.html'],
                        dest: 'build'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', [
        'clean:build',
        'cssmin:build',
        'uglify:build',
        'copy:build'
    ]);
};