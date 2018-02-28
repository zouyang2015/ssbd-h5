<template>
  <!-- App -->
  <div id="app">
    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
        <f7-pages>
          <f7-page></f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 右上角按钮打开关闭控制
        openActionVale: false,
        // 默认产品列表
        listAry: [],
        buttonStatus:1,//默认显示1推荐产品,2代表推荐产品,21代表推荐产品列表，3代表产品分类，31代表搜索产品列表
        buttonStatusActive:2,//2代表下划线在推荐产品位置，3代表下划线在产品分类位置
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
        recommendAryYuan:[],
        recommendAryList:[],//公司产品
        // 产品分类
        assortmentAry: [],
        searchList:'',
        compkey:'',
        compname:'',
        productname:'',

        prodkey:''
      }
    },
    created() {
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
    },
    methods: {
      queryString(item) {
        var sValue = window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue;
      }
    },
    mounted() {
      setTimeout(() => {
        if (this.prodkey) {
          this.$f7.mainView.router.load({url: '/product-detail/'})
          sessionStorage.setItem('prodkey', JSON.stringify(this.prodkey))
        } else {
          this.$f7.mainView.router.load({
            url: '/top-page/',
            animatePages: true
          })
        }
      }, 20)
    }
  }
</script>

<style>
  .navbar {
    background: none;
  }
</style>