const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin =require('optimize-css-assets-webpack-plugin')



module.exports = {

    devtool: 'source-map',//开启sourcemap
    entry: {
        "index":"./src/index.js",//可以定义多个入口,
        //"page":"./src/page.js"
    },
    module:{
        rules: [ 
            {
                test: /\.js$/,
                include: /src|node_modules[/\\]/,
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['transform-class-properties']
                }                
            },
           /*  {
                test: /\.css$/,
                use: [
                     {
                         loader: 'style-loader'  // 将打包后的css代码以<style>标签形式添加到页面头部
                     },
                     {
                         loader: 'css-loader'    // 用于加载css文件（并没有添加到页面
                     }
                ]
            }, */

            {
                test: /\.css$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      // 这里可以指定一个 publicPath
                      // 默认使用 webpackOptions.output中的publicPath
                      //publicPath: '../'
                    },
                  },
                  'css-loader', 
                  {
                      loader:'postcss-loader',
                      options:{
                          plugins:()=>[
                              require('autoprefixer')({
                                  //browsers:['>1%']
                              })
                         ]
                      }
                  }
                ],
              },
            
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                      name: 'img/[name].[hash:7].[ext]'
                    }
                  }
                ]
              }
        ]
    },

    output: {
        //filename: '[name].js',
        filename: '[name]_[hash:8].js', 
        path: __dirname + "/dist"  //指定资源的输出位置
    },
    mode: process.env.NODE_ENV,
    plugins:[
        new webpack.BannerPlugin({banner: `development build: ${new Date()}`, entryOnly: true}),
         new htmlWebpackPlugin({   //创建一个在内存中生成html插件
            chunks: ['index'],
            template: path.join(__dirname, '/static/index.html'),  // 指定模板页面, 将来会根据指定的页面路径, 去生成内存中的页面
            filename: 'index.html',  // 指定生成内存中的页面,
            hash: true,  // 生成的.js后面加hash  :bundle.js?93da9c5565a913afd93e
        }),
        new MiniCssExtractPlugin({
            filename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCssPlugin({
            assetNameegExp:/\.css$/g,
            cssProcessor:require('cssnano')
        }),
    ],
    devServer: {
        publicPath: "/dist", 
        
        host: '127.0.0.1',
        port: 8088,
        open:true,//自动打开浏览器
        openPage: 'dist/index.html',//配置项用于打开指定 URL 的网页
        hot: true,  // 启动热更新,
        //不启动热更新，仍然会在代码变化时自动刷新，大多数情况下满足需求了
        //启动热更新，目前只能监控js代码，css/html如果不是module的形式，就不能监听变化
        //所以，通常情况下就不设置hot:true

        //没有运行自更新的可能2个点：
        //1.如果publicPath写成__dirname+"/dist" 就不行
        //2.应该打开的网址是http://127.0.0.1:8088/dist/index.html
        //如果变成         http://127.0.0.1:8088/dist/index.html  
        //也是不能监控变化的

    },

}