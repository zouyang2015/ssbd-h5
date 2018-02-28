<template>
  <f7-page v-on:page:reinit="reinit">
    <f7-navbar class="background">
      <f7-nav-left back-link=" " sliding v-if="isBack"></f7-nav-left>
      <f7-nav-center sliding>产品详情</f7-nav-center>
    </f7-navbar>

    <f7-block inner tabs class="detail-navi">
      <f7-buttons class="page-list">
        <f7-button class="page-list-item" @click="profit('保险利益')"><span>保险利益</span></f7-button>
        <f7-button class="page-list-item" @click="clause('条款全文')"><span>条款全文</span></f7-button>
        <f7-button class="page-list-item" @click="rule('投保规则')"><span>投保规则</span></f7-button>
      </f7-buttons>
    </f7-block>

    <div class="form-warpper">
      <h2 class="h2-title">被保人信息</h2>
      <f7-list>
        <!-- 性别 -->
        <f7-list-item class="sex">
          <h3 class="h3-title">性别</h3>
          <template v-if="sexAry && sexAry.length" v-for="(item, index) in sexAry">
            <template v-if="sumAry && sumAry.length" v-for="(detail, ind) in sumAry[0].param">
              <template v-if="detail.paramcode === 's'">
                <input v-model="detail.paramvalue" :value="item" :id="item" type="radio" class="sex-button" :class="{'icon-check_circle': item === detail.paramvalue}"><label
                  :for="item">{{item === '1' ? '男' : '女'}}</label>
              </template>
            </template>
          </template>
        </f7-list-item>

        <!-- 年龄 -->
        <f7-list-item class="age">
          <h3 class="h3-title">年龄</h3>
          <template v-for="detail in sumAry[0] && sumAry[0].param">
            <template v-if="detail.paramcode === 'a'">
              <input type="number" class="text" v-model="detail.paramvalue" :placeholder="detail.paramrange">
              <div class="input-overlay" @click="inputDialog(detail)"></div>
              <div class="icon_calendar"><span>生日</span></div>
              <div class="date">
                <input type="date" v-model="birthday" value="" class="birthday"
                       @change="changeBirthday(detail)" @blur="blurBirthday(detail)">
              </div>
            </template>
          </template>
        </f7-list-item>
      </f7-list>
    </div>

    <div class="form-warpper">
      <template v-if="sumAry && sumAry.length" v-for="(item, index) in sumAry">
        <h4 class="h4-title">
          <span :class="{'main-risk': item.classtype === 'M' || item.classtype === 'A'}">{{item.prodname}}<span class="is-show" v-if="item.istingshou === 'Y'">停售</span></span>
          <i class="ico-close" v-if="typeof item.ishot === 'undefined'" @click="removeProduct(item, index)"></i>
        </h4>

        <f7-swiper class="scroll" :params="{speed:500, slidesPerView: 'auto', spaceBetween: 10}">
          <f7-swiper-slide v-for="(scroll, ind) in scrollData(item.tagstr)" :key="ind">{{scroll}}</f7-swiper-slide>
        </f7-swiper>

        <f7-list>
          <template v-for="(detail, ind) in item.param">
            <f7-list-item class="other"
                          v-if="detail.paramcode !== 's' && detail.paramcode !== 'a' && !detail.hide">
              <div class="inner">
                <h3 class="h3-title">{{detail.paramname}}</h3>
                <!-- select -->
                <template v-if="detail.paramtype === '1'">
                  <template v-if="stringToAry(detail.paramrange).length > 1">
                    <select class="select pl15" v-model="detail.paramvalue" @change="feeCalculation(item, detail,'select')">
                      <option :value="val" v-for="val in stringToAry(detail.paramrange)">
                        {{val}}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <span class="pl15">{{detail.paramvalue}}</span>
                  </template>
                </template>
                <!-- input -->
                <template v-if="detail.paramtype === '0'">
                  <input type="number" class="text pl15" v-model="detail.paramvalue" value="" :placeholder="detail.paramrange">
                  <div class="input-overlay" @click="inputDialog(detail, item)"></div>
                </template>
              </div>

              <template>
                <div class="parammsgs" v-if="detail.parammsg">{{detail.parammsg}}</div>
              </template>
            </f7-list-item>
          </template>

          <f7-list-item class="fee-sum">
            <ul>
              <li>首期保费¥ <span v-if="item.fee !=='0.00'">{{item.fee}}</span><span v-else>--</span></li>
              <li v-if="feeSum(item.param)">
                产品保额¥ <span v-if="Number(item.cover)">{{item.cover}}</span><span v-else>--</span></li>
            </ul>
          </f7-list-item>

          <f7-list-item v-if="item.ffmsg" class="ffmsg">
            <span>{{item.ffmsg}}</span>
          </f7-list-item>
        </f7-list>

      </template>

      <f7-buttons class="add-risk">
        <f7-button class="main" @click="addMain"><span>添加主险</span></f7-button>
        <f7-button class="additional" href="/add-additional/" @click="addAdditional"><span>添加附加险</span></f7-button>
      </f7-buttons>

    </div>

    <f7-toolbar bottom class="bottom-fee-sum">
      <div class="bottom-box">
        <div class="sum">
          <p>首期保费</p>
          <p>¥ <span v-if="total !=='0.00'">{{total}}</span><span v-else>--</span></p>
        </div>
        <f7-button v-if="productDetailAry.proddetailurl" :href="`${productDetailAry.proddetailurl}&target=_blank_close`" class="pagelink">
          产品特色
        </f7-button>
        <f7-button :href="planurl" class="prospectus" @click="plan()">制作计划书</f7-button>
      </div>
    </f7-toolbar>

  </f7-page>
