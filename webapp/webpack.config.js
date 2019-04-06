const path = require('path');
const MiniCssExtractPlagin = require('mini-css-extract-plugin');


let conf = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './[name].js',
    publicPath: '/dist'
  },
  devServer: {
    overlay: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        loader: 'babel-loader',
        exclude: '/node_modules'
      }, {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlagin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlagin({
      filename: '[name].css'
    })
  ]

};

module.exports = (env, options) => {
  const prod = options.mode === 'prodaction';

  conf.devtool = prod ? false : 'eval-sourcemap'

  return conf;
};
