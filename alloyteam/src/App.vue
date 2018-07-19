<template>
  <div id="app" class="container">
    <transition :name="transitionName">
      <router-view class="router-view"></router-view>
    </transition>
    <my-alert ref="alert" v-model="alert.show" :title="alert.title" :text="alert.text" :buttons="alert.buttons" @on-show="onShow" @on-hide="onHide"></my-alert>
  </div>
</template>
<script>
  import 'ASSET/scss/mreset.scss'
  import myAlert from 'COMPONENT/alert'
  // import {setCookie} from 'UTIL/tool'
  // import '../node_modules/progressive-image/dist/index.css'
  // import { mapGetters } from 'vuex'
  export default {
    mounted () {
      // setCookie('name', 'show time', 'h1')
    },
    components: {myAlert},
    data: () => ({
      transitionName: '',
      alert: {}
    }),
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/')
        const fromDepth = from.path.split('/')
        if (toDepth.length === fromDepth.length) {
          if (toDepth[toDepth.length - 1] === '') {
            this.transitionName = 'vux-pop-out'
          } else {
            this.transitionName = 'vux-pop-in'
          }
        } else {
          this.transitionName = toDepth < fromDepth ? 'vux-pop-out' : 'vux-pop-in'
        }
      }
    },
    methods: {
      onShow () {},
      onHide () {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import './assets/scss/mixin.scss';
  a{
    color: $font1;
  }
  nav{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    overflow: auto;
    // background: $nav;
    .nav-element {
      // text-align: right;
      cursor: pointer;
      padding-bottom: 2px;
      // margin: 1px;
      // padding: 1px 0;
      color: $btn;
      transition: color 0.25s;
    }

    .navbar-active {
      color: $btna;
    }

    .nav-label {
      font-size: 12px;
      padding-left: 10px;
      svg{
        width: 16px;
        height: 16px;
      }
    }
    li{
      width: 100%;
    }
    li:hover{
      opacity: 1;
      background-color: $bg3;
    }
  }
  .modal-active{
    .blur{
       filter: blur(size(3));
     }
  }
  #loading{
    display: none;
  }
  .container,.router-view{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: scroll;
  }
  .icon {
     width: 20px;
     height: 20px;
     vertical-align: text-bottom;
     margin-right: 6px;
     fill: currentColor;
     overflow: hidden;
  }
  // vue-router transition
  .router-view {
    // width: 100%;
    // animation-duration: 0.5s;
    // animation-fill-mode: both;
    // backface-visibility: hidden;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    height: 100%;
    position: absolute;
    left: 0;
  }
  .vux-pop-out-enter-active {
    animation-name: popInLeft;
  }
  .vux-pop-out-leave-active {
    animation-name: popOutRight;
  }
  .vux-pop-in-enter-active {
    perspective: 1000;
    animation-name: popInRight;
  }
  .vux-pop-in-leave-active {
    animation-name: popOutLeft;
  }
  @keyframes popInLeft {
    from {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes popOutLeft {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
  }
  @keyframes popInRight {
    from {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes popOutRight {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
