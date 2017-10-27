var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');

var htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');

var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');

var del = require('del');
var runSequence = require('run-sequence');


var collapse = require('bundle-collapser/plugin')
let envify = require('envify/custom')

gulp.task('js', function () {
  return gulp.src('src/**/*.js', { read: false })
    .pipe(tap(function (file) {
      gutil.log('bundling ' + file.path);
      file.contents = browserify(file.path, { debug: true }).transform("babelify", { presets: ["env"] }).plugin(collapse).bundle();
    }))
    .on('error', onError)
    .pipe(buffer())
    .pipe(gulp.dest('public'));
})

gulp.task('min-js', function () {
  return gulp.src('src/**/*.js', { read: false })
    .pipe(tap(function (file) {
      gutil.log('bundling ' + file.path);
      file.contents = browserify(file.path, { debug: false }).transform("babelify", { presets: ["env"] }).transform({ global: true }, envify({ NODE_ENV: 'production' })).plugin(collapse).bundle();
    }))
    .on('error', onError)
    .pipe(buffer())
    .pipe(uglify())
    .on('error', onError)
    .pipe(gulp.dest('public'));
})

gulp.task('html', function () {
  return gulp.src('src/**/*.html').pipe(gulp.dest('public').on('error', onError));
});

gulp.task('minify-html', () => {
  return gulp.src(`./src/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .on('error', onError)
    .pipe(gulp.dest(`public`))
})

gulp.task('css', function () {
  return gulp.src('src/**/*.css').pipe(gulp.dest('public').on('error', onError));
});

gulp.task('minify-css', () => {
  return gulp.src(`./src/**/*css`)
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .on('error', onError)
    .pipe(gulp.dest(`public`));
})

gulp.task('clean', function () {
  return del(['public']);
});

gulp.task('watch', () => {
  runSequence(
    'clean',
    ['js', 'html', 'css']
  )
  gulp.watch('src/**/*', () => {
    runSequence(
      'clean',
      ['js', 'html', 'css']
    )
  })
})



function onError(err) {
  console.log(err);
  this.emit('end');
}



gulp.task('default', ['watch'])
gulp.task('production', ['min-js', 'minify-html', 'minify-css'])