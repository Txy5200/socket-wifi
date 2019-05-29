import axios from 'axios'
import qs from 'qs'
import {
  API_SERVER
} from '../config'

export const request = async (url, params, isJson, type) => {
  if (type) {
    axios({ // 用axios发送post请求
      method: 'get',
      url: API_SERVER + url, // 请求地址
      data: '', // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then((res) => { // 处理返回的文件流
      const content = res.data
      const blob = new Blob([content])
      const fileName = '申请体验人信息表.xlsx'
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    })
  } else {
    let json = {}
    for (let key in params) {
      if (params[key] !== undefined) {
        json[key] = params[key]
      }
    }
    if (isJson) {
      let option = {
        url: url,
        method: 'POST',
        baseURL: API_SERVER,
        headers: {
          // 'Content-Type': 'application/json'
          // 'Authorization': 'Bearer ' + cookie.load('login_access_token')
        },
        data: qs.stringify(json)
      }
      const data = await axios.post(option)
      const result = data.data
      return result
    } else {
      console.log('reqData========', API_SERVER + url, json)
      let headers = {}
      const data = await axios.post(
        API_SERVER + url,
        qs.stringify(json),
        { headers }
      )
      console.log('resData====', data)
      const result = data.data
      return result
    }
  }
}
