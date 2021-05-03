<template>
    <div class="act-container">
        <div class="act-banner">
            <div @click="toSq(1), showModel.ruleMask = true" class="act_rule"></div>
        </div>
        <!-- 用于更好的提供给观察器 -->
        <div class="act-ioline"></div>
        <div class="act-nav">
            <div :class="[
                isTabFixed ? 'n_fixed' : 'n_normal'
            ]">
                <div 
                    v-for="(item, index) in 3" 
                    :key="index" 
                    @click="pageSlideAnm(slideArr[ index ], index)" 
                    class="nav_item"
                ></div>
            </div>
        </div>

        <div class="act-box act-box1">
            <div class="my_info">
                <div class="my_item myt_top">
                    <img :src="userAvatar" alt="">
                    <p>{{ userNick }}</p>
                </div>
                <div class="my_item">
                    <p>{{ userTotal }}</p>
                    <p>我的累计福气值</p>
                </div>
                <div class="my_item">
                    <p>{{ userRank === 0 ? '无' : userRank }}</p>
                    <p>我的排名</p>
                </div>
            </div>
            <div class="rank_box">
                <div class="rank_top">
                    <div v-for="(item, index) in pageRankList.slice(0, 3)" :key="index" class="rt_item">
                        <div class="rt_ava" :style="{
                            backgroundImage: `url(${ item.avatar })`  
                        }">

                        </div>
                        <div class="rt_nick">{{ item.nick }}</div>
                        <p class="rt_number">{{ item.total_luck }}</p>
                    </div>
                </div>
                <div class="rank_title">
                    <span>排名</span>
                    <span>玩家</span>
                    <span>福气值</span>
                </div>
                <div class="rank_scroll">
                    <p v-show="pageRankList.length <= 3" class="rank_null">虚位以待~</p>
                    <div v-show="pageRankList.length > 3" v-for="(item, index) in pageRankList.slice(3, pageRankList.length)" :key="index" class="rank_row">
                        <p>{{ index+4 }}</p>
                        <img :src="item.avatar" alt="">
                        <p>{{ item.nick }}</p>
                        <p>{{ item.total_luck }}</p>
                    </div>
                </div>

                <!-- 抽盒冲榜 -->
                <div @click="toSq(2), jumpLink('home')" class="chcb_btn"></div>
            </div>
        </div>
        <div class="act-box act-box2">
            <div class="fuqi_box">
                <p>{{ surplusNumber }}</p>
                <p>剩余福气值</p>

                <!-- 我的记录 -->
                <div @click="openMeRcd"></div>
            </div>
            <div class="fuqi_tab">
                <div 
                    @click="changeTab(+index)"
                    v-for="(item, index) in 2" 
                    :key="index" 
                    :class="['f_tab', `f_tab_${ +index }_${ +index === chooseTabIndex ? '1' : '0' }`]"
                ></div>
                <div v-show="chooseTabIndex === 0" class="fuqi_main">
                    <div v-for="(item, index) in dayList" :key="index" class="fuqi_item">
                        <p class="fq_number">剩余: {{ item.left_num }}</p>
                        <img class="fq_cover" :src="item.award_pic" alt="">
                        <div class="fq_desc">
                            <p>{{ item.award_name }}</p>
                            <div>{{ item.need_luck }}福气值</div>
                        </div>
                        <div :class="[
                            'fq_btn', 
                            item.status === 1 ? 'active' : 'disable'
                        ]" @click="jsGiftChoose(item)">{{ item.btn_name }}</div>
                    </div>
                    <p>每人每天限兑1次</p>
                </div>
                <div v-show="chooseTabIndex === 1" class="fuqi_main">
                    <div v-for="(item, index) in onceList" :key="index" class="fuqi_item">
                        <p class="fq_number">剩余: {{ item.left_num }}</p>
                        <img class="fq_cover" :src="item.award_pic" alt="">
                        <div class="fq_desc">
                            <p>{{ item.award_name }}</p>
                            <div>{{ item.need_luck }}福气值</div>
                        </div>
                        <div :class="[
                            'fq_btn', 
                            item.status === 1 ? 'active' : 'disable'
                        ]" @click="jsGiftChoose(item)">{{ item.btn_name }}</div>
                    </div>
                    <p>每人限兑1次</p>
                </div>
            </div>
        </div>
        <div class="act-box act-box3">
            <!-- 新春推荐 -->
            <div class="recommend_box">
                <div 
                    v-for="(item, index) in 6" 
                    :key="index" 
                    :class="['rem_item', `rem_item_${ +index+1 }`]" 
                    @click="jumpLink('shop', index)"
                ></div>
            </div>
        </div>

        <div class="page_bottom">
            <div class="b_shadow"></div>
            <div class="b_fixed">
                <!-- 抽盒领好礼 -->
                <div @click="jumpLink('sign')" class="b_btn sign_btn"></div>
                <div @click="toSq(3), jumpLink('home')" class="b_btn"></div>
            </div>
        </div>

        <myMask
            :show.sync="showModel.ruleMask"
            w="586"
            h="780"
            imgClass="mask_rule"
            :showClear="true"
            :bgClear="true"
        >
            <template slot="content">
                <!--  -->
            </template>
        </myMask>
        <myMask
            :show.sync="showModel.confirmMask"
            w="586"
            h="780"
            imgClass="mask_confirm"
            :showClear="true"
            :bgClear="true"
        >
            <template slot="content">
                <p class="confirm_num">
                    将使用{{ chooseNumber }}个福气值 <br>
                    兑换该奖励 
                </p>
                <img class="confirm_cover" :src="chooseCover" alt="">
                <div class="confirm_btn">
                    <!-- 我再想一想 -->
                    <div @click="showModel.confirmMask = false"></div>
                    <!-- 确认兑换 -->
                    <div @click="jsGiftTake"></div>
                </div>
            </template>
        </myMask>
        <myMask
            :show.sync="showModel.giftMask"
            w="586"
            h="780"
            imgClass="mask_gift"
            :showClear="true"
            :bgClear="true"
        >
            <template slot="content">
                <div class="awd_name">{{ awardName }}</div>
                <img class="awd_cover" :src="awardCover" alt="">
                <div @click="showModel.giftMask = false" class="awd_btn"></div>
            </template>
        </myMask>
        <myMask
            :show.sync="showModel.rcdMask"
            w="586"
            h="780"
            imgClass="mask_rcd"
            :showClear="true"
            :bgClear="true"
        >
            <template slot="content">
                <div class="rcd_main">
                    <div v-show="myRecordList.length > 0" class="rcd_border"></div>
                    <div v-show="myRecordList.length > 0" class="rcd_border"></div>

                    <div class="rcd_title">
                        <span>时间</span>
                        <span>福气值</span>
                        <span>途径</span>
                    </div>
                    <p v-if="myRecordList.length <= 0" class="rcd_null">暂无数据</p>
                    <div v-else>
                        <div v-for="(item, index) in myRecordList" :key="index" class="rcd_row">
                            <div>{{ item.dateline }}</div>
                            <div>{{ item.num }}</div>
                            <div>{{ item.desc }}</div>
                        </div>
                    </div>
                </div>
                <div class="rcd_btn">
                    <!-- 上一页 -->
                    <div @click="prevRecord"></div>
                    <!-- 下一页 -->
                    <div @click="nextRecord"></div>
                </div>
            </template>
        </myMask>
    </div>
