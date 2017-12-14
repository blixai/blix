

gulp.task('css', function () {
  return gulp.src('INPUT**/*.css')
    .pipe(gulp.dest('OUTPUT'));
});

gulp.task('minify-css', () => {
  return gulp.src(`INPUT**/*css`)
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`OUTPUT`));
})