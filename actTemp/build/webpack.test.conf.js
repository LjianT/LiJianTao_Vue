"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");

// 一个用于生成HTML文件并自动注入依赖文件（link/script）的webpack插件
const HTMLWebpackPlugin = require("html-webpack-plugin");

// 一个可以合并数组和对象的插件
const merge = require("webpack-merge");

// 返回公共基础配置
const {
    baseWebpackConfig,
    baseConfig,
    resolve
} = require("./webpack.base.conf");

// CSS 压缩插件
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");

// 删除文件夹和文件插件
const CleanWebpackPlugin = require("clean-webpack-plugin");

// 复制文件插件
const CopyWebpackPlugin = require("copy-webpack-plugin");

// 打包把css和js分开的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// vux 加载插件
const vuxLoader = require("vux-loader");

// 是否开启map
const sourceMap = false;

/**
 * 处理webpack的输入和输出
 */
baseConfig.entryFiles.forEach(dir => {
    baseWebpackConfig.entry[dir] = resolve(`${baseConfig.entryDir}/${dir}`);
    baseWebpackConfig.output.path = baseConfig.outputDir;
    baseWebpackConfig.output.filename = "js/[name].js";
    // baseWebpackConfig.output.publicPath =
    //     "/style/" + baseConfig.workFolder + "/";
    baseWebpackConfig.output.publicPath = "https://baidu.com/" + baseConfig.actFolder + '/' + baseConfig.workFolder + "/";
    // baseWebpackConfig.output.publicPath = "/" + baseConfig.workFolder + "/";

});

/**
 * Handle HTML Templates
 * 处理html模板
 */
baseConfig.entryFiles.forEach(dir => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${dir}.html`, // 输出的文件名称
        template: `${baseConfig.entryDir}/${dir}/index.html`, // 输出文件的模板路径
        chunks: [dir, "vendor", "manifest"], // 分块规则
        inject: true, // 注入静态资源
        hash: true, // 每次打包产生哈希
        minify: {
            removeComments: false, // 去注释
            collapseWhitespace: false, // 压缩空格
            removeAttributeQuotes: false, // 去除属性引用,
            minifyJS: false // 压缩js
        },
        chunksSortMode: "dependency"
    });
    baseWebpackConfig.plugins.push(htmlPlugin);
});

// 合并基本配置
const newWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: utils.cssLoaders({
                        sourceMap: sourceMap,
                        extract: true
                    }),
                    cssSourceMap: sourceMap,
                    cacheBusting: false,
                    transformToRequire: {
                        video: "src",
                        source: "src",
                        img: "src",
                        image: "xlink:href"
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [resolve("src"), resolve("test")]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 1,
                    name: "img/[name].[ext]"
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 1,
                    name: "media/[name].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 1,
                    name: "fonts/[name].[ext]"
                }
            }
        ]
    }
});

// 合并VUX 加载器
const vuxConfig = vuxLoader.merge(newWebpackConfig, {
    plugins: ["vux-ui", "progress-bar", "duplicate-style"]
});

// 合并配置
const webpackConfig = merge(vuxConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: sourceMap, // 是否开启css map
            extract: true, // 是否分离css
            usePostCSS: true
        })
    },
    devtool: false,
    plugins: [
        /**
         * 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
         * @see http://vuejs.github.io/vue-loader/en/workflow/production.html
         */
        new webpack.DefinePlugin({
            "process.env": '{env:"' +
                process.env.ENVIROMENT +
                '",work:"' +
                baseConfig.workFolder +
                '"}',
            "process.actFolder": `{actFolder: "${
                baseConfig.actFolder
            }" ,workFolder:"${baseConfig.workFolder}"}`
        }),

        /**
         * UglifyJs do not support ES6+, you can also use babel-minify for better
         * @see https://github.com/babel/minify
         * 压缩js和css
         */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: sourceMap,
            parallel: true
        }),

        /**
         * extract css into its own file
         * 将 css 文件分离出来
         */
        new ExtractTextPlugin({
            filename: "css/[name].css",
            // set the following option to `true` if you want to extract CSS from
            // codesplit chunks into this main css file as well.
            // This will result in *all* of your app's CSS being loaded upfront.
            allChunks: false
        }),

        /**
         * CSS 压缩插件
         * Compress extracted CSS. We are using this plugin so that possible
         * duplicated CSS from different components can be deduped.
         */
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        /**
         * keep module.id stable when vender modules does not change
         *  基础模块持久化缓存插件
         */
        new webpack.HashedModuleIdsPlugin(),

        /**
         * 提取第三方库和公共模块，
         * 避免首屏加载的bundle文件或者按需加载的bundle文件体积过大，从而导致加载时间过长
         */
        new webpack.optimize.ModuleConcatenationPlugin(),

        /**
         * split vendor js into its own file
         * 没有指定输出文件名的文件输出的静态文件名
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, "../node_modules")
                    ) === 0
                );
            }
        }),

        /**
         * extract webpack runtime and module manifest to its own file in order to
         * prevent vendor hash from being updated whenever app bundle is updated
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),

        /**
         * This instance extracts shared chunks from code splitted chunks and bundles them
         * in a separate chunk, similar to the vendor chunk
         * @see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: "app",
            async: "vendor-async",
            children: true,
            minChunks: 3
        }),

        // 删除打包目录
        new CleanWebpackPlugin(["dist"], {
            root: resolve(""),
            verbose: true, //开启在控制台输出信息
            dry: false
        })

        /**
         * copy custom static assets
         * 复制一下文件到发布目录
         */
        // new CopyWebpackPlugin([{
        //     from: resolve('static'),
        //     to: resolve('dist'),
        //     ignore: ['.*']
        // }])
    ]
});

// 运行带有额外参数的命令
if (process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
        .BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;