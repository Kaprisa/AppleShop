const webpack = require('webpack');

module.exports = () => {
	return {
			module: {
				rules: [
					{
						test: /\.vue$/,
						loader: 'vue'
					}
				],
			},
			plugins: [
				new webpack.LoaderOptionsPlugin({
          vue: {
           	loaders: {
              html: 'pug',
              sass: 'style!css!sass',
            },
          },
      	}),
			],
			resolve: {
         alias: {
          vue: 'vue/dist/vue.js'
         }
      }
	}
}