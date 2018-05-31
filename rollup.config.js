// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/env3d.js',
    watch: {
        include: 'src/**',
        clearScreen: false,
        chokidar: true
    },
    output: {
        file: 'dist/js/env3d.js',
        format: 'umd',
        name: 'env3d'
    },
    plugins: [
        resolve(),
        commonjs()
    ]
};
