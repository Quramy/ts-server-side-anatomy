const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'ts-loader',
        test: /\.ts$/,
			},
      {
				include: [path.resolve(__dirname, 'node_modules/typescript/lib')],
				loader: 'raw-loader',
        test: /lib.*\d.\.ts$/,
			},
		],
	},

	output: {
		chunkFilename: '[name].[chunkhash].js',
		filename: '[name].[chunkhash].js'
	},

	mode: 'development',

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
};
