import Mock from 'mockjs'
import { singerlist } from './singers'

Mock.mock('/singers', {
  code: 0,
  data: singerlist
})
