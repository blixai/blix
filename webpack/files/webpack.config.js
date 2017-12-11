const path = require('path')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin('main.css')

module.exports = {
  entry: `./INPUT/index.js`,
  output: {
    filename: 'index.js',
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
