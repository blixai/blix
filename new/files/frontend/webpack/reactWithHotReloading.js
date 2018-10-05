const path = require("path");
const postcssPresetEnv = require("postcss-preset-env");
const webpack = require('webpack')

module.exports = {
  entry: ["./src/index.js", 'webpack-hot-middleware/client'],
  mode: 'development',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/dist'
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
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: { plugins: () => [postcssPresetEnv()] }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
