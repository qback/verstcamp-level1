"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");
var sourcemaps = require('gulp-sourcemaps');

var less = require("gulp-less");
// var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var mqpacker = require('css-mqpacker');

var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var webp = require("gulp-webp");
var rsp = require('remove-svg-properties').stream

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var fileinclude = require('gulp-file-include');
// var htmlmin = require("gulp-html-minifier");

var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

var browserSync = require("browser-sync").create();

gulp.task('markup', function () {
  return gulp.src('./source/*.html')
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('./public/'));
});

gulp.task("styles", function () {
  return gulp.src("./source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({ browsers: ['last 5 versions'] }),
      mqpacker({ sort: true })
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./public/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src([
    './source/js/app.js'
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/js/'))
});

gulp.task('images:decor', function () {
  return gulp.src('./source/img/decoration/**/*.{png,jpg,jpeg,svg}')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('./public/img/decoration'));
});

gulp.task('images:content', function () {
  return gulp.src('./source/img/content/**/*.{png,jpg,jpeg,svg}')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('./public/img/content'));
});

gulp.task('webp', function () {
  return gulp.src('./source/img/content/**/*.{png,jpg}')
    .pipe(plumber())
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest('./public/img/content'));
});

gulp.task('sprite', function () {
  return gulp.src('./source/img/sprite/*.svg')
    .pipe(plumber())
    .pipe(rsp.remove({
      properties: [rsp.PROPS_FILL]
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('./public/img/'));
});

gulp.task('copy', function () {
  return gulp.src([
    './source/fonts/**',
    './source/img/content/**',
    './source/img/decoration/**',
    './source/js/**',
    './source/*.html'
  ], {
      base: './source'
    })
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function () {
  return del('./public');
});

gulp.task('serve', function () {
  browserSync.init({
    open: true,
    server: {
      baseDir: 'public/',
      index: 'index.html'
    }
  });
  browserSync.watch(['./public/**/*.*'], browserSync.reload);
});

gulp.task('watch', function () {
  gulp.watch('./source/**/*.html', gulp.series('markup'));
  gulp.watch('./source/less/**/*.less', gulp.series('styles'));
  gulp.watch('./source/js/**/*.js', gulp.series('scripts'));
  gulp.watch('./source/img/content/**/*.*', gulp.series('images:content'));
  gulp.watch('./source/img/decoration/**/*.*', gulp.series('images:decor'));
  gulp.watch('./source/img/content/**/*.*', gulp.series('webp'));
  gulp.watch('./source/img/sprite/**/*.*', gulp.series('sprite'));
});

gulp.task('default',
  gulp.series(
    'clean',
    'copy',
    'sprite',
    gulp.parallel(
      'markup',
      'styles',
      'scripts',
      'images:decor',
      'images:content',
      'webp',
    ),
    gulp.parallel(
      'watch',
      'serve'
    )
  ));
