const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const DEV_HOST = process.env.HOST || "127.0.0.1";
const DEV_PORT = process.env.PORT || "9000";

const VENDOR_LIBS = ['react', 'react-dom',
  'redux', 'react-redux', 'redux-thunk',
  'react-router', 'react-router-dom', 'antd',
  '@react-pdf/renderer'
];


module.exports = (env, argv) => {

  const prodConfig = {
    // optimization: { minimize: false },
    devtool: false,
    plugins: [
      // new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        // files: {
        //   js: [ '/vendor/simditor-2.3.23/site/assets/scripts/jquery.min.js' ],
        // },
        template: 'index.html',
        minify: {
          removeComments: true,
          //collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        },
        inlineSource: '.(js|css)$' // embed all javascript and css inline
      }),
      new MiniCssExtractPlugin({
        filename: "css/style.css?[hash]",
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      //new BundleAnalyzerPlugin()
    ],
  };

  const devConfig = {
    devtool: 'eval-sourcemap',
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
    plugins: [
      // new webpack.NoEmitOnErrorsPlugin(),
      // new webpack.NamedModulesPlugin(),
      // new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      //new BundleAnalyzerPlugin()
    ],
  };

  const commonConfig = {
    entry: {
      app: path.resolve(__dirname, './src/index.jsx'),
      // app: './src/index.jsx',
      vendor: VENDOR_LIBS,
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js?[hash]',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'node_modules'),
      ],
    },
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
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          exclude: path.resolve(__dirname, "node_modules"),
          use: [
            { loader: "url-loader",
              options: { prefix: "font", limit: 10000, mimetype: "application/octet-stream" }
            } ]
        },
      ]
    },
  };

  const { mode } = argv;
  if (mode === 'production') {
    return { ...commonConfig, ...prodConfig }
  } else if (mode === 'development') {
    return { ...commonConfig, ...devConfig }
  }
}


