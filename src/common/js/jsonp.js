import originJSONP from 'jsonp'

/**
 * json封装
 * @param url 请求地址
 * @param data 请求参数
 * @param options
 * @returns {Promise<any>}
 */
export default function jsonp (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substr(1) : ''
}
