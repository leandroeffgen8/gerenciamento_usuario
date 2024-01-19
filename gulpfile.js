const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('sass', (done) => {
  gulp.src('./scss/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

gulp.task('watch', () => {
  	gulp.watch('./scss/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('watch'));