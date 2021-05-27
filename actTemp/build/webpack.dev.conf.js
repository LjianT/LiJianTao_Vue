'use strict';
const utils = require('./utils');
const webpack = require('webpack');

// 一个用于生成HTML文件并自动注入依赖文件（link/script）的webpack插件
const HTMLWebpackPlugin = require("html-webpack-plugin");

// 一个可以合并数组和对象的插件
const merge = require('webpack-merge');

// 返回公共基础配置
const {
    baseWebpackConfig,
    baseConfig,
    resolve
} = require('./webpack.base.conf');

// 用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const portfinder = require('portfinder');

// vux 加载插件
const vuxLoader = require('vux-loader');

// 主机头
const host = process.env.HOST || '0.0.0.0';

// 端口
const port = process.env.PORT || 8080;

// 是否开启map
// false 编译时不生成.map文件
const sourceMap = false; // false 会加快打开页面

/**
 * 处理webpack的输入和输出
 */
baseConfig.entryFiles.forEach(dir => {
    baseWebpackConfig.entry[dir] = resolve(`${baseConfig.entryDir}/${dir}`);
    baseWebpackConfig.output.path = baseConfig.outputDir;
    baseWebpackConfig.output.filename = "js/[name].js";
});

/**
 * Handle HTML Templates
 * 处理html模板
 */
baseConfig.entryFiles.forEach(dir => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${dir}.html`, // 输出的文件名称
        template: `${baseConfig.entryDir}/${dir}/index.html`, // 输出文件的模板路径
        chunks: [dir, "vendor","manifest"], // 分块规则
        inject: true,
        minify: {
            removeComments: true, // 去注释
            collapseWhitespace: true, // 压缩空格
            removeAttributeQuotes: true // 去除属性引用
        },
        chunksSortMode: 'dependency'
    });
    baseWebpackConfig.plugins.push(htmlPlugin);
});

// 合并基本配置
const newWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: [
          {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: utils.cssLoaders({
                        sourceMap: sourceMap,
                        extract: false
                    }),
                    cssSourceMap: true,
                    cacheBusting: true,
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 0,
                    name: 'img/[name].[ext]?t=[hash:7]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 0,
                    name: 'media/[name].[ext]?t=[hash:7]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 0,
                    name: 'fonts/[name].[ext]?t=[hash:7]'
                }
            }
        ]
    }
});

// 合并VUX 加载器
const vuxConfig = vuxLoader.merge(newWebpackConfig, {
    plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
});


/**
 * 将我们 webpack.dev.conf.js 的配置和 webpack.base.conf.js 的配置合并
 */
const webpackConfig = merge(vuxConfig, {
    module: {
        // 使用的 loader 
        rules: utils.styleLoaders({
            sourceMap: true,
            usePostCSS: true,
            extract: false, // 是否分离css
        }),
    },

    /**
     * cheap-module-eval-source-map is faster for development
     * 使用 #eval-source-map 模式作为开发工具，此配置可参考 DDFE 往期文章详细了解
     */
    devtool: 'eval-source-map',

    // http服务相关
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: host, // 主机
        port: port, // 端口
        open: false, // 是否自动打开浏览器
        overlay: {
            warnings: false, // 显示警告
            errors: true, // 显示错误
        },
        //发布目录
        publicPath: '/',

        // 跨域设置
        proxy: {
            "/api": {
                target: 'https://baidu.com/',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "/"
                }
            }
        },
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: false,
        }
    },
    plugins: [
        // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
        new webpack.DefinePlugin({
            'process.env': '{env:"' + process.env.ENVIROMENT + '",work:"' + baseConfig.workFolder + '"}',
            'process.actFolder': `{actFolder: "${baseConfig.actFolder}" ,workFolder:"${baseConfig.workFolder}"}`
        }),

        // HotModule 插件在页面进行变更的时候只会重回对应的页面模块，不会重绘整个 html 文件
        new webpack.HotModuleReplacementPlugin(),

        /**
         * HMR shows correct file names in console on update.
         *  开启热加载时候显示模块的相对路径
         */
        new webpack.NamedModulesPlugin(),

        // 后页面中的报错不会阻塞，但是会在编译结束后报错
        new webpack.NoEmitOnErrorsPlugin(),
    ]
});


module.exports = new Promise((resolve, reject) => {
    // http服务端口
    portfinder.basePort = port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port;

            // add port to devServer config
            webpackConfig.devServer.port = port;

            // Add FriendlyErrorsPlugin
            webpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://127.0.0.1:${port}`],
                },
                onErrors: utils.createNotifierCallback(),
            }));
            resolve(webpackConfig)
        }
    })
});
