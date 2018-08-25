<template>
  <div>
    <scroll
      ref="listview"
      class="singer"
      :data="singers"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="scroll">
      <ul>
        <li v-for="(group, index) in singers" class="list-group" ref="listGroup" :key="index">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li
              v-for="item in group.items"
              class="list-group-item"
              @click="handleClickSinger(item)"
              :key="item.id">
              <img class="avatar" v-lazy="item.avatar" alt="">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <ul class="nav-list">
        <li
          v-for="(item, index) in navList"
          :key="item"
          class="nav-item"
          :class="{active: index ===currentIndex}"
          :data-index="index"
          @touchstart="onShortcutTouchstart"
          @touchmove.stop.prevent="onShortcutTouchmove"
        >
          {{item}}
        </li>
      </ul>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
        <h2 class="list-group-title">{{fixedTitle}}</h2>
      </div>
      <div class="loading-container" v-show="!singers.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { getSingerList } from '../../api/singer'
  import Singer from '../../common/js/singer'
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import { ERR_OK } from '../../api/config'
  import { getElDate } from '../../common/js/dom'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  const ANCHOR_HEIGHT = 16
  const TITLE_HEIGHT = 30

  export default {
    name: 'singer',
    data () {
      return {
        singers: [],
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      }
    },
    created () {
      this.touch = {}
      this.probeType = 3
      this.listenScroll = true
      this._getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handleClickSinger (item) {
        this.$router.push(`/singer/${item.id}`)
        this.setSinger(item)
      },
      async _getSingerList () {
        const resp = await getSingerList()
        if (resp.code === ERR_OK) {
          // this.singers = resp.data
          this.singers = this._normallizeSinger(resp.data)
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
              items: [
                new Singer(
                  item.singer_mid,
                  item.singer_name
                )
              ]
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
      },
      onShortcutTouchstart (e) {
        // 获取touchstart开始的位置
        const y1 = e.touches[0].pageY
        this.touch.y1 = y1
        // 获取开始touch的位置索引
        const anchorIndex = getElDate(e.target, 'index')
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchmove (e) {
        const y2 = e.touches[0].pageY
        this.touch.y2 = y2
        // 向下取整
        const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        const anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _scrollTo (anchorIndex) {
        // 边界处理
        if (anchorIndex < 0) {
          anchorIndex = 0
        }
        if (anchorIndex > this.listHeight.length - 2) {
          anchorIndex = this.listHeight.length - 2
        }
        console.log(anchorIndex)
        this.scrollY = -this.listHeight[anchorIndex]
        this.$refs.listview.scrollTo(0, this.scrollY)
      },
      _calculateHeight () {
        // 保存每个title的高度
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        const list = this.$refs.listGroup
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          /*
          * 计算高度的时候没有加上最后一li的20下外边距
          * */
          height += (item.clientHeight + 20)
          this.listHeight.push(height)
        }
      }
    },
    computed: {
      navList () {
        let keys = []
        this.singers.forEach(item => {
          keys.push(item.title.substr(0, 1))
        })
        return keys
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.singers[this.currentIndex] ? this.singers[this.currentIndex].title : ''
      }
    },
    watch: {
      singers () {
        let _this = this
        setTimeout(() => {
          _this._calculateHeight()
        }, 20)
      },
      scrollY (pos) {
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let h1 = this.listHeight[i]
          let h2 = this.listHeight[i + 1]
          if (h1 <= -pos && -pos < h2) {
            this.currentIndex = i
            this.diff = h2 + pos
            return
          }
        }
        this.currentIndex = 0
      },
      diff (newVal) {
        let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) return
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl";
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
    z-index -1
    .list-group-title
      background $color-highlight-background
      font-size $font-size-small
      color $color-text-l
      line-height 2.5
      padding-left 15px
    .list-group-item
      display flex
      align-items center
      margin  20px 0 20px 20px
      .avatar
        width 50px
        height 50px
        border-radius 25px
        flex 0 0 50px
        margin-right 15px
      .name
        flex: 1
        font-size: 13px
        color $color-text-l
    .nav-list
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      padding 15px 3px
      background $color-background-d
      border-bottom-left-radius: 15px
      border-top-left-radius: 15px
      .nav-item
        font-size 10px
        color $color-text-l
        text-align center
        line-height 1.4
        &.active
          color $color-theme

    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
    .loading-container
      position: absolute
      width: 100%
      top: 50%
</style>
