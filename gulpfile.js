var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require('babelify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var transform = require('vinyl-transform');
var react = require('gulp-react');

var libs = [
  'bootstrap',
  'fuelux',
  'jquery',
  'moment',
  'requirejs',
  'bluebird',
  'es6-promise',
  'fluxy',
  'form-serialize',
  'pluralize',
  'react',
  'react-async',
  'react-select',
  'superagent'
];

gulp.task('browserify', function () {

  var browserified = transform(function (filename) {
    var b = browserify();
    b.transform(reactify);
    b.add(filename);
    libs.forEach(function (lib) {
        b.external(lib);
      });
    return b.bundle();
  });

  return gulp.src(['./src/js/main.js'])
    .pipe(browserified)
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('less', function () {
  gulp.src('./src/css/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy', function () {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
  gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'));
  gulp.src('node_modules/react-select/dist/default.css')
    .pipe(gulp.dest('dist/css'));
  gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('dist/css'));
  gulp.src('bower_components/bootstrap/dist/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
  gulp.src('bower_components/fuelux/dist/css/fuelux.min.css')
    .pipe(gulp.dest('dist/css'));
  gulp.src('bower_components/fuelux/dist/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('react', function () {
  return gulp.src('src/**/*.js')
    .pipe(react())
    // .pipe(uglify())
    .pipe(gulp.dest('lib'));
});

gulp.task('default', ['browserify', 'less', 'copy']);

gulp.task('watch', ['js', 'less'], function () {
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.less', ['less']);
});
