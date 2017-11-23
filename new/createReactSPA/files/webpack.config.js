const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
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
        loaders: "style-loader!css-loader"
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" 
        }, {
          loader: "css-loader" 
        }, {
          loader: "sass-loader" 
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("public"),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  }
}