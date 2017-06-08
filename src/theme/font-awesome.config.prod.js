const fontAwesomeConfig = require("./font-awesome.config.js");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// fontAwesomeConfig.styleLoader = ExtractTextPlugin.extract({
//   fallbackLoader: 'style',
//   loader: 'css!less'
// }
// fontAwesomeConfig.styleLoader =  require('extract-text-webpack-plugin').extract('style-loader', 'css-loader!less-loader'),

function encodeLoader(loader) {
	if (typeof loader === "string") {
		return loader;
	}

	if (typeof loader.options !== "undefined") {
		const query = Object
			.keys(loader.options)
			.map(function map(param) {
				return `${encodeURIComponent(param)}=${encodeURIComponent(loader.options[param])}`;
			})
			.join("&");
		return `${loader.loader}?${query}`;
	}
	return loader.loader;
}

function buildExtractStylesLoader(loaders) {
	const extractTextLoader = encodeLoader(loaders[0]);
	const fallbackLoader = encodeLoader(loaders[1]);

	const restLoaders = loaders
		.slice(2)
		.map(function map(loader) {
			if (typeof loader === "string") {
				return loader;
			}
			return encodeLoader(loader);
		});

	return [
		extractTextLoader,
		fallbackLoader,
		...restLoaders,
	].join("!");
};


fontAwesomeConfig.styleLoader = buildExtractStylesLoader(ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: [
    {
      loader: "css-loader",
      query: {
        minimize: true,
        importLoaders: 2,
        sourceMap: true
      }
    },
    {
      loader: "postcss-loader",
			options: {
				sourceMap: false
			}
    },
    {
      loader: "less-loader",
      query: {
        outputStyle: "expanded",
        sourceMap: true,
        sourceMapContents: true
      }
    }
  ]
}));
module.exports = fontAwesomeConfig;