</template>

<script>
import 'intersection-observer'  // polyfill
import hrefTo from "utils/convertHref";

import { ToastPlugin, LoadingPlugin } from "vux";
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);

import myMask from "./mask";

export default {
    data() {
        return {
            proxyApi: '',
            actName: 'activity2021/spring_act/',
            gameState: 1,

            chooseTabIndex: 0,
            isTabFixed: false,
            isScrolling: false,
            slideArr: [],

            // 
            pageRankList: [],
            userID: '',
            userAvatar: '',
            userNick: '',
            userRank: '',
            userTotal: '',
            shareKey: '',

            dayList: [],
            onceList: [],
            surplusNumber: 0,

            chooseNumber: 0,
            chooseCover: '',
            chooseType: '',
            chooseId: '',

            awardName: '',
            awardCover: '',

            myRecordList: [],
            rePage: 0, // 页码
            noRePage: true, // false -> 最后一页

            // 

            showModel: {
                ruleMask: false,
                confirmMask: false,
                giftMask: false,
                rcdMask: false,
            },

            sq_num: '',
        };
    },
    components: {
        myMask
    },
    async created() {
        console.log('__________灰度8.0')
        console.log('____环境: ', process.env.env)
        // 本地是dev 测试是test
        if (process.env.env === 'dev') {
            
            // this.proxyApi = '/api/'
            this.proxyApi = window.baseurl
        } else this.proxyApi = window.baseurl;
        
        this.proxyApi += this.actName
        this.getGameState()
        this.getInit()

        let visProp = this.getVisibilityState();
        // console.log('_______visProp: ', visProp)
        if (visProp) {

            // 有些浏览器也需要对这个事件加前缀以便识别。
            var evtname = visProp.replace(/[V|v]isibilityState/, '') + 'visibilitychange';
            document.addEventListener(evtname, this.bodyVisibilitychange, false)
        } else {
            console.log('___________该浏览器不支持检测visibilityState')
        }

        if (window.isH5 == "miniprogram") {
            await this.getMiniKey();
            // 请求完数据，把小程序需要的参数先传过去
            let postData = {
                // 邀请类型、邀请者、活动id、商户标识、方便小程序那边区分是否是活动调起
                url: `/pages/home/main?invitorType=-1&invitor=${
                    this.userID
                }&downfrom=${ window.downfrom }&share_key=${
                    this.shareKey
                }&isActShare=1&freeActivityId=-1`,
                title: "春节集福气，热门隐藏免费领！",
                image: require("./miniShare.png")
            };
            console.log("____________postData: ", postData);

            uni.postMessage({
                data: JSON.stringify(postData)
            });
            wx.miniProgram.postMessage({
                data: JSON.stringify(postData)
            });
        }
    },
    mounted() {
        // 找准参照物 如果实在找不到很好的“相交者” 那就自己造一个
        setTimeout(() => {
            this.$nextTick(() => {
                let io = new IntersectionObserver(
                    changes => {
                        changes.forEach(change => {
                            // console.log('---- change: ', change)
                            // console.log('----- change.intersectionRatio: ', change.intersectionRatio)

                            if (change.intersectionRatio > 0) {
                                this.isTabFixed = false
                            } else this.isTabFixed = true;
                        })
                    }
                )
    
                io.observe(document.querySelector( '.act-ioline' ))
    
                let pageBoxArr = document.querySelectorAll( '.act-box' )
                let slideArr = []
    
                pageBoxArr.forEach(ele => {
                    let number = ele.getBoundingClientRect().top
                    number -= 36

                    slideArr.push( number.toFixed(2) )
                })

                slideArr[ 0 ] -= 76
    
                console.log('------ slideArr: ', slideArr)
                this.slideArr = slideArr
            })
        }, 20);
    },
    methods: {
        // CNZZ统计事件
        toSq(num) {
            this.sq_num = num;
            this.$tongji();
            console.log("统计 >> " + this.sq_num);
        },
        $tongji() {
            switch (this.sq_num) {
                case 1:
                    window._czc.push([
                        "_trackEvent",
                        "首页点击活动规则",
                        "首页点击活动规则"
                    ]);
                    break;

                case 2:
                    window._czc.push([
                        "_trackEvent", 
                        "抽盒冲榜按钮点击", 
                        "抽盒冲榜按钮点击"
                    ]);
                    break;

                case 3:
                    window._czc.push([
                        "_trackEvent",
                        "抽盒领好礼按钮点击",
                        "抽盒领好礼按钮点击"
                    ]);
                    break;

                case 4:
                    window._czc.push([
                        "_trackEvent",
                        "福气榜单tab点击",
                        "福气榜单tab点击"
                    ]);
                    break;

                case 5:
                    window._czc.push([
                        "_trackEvent",
                        "福气集市tab点击",
                        "福气集市tab点击"
                    ]);
                    break;

                case 6:
                    window._czc.push([
                        "_trackEvent",
                        "新春推荐tab点击",
                        "新春推荐tab点击"
                    ]);
                    break;

                default:
                    break;
            }
        },

        // 

        // 兼容visibilitychange
        getVisibilityState() {
            var prefixes = ['webkit', 'moz', 'ms', 'o'];

            if ('visibilityState' in document) {
                return 'visibilityState';
            }
            for (var i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + 'VisibilityState') in document){
                    return prefixes[i] + 'VisibilityState';
                }  
            }
            // 找不到返回 null
            return null;
        },
        bodyVisibilitychange() {
            switch(document.visibilityState) {
                case 'prerender':
                    // 网页预渲染 但内容不可见
                    break;

                case 'hidden':
                    // 内容不可见 处于后台状态，最小化，或者锁屏状态
                    break;

                case 'visible':
                    // 内容可见 刷新数据
                    this.getInit()
                    break;

                case 'unloaded':
                    // 文档被卸载
                    break;

                default:
                    break;
            }
        },

        // 
        getInit() {
            this.getInfo()
            this.getExchange()
        },
        getInfo() {
            this.$vux.loading.show({
                text: "Loading"
            });

            axios
                .get(this.proxyApi + 'rank')
                .then(res => {
                    if (res.data.code === 1) {

                        const DATA = res.data.data

                        this.pageRankList = DATA.list
                        this.userID = DATA.user_id
                        this.userAvatar = DATA.avatar
                        this.userNick = DATA.nick
                        this.userRank = DATA.rank
                        this.userTotal = DATA.total_luck
                    }
                    this.$vux.loading.hide();
                })
                .catch(() => {
                    this.$vux.loading.hide();
                    this.toast("服务器错误");
                });
        },
        getExchange() {
            this.$vux.loading.show({
                text: "Loading"
            });

            axios
                .get(this.proxyApi + 'exchange_list')
                .then(res => {
                    if (res.data.code === 1) {
                        this.surplusNumber = +res.data.data.left_luck
                        this.dayList = res.data.data.day_change
                        this.onceList = res.data.data.once_change
                    }
                    this.$vux.loading.hide();
                })
                .catch(() => {
                    this.$vux.loading.hide();
                    this.toast("服务器错误");
                });
        },
        jsGiftTake() {
            this.$vux.loading.show({
                text: "Loading"
            });
            
            axios
                .post(
                    this.proxyApi + 'click_exchange', {
                        type: this.chooseType,
                        id: this.chooseId,
                    }
                )
                .then(res => {
                    if (res.data.code === 1) {
                        this.awardName = res.data.data.award_name
                        this.awardCover = res.data.data.award_pic
                        this.showModel.confirmMask = false
                        this.showModel.giftMask = true
                        this.getInit()
                        
                    } else {
                        this.toast(res.data.msg)
                    }
                    this.$vux.loading.hide();
                })
                .catch(() => {
                    this.$vux.loading.hide();
                    this.toast("服务器错误");
                });
        },
        jsGiftChoose(info) {
            if (info.status !== 1) return;

            this.chooseNumber = info.need_luck
            this.chooseCover = info.award_pic
            this.chooseType = info.type
            this.chooseId = info.id
            this.showModel.confirmMask = true;
        },
        openMeRcd() {
            this.rePage = 0
            this.getRecord(this.rePage)
            this.showModel.rcdMask = true
        },
        // 上一页
        prevRecord() {
            if (this.rePage > 0) {
                this.rePage--;
                this.getRecord(this.rePage);
            } else {
                this.rePage = 0;
                this.toast("没有上一页");
            }
        },
        // 下一页
        nextRecord() {
            if (this.rePage >= 0) {
                if (this.noRePage) {
                    this.rePage++;
                    this.getRecord(this.rePage);
                } else this.toast("没有下一页");
            } else {
                this.rePage = 0;
            }
        },
        getRecord(page) {
            this.$vux.loading.show({
                text: "Loading"
            });
            axios
				.post(
                    this.proxyApi + 'luck_record', 
                    { page }
                )
                .then(res => {
                    if (res.data.code == 1) {
                        this.myRecordList = res.data.data.record;
                        this.noRePage =
                            this.myRecordList.length !== 5 ? false : true;

                    } else {
                        this.noRePage = false;
                    }
                    this.$vux.loading.hide();
                })
                .catch(() => {
                    this.$vux.loading.hide();
                    this.toast("服务器错误");
                });
        },
        // 检测活动状态
        getGameState() {
            this.$vux.loading.show({
                text: "Loading"
            });

            axios
                .get(this.proxyApi + 'check_time')
                .then(res => {

                    this.gameState = res.data.data.dieover;

                    if (this.gameState == 1) {
                        // this.toast("活动进行中");
                    } else if (this.gameState == 2) {
                        this.toast("活动还没开始");
                    } else if (this.gameState == 3) {
                        this.toast("活动已经结束");
                    }
                    this.$vux.loading.hide();
                })
                .catch(() => {
                    this.$vux.loading.hide();
                    this.toast("服务器错误");
                });
        },

        getMiniKey() {
            return new Promise((resolve, reject) => {
                try {
                    this.$vux.loading.show({
                        text: "Loading"
                    });
                    axios
                        .get(this.proxyApi + "get_mini_share_key")
                        .then(res => {
                            if (res.data.code == 1) {
                                this.shareKey = res.data.data.share_key;
                                console.log("___miniKey: ", this.shareKey);

                            } else {
                                this.toast(res.data.msg);
                            }
                            this.$vux.loading.hide();
                            resolve(true);
                        })
                        .catch(() => {
                            this.$vux.loading.hide();
                            this.toast("服务器错误");
                            resolve(true);
                        });

                } catch (error) {
                    reject(error);
                }
            });
        },

        // 

        changeTab(index) {
            if (this.chooseTabIndex === index ) return;
            this.chooseTabIndex = index
        },
        pageSlideAnm(number, index) {
            if (this.isScrolling) return;

            this.toSq(index + 4)

            this.isScrolling = true
            window.scrollTo({
                behavior: 'smooth', 
                top: number
            })
            setTimeout(() => {
                this.isScrolling = false
            }, 800);
        },
        jumpLink(type, index) {
            
            if (type === 'shop') {
                switch (index) {
                    case 0:
                        hrefTo('app://openBox?seriesId=1461');
                        break;
                    case 1:
                        hrefTo('app://openBox?seriesId=1389');
                        break;
                    case 2:
                        hrefTo('app://openBox?seriesId=1475');
                        break;
                    case 3:
                        hrefTo('app://openBox?seriesId=1503');
                        break;
                    case 4:
                        hrefTo('app://goodsBuy?goodsName=潮流水果主题福袋&goodsId=766502');
                        break;
                    case 5:
                        hrefTo('app://goodsBuy?goodsName=萌新入坑福袋&goodsId=766750');
                        break;
                
                    default:
                        break;
                }

            } else if (type === 'sign') {
                hrefTo('app://signPage');

            } else {
                hrefTo('app://boxPage?groupId=1');
            }
        },

        // 

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

