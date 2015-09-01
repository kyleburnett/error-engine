// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Grunt export

module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.initConfig({
        mocha_istanbul: {
            coverage: {
                src: 'tests.js',
                options: {
                    coverageFolder: './coverage',
                    excludes: ['tests.js'],
                    reporter: 'spec',
                    reportFormats: ['lcov'],
                    check: {
                        lines: 100,
                        statements: 100,
                        branches: 100,
                        functions: 100
                    }
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['tests.js']
            }
        }
    });

    grunt.registerTask('default', ['test', 'coverage']);

    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage'])
};