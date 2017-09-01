const path = require('path')

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
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	}
}