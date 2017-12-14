var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin')
let envify = require('envify/custom')
let plumber = require('gulp-plumber')
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var del = require('del');
var runSequence = require('run-sequence');




gulp.task('js', function () {
  return gulp.src('INPUT**/*.js', { read: false })
    .pipe(tap(function (file) {
    gutil.log('bundling ' + file.path);
    file.contents = browserify(file.path, { debug: true })
      .transform("babelify", { presets: ["env"] })
      .plugin(collapse)
      .bundle()
      .on('error', function (error) {
        console.log('error');
        this.emit('end');
      })
    }))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(gulp.dest('OUTPUT'));
})

gulp.task('min-js', function () {
  return gulp.src('INPUT**/*.js', { read: false })
    .pipe(tap(function (file) {
      gutil.log('bundling ' + file.path);
      file.contents = browserify(file.path, { debug: false })
        .transform("babelify", { presets: ["env"] })
        .transform({ global: true }, envify({ NODE_ENV: 'production' }))
        .plugin(collapse)
        .bundle()
        .on('error', function (error) {
          console.log('error');
          this.emit('end');
        })
    }))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('OUTPUT'));
})


gulp.task('clean', function () {
  return del(['OUTPUT']);
});

gulp.task('watch', () => {
  runSequence(
    'clean',
    ['js']
  )
  gulp.watch('INPUT**/*', () => {
    runSequence(
      'clean',
      ['js']
    )
  })
})



gulp.task('default', ['watch'])
gulp.task('production', ['min-js'])