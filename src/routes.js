export default [
  {
    path: '/top-page/',  // 首页
    component: require('./pages/top-page.vue')
  },
  {
    path: '/product-detail/',  // 产品详情
    component: require('./pages/product-detail.vue')
  },
  {
    path: '/multiple/:type/:title/',  //当保险利益、条款全文、投保规则是多条时
    component: require('./pages/multiple.vue')
  },
  {
    path: '/profit/:prodkey/:pageid/',  // 保险利益
    component: require('./pages/profit.vue')
  },
  {
    path: '/clause/:prodkey/:pageid/',  // 条款全文
    component: require('./pages/clause.vue')
  },
  {
    path: '/rule/:prodkey/:pageid/',  // 投保规则
    component: require('./pages/rule.vue')
  },
  {
    path: '/add-main/', //添加主险
    component: require('./pages/add-main.vue')
  },
  {
    path: '/add-additional/', //添加附加险
    component: require('./pages/add-additional.vue')
  },
  {
    path: '/product-search/',//产品搜索
    component: require('./pages/product-search.vue')
  },
  {
    path: '/product-search-list/',//产品搜索
    component: require('./pages/product-search-list.vue')
  },
  {
    path: '/product-company-list/',//公司产品列表
    component: require('./pages/product-company-list.vue')
  }
]