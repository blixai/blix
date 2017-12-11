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
  return gulp.src('INPUT/**/*.js', { read: false })
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
  return gulp.src('INPUT/**/*.js', { read: false })
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

gulp.task('html', function () {
  return gulp.src('INPUT/**/*.html').pipe(gulp.dest('OUTPUT'));
});

gulp.task('minify-html', () => {
  return gulp.src(`INPUT/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`OUTPUT`))
})

gulp.task('css', function () {
  let plugins = [cssnext]
  return gulp.src('INPUT/**/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('OUTPUT'));
});

gulp.task('minify-css', () => {
  let plugins = [cssnext]
  return gulp.src(`INPUT/**/*css`)
    .pipe(postcss(plugins))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`OUTPUT`));
})

gulp.task('scss', () => {
  return gulp.src('INPUT/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('OUTPUT'));
})

gulp.task('clean', function () {
  return del(['OUTPUT']);
});

gulp.task('watch', () => {
  runSequence(
    'clean',
    ['js', 'html', 'css', 'scss']
  )
  gulp.watch('INPUT/**/*', () => {
    runSequence(
      'clean',
      ['js', 'html', 'css', 'scss']
    )
  })
})



gulp.task('default', ['watch'])
gulp.task('production', ['min-js', 'minify-html', 'minify-css'])