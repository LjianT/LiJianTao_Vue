<template>
    <div class="act-container">
        <div class="act-banner">
            <div @click="toSq(1), showModel.ruleMask = true" class="act_rule"></div>
        </div>
    </div>
</template>

<script>
import 'intersection-observer'  // polyfill
import { ToastPlugin, LoadingPlugin } from "vux";
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
export default {
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {
        getInfo() {

            axios
                .get("/")
                .then(res => {
                    
                })
                .catch( err => {
             
                });
        },
        toast(msg, time = 1500) {
            // toast信息
            this.$vux.toast.show({
                type: "text",
                text: msg,
                time: time,
                position: "middle"
            });
        }
    }
};
</script>

<style lang="less">
// #### VUX ####
.vux-loading {
    .weui-toast {
        font-size: 20px;
        top: 44%;
    }
}
.vux-toast {
    .weui-toast {
        font-size: 28px;
    }
    .weui-toast__content {
        font-size: 20px;
    }
}

</style>