@import "./base";

.act-container {
    min-height: 100vh;
    font-size: 0;
    // .bg_size('wangge.png', 100%, 0% 0%);
    // background-repeat: repeat;
    background-color: #D24132;
    overflow: hidden;
}
.act-banner {
    box-sizing: content-box;
    position: relative;
    margin: 0 auto;
    width: 734px;
    height: 777px;
    .bg_size('a_banner.png', 100%, 0% 0%);

    .act_rule {
        position: absolute;
        top: 0;
        right: 38px;
        width: 60px;
        height: 154px;
        .bg_size('a_rule.png', 100%, 0% 0%);
    }
}
.act-ioline {
    height: 3px;
}
.act-nav {
    margin-bottom: 142px;
    height: 73px;

    .n_normal {
        margin: 0 auto;
        width: 702px;
        height: 73px;
        .bg_size('nav_normal.png');
    }
    .n_fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 6;
        height: 80px;
        .bg_size('nav_fixed.png', 100%);
    }
    .nav_item {
        display: inline-block;
        vertical-align: top;
        width: 33.3%;
        height: inherit;
    }
}

.act-box1 {
    height: 2432px;
    .bg_size('page1.png');

    &::before {
        content: "";
        display: table;
        height: 0;
        visibility: hidden;
    }
}
.act-box2 {
    position: relative;
    margin-top: 38px;
    height: 1232px;
    .bg_size('page2.png');

    &::before {
        content: "";
        display: table;
        height: 0;
        visibility: hidden;
    }
}
.act-box3 {
    position: relative;
    z-index: 1;
    margin-top: 12px;
    height: 1198px;
    .bg_size('page3.png');

    &::before {
        content: "";
        display: table;
        height: 0;
        visibility: hidden;
    }
}

