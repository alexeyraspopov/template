module.exports = function(grunt){
	grunt.initConfig({
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				commitFiles: ['-a'],
				commitMessage: 'release %VERSION%',
				tagMessage: 'version %VERSION%',
				pushTo: 'origin'
			}
		},
		jshint: {
			codebase: {
				src: 'src/*.js'
			}
		},
		complexity: {
			codebase: {
				src: 'src/*.js'
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-complexity');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('default', ['jshint', 'complexity', 'uglify']);
};