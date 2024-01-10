const { src, dest, parallel, series, watch } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const lessGulp = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const htmlMin = require('gulp-htmlmin');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();

const config = {
    paths: {
        less: './src/less/**/*.less',
        html: './public/index.html'
    },
    output: {
        cssName: 'bundle.min.css',
        path: './dist'
    },
    isDevelopment: false
}

function htmlMinify () {
        return src(config.paths.html)
            .pipe(gulpIf(!config.isDevelopment, htmlMin({collapseWhitespace: true})))
            .pipe(dest(config.output.path));
}
function lessFunc () {
    return src(config.paths.less)
        .pipe(gulpIf(config.isDevelopment, sourcemaps.init()))
        .pipe(lessGulp())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(gulpIf(!config.isDevelopment, cleanCSS()))
        .pipe(gulpIf(config.isDevelopment, sourcemaps.write()))
        .pipe(dest(config.output.path))
        .pipe(browserSync.stream())
}

function serve () {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    })
    watch(config.paths.less, lessFunc)
    watch(config.paths.html).on('change', parallel(browserSync.reload, htmlMinify))
}

exports.default = parallel(htmlMinify, lessFunc, serve);