.my_info {
    margin: 0 auto;
    margin-top: -86px;
    padding-right: 30px;
    display: flex;
    align-items: center;
    width: 596px;
    height: 123px;
    font-size: 0;
    
    background: #FFFFFF;
    border: 3px solid #040000;
    border-radius: 61px;

    .my_item {
        flex: none;
        width: 180px;
        height: inherit;
        text-align: center;

        & + .my_item {
            flex: 1;
            height: auto;

            > p {
                font-weight: bold;
                font-size: 53px;
                color: #DC3D2F;
                line-height: 56px;
            }
            > p + p {
                font-weight: normal;
                font-size: 24px;
                color: #000000;
                line-height: 30px;
            }
        }
        & + .my_item + .my_item {
            flex: none;
            width: 156px;
            height: auto;
        }
    }
    .myt_top {
        position: relative;
        margin-left: -16px;
        width: 178px;
        height: 178px;
        background: #F06E9A;
        border: 3px solid #040000;
        border-radius: 50%;

        > img {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 150px;
            height: 150px;
            background: #FFFFFF;
            border: 3px solid #040000;
            border-radius: 50%;

            & + p {
                position: absolute;
                left: 0;
                right: 0;
                bottom: -16px;
                margin: auto;
                padding: 0 12px;

                width: 154px;
                height: 35px;
                text-align: center;
                font-size: 20px;
                color: #000000;
                line-height: 28px;
                background: #FFFFFF;
                border: 3px solid #040000;
                border-radius: 17px;
                .over_test();
            }
        }
    }
}
.rank_box {
    position: relative;
    margin: 0 auto;
    margin-top: 452px;
    width: 602px;

    .rank_top {
        position: absolute;
        top: -230px;
        left: 4px;
        right: 0;
        height: 230px;

        .rt_item {
            position: absolute;
            width: 33.333%;
            height: inherit;
            text-align: center;

            &:nth-child(1) {
                left: 0;
                right: 0;
                margin: auto;

                .rt_ava {
                    margin-top: 30px;
                    width: 84px;
                    height: 84px;
                }
            }
            &:nth-child(2) {
                left: 0;

                .rt_ava {
                    margin-top: 74px;
                    width: 64px;
                    height: 64px;
                }
                .rt_nick {
                    margin-top: 20px;
                    width: 144px;
                }
                .rt_number {
                    font-size: 24px;
                }
            }
            &:nth-child(3) {
                right: 0;

                .rt_ava {
                    margin-top: 74px;
                    width: 64px;
                    height: 64px;
                }
                .rt_nick {
                    width: 144px;
                }
                .rt_number {
                    margin-top: 4px;
                    font-size: 24px;
                }
            }
        }
        .rt_ava {
            margin: 0 auto;
            background-size: contain;
            background-position: 50% 50%;
            border-radius: 50%;
        }
        .rt_nick {
            padding: 0 10px;
            margin: 0 auto;
            margin-top: 21px;
            width: 166px;
            height: 30px;

            text-align: center;
            font-size: 20px;
            color: #000000;
            line-height: 24px;
            background: #FFFFFF;
            border: 3px solid #040000;
            border-radius: 15px;

            .over_test();
        }
        .rt_number {
            text-align: center;
            font-size: 29px;
            color: #000000;
        }
    }
    .rank_title {
        display: flex;
        align-items: center;
        height: 50px;

        > span {
            flex: 1;
            text-align: center;
            font-size: 21px;
            color: #000000;

            &:nth-child(1) {
                flex-grow: 0.2;
            }
            &:nth-child(2) {
                flex-grow: 0.49;
            }
            &:nth-child(3) {
                flex-grow: 0.31;
            }
        }
    }
    .rank_scroll {
        height: 478px;
        overflow: scroll;

        .rank_null {
            padding: 32px;
            text-align: center;
            font-size: 24px;
            color: #000000;
        }
        .rank_row {
            height: 68px;
            display: flex;
            align-items: center;
            text-align: center;
            font-size: 18px;
            color: #000000;

            > p {
                flex: none;
                width: 120px;
            }
            > p + img {
                flex: none;
                width: 44px;
                height: 44px;
                background: #FFCD51;
                border: 2px solid #040000;
                border-radius: 50%;
            }
            > p + img + p {
                flex: 1;
                margin-left: 10px;
                text-align: left;
                .over_test();
            }
            > p + img + p + p {
                flex: none;
                margin-left: 10px;
                width: 180px;
            }
        }
    }
    .chcb_btn {
        margin: 0 auto;
        margin-top: 42px;
        width: 298px;
        height: 80px;
        .bg_size('a_chongbang.png');
    }
}

