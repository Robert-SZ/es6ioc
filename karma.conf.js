module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['browserify', 'jasmine'],

    files: [
      'example/*.js',
      'src/*.js',
      'tests/*.js'
    ],

    exclude: [
    ],

    preprocessors: {
      'example/*.js': ['browserify'],
      'src/*.js': ['browserify'],
      'test/*.spec.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'babelify' ],
      entries: './tests/index.spec.js'
    }

    // define reporters, port, logLevel, browsers etc.
  });
};