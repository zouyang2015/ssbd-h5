<style>
    .v-searchbar-not ul:before{
        background-color: transparent;
    }
</style>
<template>

    <f7-page class="v-searchpage" infinite-scroll @infinite="onInfiniteScroll">
        <f7-list class="product-list" style="padding-top: 0;margin-bottom: 0; margin-top: -1px" id="search-list" v-if="searchList.length>0"infinite-scroll>
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
        <f7-list class="v-searchbar-not" v-else-if="searchList!==''">
            <f7-list-item title="暂无相关产品"></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>

  import {getProductListBySearch} from 'api/api'
  import axios from 'axios'

  export default {
    data() {
      return {
        searchWord:'',
        searchList:'',
        loading: false,
        pagenum:0
      }
    },
    created() {
      this.searchWord = JSON.parse(sessionStorage.getItem('searchWord')) || ''
    },
    methods: {
      selectItem(prodkey) {
        this.$f7.mainView.router.load({url: '/product-detail/'})
        sessionStorage.setItem('prodkey', JSON.stringify(prodkey))
      },
      //搜索列表
      getProductListBySearch(){
        var _this=this
        if(this.searchList===""){
          this.searchList=[]
        }
        var keyword={"userid":"","type":1,"search":this.searchWord,"pagenum":this.pagenum}
        getProductListBySearch(keyword).then((res)=>{
          _this.searchList=_this.searchList.concat(res.prodlist)
          if(res.prodlist.length<15){
            _this.$f7.detachInfiniteScroll(_this.$$('.infinite-scroll'))
            _this.$$('.infinite-scroll-preloader').remove()
            return
          }
        })
      },
      onInfiniteScroll(){
        if (this.loading) {
          return;
        }
        this.loading = true;
        let _this = this;
        setTimeout(function () {
          _this.loading = false;
          _this.pagenum++
          _this.getProductListBySearch()
        }, 1000)
      }
    },
    mounted:function () {
      this.getProductListBySearch()
    }
  }



</script>