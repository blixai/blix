const path = require('path')
const postcssPresentEnv = require('postcss-preset-env')


module.exports = {
  entry: `INPUT`,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'OUTPUT')
  },
  module: {
    rules: [
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
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: { plugins: () => [postcssPresentEnv()]}
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  }
}