.fuqi_box {
    position: absolute;
    top: 2px;
    right: 43px;
    padding-left: 38px;
    width: 322px;
    height: 102px;

    > p {
        margin-top: 6px;
        font-weight: bold;
        font-size: 53px;
        color: #FFFFFF;
        line-height: 53px;
    }
    > p + p {
        margin-top: 0;
        font-size: 24px;
        color: #000000;
        line-height: 32px;
    }
    > p + p + div {
        position: absolute;
        top: 0;
        right: 15px;
        width: 60px;
        height: 154px;
        .bg_size('a_rcd.png');
    }
}
.fuqi_tab {
    margin-top: 208px;
    text-align: center;

    .f_tab {
        display: inline-block;
        vertical-align: top;

        & + .f_tab {
            margin-left: 20px;
        }
        &_0_0 {
            margin-top: 8px;
            width: 270px;
            height: 75px;
            .bg_size('ftab_0_0.png');
        }
        &_0_1 {
            width: 324px;
            height: 95px;
            .bg_size('ftab_0_1.png');
        }
        &_1_0 {
            margin-top: 8px;
            width: 270px;
            height: 75px;
            .bg_size('ftab_1_0.png');
        }
        &_1_1 {
            width: 324px;
            height: 95px;
            .bg_size('ftab_1_1.png');
        }
    }
}
.fuqi_main {
    padding: 36px 24px 29px 39px;
    margin: 0 auto;
    margin-top: 20px;
    width: 616px;
    height: 822px;

    & > p {
        // margin-top: 14px;
        margin-top: 40px;
        font-size: 24px;
        color: #000000;
    }
    .fuqi_item {
        position: relative;
        display: flex;
        align-items: center;
        height: 121px;

        & + .fuqi_item {
            margin-top: 26px;
        }
        .fq_number {
            position: absolute;
            top: 2px;
            left: -12px;
            width: 106px;
            height: 30px;

            text-align: center;
            font-size: 18px;
            color: #FFFFFF;            
            line-height: 26px;
            background: #000000;
            border: 2px solid #000000;
            border-radius: 20px;
        }
        .fq_cover {
            flex: none;
            width: 121px;
            height: 121px;
        }
        .fq_desc {
            flex: 1;
            margin-left: 40px;

            > p {
                padding-right: 22px;
                text-align: left;
                font-weight: bold;
                font-size: 26px;
                color: #000000;

                line-height: 34px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;  // 几行后溢出隐藏
                overflow: hidden;
            }
            > p + div {
                margin-top: 8px;
                width: 142px;
                height: 39px;
                text-align: center;
                font-size: 24px;
                color: #FFFFFF;
                line-height: 39px;
                background: #000000;
            }
        }
        .fq_btn {
            flex: none;
            width: 151px;
            height: 49px;
            text-align: center;
            font-weight: bold;
            font-size: 26px;
            color: #000000;
            line-height: 48px;

            &.active {
                .bg_size('fb_active.png', 100%);
            }
            &.disable {
                .bg_size('fb_disable.png', 100%);
            }
        }
    }
}

