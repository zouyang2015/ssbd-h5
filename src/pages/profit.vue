<template>
  <f7-page class="profit">
    <f7-navbar>
      <f7-nav-left back-link=" " sliding></f7-nav-left>
      <f7-nav-center sliding>保险利益</f7-nav-center>
    </f7-navbar>

    <f7-block>
      <f7-accordion>
        <!-- Item 1 -->
        <f7-accordion-item class="item-content" v-for="(item,index) in benefitAry" v-if="benefitAry.length"
                           :key="index">
          <f7-accordion-toggle><span class="name">{{item.name}}</span><span class="detail">{{item.detail}}</span>
          </f7-accordion-toggle>
          <f7-accordion-content>
            <div v-html="normalizeHtml(item.value)"></div>
          </f7-accordion-content>
        </f7-accordion-item>
      </f7-accordion>
    </f7-block>

  </f7-page>
</template>

<script>
  import {benefit} from 'api/api'

  export default {
    data() {
      return {
        prodkey: '',

        benefitAry: []
      }
    },
    created() {
      this.$f7.showIndicator()
      this.prodkey = this.$route.params.prodkey
      this.pageid = this.$route.params.pageid

      // 获取保险利益列表
      this.benefit()
    },
    methods: {
      // 获取保险利益列表
      benefit() {
        let option = {
          prodkey: this.prodkey,
          pageid: this.pageid
        }
        benefit(option).then((res) => {
          if(res.status === '0') {
            this.benefitAry = res.prodadv
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
      // 处理成html
      normalizeHtml(text) {
        return text.replace(/\n/g, '<br>')
      }
    }
  }
</script>

<style>
  .profit .content-block {
    margin: 0 0 10px 0;
    padding: 0;
    color: #6d6d72;
    box-sizing: border-box;
    height: 700px;
  }

  .profit .accordion-list {
    background: #ffffff;
  }

  .profit .accordion-item {
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
  }

  .profit .accordion-item-toggle {
    box-sizing: border-box;
    min-height: 44px;
    display: flex;
    align-items: center;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%2060%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'm60%2061.5-38.25%2038.25-9.75-9.75%2029.25-28.5-29.25-28.5%209.75-9.75z'%20fill%3D'%23c7c7cc'%2F%3E%3C%2Fsvg%3E");
    background-size: 10px 20px;
    background-repeat: no-repeat;
    background-position: 95% center;
    background-position: calc(100% - 15px) center;
    padding: 0 35px 0 15px;
    justify-content: space-between;
    width: 100%;
  }

  .profit .accordion-item.accordion-item-expanded .accordion-item-toggle {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%2060%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'm60%2061.5-38.25%2038.25-9.75-9.75%2029.25-28.5-29.25-28.5%209.75-9.75z'%20transform%3D'translate(115%2C%2030)%20rotate(90)'%20fill%3D'%23c7c7cc'%2F%3E%3C%2Fsvg%3E");
    background-size: 20px 20px;
  }

  .profit .accordion-item-toggle span {
    flex: 1;
  }

  .profit .accordion-item-toggle span:nth-child(2) {
    text-align: right;
    color: #999999;
  }

  .profit .accordion-item-content {
    position: relative;
    overflow: hidden;
    height: 0;
    font-size: 14px;
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    background: #f0f0f0;
  }

  .profit .accordion-item-content div {
    padding: 10px 15px 10px 15px;
  }
</style>