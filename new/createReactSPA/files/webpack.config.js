const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        loaders: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.scss$/,
        use: "style-loader!css-loader!sass-loader!postcss-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  }
}