<template>
  <f7-page class="add-main">
    <f7-navbar>
      <f7-nav-left back-link=" " sliding></f7-nav-left>
      <f7-nav-center sliding>添加主险</f7-nav-center>
    </f7-navbar>

    <f7-searchbar
      v-model="searchWord"
      class="search-risk"
      cancel-link="搜索"
      placeholder="搜索内容"
      :clear="true"
      @searchbar:enable="onEnable"
      @searchbar:disable="onDisable"
    ></f7-searchbar>

    <div class="choose-pro">
      <f7-accordion-item>
        <f7-accordion-toggle><span>已经选择产品{{computedList.length + computedSaveList.length + computedMainToDetail.length}}个</span></f7-accordion-toggle>
        <f7-accordion-content>
          <f7-list class="lists">

            <f7-list-item v-for="(item, index) in computedMainToDetail" :key="index" @click="deleteProduct(item.prodkey,'main')">
              <span>{{item.prodname}}</span>
              <i class="icon-check_circle"></i>
            </f7-list-item>

            <f7-list-item v-for="(item, index) in computedSaveList" :key="index" @click="deleteProduct(item.prodkey,'save')">
              <span>{{item.prodname}}</span>
              <i class="icon-check_circle"></i>
            </f7-list-item>

            <f7-list-item v-if="computedList.length" v-for="(item, index) in computedList" :key="index"
                          @click="removedProduct(item, item.prodkey)">
              <span>{{item.prodname}}</span>
              <i class="icon-check_circle"></i>
            </f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-accordion-item>
    </div>

    <f7-list v-if="productList.length" class="lists mt">
      <f7-list-item @click="selectedProduct(item, item.prodkey)" v-for="(item, index) in productList" :key="index"
                    :class="{'check':item.checked}">
        <span>{{item.prodname}}</span>
        <i class="icon-check_circle"></i>
      </f7-list-item>
    </f7-list>

    <div v-else class="no-prod-wrapper">
      <div class="no-prod">
        <p>
          <span>没有符合条件的主险</span>
        </p>
      </div>
    </div>


    <f7-toolbar bottom class="selected-confirm">
      <div class="confirm" @click="confirm">确定</div>
    </f7-toolbar>

  </f7-page>
</template>

