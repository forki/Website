﻿var gulp = require('gulp-param')(require('gulp'), process.argv);
var concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    debug = require('gulp-debug'),
    del = require('del'),
    less = require('gulp-less'),
    rev = require('gulp-rev-append');

// paths    
var paths = {
    webroot: "wwwroot/",
    packagesRoot: "bower_components/",
    buildrootDebug: "bin/Debug/",
    buildrootRelease: "../../build/app/"
};

paths.jsSrc = paths.webroot + "js/*.js";
paths.cssSrc = paths.webroot + "css/*.less";
paths.viewsSrc = "views/";
paths.stringsSrc = "strings/";
paths.imagesSrc = paths.webroot + "img/";

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

function getViewsDest(isRelease) {
    return getBaseDest(isRelease) + "views/";
}

function getStringsDest(isRelease) {
    return getBaseDest(isRelease) + "strings/";
}

function getImagesDest(isRelease) {
    return getBaseDest(isRelease) + "img/";
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
    return del([getJsDest(release)],{force:true});
});

gulp.task("clean:css", function (release) {
    return del([getCssDest(release)],{force:true});
});

gulp.task("clean:fonts", function (release) {
    return del([getFontsDest(release) + "**/*"], { force: true });
});

gulp.task("clean:views", function (release) {
    return del([getViewsDest(release) + "**/*"], { force: true });
});

gulp.task("clean:strings", function (release) {
    return del([getStringsDest(release) + "**/*"], { force: true });
});

gulp.task("clean:images", function (release) {
    return del([getImagesDest(release) + "**/*"], { force: true });
});

gulp.task("clean:favicons", function (release) {
    return del([getBaseDest(release) + "*.png",
        getBaseDest(release) + "*.xml",
        getBaseDest(release) + "*.ico",
        getBaseDest(release) + "*.svg",
        getBaseDest(release) + "*.json"], { force: true });
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
        .pipe(less())
        .pipe(debug())
        .pipe(concat(getCssDest(release)))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("compile:fonts", ["clean:fonts"], function (release) {
    return gulp.src(fonts)
        .pipe(gulp.dest(getFontsDest(release)));
});

gulp.task("compile:views", ["clean:views"], function (release) {
    return gulp.src(paths.viewsSrc + "**/*")
        .pipe(debug())
        .pipe(gulp.dest(getViewsDest(release)));
});

gulp.task("compile:strings", ["clean:strings"], function (release) {
    return gulp.src(paths.stringsSrc + "**/*")
        .pipe(debug())
        .pipe(gulp.dest(getStringsDest(release)));
});

gulp.task("compile:favicons", ["clean:favicons"], function (release) {
    return gulp.src(paths.webroot + "*.{png,xml,ico,svg,json}")
        .pipe(debug())
        .pipe(gulp.dest(getBaseDest(release)));
});

gulp.task("compile:images", ["clean:images"], function (release) {
    return gulp.src(paths.imagesSrc + "**/*")
        .pipe(debug())
        .pipe(gulp.dest(getImagesDest(release)));
});

// globals
gulp.task("precompile", ["compile:js", "compile:css", "compile:fonts", "compile:views", "compile:strings", "compile:favicons", "compile:images"]);

gulp.task("compile", ["precompile"], function (release) {
    var indexDes = getViewsDest(release) + "layout.html";
    return gulp.src(indexDes)
      .pipe(rev())
      .pipe(gulp.dest(getViewsDest(release)));
});