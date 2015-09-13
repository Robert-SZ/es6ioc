module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['browserify', 'jasmine'],

    files: [
      'src/*.js',
      'tests/*.js'
    ],

    exclude: [
    ],

    preprocessors: {
      'src/*.js': ['browserify'],
      'test/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'babelify' ],
      entries: './tests/index.js'
    }

    // define reporters, port, logLevel, browsers etc.
  });
};