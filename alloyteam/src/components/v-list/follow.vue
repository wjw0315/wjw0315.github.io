<template>
  <div ref="list" class="list" @mousedown="down" @mouseup="up" @touchstart="down" @touchend="up">
    <div class="paper">
      <img v-lazy="avatarImg" :data-srcset="avatarImg">
    </div>
    <div class="avatar"><span>{{title}}</span></div>
  </div>
</template>
<script>
  import {formatDate, formatType} from 'UTIL/tool'
  import API from 'API'
  export default {
    props: {
      avatarImg: String,
      title: String,
      time: String
    },
    data: () => ({
      timer: 0
    }),
    computed: {
      times () {
        return formatDate(this.time)
      },
      types () {
        return formatType(this.type)
      }
    },
    methods: {
      down () {
        console.log(this.title)
        this.timer = setTimeout(this.doStuff, 1000)
      },
      doStuff () {
        // alert('hello, you just pressed the td for two seconds.')
        this.$parent.$parent.bigs()
        API.Get(`/users/${this.title}`)
        .then(res => {
          this.$parent.$parent.big = res
        }, () => {
        })
      },
      up () {
        clearTimeout(this.timer)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .list{
    position: relative;
    .avatar{
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      color: #FFF;
      background: linear-gradient(116deg, rgba(47, 54, 61, 0.7),rgba(72, 72, 72, 0.8));
      width: 100%;
      line-height: size(20);
      @include font-size(12);
    }
  }
  .paper{
    width: 100%;
    overflow: hidden;
    img{
      position: relative;
      z-index: -1;
    }
  }
  .big{
    position: fixed;
    width: size(375);
  }
</style>
