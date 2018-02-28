<template>
  <f7-page class="multiple">
    <f7-navbar :title="title" back-link=" " sliding></f7-navbar>

    <f7-list>
      <f7-list-item link="/profit/" class="item" v-for="(item, index) in sumAry" :key="index" @click="detail(item.prodkey, item.pageid)">
        <span>{{item.prodname}}</span></f7-list-item>
    </f7-list>


  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        sumAry: [],
        type: '',
        title: ''
      }
    },
    created() {
      this.sumAry = JSON.parse(sessionStorage.getItem('sumAry')) || ''
      this.type = this.$route.params.type
      this.title = this.$route.params.title
    },
    methods: {
      detail(prodkey, pageid) {
        this.$f7.mainView.router.load({url: `/${this.type}/${prodkey}/${pageid}`})
      }
    }
  }
</script>

<style>
  .multiple .list-block {
    margin: 0;
    font-size: 14px;
    margin-top: -1px;
  }

  .multiple .item-content {
    padding: 0;
  }

  .multiple .item-content span {
    padding-left: 15px;
  }

  .multiple .list-block .item-inner {
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 35px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%2060%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'm60%2061.5-38.25%2038.25-9.75-9.75%2029.25-28.5-29.25-28.5%209.75-9.75z'%20fill%3D'%23c7c7cc'%2F%3E%3C%2Fsvg%3E");
    background-size: 10px 20px;
    background-repeat: no-repeat;
    background-position: 95% center;
    background-position: calc(100% - 15px) center;
  }


</style>