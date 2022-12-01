const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './lib/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
}