

gulp.task('scss', () => {
  return gulp.src('INPUT**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('OUTPUT'));
})