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
                $('path').each(function(i, el) {
                    var fillAttr = $(el).attr('fill');
                    if (fillAttr && fillAttr.indexOf('url(#linear-gradient') === 0) {
                        $(el).remove();
                    }
                });
                $('[fill="#0f0"]').attr('fill', 'currentColor');
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
        .pipe(uglify({
            warnings: true,
            compress: {},
            mangle: true
        }))
        .pipe(concat('iqons.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['prepare-svg', 'prepare-js']);