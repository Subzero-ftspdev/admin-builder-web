var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglifyjs');
//***********
//
// Watchable files
//
//***********

//
//SASS
//
gulp.task('sass', function () {
  return gulp.src('./src/sass/style.min.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./ss'));
});
//
// Javascript
//

gulp.task('compressjS', function() {
  return gulp.src('./src/js/*.js')
  .pipe(uglify('script.min.js', {
    outSourceMap: true,
    mangle: false
  }))
  .pipe(gulp.dest('./ss'));
});

//
// First run files
//

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/custom/*.scss', ['sass']);
  gulp.watch('./src/sass/style.min.scss', ['sass']);
  gulp.watch('./src/js/*.js', ['compressjS']);

});
gulp.task('default', ['sass','compressjS','sass:watch']);
