export const parseUA = () => {
  let u = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
  return {
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    Mobile: /(Mobile)/i.test(u),
    MobileAll: u.indexOf('Android') > -1 || u.indexOf('iPhone') > -1 || u.indexOf('SymbianOS') > -1 || u.indexOf('Windows Phone') > -1 || u.indexOf('iPad') > -1 || u.indexOf('iPod') > -1,
    wPhone: /(Windows Phone|windows[\s+]phone)/i.test(u),
    PC: u.indexOf('Win') > -1 || u.indexOf('Mac') > -1 || u.indexOf('Linux') > -1,
    weixin: u.indexOf('MicroMessenger') > -1,
    ykly: u.indexOf('ykly') > -1,
    yIos: u.indexOf('ykly_ios_app') > -1,
    yAndroid: u.indexOf('ykly_android_app') > -1
  }
}

export const loadScript = (url, callback) => {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = 'async'
  script.src = url
  document.body.appendChild(script)
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'complete' || script.readyState === 'loaded') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    script.onload = function () {
      callback()
    }
  }
}

export const urlAuthWechat = (appid, link) => {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(link)}&response_type=code&scope=snsapi_base#wechat_redirect`
}

export const authorize = () => {
  let secret = 'abcb4790d98c686e7656d28c756ebbaac5b89d3a'
  let id = '82c800a8b9db1cb2a145'
  return `https://github.com/login/oauth/authorize?redirect_uri=${window.location.href}&client_id=${id}&client_secret=${secret}`
  // return `https://github.com/login/oauth/authorize?scope=public_repo&redirect_uri=${window.location.href}/?error=redirect_uri_mismatch&error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&error_uri=https://developer.github.com/v3/oauth/%23redirect-uri-mismatch&client_id=${id}&client_secret=${secret}`
}

/* 获取url的一个参数值 */
export const getUrlObj = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  if (r !== null) return decodeURI(r[2])
  return null
}
/* 获取url的参数对象 */
export const getUrlJson = () => {
  let json = {}
  let arr = window.location.search.substr(1).split('&')
  for (var i = 0; i < arr.length; i++) {
    let tempArr = arr[i].split('=')
    json[tempArr[0]] = tempArr[1]
  }
  return json
}
