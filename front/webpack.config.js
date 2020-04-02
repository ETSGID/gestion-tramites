const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path');

module.exports = {
    entry:  './pas/main.js',

    output: {
        //debo darle una ruta absoluta
        path: __dirname + '/build',
        filename:   'bundle_pas.js'
    },

    context: resolve(__dirname, 'app'),

    devServer: {
        port: 4000,
        contentBase: `${__dirname}/app/pas/`,
        hot: true 
    },
    //lo que queramos que traduzca de los imports que se encuentre en los javascripts
    module: {
        rules:[
            {
                test: /\.css$/i,
                use: [
                    { loader: 'style-loader'},
                    { loader: 'css-loader'}
                ]

            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
              },
            {
            test: /\.(scss|sass)$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                'style-loader',
                'css-loader',
                { loader: 'sass-loader', options: { sourceMap: true } },
            ],
        },
        ]
    },

    resolve: {
        // resuelve extensiones al no indicarlas los import
        extensions: ['.js', '.jsx', '.es6'],
    },

    plugins: [
        //para copiar el archivo a la carpeta build
        new HtmlWebpackPlugin({
            template: `${__dirname}/app/pas/index.html`,
            filename: 'index_pas.html',
	    //evitas que inyecte el bundle.js en el index.html
            inject: false,
        })
    ],

}