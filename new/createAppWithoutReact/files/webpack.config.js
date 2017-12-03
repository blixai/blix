const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin('[name]/main.css')

module.exports = {
  entry: {
    home: `./src/home/index.js`
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'public')
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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }]
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("public"),
    new ExtractTextPlugin('[name]/main.css'),
    extractSass
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  }
}                   
