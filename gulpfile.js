'use strict';

var gulp = require('gulp'),
	complexity = require('gulp-complexity'),
	jshint = require('gulp-jshint');

gulp.task('default', function(){
	return gulp.src('*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(complexity());
});
