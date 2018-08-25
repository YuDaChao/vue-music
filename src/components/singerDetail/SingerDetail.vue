<template>
  <transition name="fade">
    <div class="singer-detail">singer-detail</div>
  </transition>
</template>

<script>
  import { getSingerDetail } from '../../api/singer'
  import { ERR_OK } from '../../api/config'
  import { createSong } from '../../common/js/song'
  export default {
    name: 'SingerDetail',
    data () {
      return {
        songs: []
      }
    },
    mounted () {
      const { id } = this.$route.params
      this.getSinger(id)
    },
    methods: {
      async getSinger (singerId) {
        const result = await getSingerDetail(singerId)
        if (result.code === ERR_OK) {
          this.songs = this._normallizeSongs(result.data)
          console.log(this.songs)
        }
      },
      _normallizeSongs (songInfo) {
        const result = []
        songInfo.list.forEach(item => {
          const data = {
            ...item.musicData,
            singer_mid: songInfo.singer_mid
          }
          result.push(createSong(data))
        })
        return result
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .singer-detail
    position fixed
    left 0
    bottom 0
    right 0
    top 0
    background-color $color-background
  .fade-enter-active, .fade-leave-active
    transition all 0.3s
  .fade-enter, .fade-leave-to
    transform translate3d(100%, 0, 0)
</style>
