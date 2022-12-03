const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './lib/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: {
      type: 'commonjs',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@lib': path.resolve(__dirname, './lib'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  externals: {
    '@akdasa-studios/framework': {
      commonjs: 'framework',
      commonjs2: 'framework',
      amd: 'framework',
      root: 'framework',
    },
    uuid: {
      commonjs: 'uuid',
      commonjs2: 'uuid',
      amd: 'uuid',
      root: 'uuid',
    },
  },
}