.recommend_box {
    margin: 0 auto;
    margin-top: 12px;
    padding-top: 154px;
    width: 679px;
    height: 1137px;
    text-align: center;

    .rem_item {
        margin-top: 31px;
        display: inline-block;
        vertical-align: top;
        width: 291px;
        height: 294px;

        & + .rem_item {
            margin-left: 34px;
        }
        &:nth-child(2n-1) {
            margin-left: 0;
        }
        &:nth-child(-n+2) {
            margin-top: 0;
        }

        &_1 {
            .bg_size('rem_01.png');
        }
        &_2 {
            .bg_size('rem_02.png');
        }
        &_3 {
            .bg_size('rem_03.png');
        }
        &_4 {
            .bg_size('rem_04.png');
        }
        &_5 {
            .bg_size('rem_05.png');
        }
        &_6 {
            .bg_size('rem_06.png');
        }
    }
}

.page_bottom {
    position: relative;
    padding-top: 12px;
    height: 178px;
    text-align: center;

    .b_shadow {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 316px;
        .bg_size('bottom_shadow.png');
    }
    .b_fixed {
        position: relative;
        z-index: 3;
        // position: absolute;
        // left: 0;
        // right: 0;
        // bottom: 68px;
        // z-index: 6;
    }
    .b_btn {
        margin: 0 auto;
        display: inline-block;
        vertical-align: top;
        width: 274px;
        height: 87px;
        .bg_size('bottom_btn.png');

        &.sign_btn {
            margin-right: 36px;
            .bg_size('bottom_btn_sign.png');
        }
    }
}

