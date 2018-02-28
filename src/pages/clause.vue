<template>
  <f7-page>
    <f7-navbar title="条款全文" back-link=" " sliding></f7-navbar>
    <f7-block v-if="pdfurl" class="clause pdf">
      <f7-button :href="`${pdfurl}?target=_blank_close`" external>下载查看原版pdf</f7-button>
    </f7-block>


    <f7-block class="prodlaw" v-if="prodlaw.length">
      <f7-accordion>
        <!-- Item 1 -->
        <f7-accordion-item class="item-content" v-for="(item,index) in prodlaw" v-if="prodlaw.length"
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
  import {download} from 'api/api'

  export default {
    data() {
      return {
        prodkey: '',
        pdfurl: '',
        prodlaw: []
      }
    },
    created() {
      this.$f7.showIndicator()
      this.prodkey = this.$route.params.prodkey

      this.download()
    },
    methods: {
      download() {
        let option = {
          prodkey: this.prodkey
        }
        download(option).then((res) => {
          if(res.status === '0') {
            this.pdfurl = res.pdfurl
            this.prodlaw = res.prodlaw
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
  .clause.content-block {
    margin: 25px 0 15px 0;
  }

  .clause .button {
    border: 1px solid #e6e6e6;
    background: #ffffff;
    color: #333333;
    line-height: 40px;
    height: 40px;
  }



  .prodlaw.content-block {
    margin: 0 0 10px 0;
    padding: 0;
    color: #6d6d72;
    box-sizing: border-box;
    height: 700px;
  }

  .prodlaw .accordion-list {
    background: #ffffff;
  }

  .prodlaw .accordion-item {
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
  }

  .prodlaw .accordion-item-toggle {
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

  .prodlaw .accordion-item.accordion-item-expanded .accordion-item-toggle {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%2060%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'm60%2061.5-38.25%2038.25-9.75-9.75%2029.25-28.5-29.25-28.5%209.75-9.75z'%20transform%3D'translate(115%2C%2030)%20rotate(90)'%20fill%3D'%23c7c7cc'%2F%3E%3C%2Fsvg%3E");
    background-size: 20px 20px;
  }

  .prodlaw .accordion-item-toggle span {
    flex: 1;
  }

  .prodlaw .accordion-item-toggle span:nth-child(2) {
    text-align: right;
    color: #999999;
  }

  .prodlaw .accordion-item-content {
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

  .prodlaw .accordion-item-content div {
    padding: 10px 15px 10px 15px;
  }
</style>
