var gulp = require('gulp');
var replace = require('gulp-replace');
var version = '0.0.1.' + new Date().getTime();

gulp.task('version', function () {
    gulp.src(['./src/index.html'])
        .pipe(replace(/v=(\d)+(\.)+(\d)+(\.)(\d)+(\.)(\d)+/g, 'v=' + version))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('setDist', function() {
    gulp.src(['./src/utils/util.js'])
        .pipe(replace('isDev = true', 'isDev = false'))
        .pipe(gulp.dest('./src/utils/'));
});

gulp.task('setDev', function() {
    gulp.src(['./src/utils/util.js'])
        .pipe(replace('isDev = false', 'isDev = true'))
        .pipe(gulp.dest('./src/utils/'));
});

//"copyfiles -f ./src/index.html ./src/favicon.ico ./dist",
