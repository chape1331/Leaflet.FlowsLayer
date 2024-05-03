const path = require('path');

module.exports = {
    entry: './src/L.FlowsLayer.js',
    output: {
        filename: 'L.FlowsLayer.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    externals: {
        'leaflet': 'L'
    }
}
