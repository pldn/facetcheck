/**
We have this simple build script, because the config file (in ts) is needed by webpack
I.e., there is a chicken-egg issue: the config is not available to webpack before the whole stack is built
Therefore, just compile the ts for this small file beforehand
**/
// var tsConfig = require('../tsconfig-build.json')
var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    rename = require('gulp-rename'),
    util = require('gulp-util');

var tsProject = ts.createProject('tsconfig-build.json',{
  declaration: false
});

gulp.task('compileTs', function() {
  console.info('compiling ts')
  console.time('compile time')
  var tsResult = gulp.src(['./src/staticConfig.ts', "./typings/index.d.ts",
          "./typings-custom/main.d.ts", './src/utils/ConfigTemplate.ts'])
				.pipe(tsProject())

  return tsResult.js
    .pipe(rename(function (path) {
      if (path.basename === 'staticConfig') path.basename = '_appConfig'
      if (path.basename === 'ConfigTemplate') path.dirname = path.dirname + '/utils'
    }))
    // .pipe(rename('_appConfig.js'))
    .pipe(gulp.dest('./webpack'))
    .pipe(util.noop())//fake pipe needed, otherwise there is no on-end event
    .on('end', function(){
      console.timeEnd('compile time', 'compilation done');
    })
})

gulp.start('compileTs')
