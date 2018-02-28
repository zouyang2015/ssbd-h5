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
        <div class="product-list">
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
    </f7-page>
</template>

<script>

  import {getProductListBySearch,getSearchHot} from 'api/api'
  import axios from 'axios'

  export default {
    data() {
      return {
        searchWord:'',
        searchBlock:false,
        hotWord:[],//关键词
        hotLink:[],//热搜
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
        this.goSearchList()
      },
      goSearchList(){
        this.$f7.mainView.router.load({url: '/product-search-list/'})
        sessionStorage.setItem('searchWord', JSON.stringify(this.searchWord))
      },
      //推荐和热搜
      getSearchHot(){
        var _this=this
        getSearchHot().then((res)=>{
          _this.hotWord=res.prodwordlist
          _this.hotLink=res.prodlist
        })
      },
      selectItem(prodkey) {
        this.$f7.mainView.router.load({url: '/product-detail/'})
        sessionStorage.setItem('prodkey', JSON.stringify(prodkey))
      },
      //推荐获取
      getHotList(hotword){
        this.searchWord=hotword
        this.goSearchList()
      },
    },
    mounted:function () {
      this.getSearchHot()
    }
  }



</script>