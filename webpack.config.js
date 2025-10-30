const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');        // ✅ AÑADIDO
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // ✅ AÑADIDO
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const Icons = require('unplugin-icons/webpack');
const isProduction = process.env.NODE_ENV === 'production';      // ✅ AÑADIDO


module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),    // ✅ Corregido: apunta a dist/
    filename: 'js/bundle.js',                // ✅ JS en dist/js/
    clean: true                              // ✅ Limpia antes de compilar
  },

  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
              // También puedes agregar 'source', 'video', etc.
            ],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader', // ← Alternativa comentada
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]' // ← Se guardará en dist/images/
        }
      }      
    ]
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        // { from: 'public', to: '' }, // ← copia todo public/ → dist/
        // { from: 'src/images', to: 'images' } // ← imágenes que ya tenías
        { from: 'src/data/stations.json', to: 'js/stations.json' }, 
      ]
    }),
    // new Icons({ /* opciones */ }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css', // ✅ CSS en dist/css/style.css
    })
  ],

  optimization: {
    // minimize: true,
    minimizer: [
      '...', // ← ¡Mantiene los minimizadores por defecto (JS)!
      new CssMinimizerPlugin(), // ← ¡Minifica CSS en producción!
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9000,
    open: true,
    hot: true,
  },

  devtool: isProduction ? false : 'inline-source-map',
};
