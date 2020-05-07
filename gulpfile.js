var gulp = require('gulp');
var path = require('path');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');
var rename = require('gulp-rename');
var uglify_es = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglify_es, console);
var concat = require('gulp-concat');
var remove_code = require('gulp-remove-code');
var babel = require('gulp-babel');

gulp.task('prepare-svg', function () {
    return gulp
        .src('src/svg/*/*.svg')
        // Minify SVG files
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        removeAttrs: {
                            attrs: ['viewBox']
                        }
                    },
                    {
                        mergePaths: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix,
                            minify: true
                        }
                    },
                ],
            };
        }))
        // Combine SVG files as symbols
        .pipe(svgstore({ inlineSvg: true }))
        // Remove unused tags
        .pipe(cheerio({
            run: function ($, file) {
                $('[fill="#0f0"]').attr('fill', 'currentColor');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(rename('iqons.min.svg'))
        .pipe(gulp.dest('dist'));
});

gulp.task('prepare-iqons-js', function () {
    return gulp
        .src([
            'src/js/iqons.js',
            'src/js/hash.js',
            'src/js/color-names.js',
            'src/js/colors.js',
        ])
        .pipe(remove_code({ production: true }))
        .pipe(uglify({
            warnings: true,
            compress: {},
            mangle: true,
            output: {
                comments: /@asset/
            }
        }))
        .pipe(concat('iqons.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('prepare-name-js', function () {
    return gulp
        .src([
            'src/js/name.js',
            'src/js/hash.js',
            'src/js/color-names.js',
            'src/js/colors.js',
            'src/js/word-catalog.js',
            'src/js/word-dimensions.js',
        ])
        .pipe(remove_code({ production: true }))
        .pipe(uglify({
            warnings: true,
            compress: {},
            mangle: true,
            output: {
                comments: /@asset/
            }
        }))
        .pipe(concat('iqons-name.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('prepare-bundle', function () {
    return gulp
        .src(['src/js/svg.prefix.js', 'dist/iqons.min.svg', 'src/js/svg.suffix.js', 'dist/iqons.min.js'])
        .pipe(concat('iqons.bundle.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('commonjs-bundle', function () {
    return gulp
        .src('dist/iqons.bundle.min.js')
        .pipe(babel({
            plugins: ["@babel/plugin-transform-modules-commonjs"],
        }))
        // .pipe(uglify())
        .pipe(rename('iqons.bundle.cjs.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('commonjs-name', function() {
    return gulp
        .src('dist/iqons-name.min.js')
        .pipe(babel({
            plugins: ["@babel/plugin-transform-modules-commonjs"],
        }))
        // .pipe(uglify())
        .pipe(rename('iqons-name.cjs.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('prepare-svg', 'prepare-iqons-js', 'prepare-name-js', 'prepare-bundle', 'commonjs-bundle', 'commonjs-name'));
