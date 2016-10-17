/**
 * Created by mikoladyachok on 16/10/2016.
 */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');

// gulp.task('js', function(){
//     gulp.src('app/scripts/*.js')
//         .pipe(concat('script.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('public/js/'));
// });
//
// gulp.task('css', function(){
//     gulp.src('app/styles/*.css')
//         .pipe(concat('styles.css'))
//         .pipe(minify())
//         .pipe(gulp.dest('public/css/'));
// });

gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify({ mangle: false })))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('public'))
});

gulp.task('images', function(){
    return gulp.src('app/assets/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'))
});

gulp.task('clean:dist', function() {
    return del.sync('public');
})

gulp.task('default',['useref'],function(){
});