/* 弹窗 */
.mask_rule {
    .bg_size('mask/window_rule.png');
}
.mask_confirm {
    .bg_size('mask/window_confirm.png');
}
.mask_gift {
    .bg_size('mask/window_gift.png');
}
.mask_rcd {
    .bg_size('mask/window_rcd.png');
}

.confirm_num {
    margin-top: 126px;
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    color: #FFFFFF;
    line-height: 50px;
}
.confirm_cover {
    margin: 0 auto;
    margin-top: 19px;
    display: block;
    width: 302px;
    height: 302px;
    border: 3px solid #000000;
    border-radius: 10px;
    overflow: hidden;
}
.confirm_btn {
    margin-top: 37px;
    text-align: center;

    > div {
        display: inline-block;
        vertical-align: top;
        width: 217px;
        height: 82px;

        .bg_size('/mask/cf_no.png', 100%);
    }
    > div + div {
        margin-left: 12px;
        .bg_size('/mask/cf_yes.png', 100%);
    }
}
.awd_name {
    padding: 0 16px;
    margin: 0 auto;
    margin-top: 175px;
    width: 310px;
    height: 49px;
    text-align: center;
    font-size: 30px;
    color: #ffffff;
    line-height: 43px;
    background: #5EB1F8;
    border: 3px solid #000000;
    border-radius: 24px;

    .over_test();
}
.awd_cover {
    margin: 0 auto;
    margin-top: 17px;
    display: block;
    width: 302px;
    height: 302px;
    border: 3px solid #000000;
    border-radius: 10px;
}
.awd_btn {
    margin: 0 auto;
    margin-top: 37px;
    width: 272px;
    height: 82px;

    .bg_size('/mask/awd_close.png', 100%);
}

