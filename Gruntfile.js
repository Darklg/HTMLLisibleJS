module.exports = function(grunt) {
    // Tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'assets/js/events.js',
                'assets/js/htmllisible.js',
                'assets/js/jsutilities.js'
            ],
        },
    });

    grunt.registerTask('default', [
        'jshint',
    ]);
};