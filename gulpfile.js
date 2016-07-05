const gulp = require('gulp');
const plumber = require('gulp-plumber');

const uglify = require('gulp-uglify')
const jshint = require('gulp-jshint');
const webpack = require('gulp-webpack');

const stylus = require('gulp-stylus');

const livereload = require('gulp-livereload');

gulp.task('js', () => {
  gulp.src('./src/js/**/*.js')
    .pipe(jshint({
      esnext: true
    }))
    .pipe(jshint.reporter('default'))
    .pipe(plumber())
    .pipe(webpack({

      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        }]
      },
      output: {
        filename: 'entry.js',
      }

    }))
    // .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload());
});

gulp.task('css', () => {
  gulp.src('./src/styl/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(livereload());
});

gulp.task('html', () => {
  gulp.src('./src/html/*.html')
    .pipe(gulp.dest('./build'))
    .pipe(livereload());
});

gulp.task('watch', () => {
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/styl/*.styl', ['css']);
  gulp.watch('./src/html/*.html', ['html']);
});

gulp.task('server', () => {
  livereload.listen()
})

gulp.task('default', ['server', 'js', 'css', 'html', 'watch']);
