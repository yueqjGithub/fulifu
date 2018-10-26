const path = require('path');
const root = path.resolve(__dirname,'.');
// const publish_path = path.resolve('/g','/www/app');
const publish_path = path.resolve(__dirname,'dist');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    mode:'production',
    entry:{
        app:[path.join(root,'src/main.js')]
    },
    output:{
        // path:path.resolve(__dirname,'dist'),
        path:publish_path,
        publicPath:'',
        filename:'js/[name].[hash:8].js'
    },
    plugins:[
        new CleanWebpackPlugin(['dist',publish_path],{allowExternal:true}),
        new HtmlWebpackPlugin({
            title:'Output Management',
            template:path.join(root,'src/index.html')
        }),
        new ExtractTextPlugin({
            filename:"css/[name].[hash:7].css",
            allChunks:true
        })
    ],
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:{
                    loader:'vue-loader',
                    options:{
                        extractCSS:true,
                    }
                }
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{loader:'babel-loader'}
            },
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader:"css-loader",
                            options:{
                                url:false,
                                importLoaders:1
                            }
                        },
                    ]
                })
            },
            {
                test:/\.(png|jpe?g|gif)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:2000,
                        name:"/img/[name].[hash:7].[ext]"
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '/media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|iconfont.css)(\?.*)?$/,
                use:{
                    loader:'url-loader',
                    options: {
                        limit:1000,
                        name: '/fonts/[name].[hash:7].[ext]'
                    }
                }
            }
        ]
    },
    optimization : {
        splitChunks:{
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    enforce:true,
                    chunks: 'initial',
                    name:'vendor'
                },
                commons: {
                    chunks: 'initial',
                    minChunks: Infinity,
                    maxInitialRequests: 5,
                    minSize: 0,
                    name:'commons'
                },
            }
        }
    },
    resolve: {
        alias: {
            'vue$':'vue/dist/vue.esm.js',
            '@': path.join(root,'src'),
        }
    }

};