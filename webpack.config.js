const path = require('node:path')

module.exports = {
  target: 'node',
  mode: 'production',
  resolve: {
    extensions: ['.js']
  },
  entry: './index.js',
  externals: {
    bridge: 'commonjs bridge'
  },
  output: {
    path: path.join(__dirname, '/release'),
    filename: `main.bundle.js`,
    library: {
      type: 'commonjs2'
    }
  }
}