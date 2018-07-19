<template>
</template>
<script>
  import WX from 'weixin-js-sdk'
  export default {
    props: {
      WXs: Object
    },
    data: () => ({
    }),
    mounted () {
      window.WeiSucc = function () {
      }
    },
    methods: {
      WeixinSdk () {
        let self = this
        console.log('WeixinSdk')
        WX.ready(function () {
          WX.onMenuShareTimeline({
            title: self.WXs.oTitle,
            link: self.WXs.oUrl,
            imgUrl: self.WXs.oImgUrl,
            success: function (res) {
              window.WeiSucc()
            },
            cancel: function () {}
          })
          WX.onMenuShareAppMessage({
            title: self.WXs.oTitle,
            desc: self.WXs.oDesc,
            link: self.WXs.oUrl,
            imgUrl: self.WXs.oImgUrl,
            success: function () {
              window.WeiSucc()
            },
            cancel: function () {}
          })
          WX.onMenuShareQQ({
            title: self.WXs.oTitle,
            desc: self.WXs.oDesc,
            link: self.WXs.oUrl,
            imgUrl: self.WXs.oImgUrl,
            success: function () {
              window.WeiSucc()
            },
            cancel: function () {}
          })
          WX.onMenuShareWeibo({
            title: self.WXs.oTitle,
            desc: self.WXs.oDesc,
            link: self.WXs.oUrl,
            imgUrl: self.WXs.oImgUrl,
            success: function () {
              window.WeiSucc()
            },
            cancel: function () {}
          })
          WX.onMenuShareQZone({
            title: self.WXs.oTitle,
            desc: self.WXs.oDesc,
            link: self.WXs.oUrl,
            imgUrl: self.WXs.oImgUrl,
            success: function () {
              window.WeiSucc()
            },
            cancel: function () {}
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
</style>
