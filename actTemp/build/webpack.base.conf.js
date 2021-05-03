'use strict';
const fs = require("fs");
const path = require('path');

// 给出正确的绝对路径
const resolve = (p) => path.resolve(__dirname, "..", p);

/* ■■■■■■■ 当前要处理的活动文件夹类别 ■■■■■■■ */
const actFolder = "client";

/* ■■■■■■■ 当前要处理的活动文件夹 ■■■■■■■ */
const workFolder = "turntable_act";

// 入口文件夹
const entryDir = resolve("src/page/" + actFolder + "/" + workFolder);
// 输出文件夹
const outputDir = resolve("dist");
// 入口文件列表
const entryFiles = fs.readdirSync(entryDir);

// 基礎配置文件
const baseWebpackConfig = {
    context: path.resolve(__dirname, '../'),
    output:{},
    entry:{},
    resolve: {
        // 自动补全的扩展名
        extensions: ['.js', '.vue', '.json'],
        alias: {
            //默认路径代理，例如 import Vue from 'vue'，会自动到 'vue/dist/vue.common.js'中寻找
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),// 源码根目录
            'assets': resolve('src/assets'),
            'imgurl':resolve('src/assets/image/'+actFolder+'/'+workFolder),
            'components': resolve('src/components'),
            'directives': resolve('src/directives'),
            'filters': resolve('src/filters'),
            'mixins': resolve('src/mixins'),
            'router': resolve('src/router'),
            'stores': resolve('src/store/modules'),
            'store': resolve('src/store'),
            'utils': resolve('src/utils'),
        }
    },
    externals: {
        // 不打包的库，外部引用
        "vue": "Vue",
        "axios": "axios",
    },
    plugins: [

    ],
    module: {
        rules: [

        ]
    }
};

/**
 * 基本公共配置
 */
let baseConfig = {
    actFolder:actFolder,
    workFolder: workFolder,
    outputDir: outputDir,
    entryFiles: entryFiles,
    entryDir: entryDir
};

exports.baseWebpackConfig = baseWebpackConfig;
exports.baseConfig = baseConfig;
exports.resolve = resolve;
