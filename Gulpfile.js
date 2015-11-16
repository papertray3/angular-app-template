'use strict';

//var gulp = require('gulp'), gif = require('gulp-if'), gutil = require('gulp-util'), clean = require('del');
var gulp = require('gulp'), clean = require('del');

var plugins = require("gulp-load-plugins")({
	pattern : [ 'gulp-*', 'gulp.*' ], // the glob(s) to search for 
	scope : [ 'dependencies', 'devDependencies', 'peerDependencies' ], // which keys in the config to look within 
	replaceString : /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context 
	camelize : true, // if true, transforms hyphenated plugins names to camel case 
	lazy : true, // whether the plugins should be lazy loaded on demand
	rename : {
		'gulp-if' : 'gif'
	}
}); 

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');


var config = {
	src : './src/main/app/',
	dest : './target/classes/static/',
	mods : './node_modules/',
	lrport : 35729,
	stylus : {
		'linenos' : true,
		'include css' : true,
		'compress' : false
	},
	browserify : {
		options : {
			insertGlobals : true,
			debug : true
		},
		transforms : [ {
			'name' : babelify,
			'options' : {}
		}, {
			'name' : 'brfs',
			'options' : {}
		}, {
			'name' : 'bulkify',
			'options' : {}
		} ]
	},
	main : 'index.js',
	bundle : 'bundle.js',
	build_env : 'dev'
};

if (typeof plugins.util.env.env != 'undefined') {
	config.build_env = plugins.util.env.env;
}

console.log('Building for ' + config.build_env + ' environment');


if (config.build_env == 'prod') {
	config.browserify.debug = false;
	config.bundle = 'bundle.min.js';
	config.stylus.compress = true;
}

var assets = [config.dest + 'index.html', config.dest + 'views', config.dest + 'css', config.dest + 'scripts'];
var mod_assets = [{
	src: config.mods + 'bootstrap/fonts/**/*',
    dest: config.dest + 'fonts'
},
{
	src: config.mods + 'bootstrap/dist/css/' + (config.build_env == 'prod' ? 'bootstrap-theme.min.css' : 'bootstrap-theme.css*'),
	dest : config.dest + 'css'
},
{
	src: config.mods + 'bootstrap/dist/css/' + (config.build_env == 'prod' ? 'bootstrap.min.css' : 'bootstrap.css*'),
	dest : config.dest + 'css'
},
{
	src: config.mods + 'angular/angular-csp.css',
	dest: config.dest + 'css'
}
];


var paths = {
	html : {
		src : config.src + 'html',
		dest : config.dest
	},
	scripts : {
		src : config.src + 'scripts',
		dest : config.dest + 'scripts'
	},
	css : {
		src : config.src + 'styles',
		dest : config.dest + 'css'
	}
};



// Dev task
gulp.task('build', ['mods', 'html', 'styles', 'lint', 'browserify' ], function() {
});

// Clean task
gulp.task('clean', function() {
	
	var cleans = assets;
	mod_assets.forEach(function(asset){
		cleans.push(asset.dest);
	});
 
	plugins.util.log('Removing:', assets);
	clean.sync(assets);
});

gulp.task('mods', function() {
	mod_assets.forEach(function(asset){
		plugins.util.log('Moving ' + asset.src + ' to ' + asset.dest);
		gulp.src(asset.src).pipe(gulp.dest(asset.dest));		
	});
});

// JSHint task
gulp.task('lint', function() {
	gulp.src(paths.scripts.src + '/**/*.js').pipe(plugins.jshint()).pipe(
			plugins.jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function() {
	plugins.util.log('using compress: ' + config.stylus.compress);
	gulp.src(paths.css.src + '/**/*.styl').pipe(plugins.stylus(config.stylus))
		.pipe(gulp.dest(paths.css.dest));
});

// Browserify task
gulp.task('browserify', function() {
	var browserified = function(file) {
		var b = browserify(file, config.browserify.options);
		config.browserify.transforms.forEach(function(transform) {
			b.transform(transform.name, transform.options);
		});
		return b.bundle();
	};
	
	
	// Single point of entry (make sure not to src ALL your files, browserify will figure it out)
	browserified(paths.scripts.src + '/' + config.main)
		.pipe(source(config.bundle))
		// Bundle to a single file
		.pipe(buffer())
		.pipe(
			plugins.gif(config.build_env == 'prod', plugins.uglify()))
			// Output it to our dist folder
			.pipe(gulp.dest(paths.scripts.dest));
});

// Views task
gulp.task('html', function() {
	// Get our index.html
	gulp.src(paths.html.src + '/**/*').pipe(plugins.preprocess({
		context : config
	}))
	// And put it in the dist folder
	.pipe(gulp.dest(paths.html.dest));
	
});

gulp.task('watch', function() {
	// Start live reload
	plugins.livereload.listen(config.lrport);

	// Watch our scripts, and when they change run lint and browserify
	gulp.watch(paths.scripts.src + '/**/*.js', [ 'lint',
			'browserify' ]);
	// Watch our styles files
	gulp.watch(paths.css.src + '/**/*.styl',
			[ 'styles' ]);

	gulp.watch([ paths.html.src + '/*', paths.html.src + '/**/*' ], [ 'html' ]);

	gulp.watch(config.dest + '/**').on('change', plugins.livereload.changed);
	

});

gulp.task('default', [ 'build' ]);