<script>
  import {getMainRisk, addRisk, getSearch} from 'api/api'

  export default {
    data() {
      return {
        // 当前主险
        prodkey: '',
        detailToAdd: {},
        mainToDetail: [],
        // 存产品条数
        productList: [],
        selectedList: [],
        saveList: [],

        loading: true,
        searchWord: ''
      }
    },
    created() {
      this.$f7.showIndicator()
      this.prodkey = JSON.parse(sessionStorage.getItem('prodkey')) || ''
      this.detailToAdd = JSON.parse(sessionStorage.getItem('detailToAdd')) || {}
      this.mainToDetail = JSON.parse(sessionStorage.getItem('mainToDetail')) || []
      this.additionalToDetail = JSON.parse(sessionStorage.getItem('additionalToDetail')) || []
      this.saveList = JSON.parse(sessionStorage.getItem('saveList')) || []



      // 添加主险
      this.getMainRisk()
    },
    computed: {
      computedMainToDetail() {
        let curAry = []
        // 去掉在computedList有相同prodkey号的
        this.mainToDetail.forEach((item) => {
          let flg = false
          flg = this.computedList.some((detail) => {
            return item.prodkey === detail.prodkey
          })
          if(!flg) {
            curAry.push(item)
          }
        })
        return curAry
      },
      computedSaveList() {
        let curAry = []
        // 去掉在computedList有相同prodkey号的
        this.saveList.forEach((item) => {
          let flg = false
          flg = this.computedList.some((detail) => {
            return item.prodkey === detail.prodkey
          })
          if(!flg) {
            curAry.push(item)
          }
        })
        return curAry
      },
      // 计算被选中的产品项
      computedList() {
        return this.productList.filter((item) => {
          return item.checked === true
        })
      }
    },
    methods: {
      normalizeSaveList() {
        let curAry = []
        // 去掉在computedList有相同prodkey号的
        this.saveList.forEach((item) => {
          let flg = false
          flg = this.computedList.some((detail) => {
            return item.prodkey === detail.prodkey
          })
          if(!flg) {
            curAry.push(item)
          }
        })
        this.saveList = curAry
      },
      // 添加主险
      getMainRisk(compkey) {
        getMainRisk(compkey).then((res) => {
          if (res.status === '0') {
            this.productList = this.normalizeProdlist(res.prodlist)
            this.echoedData()
          } else {
            if (typeof res.msg === 'undefined' || res.msg === 'null' || res.msg === '') {
              this.$f7.alert('出错了', null)
            } else {
              this.$f7.alert(res.msg, null)
            }
          }
          this.$f7.hideIndicator()
        })
      },
      // 过滤掉当前主险
      normalizeProdlist(list) {
        return list.filter((item) => {
          return item.prodkey !== this.prodkey
        })
      },
      // 回显处理
      echoedData() {
        this.mainToDetail.forEach((selected) => {
          this.productList.forEach((item) => {
            if (selected.prodkey === item.prodkey) {
              this.$set(item, 'checked', true)
            }
          })
        })
      },
      // 点击下面列表添加、移除产品
      selectedProduct(product, prodkey) {
        if (typeof product.checked === 'undefined') {
          this.$set(product, 'checked', true)
        } else {
          product.checked = !product.checked
        }
      },
      // 删除的产品
      deleteProduct(prodkey, type) {
        if(type === 'save') {
          this.saveList = this.saveList.filter((item) => {
            console.log(prodkey, item.prodkey)
            return item.prodkey !== prodkey
          })
        }else if(type === 'main') {
          this.mainToDetail = this.mainToDetail.filter((item) => {
            return item.prodkey !== prodkey
          })
        }

      },
      // 点击已选中产品移除
      removedProduct(product, prodkey) {
        this.saveList = this.saveList.filter((item) => {
          return item.prodkey !== prodkey
        })
        this.mainToDetail = this.mainToDetail.filter((item) => {
          return item.prodkey !== prodkey
        })
        product.checked = false
      },
      // 点击搜索
      onDisable: function () {
        this.saveList = this.selectedList
        sessionStorage.setItem('saveList', JSON.stringify(this.saveList))
//        this.selectedList = []
        let option = {
          classtype: 'M',
          keyword: this.searchWord
        }
        getSearch(option).then((res) => {
          if (res.status === '0') {
            this.productList = res.prods
//            this.selectedList = this.saveList.concat(this.selectedList)
          } else {
            if (typeof res.msg === 'undefined' || res.msg === 'null' || res.msg === '') {
              this.$f7.alert('出错了', null)
            } else {
              this.$f7.alert(res.msg, null)
            }
          }
          this.$f7.hideIndicator()
        })
      },
      onEnable() {
        this.searchWord = ''
      },
      // 添加主险(附加险)确认
      confirm() {
        let option = Object.assign({}, this.detailToAdd, {
          prodlist: []
        })
        this.computedMainToDetail.forEach((item) => {
          let obj = {}
          obj.prodkey = item.prodkey
          obj.pageid = item.pageid || ''
          obj.parentprodkey = item.parentprodkey || ''
          obj.option = 'A'
          option.prodlist.push(obj)
        })
        this.computedSaveList.forEach((item) => {
          let obj = {}
          obj.prodkey = item.prodkey
          obj.pageid = item.pageid || ''
          obj.parentprodkey = item.parentprodkey || ''
          obj.option = 'A'
          option.prodlist.push(obj)
        })
        this.productList.forEach((item) => {
          if (typeof item.checked !== 'undefined') {
            let obj = {}
            obj.prodkey = item.prodkey
            obj.pageid = item.pageid || ''
            obj.parentprodkey = item.parentprodkey || ''
            if (item.checked === true) {
              obj.option = 'A'
            } else {
              obj.option = 'D'
              // 记录被删掉的主险，将其附加险也选中一起删掉（处理的是session)
              this.additionalToDetail = this.additionalToDetail.filter((additional) => {
                return item.prodkey !== additional.parentprodkey
              })
              sessionStorage.setItem('additionalToDetail', JSON.stringify(this.additionalToDetail))
            }
            option.prodlist.push(obj)
          }
        })

        if (option.prodlist.length) {
          this.$f7.showIndicator()
          this.addRisk(option)
        } else {
          this.$f7.mainView.router.back()
        }
      },
      // 添加主险(附加险)确认-ajax
      addRisk(option) {
        addRisk(option)
          .then((res) => {
            if (res.status === '0') {
              sessionStorage.setItem('mainToDetail', JSON.stringify(res.prodlist))
              this.$f7.mainView.router.back()
            } else {
              if (typeof res.msg === 'undefined' || res.msg === 'null' || res.msg === '') {
                this.$f7.alert('出错了', null)
              } else {
                this.$f7.alert(res.msg, null)
              }
            }
            this.$f7.hideIndicator()
          })
      }
    },
    watch: {
      productList: {
        handler(newVal) {
          this.selectedList = newVal.filter((item) => {
            return item.checked && item.checked === true
          })
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  @import "../css/add-main.css";
</style>