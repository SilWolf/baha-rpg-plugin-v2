const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: '/dist/main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							// 预设：指示babel做怎么样的兼容性处理。
							presets: [
								[
									'@babel/preset-env',
									{
										corejs: {
											version: 3,
										},
										// 按需加载
										useBuiltIns: 'usage',
									},
								],
							],
						},
					},
				],
			},
		],
	},
};
