const path = require('path');
const webpack = require('webpack')
//const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './source.js',
	output: {
		path: path.resolve(__dirname,'js'),
		filename: 'app.js'
	},
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
		]
	},

	// plugins: [
	//     new webpack.DefinePlugin({
	//       'process.env': {
	//         NODE_ENV: '"production"'
	//       }
	//     }),
	//   ]
}

