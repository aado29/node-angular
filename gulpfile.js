var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('scripts', function () {
  gulp.src(['./app_client/**/*.js', '!./app_client/**/*.test.js', '!./app_client/app.min.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('./app.min.js'))
		.pipe(uglify({mangle: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('public/js/'))
})

gulp.task('ng-templates', function () {
	gulp.src(['./app_client/**/*.html'])
		.pipe(gulp.dest('public/'))
})

gulp.task('watch', () => {
  watch(['./app_client/**/*.js', '!./app_client/**/*.test.js', '!./app_client/app.min.js'], function () {
    gulp.start('scripts')
  })
  watch(['./app_client/**/*.html'], function () {
  	gulp.start('ng-templates')
  })
})

gulp.task('default', ['ng-templates', 'scripts', 'watch'])
