var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    util = require('gulp-util'),
    // nodemon = require('gulp-nodemon'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;
var tsConfig = require('../tsconfig-build.json')

var sourcemaps = require('gulp-sourcemaps');
var runSeq = require('run-sequence');
var merge = require('merge2');  // Require separate installation

var tsProject = ts.createProject('tsconfig-build.json',{
  declaration: true,
  // typescript: require('ntypescript')
});

gulp.task('copyAssets', function(cb) {
  exec('npm run copyAssets', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})


//regex taken from: https://github.com/chalk/ansi-regex/blob/master/index.js#L3
const removeColorsReg = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
var lastTsErrorMsg = null;
var errorCount = 0;
gulp.task('compileTs', function() {
  console.info('compiling ts')
  console.time('compile time')
  var tsResult = gulp.src(tsConfig.filesGlob)
        .pipe(sourcemaps.init())
				.pipe(tsProject())
        .on('error', function(e){errorCount++; lastTsErrorMsg = e.message})
  return merge([
        tsResult.dts.pipe(gulp.dest('./build/src')),
        tsResult.js.pipe(gulp.dest('./build/src')).on('end', function(){'ts compilation done'}),
        tsResult.pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./build/src'))
    ])
    .pipe(util.noop())//fake pipe needed, otherwise there is no on-end event
    .on('end', function(){
      console.timeEnd('compile time', 'compilation done');
      if (lastTsErrorMsg) {
        notifier.notify({title: 'Server Compilation Errors (' + errorCount + ')', message: lastTsErrorMsg.replace(removeColorsReg, '')})
        lastTsErrorMsg = null; errorCount = 0;
      } else {
        notifier.notify({'expire-time': 1000, title: 'Client',message:'Compilation finished'})
      }
    })
})
gulp.task('build',function(cb) {
   runSeq('copyAssets', 'compileTs', cb);
})
var server;
process.once('SIGINT', function() {
  if (server && server.pid) process.kill(-server.pid, 'SIGKILL');
  process.exit(1);
})
gulp.task('startServer', ['build'], function() {
  if (server) {
    try {
      process.kill(-server.pid, 'SIGKILL');
    } catch(e) {
      //ah, process was stopped before, and is already gone.
      //just ignore
    }
  }
  // process.nextTick(function() {
    // setTimeout(function() {
  server = spawn('npm', ['run', 'start-server-dev'], {stdio: 'inherit', detached: true})
  server.on('close', function (code) {
    console.log('server closed, code', code)
    if (code === 8) {
      notifier.notify({title:'Client error', message: 'Error detected, waiting for changes...'})
      gulp.log('Error detected, waiting for changes...');
    }
  })
  server.on('error', function(e) {
    console.log('error on spawned server. do we need to catch something here? e.g. socket disconnecting?', e)
  })
})

gulp.task('watch', ['startServer'], function() {
    gulp.watch(tsConfig.filesGlob, ['startServer'])
    .on('error', function(error) {
          // silently catch 'ENOENT' error typically caused by renaming watched folders
          if (error.code === 'ENOENT') {
            return;
          } else {
            console.log('gulp watch error, do we need to do something here?',error)
          }
        })
});


if (process.env.NODE_ENV !== 'production') {
  var notifier = require('node-notifier');
  gulp.start('watch');
} else {
  console.log('Building as production. Not including node-notifier')
  var notifier = {
    notify: function(val){
      console.info((val.title?val.title+':': ''), (val.message?val.message: val))
    }
  }
  gulp.start('build')
}
