'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-cleancss');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

const rename = require('gulp-rename');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const paths =  {
  src: './src/',              // paths.src
  build: './build/'           // paths.build
};
function styles() {
  return gulp.src(paths.src + 'scss/main.scss')
      .pipe(plumber())
      .pipe(sassGlob())
      .pipe(sass()) // { outputStyle: 'compressed' }
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(paths.build + 'css/'))
}
function scripts() {
  return gulp.src(paths.src + 'js/*.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest(paths.build + 'js/'))
}

function htmls() {
  return gulp.src(paths.src + '*.html')
      .pipe(plumber())
      .pipe(gulp.dest(paths.build));
}
function img() {
  return gulp.src(paths.src + 'img/*')
      .pipe(gulp.dest(paths.build + 'img'));
}
function fonts() {
  return gulp.src(paths.src + 'fonts/**/*')
      .pipe(gulp.dest(paths.build + 'fonts'));
}
function clean() {
  return del('build/')
}

function watch() {
  gulp.watch(paths.src + 'scss/**/*.scss', styles);
  gulp.watch(paths.src + 'js/*.js', scripts);
  gulp.watch(paths.src + '*.html', htmls);
  gulp.watch(paths.src + 'img/*', img);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
  browserSync.watch(paths.build + '**/*.*', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.htmls = htmls;
exports.clean = clean;
exports.watch = watch;
exports.img = img;
exports.fonts = fonts;

gulp.task('build', gulp.series(
    clean,
    styles,
    scripts,
    htmls,
    img,
    fonts
    // gulp.parallel(styles, scripts, htmls, img, fonts)
));

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, scripts, htmls, img, fonts),
    gulp.parallel(watch, serve)
));
