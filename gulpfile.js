// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
// File paths
const files = {
	imagePath: 'img/**/*.+(png|jpg|jpeg|gif|svg|ico)',
	htmlPath: '*.html',
	scssPath: '/css/**/*.scss',
	cssPath: [
		'node_modules/bootstrap/dist/css/bootstrap.min.css',
		'node_modules/font-awesome/css/font-awesome.min.css',
		'node_modules/bootstrap-social/bootstrap-social.css',
		'css/**/*.css',
	],
	jsPath: [
		'node_modules/jquery/dist/jquery.js',
		'node_modules/popper.js/dist/umd/popper.js',
		'node_modules/bootstrap/dist/js/bootstrap.js',
		'js/scripts.js',
	],
	fontsPath: 'node_modules/font-awesome/fonts/*',
};
//clean dist folder
function clean() {
	return del('dist');
}
// image

function imageTask() {
	return src(files.imagePath).pipe(imagemin()).pipe(dest('dist/img/'));
}
// Task to minify HTML
function htmlTask() {
	return src(files.htmlPath).pipe(htmlmin()).pipe(dest('dist/'));
}
// Sass task: compiles the style.scss file into style.css
function scssTask() {
	return src(files.scssPath)
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(sass()) // compile SCSS to CSS

		.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
		.pipe(dest('/css')); // put final CSS in dist/css folder
}
// css task: compiles the css file into style.css
function cssTask() {
	return src(files.cssPath)
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(concat('styles.css'))
		.pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
		.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
		.pipe(dest('dist/css')); // put final CSS in dist/css folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
	return src(files.jsPath)
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/js'));
}

// fontawesome
function fontsTask() {
	return src(files.fontsPath).pipe(dest('dist/fonts'));
}

// Cachebust
function cacheBustTask() {
	var cbString = new Date().getTime();
	return src(['index.html'])
		.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
		.pipe(dest('.'));
}
// browserSync

function browser() {
	browserSync.init({
		server: {
			baseDir: 'dist/',
		},
	});
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
	watch(
		files.imagePath +
			files.htmlPath +
			files.scssPath +
			files.cssPath +
			files.jsPath,

		series(
			htmlTask,
			scssTask,
			parallel(cssTask, jsTask),
			cacheBustTask,
			browser
		)
	);
}
const build = series(
	clean,
	imageTask,
	fontsTask,
	htmlTask,
	scssTask,
	parallel(cssTask, jsTask),
	cacheBustTask,
	browser
);

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.clean = clean;
exports.image = imageTask;
exports.html = htmlTask;
exports.browser = browser;
exports.build = build;
exports.watch = series(watchTask);
exports.default = series(build, watch);
