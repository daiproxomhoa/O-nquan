/**
 * Created by Vu Tien Dai on 16/06/2017.
 */
/**
 * Created by To Tai on 5/4/2017.
 */
var path = require('path'),
    minimize = process.argv.indexOf('--minimize') !== -1,
    plugins = [];

module.exports = {

    entry: {
        main: path.resolve("Client/Main.ts")
    },
    output: {
        path: __dirname,
        filename: 'dist/bundle.js'
        // filename: 'Mobile/www/js/bundle.js'
    },

    devtool : "source-map",
    module: {
        loaders: [
            {test: /.ts$/, loader: 'awesome-typescript-loader'}
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};

