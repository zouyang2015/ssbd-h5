<style>
  .v-master .assortment {
    padding: inherit;
    margin: inherit;
  }

  .v-media .item-media img {
    width: 60px;
  }

  .v-media .media-list {
    margin: 0;
  }

  .nav-active {
    border-bottom: 1px solid #3C87EB;
  }

  .lookmore {
    width: 60%;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    color: #888;
    border-radius: 16px;
  }

  .lookmore:active {
    background-color: #fff;
  }

</style>
<template>
  <f7-page class="v-master">
    <!-- iOS Theme Navbar -->
    <f7-navbar v-if="$theme.ios" class="app-navi">
      <!--<f7-nav-left back-link=" " sliding></f7-nav-left>-->
      <f7-nav-center sliding>保险产品算费</f7-nav-center>

      <f7-subnavbar class="main-navi" sliding>
        <f7-buttons>
          <f7-button v-if="buttonStatus===1" @click="changeStatus(2)" class="main-navi-item btn" :class="{ 'nav-active': buttonStatusActive===2||buttonStatusActive===1,'up-arrow': buttonStatusActive===2&&(buttonStatus===21||buttonStatus===2)}">
            <!--nav-active-->
            <span>推荐产品</span>
            <span v-if="buttonStatusActive===2||buttonStatusActive===1" class="navspan"></span>
          </f7-button>
          <f7-button v-else @click="changeStatus(1)" class="main-navi-item btn" :class="{ 'nav-active': buttonStatusActive===2||buttonStatusActive===1,'up-arrow': buttonStatusActive===2&&(buttonStatus===21||buttonStatus===2)}">
            <!--nav-active-->
            <span>{{compname?compname.substring(0,4):"推荐产品"}}</span>
            <span v-if="buttonStatusActive===2||buttonStatusActive===1" class="navspan"></span>
          </f7-button>
          <f7-button @click="search" class="main-navi-item search-img">
            <span>搜索保险产品</span>
          </f7-button>
          <f7-button @click="changeStatus(3)" class="main-navi-item btn" :class="{ 'nav-active': buttonStatusActive===3,'up-arrow': buttonStatusActive===3&&buttonStatus!==1}">
            <span>{{productname?productname.substring(0,4):"产品分类"}}</span>
            <span v-if="buttonStatusActive===3" class="navspan"></span>
          </f7-button>
        </f7-buttons>
      </f7-subnavbar>
    </f7-navbar>


    <template v-if="buttonStatus===31">
      <f7-list class="product-list" id="search-list" v-if="searchList.length>0">
        <f7-list-item no-link-class class="product-item"
                      v-for="(item, index) in searchList" @click="selectItem(item.prodkey)" :key="index">
          <div class="icon">
            <img v-lazy="item.picurl" width="60" height="45">
          </div>
          <div class="text">
            <h2 class="name">
              <span class="left">{{item.prodname}}</span><span class="hot" v-if="item.ishot === 'Y'">热销</span><span class="hot" v-if="item.isnew === 'Y'" style="color: #ff6969;border:1px solid #ff6969">新品</span><span class="hot" v-if="item.istingshou === 'Y'" style="color: #3C87EB;border:1px solid #3C87EB">停售</span>
            </h2>
            <p class="desc">{{item.prodtags}}</p>
          </div>
        </f7-list-item>
      </f7-list>

      <f7-list class="product-list v-searchbar-not" v-else-if="searchList.length===0">
        <f7-list-item title="暂无相关产品"></f7-list-item>
      </f7-list>
    </template>

    <template v-else>
      <!-- 全推荐列表 -->
      <template v-if="buttonStatus===1">
        <f7-list v-if="listAry && listAry.length" class="product-list">
          <f7-list-item no-link-class class="product-item"
                        v-for="(item, index) in listAry" @click="selectItem(item.prodkey)" :key="index">
            <div class="icon">
              <img v-lazy="item.picurl" width="60" height="45">
            </div>
            <div class="text">
              <h2 class="name">
                <span class="left">{{item.prodname}}</span><span class="hot" v-if="item.ishot === 'Y'">热销</span><span class="hot" v-if="item.isnew === 'Y'" style="color: #ff6969;border:1px solid #ff6969">新品</span><span class="hot" v-if="item.istingshou === 'Y'" style="color: #3C87EB;border:1px solid #3C87EB">停售</span>
              </h2>
              <p class="desc">{{item.prodtags}}</p>
            </div>
          </f7-list-item>
        </f7-list>
      </template>

      <!--拼音筛选-->
      <template v-else-if="buttonStatus==2">
        <div data-page="index" class="product-list page">
          <div class="page-content">

            <div class="list-block contacts-block" v-for="(item,index) in recommendAry" v-if="item.letter!=='*'">
              <div class="list-group">
                <!--<ul>-->
                <!--<li>-->
                <!--<div class="item-content">-->
                <!--<div class="item-inner">-->
                <!--<div class="item-title" @click="changeStatus(1)">推荐产品</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--</li>-->
                <!--</ul>-->
                <ul>
                  <li class="list-group-title" :data-index-letter="item.letter">{{item.letter.toUpperCase()}}</li>
                  <li v-for="(itemS,indexS) in item.data">
                    <div class="item-content">
                      <div class="item-inner">
                        <div class="item-title" @click="getProductListByCompkey(itemS.compkey,itemS.compname)">
                          {{itemS.compname}}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
          <ul class="list-index"></ul>
        </div>
      </template>

      <!-- 公司产品 -->
      <template v-else-if="buttonStatus===21">
        <f7-list v-if="recommendAryList && recommendAryList.length" class="product-list">
          <f7-list-item no-link-class class="product-item"
                        v-for="(item, index) in recommendAryList" @click="selectItem(item.prodkey)" :key="index" v-if="index<20">
            <div class="icon">
              <img v-lazy="item.picurl" width="60" height="45">
            </div>
            <div class="text">
              <h2 class="name">
                <span class="left">{{item.prodname}}</span><span class="hot" v-if="item.ishot === 'Y'">热销</span><span class="hot" v-if="item.isnew === 'Y'" style="color: #ff6969;border:1px solid #ff6969">新品</span><span class="hot" v-if="item.istingshou === 'Y'" style="color: #3C87EB;border:1px solid #3C87EB">停售</span>
              </h2>
              <p class="desc">{{item.prodtags}}</p>
            </div>
          </f7-list-item>
          <f7-button class="page-list-item lookmore" @click="recommendFunc(compkey,compname)"><span>查看更多产品</span>
          </f7-button>
        </f7-list>
      </template>

      <!-- 产品分类 -->
      <template v-else-if="buttonStatus===3">
        <f7-block class="assortment">
          <div class="assortment-list">
            <template v-for="(item, index) in assortmentAry" v-if="!item.parrentcode">
              <h2 class="title">{{item.typename}}</h2>
              <div class="row">
                <template v-for="(itemS, indexS) in assortmentAry" v-if="itemS.parrentcode===item.typecode">
                  <div class="row-item col-33" @click="getProductListByWord(itemS.typecode,itemS.typename)">
                    {{itemS.typename}}
                  </div>
                </template>
              </div>
            </template>
          </div>
        </f7-block>
      </template>
    </template>
  </f7-page>
