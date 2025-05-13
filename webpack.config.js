// webpack.config.js
module.exports = {
    // ...
    module: {
      rules: [
        {
          test: /\.js\.map$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: /node_modules/, // Ignore all source maps from node_modules
        },
      ],
    },
  };
  