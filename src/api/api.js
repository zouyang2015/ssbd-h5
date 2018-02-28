import qs from 'qs'
import axios from 'axios'

export function queryString(item) {
  var sValue = window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
  return sValue ? sValue[1] : sValue;
}

const URL = 'https://app.ibaodian.com/webh5.shtml'
const SECRET = queryString('secret') || 'dMFEhjxnsmJJEhYz4wgi0Q=='
export const USERID = queryString('userid') || 'US160831000000000179'

// 基础数据(公司名称key)
export function getBaseInfo() {
  const url = URL

  const data = {
    optioncode: 'sys-03',
    option: JSON.stringify({"lastupdatetime": ""}),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 搜索、点击产品分类中标签搜索 sch-01
export function getSearch(option) {
  const url = URL

  const data = {
    optioncode: 'sch-01',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 获取产品详情
export function getProductDetail(prodkey = '') {
  const url = URL

  const data = {
    optioncode: 'prds-01new',
    option: JSON.stringify({"prodkey": prodkey, "userid": USERID}),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 获取主页推荐产品、添加主险
export function getMainRisk(pk_comp = '') {
  const url = URL

  const data = {
    optioncode: 'HP-02',
    option: JSON.stringify({"pk_comp": pk_comp}),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 获取添加附加险
export function getAdditionalRisk(option) {
  const url = URL

  const data = {
    optioncode: 'prds-01-4new',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 添加主险(附加险)确认
export function addRisk(option) {
  const url = URL

  const data = {
    optioncode: 'PRDS-01-2new',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 算费参数变化prds-06new
export function feeCalculation(option) {
  const url = URL

  const data = {
    optioncode: 'prds-06new',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 保险利益PRDS-02
export function benefit(option) {
  const url = URL

  const data = {
    optioncode: 'PRDS-02',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 条款全文PRD-03
export function download(option) {
  const url = URL

  const data = {
    optioncode: 'PRD-03',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 10.投保规则PRD-04
export function getRule(option) {
  const url = URL

  const data = {
    optioncode: 'PRD-04',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}


// 产品搜索，产品分类点击
// 产品分类点击：{"classtype":"M","prodtypes":[{"prodtype":"T11"}]}
// 搜索：{"classtype":"M","keyword":"重疾"}
export function getProductListByWord(json) {
  const url = URL

  const data = {
    optioncode: 'sch-01',
    option: JSON.stringify(json),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}
//根据关键词搜索
export function getProductListBySearch(json) {
  const url = URL
  const data = {
    optioncode: 'livenew-09',
    option: JSON.stringify(json),
    platform: 'web',
    secret: 'FxOFz9tPtjFMuOweERxpHw=='
  }
  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}
// 搜索推荐和热词语
export function getSearchHot() {
  const url = URL
  const data = {
    optioncode: 'livenew-49',
    option: JSON.stringify({}),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

// 计划书 plns-01
export function getPlan(option) {
  const url = URL

  const data = {
    optioncode: 'plns-01',
    option: JSON.stringify(option),
    platform: 'web',
    secret: SECRET
  }

  return axios.post(url, qs.stringify(data))
    .then((res) => {
      return Promise.resolve(res.data)
    })
}