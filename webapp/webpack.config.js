const path = require('path');
// const MiniCssExtractPlagin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'


let conf = {
  entry: {
    app: './src/index.jsx'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './[name].js',
    publicPath: '/dist/'
  },
  devServer: {
    overlay: true,
  },
  devtool: devMode ? 'eval-sourcemap' : false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader',],
        exclude: '/node_modules'
      }, {
        test: /\.scss$/,
        use: [
          // MiniCssExtractPlagin.loader,
          'style-loader',
          'css-loader',
          'sass-loader',
          // 'less-loader',
        ]
      }, {
        test: /\.less$/,
        use: [
          // MiniCssExtractPlagin.loader,
          'style-loader',
          'css-loader',
          // 'sass-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true, }, },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  // plugins: [
  //   new MiniCssExtractPlagin({
  //     filename: '[name].css'
  //   })
  // ]

};

module.exports = conf;

