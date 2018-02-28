<style>
    .v-searchpage .list-block{
        margin: 0px 0 45px;
    }
    .navbar-through .page>.v-search~.page-content{
        padding-top: 0px;
        top:45px;
    }
    .v-searchpage .h2-title{
        font-size: 14px;
        border-bottom: 1px solid #e6e6e6;
        border-top:none;
        margin-bottom: 10px;
        padding: 5px 0 5px 0;
    }
    .v-searchpage .v-padding{
        padding: 10px;
        background-color: #fff;
        margin-bottom: 10px;
    }
    .v-searchpage .v-gjc li{
        display: inline-block;
        background-color:#efeff4;
        margin: 3px;
        padding: 3px 10px;
        margin-bottom: 5px;
        border-radius: 2px;
        color:#666;
        font-size: 16px;
    }
    .v-searchpage .hot-product li{
        line-height: 30px;
        color:#666;
    }
    .v-searchbar-not{
        font-size: 14px;
    }
</style>
<template>
    <f7-pages>
        <f7-page class="v-searchpage">
        <f7-navbar>
            <f7-nav-left back-link=" " sliding></f7-nav-left>
            <f7-nav-center sliding>产品搜索</f7-nav-center>
        </f7-navbar>
        <f7-searchbar
        class="search-risk v-search"
        cancel-link="搜索"
        placeholder="搜索内容"
        search-list="#search-list"
        :clear="true"
        v-model="searchWord"
        @searchbar:search="onSearch"
        @searchbar:enable="onEnable"
        @searchbar:disable="onDisable"
        @searchbar:clear="onClear"
        ></f7-searchbar>
        <div class="product-list" v-if="searchList===''">
            <div class="v-search-block">
                <div class="v-gjc v-padding">
                    <h2 class="h2-title">关键词</h2>
                    <ul>
                        <li v-for="(item,index) in hotWord" :key="index" @click="getHotList(item)">{{item}}</li>
                    </ul>
                </div>
                <div class="hot-product v-padding">
                   <h2 class="h2-title">热门产品</h2>
                    <ul>
                        <li v-for="(item,index) in hotLink" :key="index" @click="selectItem(item.prodkey)">{{item.prodname}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-show="searchList!==''">
            <f7-page infinite-scroll @infinite="onInfiniteScroll" style="padding-bottom: 42px;">



                <f7-list class="product-list" style="padding-top: 0; margin-top: -1px;margin-bottom: 0" id="search-list" v-if="searchList.length>0"infinite-scroll>
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
        </div>
        </f7-page>
    </f7-pages>
</template>

<script>

  import {getProductListBySearch,getSearchHot} from 'api/api'
  import axios from 'axios'

  export default {
    data() {
      return {
        searchWord:'',
        searchBlock:false,
        searchList:'',
        hotWord:[],//关键词
        hotLink:[],//热搜
        pagenum:0,
        loading: false,
        ismax: false,
      }
    },
    created() {
    },
    methods: {
      onSearch: function (query, found) {
        console.log('search', query);
      },
      onClear: function (event) {
        console.log('clear');
      },
      onEnable: function (event) {
        console.log('enable')
      },
      onDisable: function (event) {
        console.log("disable")
        this.getProductListBySearch()
      },
      goSearchList(){
        this.getProductListBySearch()
      },
      //推荐和热搜
      getSearchHot(){
        var _this=this
        getSearchHot().then((res)=>{
          _this.hotWord=res.prodwordlist
          _this.hotLink=res.prodlist
        })
      },
      getProductListBySearch(){
        var _this=this
        console.log(this.pagenum)
        if(this.searchList===""){
          this.searchList=[]
        }
        var keyword={"userid":"","type":1,"search":this.searchWord,"pagenum":this.pagenum}
        getProductListBySearch(keyword).then((res)=>{
          if(res.prodlist.length<1){
              _this.$f7.detachInfiniteScroll(_this.$$('.infinite-scroll'))
              _this.$$('.infinite-scroll-preloader').remove()
              return
          }
          _this.searchList=_this.searchList.concat(res.prodlist)
        })
      },
      selectItem(prodkey) {
        this.$f7.mainView.router.loadPage('/product-detail/')
        sessionStorage.setItem('prodkey', JSON.stringify(prodkey))
      },
      //推荐获取
      getHotList(hotword){
        this.searchWord=hotword
        this.goSearchList()
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
      this.getSearchHot()
    }
  }



</script>