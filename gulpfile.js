let gulp = require('gulp');
let ts = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let del = require('del');
let runSequence = require('run-sequence');
let connect = require('gulp-connect');
let concat = require('gulp-concat');
let open = require('gulp-open');
let watch = require('gulp-watch');
let st = require('st');
let uglify = require('gulp-uglify');

let vendor = [
  {path: 'node_modules/phaser/build', file: 'phaser.min.js'},
  {path: 'node_modules/systemjs/dist', file: 'system.js'}
]


gulp.task('default', function(callback) {
    runSequence('clean-build',
              'ts-build',
              ['ts-watch-build', 'other-watch-build'],
              'connect-build',
              'open-build',
              callback);
});

gulp.task('dist', function(callback) {
    runSequence('clean-build',
              ['ts-build', 'clean-dist'],
              'files-dist',
              ['js-dist', 'vendor-dist'],
              callback);
});

gulp.task('clean-build', function() {
    return del(['build']);
});

gulp.task('ts-build', function() {
  var tsResult = gulp.src(['./src/ts/**/*.ts', './typings/**/*.ts'])
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
    .pipe(ts({
            noExternalResolve: true
        }));

  return tsResult.js
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest('build/js'))
    .pipe(connect.reload());
});

gulp.task('ts-watch-build', function() {
    return gulp.watch(['./src/ts/**/*.ts'], ['ts-build']);
});

gulp.task('other-watch-build', function() {
    return gulp.watch(['./src/*.html', './src/css/*.css'], ['connect-reload']);
});

gulp.task('connect-reload', function () {
  return gulp.src(__filename)
    .pipe(connect.reload());
});

gulp.task('connect-build', function () {
  connect.server({
    name: 'Phaser',
    root: ['src', 'build'],
    port: 8080,
    livereload: true,
    middleware: function (connect, opt) {
      return vendor.map(function(v) {
        return st({ path: v.path, url: '/vendor', passthrough: true })
      });
    }
  });
});

gulp.task('open-build', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://127.0.0.1:8080'}));
});

gulp.task('clean-dist', function() {
    return del(['dist']);
});

gulp.task('files-dist', function() {
  return gulp.src(['src/**', '!src/ts', '!src/ts/**'])
    .pipe(gulp.dest('dist'));
});

gulp.task('js-dist', function() {
  return gulp.src('build/**/*.js')
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('vendor-dist', function() {
  return gulp.src(vendor.map(function(v) {
    return v.path + '/' + v.file;
  }))
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('connect-dist', function () {
  connect.server({
    name: 'Phaser',
    root: ['dist'],
    port: 7070,
    livereload: false
  });
  gulp.src(__filename)
  .pipe(open({uri: 'http://127.0.0.1:7070'}));
});