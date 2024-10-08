// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const ghPages = require('gh-pages'); // Import gulp-gh-pages
const replace = require('gulp-replace');

// Use dart-sass for @use
// sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// Javascript Task 
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// HTML Task
function htmlTask() {
    return src('index.html')
        .pipe(replace(/href="dist\/styles\.css"/g, 'href="styles.css"')) // Replace CSS path
        .pipe(replace(/src="dist\/script\.js"/g, 'src="script.js"')) // Replace JS path
        .pipe(dest('dist')); // Copy to dist folder
}

// Copy Images Task
function imagesTask() {
    return src('images/**/*') // Adjust the path to your images directory
        .pipe(dest('dist/images')); // Copy images to dist/images
}

// Browsersync 
function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

function deploy(done) {
    ghPages.publish('dist', { branch: 'deployment-branch' }, (err) => {
        if (err) {
            console.error('Deployment failed:', err);
            done(err); // Call done with error to indicate failure
        } else {
            console.log('Deployment successful!');
            done(); // Call done to indicate completion
        }
    });
}


// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask, htmlTask, imagesTask);

// Deploy Gulp Task
exports.deploy = deploy; // Export deploy task
