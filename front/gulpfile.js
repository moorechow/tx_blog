var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var cache = require("gulp-cache");
var imagemin = require("gulp-imagemin");
var bs = require("browser-sync").create();
var sass = require("gulp-sass");
// log方法可以打印js出错信息
var util = require("gulp-util");
// sourcemaps相当于符号表，可以翻译min文件到原文件
var sourcemaps = require("gulp-sourcemaps");

var path = {
    'html':'./templates/**/',
    'css':'./src/css/**/',
    'js':'./src/js/',
    'images':'./src/images/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'images_dist':'./dist/images/',
};

// html task
gulp.task("html",function(){
   gulp.src(path.html+"*.html")
        .pipe(bs.stream())
});

// css task
gulp.task("css",function(){
   gulp.src(path.css+"*.scss")
        .pipe(sass().on("error",sass.logError))
        .pipe(cssnano())
        .pipe(rename({"suffix":".min"}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});

// js task
gulp.task("js",function () {
    gulp.src(path.js+"*.js")
        .pipe(sourcemaps.init())
        .pipe(uglify({
            'toplevel':true,
            'compress': {
                'drop_console':false,
            },
        }).on('error',util.log))
        .pipe(rename({"suffix":".min"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});

// images task
gulp.task("images",function () {
    gulp.src(path.images+"*.*")
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
});

// watch task
gulp.task("watch",function(){
    gulp.watch(path.html+'*.html',['html']);
    gulp.watch(path.css+'*.scss',['css']);
    gulp.watch(path.js+'*.js',['js']);
    gulp.watch(path.images+'*.*',['images']);
});

// 初始化brower-sync的任务
gulp.task("bs",function () {
    bs.init({
        'server':{
            'baseDir':'./'
        }
    });
});

//创建一个默认的任务
gulp.task("default",['bs','watch']);

