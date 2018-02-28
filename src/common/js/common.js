// toast('您点击了弹框按钮您点击了！',3000)
export function toast(msg, duration = 3000) {
  var m = document.createElement('div')
  m.style.cssText = 'position:fixed; top:85%; width:100%; z-index:999999;text-align:center; '
  document.body.appendChild(m)
  var n = document.createElement('div')
  n.innerHTML = msg
  n.style.cssText = 'background:#000000; color:#fff;opacity:0.8;border-radius:4px;text-align: center;display: inline-block;max-width: 70%;min-width:100px;margin: 0 auto;padding: 6px 20px;line-height: 20px; font-size: 16px;'
  m.appendChild(n)
  setTimeout(function () {
    var d = 0.5
    n.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
    n.style.opacity = '0'
    setTimeout(function () {
      document.body.removeChild(m)
    }, d * 1000)
  }, duration)
}

// 日期转周岁
export function jsGetAge(strBirthday, expectDate) {
  if (strBirthday === "" || !strBirthday) {
    return ""
  }
  var returnAge
  var strBirthdayArr = strBirthday.split('-')
  var birthYear = strBirthdayArr[0]
  var birthMonth = strBirthdayArr[1]
  var birthDay = strBirthdayArr[2]

  var d = (expectDate && expectDate !== "") ? new Date(expectDate) : new Date()
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

// 判断是不是ios
export function isIos() {
  var browser = {
    versions: function () {
      var u = navigator.userAgent
      var app = navigator.appVersion;
      return { //移动终端浏览器版本信息
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
      };
    }(),
  }
  if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
    return true
  }
  return false;
}





export function indexedlist() {
  window.f7.indexedlist = function (params) {
    var $ = window.Dom7;
    if (!params.init) return;
    function initIndexedList(page) {
      var eventsTarget = $(page.container).find('.list-index')
      if (eventsTarget.length === 0) return

      var pageContent = $(page.container).find('.page-content')
      buildLetters()
      var isTouched, isMoved
      var letterToScroll
      var elementHover
      var fixedNavbar = pageContent.parents('.navbar-fixed').length > 0 || pageContent.parents('.navbar-through').length > 0
      var searchBar = $(page.container).find('.searchbar').length > 0

      if (searchBar) {
        eventsTarget.css('margin-top', '42px')
      }

      function handleTouchStart(e) {
        e.preventDefault()
        isTouched = true;

        var target = $(e.target)
        if (!target.is('li')) target = target.parents('li')
        if (target.length > 0) {
          scrollToLetter(target.eq(0).data('index-letter'))
        }
      }

      function handleTouchMove(e) {
        if (!isTouched) return
        e.preventDefault()
        var target
        if (e.type === 'mousemove') {
          target = $(e.target)
        }
        else {
          target = $(document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY))
        }
        if (!target.is('li')) target = target.parents('li')

        if (target.length === 0) return;
        if (target.length > 0 && !target.is('.list-index li')) return

        scrollToLetter(target.eq(0).data('index-letter'))
      }

      function handleTouchEnd(e) {
        isTouched = isMoved = false
      }

      $(page.container).on('click', '.list-index li', function (e) {
        var target = $(e.target)
        if (!target.is('li')) target = target.parents('li')
        if (target.length > 0) {
          scrollToLetter(target.eq(0).data('index-letter'))
        }
      })

      function buildLetters() {
        var _letters = []
        var lettersHtml = ''
        pageContent.find('.list-group').each(function () {
          var _letterDiv = $(this).find('ul .list-group-title')
          var _letter = _letterDiv.html().trim().charAt(0).toUpperCase()
          _letterDiv.attr('data-index-letter', _letter)
          lettersHtml += '<li data-index-letter="' + _letter + '">' + _letter + '</li>'
          _letters.push(_letter)
        })
        eventsTarget.html(lettersHtml)
        return _letters
      }

      function scrollToLetter(letter) {
        var scrollToEl = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]').parent()
        if (!scrollToEl.length) return
        var scrollTop = scrollToEl.offset().top + pageContent.scrollTop() - (fixedNavbar ? 44 : 0) - (searchBar ? 44 : 0)-42
        pageContent.scrollTop(scrollTop)
      }

      eventsTarget.on("touchstart", handleTouchStart)
      eventsTarget.on("touchmove", handleTouchMove)
      eventsTarget.on("touchend", handleTouchEnd)
    }


    initIndexedList(params)
  }
}

