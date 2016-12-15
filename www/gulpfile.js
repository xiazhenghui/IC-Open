"use strict";

var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    sourcemaps = require("gulp-sourcemaps"),
    newer = require("gulp-newer"),
    concat = require("gulp-concat"),
    less = require("gulp-less"),
    cssmin = require("gulp-cssmin"),
    ts = require("gulp-typescript"),
    modernizr = require('gulp-modernizr'),
    debug = require('gulp-debug'),
    path = require("path"),
    del = require("del");

var paths = {
    webroot: "./wwwroot/"
};

// less
paths.less = {
    src: path.join(paths.webroot, "css/*.less"),
    dst: path.join(paths.webroot, "css")
};

gulp.task('less', () => {
    return gulp.src(paths.less.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.less.dst));
});

gulp.task('clean-less', (cb) => {
    return del([path.join(paths.less.dst, "*.css"), path.join(paths.less.dst, "*.css.map")]);
});

// typescript
paths.ts = {
    src: path.join(paths.webroot, "js/*.ts"),
    dst: path.join(paths.webroot, "js/")
};

gulp.task("ts", () => {
    var tsProj = ts.createProject("tsconfig.json");
    return tsProj.src()
        .pipe(sourcemaps.init())
        .pipe(tsProj())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.ts.dst))
        .pipe(debug({ title: 'ts:' }));
});

gulp.task('clean-ts', (cb) => {
    return del([path.join(paths.ts.dst, "/**/*.js"), path.join(paths.ts.dst, "/**/*.js.map")]);
});

// modernizr
gulp.task('modernizr', ['ts'], () => {
    return gulp.src([path.join(paths.ts.dst, "/**/*.js"), "!" + path.join(paths.ts.dst, "modernizr.js")])
        .pipe(modernizr())
        .pipe(uglify())
        .pipe(gulp.dest(paths.ts.dst));
});

// min
paths.requirejs = {
    src: path.join(paths.webroot, "lib/requirejs/require.js"),
    dst: path.join(paths.webroot, "lib/requirejs/")
};

gulp.task("min", () => {
    return gulp.src(paths.requirejs.src)
        .pipe(newer(path.join(paths.requirejs.dst, "require.min.js")))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat("require.min.js"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.requirejs.dst));
});

gulp.task("clean-min", (cb) => {
    return del([path.join(paths.requirejs.dst, "require.min.js"), path.join(paths.requirejs.dst, "require.min.js.map")]);
});

// default
gulp.task("build", ["less", "ts", "modernizr", "min"]);
gulp.task("clean", ["clean-min", "clean-ts", "clean-less"]);
gulp.task("default", ["build"]);