/*
 The MIT License

 Copyright (c) 2017 - Klaus Landsdorf (http://bianco-royal.de/)
 All rights reserved.
 node-red-contrib-iiot-jwt
 */

'use strict'

const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const jsdoc = require('gulp-jsdoc3')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const sequence = require('gulp-sequence')
const sourcemaps = require('gulp-sourcemaps')
const pump = require('pump')

gulp.task('default', function () {
  // place code for your default task here
})

gulp.task('docs', sequence('doc', 'docIcons', 'docExamples', 'docImages'))
gulp.task('build', sequence('clean', 'web', 'nodejs', 'locale'))
gulp.task('publish', sequence('build', 'public', 'icons', 'docs', 'releaseExamples'))

gulp.task('icons', function () {
  return gulp.src('src/icons/**/*').pipe(gulp.dest('jwt/icons'))
})

gulp.task('docIcons', function () {
  return gulp.src('src/icons/**/*').pipe(gulp.dest('docs/gen/icons'))
})

gulp.task('docExamples', function () {
  return gulp.src('examples/**/*').pipe(gulp.dest('docs/gen/examples'))
})

gulp.task('releaseExamples', function () {
  return gulp.src('examples/**/*').pipe(gulp.dest('jwt/examples'))
})

gulp.task('docImages', function () {
  return gulp.src('images/**/*').pipe(gulp.dest('docs/gen/images'))
})

gulp.task('locale', function () {
  return gulp.src('src/locales/**/*').pipe(gulp.dest('jwt/locales'))
})

gulp.task('public', function () {
  return gulp.src('src/public/**/*').pipe(gulp.dest('jwt/public'))
})

gulp.task('clean', function () {
  return gulp.src(['jwt', 'docs/gen', 'maps'])
    .pipe(clean({force: true}))
})

gulp.task('web', function () {
  return gulp.src('src/*.htm*')
    .pipe(htmlmin({
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
      maxLineLength: 120,
      preserveLineBreaks: false,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      conservativeCollapse: true,
      processScripts: ['text/x-red'],
      quoteCharacter: "'"
    }))
    .pipe(gulp.dest('jwt'))
})

gulp.task('nodejs', function (cb) {
  pump([
    gulp.src('src/**/*.js')
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(sourcemaps.write('../maps')), gulp.dest('jwt')],
  cb
  )
})

gulp.task('doc', function (cb) {
  gulp.src(['README.md', 'src/**/*.js'], {read: false})
    .pipe(jsdoc(cb))
})
