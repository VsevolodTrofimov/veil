const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    
    entry: __dirname + '/src/index.js',
    output: {
        libraryTarget: 'var',
        library: 'veil',
        path: __dirname + '/dist',
        filename: 'ext.js'
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    
    plugins: [
        new UglifyJSPlugin()
    ]
}