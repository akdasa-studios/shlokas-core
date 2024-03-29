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
      commonjs: '@akdasa-studios/framework',
      commonjs2: '@akdasa-studios/framework',
      amd: '@akdasa-studios/framework',
      root: '@akdasa-studios/framework',
    },
    '@akdasa-studios/framework-sync': {
      commonjs: '@akdasa-studios/framework-sync',
      commonjs2: '@akdasa-studios/framework-sync',
      amd: '@akdasa-studios/framework-sync',
      root: '@akdasa-studios/framework-sync',
    },
    uuid: {
      commonjs: 'uuid',
      commonjs2: 'uuid',
      amd: 'uuid',
      root: 'uuid',
    },
    dayjs: {
      commonjs: 'dayjs',
      commonjs2: 'dayjs',
      amd: 'dayjs',
      root: 'dayjs',
    }
  },
}