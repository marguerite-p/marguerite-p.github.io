const gulp = require('gulp');

const imagemin = require('gulp-imagemin');
const smushit = require('gulp-smushit');
const uglify = require('gulp-uglify');

gulp.task('compress:images', () => {
  return gulp.src('assets/images/.raw/**/*')
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 })
    ]))
    .pipe(smushit({
      verbose: true
    }))
    .pipe(gulp.dest('assets/images'));
});

gulp.task('compress:js', () => {
  return gulp.src('assets/js/src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});
