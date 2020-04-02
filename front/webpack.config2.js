const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path');

module.exports = {
    entry:  './estudiantes/main.js',

    output: {
        //debo darle una ruta absoluta
        path: __dirname + '/build',
        filename:   'bundle_estudiantes.js'
    },

    context: resolve(__dirname, 'app'),

    devServer: {
        port: 4001,
        contentBase: `${__dirname}/app/estudiantes/`,
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
            template: `${__dirname}/app/estudiantes/index.html`,
            filename: 'index_estudiantes.html',
	    //evitas que inyecte el bundle.js en el index.html
            inject: false,
        })
    ],

}