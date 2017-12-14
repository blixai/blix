

gulp.task('html', function () {
  return gulp.src('INPUT**/*.html').pipe(gulp.dest('OUTPUT'));
});

gulp.task('minify-html', () => {
  return gulp.src(`INPUT**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`OUTPUT`))
})