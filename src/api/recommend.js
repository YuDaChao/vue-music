import axios from 'axios'
import json from '../common/js/jsonp'
import { commonParams, options } from './config'

export function getRecommend () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    uin: 290945266
  })

  return json(url, data, options)
}

export function getDiscList () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, {
    picmid: 1,
    rnd: Math.random(),
    g_tk: 5381,
    jsonpCallback: 'getPlaylist',
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
