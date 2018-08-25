import axios from 'axios'
import json from '../common/js/jsonp'
import { commonParams, options } from './config'

export async function getSingerList () {
  const resp = await axios.get('/singers')
  return resp.data
}

export function getSingerDetail (singerId) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  })

  return json(url, data, options)
}
