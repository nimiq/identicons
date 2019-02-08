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

gulp.task('prepare-svg', function () {
    return gulp
        .src('src/svg/*/*.svg')
        // Minify SVG files
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        inlineStyles: {
                            onlyMatchedOnce: false
                        }
                    },
                    {
                        removeAttrs: {
                            attrs: ['data.*', 'viewBox']
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
                    }
                ]
            };
        }))
        // Combine SVG files as symbols
        .pipe(svgstore({ inlineSvg: true }))
        // Remove unused tags
        .pipe(cheerio({
            run: function ($, file) {
                $('linearGradient').remove();
                $('radialGradient').remove();
                $('style').remove();
                $('defs').remove();
                $('clipPath').remove();
                $('path').each(function(i, el) {
                    var fillAttr = $(el).attr('fill');
                    if (fillAttr && fillAttr.indexOf('url(#linear-gradient') === 0) {
                        $(el).remove();
                    }
                });
                $('[fill="#0f0"]').attr('fill', 'currentColor');
                $('#g92-5').remove(); // Empty <g>
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(rename('iqons.min.svg'))
        .pipe(gulp.dest('dist'));
});

gulp.task('prepare-js', function () {
    return gulp
        .src(['src/js/iqons-catalog.js', 'src/js/iqons.js'])
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

gulp.task('prepare-bundle', function () {
    return gulp
        .src(['src/js/svg.prefix.js', 'dist/iqons.min.svg', 'src/js/svg.suffix.js', 'dist/iqons.min.js'])
        .pipe(concat('iqons.bundle.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('prepare-svg', 'prepare-js', 'prepare-bundle'));
