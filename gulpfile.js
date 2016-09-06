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


gulp.task('default', function(callback) {
    runSequence('clean-build',
              'ts-build',
              ['ts-watch-build', 'other-watch-build'],
              'connect-build',
              'open-build',
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
      return [
        st({ path: 'node_modules', url: '/node_modules' })
      ];
    }
  });
});

gulp.task('open-build', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://127.0.0.1:8080'}));
});