.rcd_main {
    box-sizing: content-box;
    position: relative;
    margin: 0 auto;
    margin-top: 167px;
    width: 423px;
    height: 412px;
    background: #FFCD51;
    border: 3px solid #000000;
    border-radius: 10px;
    overflow: hidden;

    .rcd_border {
        position: absolute;
        top: 0;
        left: 33.333%;
        bottom: 0;
        width: 3px;
        background: #000000;

        & + .rcd_border {
            left: 66.667%;
        }
    }
    .rcd_title {
        display: flex;
        align-items: center;
        border-bottom: 3px solid #000000;
        background: #ffffff;

        > span {
            flex: 1;
            height: 59px;
            text-align: center;
            font-size: 22px;
            color: #000000;
            line-height: 59px;
        }
    }
    .rcd_null {
        padding: 30px 0;
        text-align: center;
        font-size: 22px;
        color: #000000;
    }
    .rcd_row {
        height: 70px;
        display: flex;
        align-items: center;

        > div {
            flex: 1;
            padding: 0 12px;
            text-align: center;
            font-size: 22px;
            color: #000000;

            &:last-child {
                line-height: 26px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;  // 几行后溢出隐藏
                overflow: hidden;
            }
        }
        &:nth-child(2n) {
            background: #FFDE8D;
        }
    }
}
.rcd_btn {
    margin-top: 28px;
    text-align: center;

    > div {
        display: inline-block;
        vertical-align: top;
        width: 193px;
        height: 56px;
        .bg_size('/mask/rcd_prev.png');

        & + div {
            margin-left: 20px;
            .bg_size('/mask/rcd_next.png');
        }
    }
}

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
