﻿var gulp = require('gulp-param')(require('gulp'), process.argv);
var concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    debug = require('gulp-debug'),
    del = require('del'),
    watch = require('gulp-watch');

// paths    
var paths = {
    webroot: "wwwroot/",
    packagesRoot: "bower_components/",
    buildrootDebug: "bin/Debug/",
    buildrootRelease: "../../build/app/"
};

paths.jsSrc = paths.webroot + "js/*.js";
paths.cssSrc = paths.webroot + "css/*.css";
paths.templatesSrc = "views/";

function getBaseDest(isRelease) {
    return isRelease ? paths.buildrootRelease : paths.buildrootDebug;
}

function getJsDest(isRelease) {
    return getBaseDest(isRelease) + "js/site.min.js";
}

function getCssDest(isRelease) {
    return getBaseDest(isRelease) + "css/site.min.css";
}

function getFontsDest(isRelease) {
    return getBaseDest(isRelease) + "fonts/";
}

function getTemplatesDest(isRelease) {
    return getBaseDest(isRelease) + "views/";
}

// packages paths
paths.packages = {};
paths.packages.jquery = paths.packagesRoot + "jquery/dist/";
paths.packages.bootstrap = paths.packagesRoot + "bootstrap/dist/";
paths.packages.fontawesome = paths.packagesRoot + "fontawesome/";

// scripts, fonts & styles
var scripts = [];
var styles = [];
var fonts = [];
    
// jquery
scripts.push(paths.packages.jquery + "jquery.js");
    
// bootstrap
scripts.push(paths.packages.bootstrap + "js/bootstrap.js");
styles.push(paths.packages.bootstrap + "css/bootstrap.css"/*, paths.packages.bootstrap + "css/bootstrap-theme.css"*/);
fonts.push(paths.packages.bootstrap + "fonts/*.*");

// fontawesome
styles.push(paths.packages.fontawesome + "css/font-awesome.css");
fonts.push(paths.packages.fontawesome + "fonts/*.*");

// custom scripts & styles
scripts.push(paths.jsSrc);
styles.push(paths.cssSrc);


// clean tasks
gulp.task('clean:js', function (release) {
    return del([getJsDest(release)]);
});

gulp.task("clean:css", function (release) {
    return del([getCssDest(release)]);
});

gulp.task("clean:fonts", function (release) {
    return del([getFontsDest(release) + "**/*"]);
});

gulp.task("clean:templates", function (release) {
    return del([getTemplatesDest(release) + "**/*"]);
});

// minification
gulp.task("compile:js", ["clean:js"], function (release) {
    return gulp.src(scripts)
        .pipe(debug())
        .pipe(concat(getJsDest(release)))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("compile:css", ["clean:css"], function (release) {
    return gulp.src(styles)
        .pipe(debug())
        .pipe(concat(getCssDest(release)))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("compile:fonts", ["clean:fonts"], function (release) {
    return gulp.src(fonts)
        .pipe(gulp.dest(getFontsDest(release)));
});

gulp.task("compile:templates", ["clean:templates"], function (release) {
    return gulp.src(paths.templatesSrc + "**/*")
        .pipe(debug())
        .pipe(gulp.dest(getTemplatesDest(release)));
});

// globals
gulp.task("compile", ["compile:js", "compile:css", "compile:fonts", "compile:templates"]);