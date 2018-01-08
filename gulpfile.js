const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const smushit = require('gulp-smushit');

gulp.task('compress', () => {
  return gulp.src('assets/images/raw/*')
    .pipe(imagemin([
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 })
    ]))
    .pipe(smushit({
      verbose: true
    }))
    .pipe(gulp.dest('assets/images'));
});
