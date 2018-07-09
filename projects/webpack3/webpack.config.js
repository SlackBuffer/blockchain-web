const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
  fallback: "style-loader",
  // resolve-url-loader may be chained before sass-loader if necessary
  use: ["css-loader", "sass-loader"]
});
const isProd = process.env.NODE_ENV === 'production';

const cssConfig = isProd ? cssProd : cssDev;

console.log("isProd: ", isProd);  // terminal 里查看输出

module.exports = {
  // entry: './src/app.js',
  entry: {
    'app.bundle': './src/app.js',
    'contact': './src/contact.js'
  },
  output: {
    path: __dirname + '/dist',
    // filename: 'app.bundle.js'
    // filename: '[name].[chunkhash].js'
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // use: [ 'style-loader', 'css-loader', 'sass-loader' ]
        /* use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          // resolve-url-loader may be chained before sass-loader if necessary
          use: ["css-loader", "sass-loader"]
        }) */
        use: cssConfig
      },
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {}
        }
      }
    ]
  },
  devServer: {
    port: 4444,
    open: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "ho",
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      chunks: ['app.bundle']    // 加载 app.bundle
    }),
    new HtmlWebpackPlugin({
      title: "sb",
      template: './src/contact.pug', // 源文件
      filename: 'contact.html',       // 目标文件
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      excludeChunks: ['app.bundle'] // 除了 app.bundle，entry 配置的 js 都加载
    }),
    /* new HtmlWebpackPlugin({
      title: "sb",
      template: './src/index.html',
      minify: {
        collapseWhitespace: true
      },
      hash: true
    }), */
    new ExtractTextPlugin({
      filename: "style.css",  // 生成的 css 文件名
      disable: !isProd        // 生产环境关闭，开发环境开启   
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
/* module.exports = {
  entry: './src/app.js',
  output: {
    filename: './dist/app.bundle.js'
  }
}; */