<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Happyu Music</h1>
  </div>
</template>

<script>
  export default {
    name: 'm-header'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .m-header
    position relative
    height 44px
    text-align center
    color: $color-theme
    font-size 0
    .icon
      display inline-block
      width 30px
      height 32px
      margin: 5px 6px 0 0
      vertical-align top
      bg-image('./images/logo')
      background-size 30px 32px
    .text
      display inline-block
      line-height 44px
      vertical-align top
      font-size $font-size-large
</style>
