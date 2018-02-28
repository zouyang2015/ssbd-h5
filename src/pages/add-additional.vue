<template>
  <f7-page class="white">
    <f7-navbar class="additional">
      <f7-nav-left back-link=" " sliding></f7-nav-left>
      <f7-nav-center sliding>添加附加险</f7-nav-center>
    </f7-navbar>

    <div v-if="productList && productList.length > 1" class="choose">
      <f7-accordion>
        <!-- Item 1 -->
        <f7-accordion-item v-for="(lists, index) in productList" :key="index">
          <f7-accordion-toggle><span>{{lists.prodname}}</span></f7-accordion-toggle>
          <f7-accordion-content v-if="lists.sprodlist.length" v-for="(item, ind) in lists.sprodlist" :key="ind"
                                :class="{'check':item.checked}">
            <div class="text-wrapper" @click="selectedProduct(item)">
              <div class="text">
                <p class="title">{{item.prodname}}</p>
                <p class="desc">{{item.prodtag}}</p>
              </div>
              <i class="icon-check_circle"></i>
            </div>
          </f7-accordion-content>
          <f7-accordion-content v-if="lists.sprodlist.length === 0" class="no-list">
            <span>无附加险</span>
          </f7-accordion-content>
        </f7-accordion-item>
      </f7-accordion>
    </div>

    <f7-list v-if="productList && productList.length === 1" class="lists pt">
      <template v-for="(lists, index) in productList">
        <f7-list-item v-if="lists.sprodlist && lists.sprodlist.length" @click="selectedProduct(item)"
                      v-for="(item, index) in lists.sprodlist" :key="index" :class="{'check':item.checked}">
          <div class="text">
            <p class="title">{{item.prodname}}</p>
            <p class="desc">{{item.prodtag}}</p>
          </div>
          <i class="icon-check_circle"></i>
        </f7-list-item>
      </template>
    </f7-list>

    <div v-if="productList && productList.length === 1 && productList[0].sprodlist.length === 0" class="no-prod">
      <p>
        <span>没有符合条件的附加险</span>
      </p>
    </div>

    <f7-toolbar bottom class="selected-confirm">
      <div class="confirm" @click="confirm">确定</div>
    </f7-toolbar>
  </f7-page>
</template>

<script>
  import {getAdditionalRisk, addRisk, queryString} from 'api/api'

  export default {
    data() {
      return {
        prodkey: '',
        detailToAdd: {},
        additionalToDetail: [],
        // 存产品条数
        productList: []
      }
    },
    created() {
      this.$f7.showIndicator()
      this.prodkey = JSON.parse(window.sessionStorage.getItem('prodkey')) || ''
      this.detailToAdd = JSON.parse(sessionStorage.getItem('detailToAdd')) || {}
      this.additionalToDetail = JSON.parse(sessionStorage.getItem('additionalToDetail')) || []

      // 添加附加险
      this.getAdditionalRisk()
    },
    methods: {
      // 添加附加险
      getAdditionalRisk() {
        let param = {
          complist: [],
          prodlist: [],
          mprodlist: []
        }
        this.detailToAdd.allprodlist.forEach((item) => {
          if (item.parentprodkey === '') {
            param.mprodlist.push({
              prodkey: item.prodkey
            })
          }
        })
        getAdditionalRisk(param).then((res) => {
          if (res.status === '0') {
            this.productList = res.prodlist
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
      // 回显处理
      echoedData() {
        this.productList.forEach((group) => {
          group.sprodlist.forEach((item) => {
            this.additionalToDetail.forEach((selected) => {
              if (selected.prodkey === item.prodkey) {
                this.$set(item, 'checked', true)
              }
            })
          })
        })
      },
      // 点击下面列表添加、移除产品
      selectedProduct(product) {
        if (typeof product.checked === 'undefined') {
          this.$set(product, 'checked', true)
        } else {
          product.checked = !product.checked
        }
      },
      // 添加主险(附加险)确认
      confirm() {
        let option = Object.assign({}, this.detailToAdd, {
          prodlist: []
        })
        this.productList.forEach((prod) => {
          prod.sprodlist.forEach((item) => {
            if (typeof item.checked !== 'undefined') {
              let obj = {}
              obj.prodkey = item.prodkey
              obj.pageid = item.pageid || ''
              obj.parentprodkey = item.parentprodkey || ''
              if (item.checked === true) {
                obj.option = 'A'
              } else {
                obj.option = 'D'
              }
              option.prodlist.push(obj)
            }
          })
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
              sessionStorage.setItem('additionalToDetail', JSON.stringify(res.prodlist))
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
    }
  }
</script>

<style>
  @import "../css/add-additional.css";
</style>