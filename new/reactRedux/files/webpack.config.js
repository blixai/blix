const path = require('path')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin('main.css')

module.exports = {
  entry: `./src/index.js`,
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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!postcss-loader"
        })
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader!postcss-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    extractSass
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  }
}
