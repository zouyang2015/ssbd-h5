
<template>
    <f7-page>
        <f7-navbar :title="compname" back-link=" " sliding></f7-navbar>
        <f7-list class="product-list" style="padding:0">
            <f7-list-item no-link-class class="product-item"
                          v-for="(item, index) in searchList" @click="selectItem(item.prodkey)" :key="index">
                <div class="icon">
                    <img v-lazy="item.picurl" width="60" height="45">
                </div>
                <div class="text">
                    <h2 class="name"><span class="left">{{item.prodname}}</span><span class="hot" v-if="item.ishot === 'Y'">热销</span><span class="hot" v-if="item.isnew === 'Y'" style="color: #ff6969;border:1px solid #ff6969">新品</span><span class="hot" v-if="item.istingshou === 'Y'" style="color: #3C87EB;border:1px solid #3C87EB">停售</span></h2>
                    <p class="desc">{{item.prodtags}}</p>
                </div>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>

  import {getProductListByWord} from 'api/api'
  import axios from 'axios'

  export default {
    data() {
      return {
        compkey:'',
        compname:'',
        searchList:''
      }
    },
    created() {
      this.compkey=JSON.parse(sessionStorage.getItem('compkey')) || ''
      this.compname=JSON.parse(sessionStorage.getItem('compname')) || ''
    },
    methods: {
      //搜索列表
      getProductListByWord(){
        var _this=this
        var keyword={"classtype":"M","prodcomp":[{"compkey":this.compkey}]}
        getProductListByWord(keyword).then((res)=>{
          console.log(res)
          _this.searchList=res.prods
        })
      },
      selectItem(prodkey) {
        this.$f7.mainView.router.load({url: '/product-detail/'})
        sessionStorage.setItem('prodkey', JSON.stringify(prodkey))
      },
    },
    mounted:function () {
      this.getProductListByWord()
    }
  }

</script>