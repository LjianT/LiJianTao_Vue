<template>
    <div class="demo-container">
        <div class="demo-banner">
            <div @click="toSq(1), showModel.ruleMask = true" class="act_rule"></div>
        </div>
    </div>
</template>

<script>
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
        }
    }
};
</script>

<style lang="less" scoped>
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
