/**
 * Created by Voanit on 2017/3/10.
 */
// JAVASCRIPT组件
(function (window) {
  // 定义$$
  window.$$ = Dom7
  window.goPathOrder= '{base_path_order}'
  window.goPathHome = '{base_path}'
  window.mcPath = '{mc_path}'
  window.goPath = '{base_path_project}' + '/'
  window.imgPath = '{base_img_path}' + '/'
  window.requestPath = '{api_base_path}' + '/'
  window.mediaPath = '{base_media_path}' + '/'
  window.isClickflag=false
  //防止按钮多次点击调用方法
  //if(isClickflag) return false
  //isClickflag=true

  // ajax请求数据
  var apiConfig = {}
  apiConfig.dataRequest = function (method, url, params, successCallback, errorCallback, selfParam, async) {
    var req = {
      method: method.toUpperCase() || 'POST',
      url: url || '',
      params: params || {},
      async: !async
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      req.params = JSON.stringify(req.params)
    }
    $$.ajax({
      type: req.method,
      url: requestPath + req.url,
      data: req.params,
      async: req.async,
      dataType: 'text',
      contentType: 'application/json',
      cache: false,
      success: function (response, status, xhr) {
        window.isClickflag=false
        if (response) {
          response = JSON.parse(response)
        }
        typeof successCallback === 'function' ? successCallback(response, xhr) : null
      },
      error: function (xhr, error) {
        window.isClickflag=false
        typeof errorCallback === 'function' ? errorCallback(xhr, error) : null
      }
    })
  }

  window.apiConfig = apiConfig

  window.jsonToQueryString = function (json) {
    if (json === {}) {
      return ''
    } else {
      return '?' +
        Object.keys(json).map(function (key) {
          return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
        }).join('&')
    }
  }
// 截取浏览器地址栏参数
  window.GetQueryString = function (key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    var result = window.location.search.substr(1).match(reg)
    return result ? decodeURIComponent(result[2]) : null
  }

  // 日期格式化
  // 示例：
  // (new Date().Format("yyyy年MM月dd日"));
  // (new Date().Format("MM/dd/yyyy"));
  // (new Date().Format("yyyyMMdd"));
  // (new Date().Format("yyyy-MM-dd hh:mm:ss"));
  Date.prototype.Format = function (format) {
    var o = {
      'M+': this.getMonth() + 1, // month
      'd+': this.getDate(), // day
      'h+': this.getHours(), // hour
      'm+': this.getMinutes(), // minute
      's+': this.getSeconds(), // second
      'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
      'S': this.getMilliseconds() // millisecond
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }

  // toast('您点击了弹框按钮您点击了！',3000)
  window.toast = function (msg, duration) {
    duration = isNaN(duration) ? 3000 : duration
    var m = document.createElement('div')
    m.style.cssText = 'position:fixed; top:55%; width:100%; z-index:999999;text-align:center; '
    document.body.appendChild(m)
    var n = document.createElement('div')
    n.innerHTML = msg
    n.style.cssText = 'background:#435778; color:#fff;opacity:0.9;border-radius:4px;text-align: center;display: inline-block;max-width: 70%;min-width:100px;margin: 0 auto;padding: 6px 20px;line-height: 20px;'
    m.appendChild(n)
    setTimeout(function () {
      var d = 0.5
      n.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
      n.style.opacity = '0'
      setTimeout(function () { document.body.removeChild(m) }, d * 1000)
    }, duration)
  }
  //bankno为银行卡号 banknoInfo为显示提示信息的DIV或其他控件
  window.checkBankCard=function checkBankCard(bankno){
    if(bankno==""){
      return "请输入银行卡号";
    }
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
      if((j+1)%2==1){//奇数位
        if(parseInt(newArr[j])*2<9)
          arrJiShu.push(parseInt(newArr[j])*2);
        else
          arrJiShu2.push(parseInt(newArr[j])*2);
      }
      else //偶数位
        arrOuShu.push(newArr[j]);
    }
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
      jishu_child1.push(parseInt(arrJiShu2[h])%10);
      jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
      sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
    for(var n=0;n<arrOuShu.length;n++){
      sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
    for(var p=0;p<jishu_child1.length;p++){
      sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
      sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
    var luhm= 10-k;
    if(lastNum==luhm){
      //$("#banknoInfo").html("Luhm验证通过");
      return '';
    }
    else{
      return "请输入正确的银行卡号";
    }
  }
  // 日期转周岁
  window.jsGetAge = function (strBirthday,expectDate) {
    if(strBirthday===""||!strBirthday){
      return ""
    }
    var returnAge
    var strBirthdayArr = strBirthday.split('-')
    var birthYear = strBirthdayArr[0]
    var birthMonth = strBirthdayArr[1]
    var birthDay = strBirthdayArr[2]

    d = (expectDate&&expectDate!=="")?new Date(expectDate):new Date()
    var nowYear = d.getFullYear()
    var nowMonth = d.getMonth() + 1
    var nowDay = d.getDate()

    if (nowYear == birthYear) {
      returnAge = 0// 同年 则为0岁
    } else {
      var ageDiff = nowYear - birthYear // 年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          var dayDiff = nowDay - birthDay// 日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          var monthDiff = nowMonth - birthMonth// 月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        }
      } else {
        returnAge = -1// 返回-1 表示出生日期输入错误 晚于今天
        //myApp.alert('出生日期不能大于当前日期')
      }
    }
    return returnAge// 返回周岁年龄
  }
  //删除数组
  Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length)
    this.length = from < 0 ? this.length + from : from
    return this.push.apply(this, rest)
  }
})(window)

// 过滤路径是否有http
Vue.filter('srcFilter', function (value) {
  if (value.indexOf('http') === -1) {
    value = mediaPath + value
  } else if (value.indexOf('http:') > -1) {
    value = value.replace('http:', 'https:')
  }
  return value
})
