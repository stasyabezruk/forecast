var gulp = require('gulp'),
	watch = require('gulp-watch'),
	less = require('gulp-less'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename');

gulp.task('less', function () {
    return gulp.src('less/*.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
    gulp.watch('less/*.less', ['less']); 
});

gulp.task('default', ['less', 'watch']);

