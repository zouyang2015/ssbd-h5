// Import Vue
import Vue from 'vue'

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

import VueLazyLoad from 'vue-lazyload'

// Import F7 iOS Theme Styles
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme:
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
*/

// Import App Custom Styles
import AppStyles from './css/app.css'

// Import Routes
import Routes from './routes.js'

// Import App Component
import App from './app'

import 'common/css/index.css'

// Init F7 Vue Plugin
Vue.use(Framework7Vue)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.jpg')
})

import {queryString} from 'api/api'
function chooseCss () {
  let secret = queryString('secret') || ''
  if(secret === 'Fwf2I3dGiOQKMCAwaF4khA==') {
    require(`common/css/color.css`)
  }
}
chooseCss()


// Init App
new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    // material: true,
    routes: Routes,
    modalButtonOk: '确定',
  },
  // Register App Component
  components: {
    app: App
  }
});
