<template>
  <f7-page class="rule">
    <f7-navbar title="投保规则" back-link=" " sliding></f7-navbar>

    <f7-block>
      <!-- Switch Between Tabs -->
      <f7-navbar sliding>
        <f7-subnavbar sliding>
          <f7-buttons class="rule-tab">
            <f7-button tab-link="#tab-1" active><span>本产品投保规则</span></f7-button>
            <f7-button tab-link="#tab-2"><span>公司一般投保规则</span></f7-button>
          </f7-buttons>
        </f7-subnavbar>
      </f7-navbar>

      <!--<f7-link tab-link="#tab-1" class="tab-item">Show Tab 1</f7-link>-->
      <!--<f7-link tab-link="#tab-2" class="tab-item">Show Tab 2</f7-link>-->
      <!-- Tabs -->
      <f7-tabs class="tab-content-wrapper">
        <f7-tab id="tab-1" active v-html="normalizeHtml(prodrule)"></f7-tab>
        <f7-tab id="tab-2" v-html="normalizeHtml(comprule)"></f7-tab>
      </f7-tabs>
    </f7-block>

  </f7-page>

</template>

<script>
  import {getRule} from 'api/api'

  export default {
    data() {
      return {
        prodkey: '',
        pageid: '',

        prodrule: '',
        comprule: ''
      }
    },
    created() {
      this.$f7.showIndicator()
      this.prodkey = this.$route.params.prodkey
      this.pageid = this.$route.params.pageid

      this.getRule()
    },
    methods: {
      getRule() {
        let option = {
          prodkey: this.prodkey
        }
        getRule(option).then((res) => {
          if(res.status === '0') {
            this.prodrule = res.prodrule
            this.comprule = res.comprule
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
  .rule.page {
    background: #ffffff;
  }

  .rule .tab-wrapper {
    display: flex;
    font-size: 12px;
  }

  .rule .buttons-row.rule-tab .button {
    border: none;
    color: #999999;
    font-size: 14px;
    overflow: visible;
  }

  .rule .buttons-row.rule-tab .button:nth-child(2) {
    border-left: 1px solid #d0d0d0;
  }

  .rule .buttons-row.rule-tab .button.active {
    color: #5b52b5;
    background: none;
  }

  .rule .buttons-row.rule-tab .button.active span {
    position: relative;
  }

  .rule .buttons-row.rule-tab .button.active span:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -14px;
    right: auto;
    top: auto;
    height: 1px;
    width: 100%;
    background-color: #5b52b5;
    display: block;
  }

  .rule .buttons-row.rule-tab .button.active-state {
    background: no-repeat;
  }

  .rule .tab-content-wrapper {
    margin-top: 44px;
    font-size: 14px;
    padding: 15px 0;
  }

  .navbar-through .page .subnavbar {
    top: 42px;
  }

</style>