</template>

<script>
  import {getProductDetail, feeCalculation, getPlan, USERID} from 'api/api'
  import {toast, jsGetAge, isIos} from 'common/js/common'

  export default {
    data() {
      return {
        prodkey: '',
        mainToDetail: [],
        additionalToDetail: [],
        detailToAdd: [],
        // 产品详情数据
        productDetailAry: [],
        // 产品详情中主险和附加险的数据
        productList: [],
        // 主险
        mainRisk: [],
        // 附加险
        additionalRisk: [],

        birthday: '',

        // 表单中绑定的数据
        formData: {
          sex: '',  // 姓别
          age: '' // 年龄
        },
        // 暂存formData数据-用于不想麻烦赋值，以后再处理等,如日期选择器，选择时不赋值只有点击完成时才进行赋值操作
        temporaryStorage: {
          saveAge: ''
        },
        // 姓别对象-特殊处理
        sex: {
          paramcode: "s",
          paramname: "性别",
          paramrange: "1,2",
          paramtype: "1",
          paramvalue: "1"
        },
        age: {
//          paramcode: "a",
//          paramname: "被保险人年龄",
//          paramrange: "0-65",
//          paramtype: "0",
//          paramvalue: "0"
        },
        sexAry: [],

        sumAry: [],
        feeAry: [],
        // 是否点击过性别和年龄
        inputCommon: false,

        planurl: '#',
        planid: '',

        isBack: true
      }
    },
    created() {
      let navbar = document.getElementsByClassName('navbar')[0]
      navbar.style.background = '#ffffff'

      this.$f7.mainView.router.refreshPreviousPage()
      this.$f7.showIndicator()
      this.prodkey = JSON.parse(sessionStorage.getItem('prodkey')) || ''
      this.mainToDetail = JSON.parse(sessionStorage.getItem('mainToDetail')) || []
      this.additionalToDetail = JSON.parse(sessionStorage.getItem('additionalToDetail')) || []
      this.saveList = JSON.parse(sessionStorage.getItem('saveList')) || []


      // 获取产品详情
      this.getProductDetail(this.prodkey)

      this.isBack = this.queryString('prodkey') ? false : true
    },
    computed: {
      total() {
        return this.sumAry.reduce((sum, value) => {
          return sum + parseFloat(value.fee)
        }, 0).toFixed(2)
      },
      sexVal() {
        let sex = ''
        this.sumAry.forEach((item, index) => {
          if (index === 0) {
            item.param.forEach((detail) => {
              if (detail.paramcode === 's') {
                sex = detail.paramvalue
              }
            })
          }
        })
        return sex
      },
      ageVal() {
        let age = ''
        this.sumAry.forEach((item, index) => {
          if (index === 0) {
            item.param.forEach((detail) => {
              if (detail.paramcode === 'a') {
                age = detail.paramvalue
              }
            })
          }
        })
        return age
      },
      pageid() {
        return this.mainRisk[0].pageid
      }
    },
    methods: {
      queryString(item) {
        var sValue = window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue;
      },
      reinit() {
        this.prodkey = JSON.parse(sessionStorage.getItem('prodkey')) || ''
        this.mainToDetail = JSON.parse(sessionStorage.getItem('mainToDetail')) || []
        this.additionalToDetail = JSON.parse(sessionStorage.getItem('additionalToDetail')) || []
        this.detailToAdd = JSON.parse(sessionStorage.getItem('detailToAdd')) || {}

        // 对三套数据合并
        this.concatAry()
        // 获取产品详情
      },
      // 对三套数据合并
      concatAry() {
        // 排列顺序：0详情主、1详情附、（2详情附1、3详情附2、4主1、5主1附1，6主1附2、7主2、8主2附1，9主2附2）用括号包起来的，都为选中可发生的
        // 排在前面的先是详情主险和附加险 0,1
        this.sumAry = [...this.mainRisk, ...this.additionalRisk]

        // 1，主险排序
        let mainToDetail = this.mainToDetail.slice()
        mainToDetail.sort((a, b) => {
          return a.prodkey.localeCompare(b.prodkey)
        })
        // 2.将险加险以父险为基础顺序排
        let additionalToDetail = this.additionalToDetail.slice()
        additionalToDetail.sort((a, b) => {
          return a.parentprodkey.localeCompare(b.parentprodkey)
        })
        // 3.将附加险与详情有关的去掉，加入进详情险种内 2
        additionalToDetail.forEach((item) => {
          if (item.parentprodkey === this.prodkey) {
            this.sumAry.push(item)
          }
        })
        additionalToDetail = additionalToDetail.filter((item) => {
          return item.parentprodkey !== this.prodkey
        })
        // 4.附加险倒序-为插入主险做准备
        additionalToDetail.reverse()
        // 5.将附加险插入到主险数组中-用附加险里的parentprodkey去查找主险里与之相等的prodkey，找到下标，插入当前主险后（因为是倒顺排列的所以插入后是正序）
        additionalToDetail.forEach((item) => {
          let val = item.parentprodkey
          let index = mainToDetail.findIndex((item) => {
            return item.prodkey === val
          })
          mainToDetail.splice(index + 1, 0, item)
        })
        this.sumAry = [...this.sumAry, ...mainToDetail]
      },
      // 获取产品详情
      getProductDetail(prodkey) {
        getProductDetail(prodkey).then((res) => {
          if (res.status === '0') {
            // 产品详情数据
            this.productDetailAry = res
            // 产品详情中主险和附加险的数据
            this.productList = res.prodlist
            // 去掉主险中年龄的数值
            // 增加cover保额、fee保费
            this.productList.forEach((item) => {
              if (item.classtype === 'M' || item.classtype === 'A') {
                item.param.forEach((detail) => {
                  if (detail.paramcode === 'a') {
                    detail.paramvalue = ''
                  }
                })
              }
              this.$set(item, 'cover', '0.00')
              this.$set(item, 'fee', '0.00')
            })
            this.sumAry = this.productList
            window.sessionStorage.setItem('productDetail', JSON.stringify(res))
            this.normalizeDetailAry()
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
      // 对获取的产品详情进行处理-分别处理主险、附加险
      normalizeDetailAry() {
        this.mainRisk = []
        this.additionalRisk = []
        this.productList.forEach((item) => {
          if (item.classtype === 'M' || item.classtype === 'A') {
            this.mainRisk.push(item)
          } else {
            this.additionalRisk.push(item)
          }

          if (this.mainRisk && this.mainRisk.length) {
            // 特别处理性别
            this.mainRisk[0].param.forEach((item) => {
              if (item.paramcode === 's') {
                this.sex = item
                this.sexAry = item.paramrange.split(',')
                this.formData.sex = item.paramvalue
              }
            })
            // 特别处理年龄
            this.mainRisk[0].param.forEach((item) => {
              if (item.paramcode === 'a') {
                this.age = item
                this.formData.age = item.paramvalue === '0' ? '' : item.paramvalue
              }
            })
          }
        })
      },
      // 点击后为弹出试输入框
      inputDialog(message, item) {
        this.$f7.modal({
          text: `<div id="input-title" class="input-title">${message.paramname}</div>`,
          afterText: `<div id="input-info"><input type="tel" name="tel" value="" id="input-content" placeholder="${message.paramrange}" autofocus></div>`,
          buttons: [
            {
              text: '取消',
              onClick: () => {
                return
              }
            },
            {
              text: '确定',
              close: false,
              onClick: () => {
                var rangeAry = message.paramrange.split('-')
                let dom = document.getElementById('input-content')
                let val = dom.value
                if (message.paramrange !== '') {
                  if (message.paramrange !== '' && val >= (rangeAry[0] | 0) && val <= (rangeAry[1] | 0)) {
                    this.$f7.closeModal('.modal')
                    message.paramvalue = dom.value
                    if (typeof item !== 'undefined') {
                      this.feeCalculation(item, message, 'input')
                      this.inputCommon = true
                    }
                  } else {
                    toast(`请输入${message.paramrange}之间的数字`)
                  }
                } else {
                  this.$f7.closeModal('.modal')
                  message.paramvalue = dom.value
                  if (typeof item !== 'undefined') {
                    this.feeCalculation(item, message, 'input')
                    this.inputCommon = true
                  }
                }
              }
            }
          ]
        })
      },
      // 日期转周岁
      changeBirthday(detail) {
        this.temporaryStorage.saveAge = jsGetAge(this.birthday)
        if (this.temporaryStorage.saveAge < 0) {
          this.$f7.alert('选择日期不可以大于当前日期', null)
          this.temporaryStorage.saveAge = 0
        }
        if (!isIos()) {
          detail.paramvalue = this.temporaryStorage.saveAge
          this.inputCommon = true
        }
      },
      // 日期转周岁-点击完成后赋值
      blurBirthday(detail) {
        if (isIos()) {
          detail.paramvalue = this.temporaryStorage.saveAge
          this.inputCommon = true
        }
      },
      // 添加主险
      addMain() {
        let option = {
          userid: USERID,
          age: this.ageVal,
          sex: this.sexVal,
          allprodlist: []
        }
        this.sumAry.forEach((item) => {
          let obj = {}
          obj.prodkey = item.prodkey
          obj.pageid = item.pageid
          obj.parentprodkey = item.parentprodkey
          option.allprodlist.push(obj)
        })
        this.$f7.mainView.router.load({url: '/add-main/'})
        sessionStorage.setItem('detailToAdd', JSON.stringify(option))
      },
      // 添加附加险
      addAdditional() {
        let option = {
          userid: USERID,
          age: this.ageVal,
          sex: this.sexVal,
          allprodlist: []
        }
        this.sumAry.forEach((item) => {
          let obj = {}
          obj.prodkey = item.prodkey
          obj.pageid = item.pageid
          obj.parentprodkey = item.parentprodkey
          option.allprodlist.push(obj)
        })
        this.$f7.mainView.router.load({url: '/add-additional/'})
        sessionStorage.setItem('detailToAdd', JSON.stringify(option))
      },
      // 滚动关键字
      scrollData(tagstr) {
        return tagstr.split('^') || ''
      },
      // 字符串转数组
      stringToAry(string) {
        return string.split(',')
      },
      // 判断是保额-保费-返回true、保费或份数-保费保额-返回false
      feeSum(params) {
        return params.some((item) => {
          return item.paramcode === 'qp' || item.paramcode === 'qp1'
        })
      },
      // 算费-特殊（性别、年龄）
      feeCalculationSp(type, val) {
        this.$f7.showIndicator()
        let sumAry = this.sumAry.slice()
        let option = {
          userid: USERID,
          changelist: []
        }
        sumAry.forEach((item) => {
          let obj = {}
          obj.prodkey = item.prodkey
          obj.pageid = item.pageid
          obj.parentprodkey = item.parentprodkey
          if (type === 'age') {
            obj.paramcode = 'a'
          } else if (type === 'sex') {
            obj.paramcode = 's'
          }
          obj.paramvalue = val
          option.changelist.push(obj)
        })
        feeCalculation(option).then((res) => {
          if (res.status === '0') {
            this.feeAry = res.changelist
            // 处理与sumAry的合并
            this.concatSumAry()
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
      // 算费
      feeCalculation(item, detail, type) {
        this.$f7.showIndicator()
        // 不管当前change的是主险还是附加险，都要把与当前change有关的所有主附险一起提交
        // 拆成input和select去处理
        let option = {
          userid: USERID,
          changelist: []
        }
        if (type === 'input') {
          option.changelist.push({
            prodkey: item.prodkey,
            pageid: item.pageid,
            parentprodkey: item.parentprodkey,
            paramcode: detail.paramcode,
            paramvalue: detail.paramvalue
          })
        } else {
          // 筛选出所有需要的主附险
          let ary = []
          if (detail.paramcode === 'fs' || detail.paramcode === 'fp') {
            // 选缴费方式、缴费期间需要主附险连动
            ary = this.sumAry.filter((list) => {
              return (item.classtype === 'M' || item.classtype === 'A') ? list.prodkey === item.prodkey || list.parentprodkey === item.prodkey : list.prodkey === item.parentprodkey || list.parentprodkey === item.parentprodkey
            })
          } else {
            // 只有自己计算
            ary.push(item)
          }
          ary.forEach((aryItem) => {
            let obj = {
              prodkey: aryItem.prodkey,
              pageid: aryItem.pageid,
              parentprodkey: aryItem.parentprodkey,
              paramcode: detail.paramcode,
              paramvalue: detail.paramvalue
            }
            option.changelist.push(obj)
          })
        }
        feeCalculation(option).then((res) => {
          if (res.status === '0') {
            this.feeAry = res.changelist
            // 处理与sumAry的合并
            this.concatSumAry()
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
      // 处理与sumAry的合并
      concatSumAry() {
        this.sumAry.forEach((sumItem) => {
          this.feeAry.forEach((feeItem) => {
            if (sumItem.prodkey === feeItem.prodkey) {
              sumItem.cover = feeItem.cover || ''
              sumItem.fee = feeItem.fee || ''

              let flg = false
              sumItem.param.forEach((sumDetail) => {
                feeItem.params.forEach((feeDetail) => {
                  if (sumDetail.paramcode === feeDetail.paramcode) {
                    sumDetail.paramvalue = feeDetail.paramvalue
                    if (feeDetail.paramvalue === '趸交') {
                      flg = true
                    }
                  }
                })
              })

              // 处理趸交后缴费期间不显示的问题
              if (flg) {
                sumItem.param.forEach((hideItem) => {
                  if (hideItem.paramcode === 'fp') {
                    this.$set(hideItem, 'hide', true)
                  }
                })
              } else {
                sumItem.param.forEach((hideItem) => {
                  if (hideItem.paramcode === 'fp') {
                    this.$set(hideItem, 'hide', false)
                  }
                })
              }


            }
          })
        })
      },
      // 保险利益
      profit(title) {
        if (this.sumAry.length > 1) {
          this.$f7.mainView.router.load({url: `/multiple/profit/${title}/`})
        } else {
          this.$f7.mainView.router.load({url: `/profit/${this.sumAry[0].prodkey}/${this.sumAry[0].pageid}/`})
        }
        window.sessionStorage.setItem('sumAry', JSON.stringify(this.sumAry))
      },
      // 条款全文
      clause(title) {
        if (this.sumAry.length > 1) {
          this.$f7.mainView.router.load({url: `/multiple/clause/${title}/`})
        } else {
          this.$f7.mainView.router.load({url: `/clause/${this.sumAry[0].prodkey}/${this.sumAry[0].pageid}/`})
        }
        window.sessionStorage.setItem('sumAry', JSON.stringify(this.sumAry))
      },
      // 投保规则
      rule(title) {
        if (this.sumAry.length > 1) {
          this.$f7.mainView.router.load({url: `/multiple/rule/${title}/`})
        } else {
          this.$f7.mainView.router.load({url: `/rule/${this.sumAry[0].prodkey}/${this.sumAry[0].pageid}/`})
        }
        window.sessionStorage.setItem('sumAry', JSON.stringify(this.sumAry))
      },
      // 删除产品
      removeProduct(prod, index) {
        this.sumAry.splice(index, 1)
        if (prod.classtype === 'M' || prod.classtype === 'A') {
          this.mainToDetail = this.mainToDetail.filter((item) => {
            return item.prodkey !== prod.prodkey
          })
          window.sessionStorage.setItem('mainToDetail', JSON.stringify(this.mainToDetail))
          this.saveList = this.saveList.filter((item) => {
            return item.prodkey !== prod.prodkey
          })
          window.sessionStorage.setItem('saveList', JSON.stringify(this.saveList))
        } else {
          this.additionalToDetail = this.mainToDetail.filter((item) => {
            return item.prodkey !== prod.prodkey
          })
          window.sessionStorage.setItem('additionalToDetail', JSON.stringify(this.additionalToDetail))
        }
        window.sessionStorage.setItem('sumAry', JSON.stringify(this.sumAry))
      },
      // 制作计划
      plan() {
        if(this.total >= 0 && this.total !== '0.00'){
          this.$f7.showIndicator()
          let option = {
            userid: USERID,
            sex: this.sexVal,
            age: this.ageVal,
            custname: '',
            prodkey: this.prodkey,
            prodlist: []
          }
          this.sumAry.forEach((item) => {
            let curObj = {
              prodkey: item.prodkey || '',
              prodname: item.prodname || '',
              classtype: item.classtype || '',
              compkey: item.compkey || '',
              prodtags: item.prodtags || '',
              pageid: item.pageid || '',
              isrequired: item.isrequired || '',
              picurl: item.picurl || '',
              ishot: item.ishot || '',
              isnew: item.isnew || '',
              parentprodkey: item.parentprodkey || '',
              istingshou: item.istingshou || '',
              proddetailurl: item.proddetailurl || '',
              tagstr: item.tagstr || '',
              ffmsg: item.ffmsg || '',
              fee: item.fee || '',
              cover: item.cover || '',
              params: [],
              param: []
            }
            if (typeof item.params !== 'undefined') {
              item.params.forEach((detail) => {
                if(!detail.hide) {
                  let obj = {
                    paramcode: detail.paramcode || '',
                    paramvalue: detail.paramvalue || '',
                    paramname: detail.paramname || '',
                    paramrange: detail.paramrange || '',
                    paramtype: detail.paramtype || '',
                    parammsg: detail.parammsg || '',
                  }
                  curObj.params.push(obj)
                }
              })
            }
            if (typeof item.param !== 'undefined') {
              item.param.forEach((detail) => {
                if(!detail.hide) {
                  let obj = {
                    paramcode: detail.paramcode || '',
                    paramvalue: detail.paramvalue || '',
                    paramname: detail.paramname || '',
                    paramrange: detail.paramrange || '',
                    paramtype: detail.paramtype || '',
                    parammsg: detail.parammsg || '',
                  }
                  curObj.param.push(obj)
                }
              })
            }
            option.prodlist.push(curObj)
          })
          getPlan(option).then((res) => {
            if (res.status === '0') {
              this.planid = res.planid
              this.planurl = `https://app.ibaodian.com${res.planurl}&target=_blank_close`
              window.location.href = this.planurl
            } else {
              if (typeof res.msg === 'undefined' || res.msg === 'null' || res.msg === '') {
                this.$f7.alert('出错了', null)
              } else {
                this.$f7.alert(res.msg, null)
              }
            }
            this.$f7.hideIndicator()
          })
        } else {
          this.$f7.alert('保费不能为0', null)
        }
      }
    },
    watch: {
      sexVal(newVal, oldVal) {
        if (oldVal !== '') {
          this.feeCalculationSp('sex', newVal)
        }
      },
      ageVal(newVal, oldVal) {
        // age已经强制为空了，所以可以不用判断
        this.feeCalculationSp('age', newVal)
      }
    }
  }

</script>

<style>
  @import "../css/product-detail.css";
</style>