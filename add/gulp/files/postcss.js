


gulp.task('css', function () {
  let plugins = [cssnext]
  return gulp.src('INPUT**/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('OUTPUT'));
});

gulp.task('minify-css', () => {
  let plugins = [cssnext]
  return gulp.src(`INPUT**/*css`)
    .pipe(postcss(plugins))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`OUTPUT`));
})