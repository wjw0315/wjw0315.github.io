import axios from 'axios'

const TOKEN = '93a89eb491ce25f7cd243bd51fd8c68b38ae77cd'
// const option = {
//   headers: {
//     'Authorization': `token ${TOKEN}`
//   }
// }
// console.log('option' + option)

import qs from 'qs'
import * as Tool from 'UTIL/tool'
// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'https://api.github.com'
axios.defaults.headers.common['Authorization'] = `token ${TOKEN}`
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  let URL = config.url.split(config.baseURL)
  Tool.open(URL[1])
  return config
}, (error) => {
  Tool.toast('错误的传参', 'fail')
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
  console.log(res)
  // 拦截器配置
  // if (res.data.success) {
  //   Tool.toast(res.data.msg)
  //   Tool.close()
  //   return Promise.reject(res)
  // }
  Tool.close()
  return res
}, (error) => {
  Tool.toast('网络异常', 'fail')
  Tool.close()
  return Promise.reject(error)
})

export const oGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const oPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// export default {
//   List () {
//     return oGet(`https://www.easy-mock.com/mock/5926ae2191470c0ac1fde242/api/frontendguide/list`)
//   },
//   Get (link) {
//     return oGet(link)
//   }
// }

import * as repos from '../../static/FontEnd.json'
export const setpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
var List = (username) => setpromise(repos)
var Notifications = (username) => setpromise(repos)

export default {
  List,
  Notifications
}
