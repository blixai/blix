const path = require('path')
let ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
  entry: `INPUT`,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'OUTPUT')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
  ],
  resolve: {
    extensions: ['.js', '.css', '.scss']
  }
}
