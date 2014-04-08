'use strict';

var gulp = require('gulp'),
	complexity = require('gulp-complexity'),
	jshint = require('gulp-jshint'),
	browserify = require('gulp-browserify');

gulp.task('default', function(){
	return gulp.src('*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(complexity());
});

gulp.task('lab', function(){
	return gulp.src('lab/index.js')
		.pipe(browserify({
			require: [
				['../index.js', { expose: 'template' }],
				['../bower_components/reactive/index.js', { expose: 'reactive' }]
			]
		}))
		.pipe(gulp.dest('lab/dest'));
});

gulp.task('watch', function(){
	gulp.watch(['index.js', 'lab/index.js'], ['lab']);
});
