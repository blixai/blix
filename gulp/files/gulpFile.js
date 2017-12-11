var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');

var htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');

var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');

var del = require('del');
var runSequence = require('run-sequence');


var collapse = require('bundle-collapser/plugin')
let envify = require('envify/custom')
let plumber = require('gulp-plumber')

let postcss = require('gulp-postcss')
let cssnext = require('postcss-cssnext')

gulp.task('js', function () {
  return gulp.src('src/**/*.js', { read: false })
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
    .pipe(gulp.dest('public'));
})

gulp.task('min-js', function () {
  return gulp.src('src/**/*.js', { read: false })
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
    .pipe(gulp.dest('public'));
})

gulp.task('html', function () {
  return gulp.src('src/**/*.html').pipe(gulp.dest('public'));
});

gulp.task('minify-html', () => {
  return gulp.src(`./src/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`public`))
})

gulp.task('css', function () {
  let plugins = [cssnext]
  return gulp.src('src/**/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('public'));
});

gulp.task('minify-css', () => {
  let plugins = [cssnext]
  return gulp.src(`./src/**/*css`)
    .pipe(postcss(plugins))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`public`));
})

gulp.task('scss', () => {
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public'));
})

gulp.task('clean', function () {
  return del(['public']);
});

gulp.task('watch', () => {
  runSequence(
    'clean',
    ['js', 'html', 'css', 'scss']
  )
  gulp.watch('src/**/*', () => {
    runSequence(
      'clean',
      ['js', 'html', 'css', 'scss']
    )
  })
})



gulp.task('default', ['watch'])
gulp.task('production', ['min-js', 'minify-html', 'minify-css'])