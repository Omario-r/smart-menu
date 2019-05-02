const path = require('path');
// const webpack = require('webpack');
// const MiniCssExtractPlagin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

const DEV_HOST = process.env.HOST || "127.0.0.1";
const DEV_PORT = process.env.PORT || "9000";


let conf = {
  entry: {
    // app: path.resolve(__dirname, './src/index.jsx'),
    app: './src/index.jsx',
    // vendor: ['antd']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './[name].js?[hash]',
    publicPath: '/dist/'
  },
  devServer: {
    overlay: true,
    historyApiFallback: true,
    port: DEV_PORT,
    host: DEV_HOST,
    // disableHostCheck: true,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:3010/`,
        pathRewrite: {"^/api" : ""},
        changeOrigin: true,
        headers: {
          'X-Api-Role': 'admin'
        }
      },
      // "/images": {
      //   target: `http://127.0.0.1:3010/`,
      //   changeOrigin: true,
      // }
    },
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
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
        exclude: '/node_modules'
      }, {
        test: /\.scss$/,
        use: [
          // MiniCssExtractPlagin.loader,
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: '/node_modules'
      }, {
        test: /\.less$/,
        use: [
          // MiniCssExtractPlagin.loader,
          { loader:'style-loader' },
          
          { loader:'css-loader',
            options: {
              modules: 'global', // in this case antd styles are working
              localIdentName: '[local]--[hash:base64:5]',
              // exportOnlyLocals: true,
            },
            
          },
          // 'less-loader',
          { loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ]
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
         'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    // new MiniCssExtractPlagin({
    //   filename: '[name].css'
    // }),
    // new webpack.NamedModulesPlugin(),
  ]

};

module.exports = conf;

