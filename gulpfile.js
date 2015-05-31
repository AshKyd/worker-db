var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var fs = require('fs');

gulp.task('js', function() {
    gulp.src([
        'src/scripts/index.js',
        'src/scripts/engine.js',
        ])
        .pipe(browserify({
          debug : true
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('html', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'));
});

// gulp.task('css', function(){
//     gulp.src('src/css/style.less')
//         .pipe(less())
//         .pipe(gulp.dest('dist/'));
// });

gulp.task('connect',function(){
    connect.server({
        root: 'dist',
        livereload: false
    });
});

gulp.task('watch', function () {
    gulp.watch(
        [
        'src/index.html',
        'src/**/*'
        ],
        ['build']
    );
});

gulp.task('build',['js','html']);
gulp.task('default',['build','connect','watch']);
