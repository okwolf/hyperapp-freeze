import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/freeze.js',
    format: 'umd'
  },
  name: 'freeze',
  plugins: [
    resolve(),
    commonjs()
  ]
};