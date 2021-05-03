<template>
    <div class="bg_mask" v-if="show" @click.self="!!bgClear ? clearMask() : ''">
        <div
            :style="{
                width: !!w ? `${ w / 750 * 10 }rem` : `${ 200 / 750 * 10 }rem`,
                height: !!h ? `${ h / 750 * 10 }rem` : `${ 200 / 750 * 10 }rem`
            }"
            :class="['mask_box popIn', imgClass || '']"
        >
            <!-- 顶部 -->
            <slot name="header"></slot>
            <!-- 内容 -->
            <slot name="content"></slot>
            <!-- 底部按钮 -->
            <slot name="btn"></slot>
            <!-- 关闭按钮 -->
            <div v-if="showClear" class="clear_btn" @click="clearMask()"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        "show",             // 控制显示
        "w",                // 弹窗宽度
        "h",                // 弹窗高度
        "imgClass",         // 弹窗图片类名
        "showClear",        // 是否显示关闭按钮 有传值就显示
        "bgClear"           // 点击遮罩层是否关闭弹窗
    ],
    data() {
        return {};
    },
    methods: {
        clearMask() {
            this.$emit("update:show", false);
        }
    }
};
</script>

<style lang="less">
.bg_mask {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // 当这四个属性为0时不设置宽高就会铺满屏幕
    margin: auto;
    background: rgba(0, 0, 0, 0.6);
    .mask_box {
        position: absolute;
        z-index: 999;
        // top: 0;
        // left: 0;
        // right: 0;
        // bottom: 0;
        top: 16%;
        left: 0;
        right: 0;
        margin: auto;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 50% 50%;

        // 关闭按钮
        .clear_btn {
            position: absolute;
            top: 28px;
            right: 28px;
            width: 58px;
            height: 58px;
            background: url("~imgurl/mask/x.png") no-repeat;
            background-size: contain;
            background-position: 50% 50%;
        }
    }
}

// 弹窗动画
.popIn {
    -webkit-animation-name: popIn;
    animation-name: popIn;
    -webkit-animation-duration: 0.7s;
    animation-duration: 0.7s;
}

@keyframes popIn {
    0% {
        -webkit-transform: scale3d(0, 0, 0);
        transform: scale3d(0, 0, 0);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    40% {
        -webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
        animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
        -webkit-transform: scale3d(1.08, 1.08, 1.08);
        transform: scale3d(1.08, 1.08, 1.08);
    }
    60% {
        -webkit-animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
    80% {
        -webkit-animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        -webkit-transform: scale3d(1.03, 1.03, 1.03);
        transform: scale3d(1.03, 1.03, 1.03);
    }
    100% {
        -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}
</style>