</template>

<script>
  import {getBaseInfo, getMainRisk, getProductListByWord} from 'api/api'
  import {indexedlist} from 'common/js/common'

  export default {
    data() {
      return {
        // 右上角按钮打开关闭控制
        openActionVale: false,
        // 默认产品列表
        listAry: [],
        buttonStatus: 1,//默认显示1推荐产品,2代表推荐产品,21代表推荐产品列表，3代表产品分类，31代表搜索产品列表
        buttonStatusActive: 2,//2代表下划线在推荐产品位置，3代表下划线在产品分类位置
        // 推荐产品
        recommendAry: [
//          {
//            letter: 'B',
//            data: [
//              {
//                compname: '北大方正人寿'
//              },
//            ]
//          },
        ],
        recommendAryYuan: [],
        recommendAryList: [],//公司产品
        // 产品分类
        assortmentAry: [],
        searchList: '',
        compkey: '',
        compname: '',
        productname: '',

        prodkey: ''
      }
    },
    created() {
      let navbar = document.getElementsByClassName('navbar')[0]
      navbar.style.background = '#ffffff'
      this.prodkey = this.queryString('prodkey')
      // 清session
      window.sessionStorage.removeItem('prodkey')
      window.sessionStorage.removeItem('pageid')
      window.sessionStorage.removeItem('productDetail')
      window.sessionStorage.removeItem('detailToAdd')
      window.sessionStorage.removeItem('mainToDetail')
      window.sessionStorage.removeItem('additionalToDetail')
      window.sessionStorage.removeItem('saveList')
      window.sessionStorage.removeItem('compkey')
      window.sessionStorage.removeItem('compname')
      this.getMainRisk()
    },
    methods: {
      queryString(item) {
        var sValue = window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue;
      },
      // 获取主险
      getMainRisk() {
        getMainRisk().then((res) => {
          if (res.status === '0') {
            this.listAry = res.prodlist
          }
        })
      },
      selectItem(prodkey, pageid) {
        this.$f7.mainView.router.load({url: '/product-detail/'})
        sessionStorage.setItem('prodkey', JSON.stringify(prodkey))
      },
      search: function () {
        this.$f7.mainView.router.load({url: '/product-search/'})
      },
      changeStatus: function (status) {
        if (status === 2) {
          //渲染索引列表页面
          setTimeout(() => {
            indexedlist()
            this.$f7.indexedlist({
              init: true,
              container: '.page'
            })
          }, 20)
        }
        this.compname = ""
        this.productname = ""
        if (this.buttonStatus === 21 && (status === 1 || status === 2)) {
          this.buttonStatus = 2
          this.buttonStatusActive = 2
        } else if (this.buttonStatus === 2 && status === 1) {
          this.buttonStatus = 1
          this.buttonStatusActive = 2
        } else if (this.buttonStatus === 2 && status === 2) {
          this.buttonStatus = 2
          this.buttonStatusActive = 1
        } else if (this.buttonStatus === 3 && status === 3) {
          this.buttonStatus = 1
          this.buttonStatusActive = 3
        } else if (this.buttonStatus === 31 && status === 3) {
          this.buttonStatus = 3
          this.buttonStatusActive = 3
        } else {
          this.buttonStatus = status
          this.buttonStatusActive = status
        }
      },
      //获取基本信息
      getBaseInfo(){
        var _this = this
        getBaseInfo().then((res) => {
          //产品分类
          _this.assortmentAry = res.prodtype
          //保险公司
          _this.recommendAry = _this.pySegSort(res.prodcomp)
          _this.recommendAryYuan = res.prodcomp
        })
      },
      //分类列表
      getProductListByWord(prodtype, typename){
        var _this = this
        this.buttonStatus = 31
        this.productname = typename
        var keyword = {"classtype": "M", "prodtypes": [{"prodtype": prodtype}]}
        getProductListByWord(keyword).then((res) => {
          _this.searchList = res.prods
        })
      },
      //获取公司产品
      getProductListByCompkey(compkey, compname){
        var _this = this
        this.buttonStatus = 21
        this.compkey = compkey
        this.compname = compname
        var keyword = {"classtype": "M", "prodcomp": [{"compkey": compkey}]}
        getProductListByWord(keyword).then((res) => {
          _this.recommendAryList = res.prods
        })
      },
      recommendFunc(compkey, compname) {
        this.$f7.mainView.router.load({url: '/product-company-list/'})
        sessionStorage.setItem('compkey', JSON.stringify(compkey))
        sessionStorage.setItem('compname', JSON.stringify(compname))
      },
      pySegSort(arr) {
        if (!String.prototype.localeCompare)
          return null;

        var letters = "*abcdefghjklmnopqrstwxyz".split('');
        var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');

        var segs = [];
        var curr;
        letters.forEach(function (item, i) {
          curr = {letter: item, data: []};
          arr.forEach(function (item2) {
            if (letters[i] == item2.compname.substring(0, 1).toLocaleLowerCase()) {
              curr.data.push(item2);
            } else if ((!zh[i - 1] || zh[i - 1].localeCompare(item2.compname, "zh") <= 0) && item2.compname.localeCompare(zh[i], "zh") == -1) {
              curr.data.push(item2);
              //console.log(curr)
            }
          });
          if (curr.data.length) {
            segs.push(curr);
            curr.data.sort(function (a, b) {
              return a.compname.localeCompare(b.compname, "zh");
            });
          }
        });
        return segs;
      },

    },
    mounted(e) {
      this.getBaseInfo()

      setTimeout(() => {
        if (this.prodkey) {
          this.$f7.mainView.router.load({url: '/product-detail/'})
          sessionStorage.setItem('prodkey', JSON.stringify(this.prodkey))
        }
      }, 20)
    }
  }
</script>

<style>
  @import "../css/app.css";
  @import "../css/framework7.indexed-list.css";
</style>