<template>
  <div class="singer">singer</div>
</template>

<script>
  import { getSingerList } from '../../api/singer'
  import Singer from '../../common/js/singer'
  import { ERR_OK } from '../../api/config'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    name: 'singer',
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      async _getSingerList () {
        const resp = await getSingerList()
        if (resp.code === ERR_OK) {
          // this.singers = resp.data
          console.log(this._normallizeSinger(resp.data))
        }
      },
      _normallizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index <= HOT_SINGER_LEN) {
            map.hot.items.push(new Singer(
              item.singer_mid,
              item.singer_name
            ))
          }
          const key = item.findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          } else {
            map[key].items.push(new Singer(
              item.singer_mid,
              item.singer_name
            ))
          }
        })
        // 排序
        let hot = []
        let ret = []
        for (let key in map) {
          const val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
