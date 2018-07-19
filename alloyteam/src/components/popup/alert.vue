<template>
  <div v-show="showValue">
    <!-- <Dialogs v-model="showValue" :mask-transition="maskTransition" :dialog-transition="dialogTransition" @on-hide="$emit('on-hide')"@on-show="">
    </Dialogs> -->
    <Dialogs></Dialogs>
    <div class="al-mask"></div>
    <div class="m-alert">
      <div class="al-title">{{name.title || title_text}}</div>
      <div class="al-dec">{{name.dec || title_dec}}</div>
      <div class="al-btn">
        <a href="javascript:;" class="btn" @click="onHide">{{name.button_text || button_text}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import Dialogs from 'COMPONENT/popup/dialog'
  export default {
    components: {Dialogs},
    props: ['name'],
    data () {
      return {
        title_text: '恭喜',
        title_dec: '消息已成功发送',
        button_text: '确定',
        showValue: false
      }
    },
    // bug 暂时使用定时器设置
    created () {
      var _this = this
      setInterval(function () {
        _this.showValue = _this.name.showValue
      }, 500)
    },
    updated () {
      // this.addShow()
    },
    methods: {
      onHide () {
        this.name.showValue = false
      },
      addShow () {
        // console.log(this.showValue)
        // this.showValue = this.name.showValue
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import '../../assets/scss/mixin.scss';
  .al-mask{
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .m-alert{
    position: fixed;
    z-index: 5000;
    width: size(300);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFF;
    text-align: center;
    border-radius: size(6);
    overflow: hidden;
    .al-title{
      padding: size(18) size(20) size(8);
      font-weight: 400;
      @include font-size(18px);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .al-dec{
      padding: size(0) size(20) size(8);
      min-height: 40px;
      @include font-size(15px);
      word-wrap: break-word;
      word-break: break-all;
      color: #999;
    }
    .al-btn{
      position: relative;
      line-height: 48px;
      font-size: 18px;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      a{
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        color: #3CC51F;
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        position: relative;
        @include font-size(18px);
        line-height: size(48);
        &::after{
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 1px;
          border-top: 1px solid #D5D5D6;
          color: #D5D5D6;
          transform-origin: 0 0;
          transform: scaleY(0.5);
        }
      }
    }
  }
.pop_toast{
  position: fixed;
  margin: 0 10px;
  width: 80%;
  z-index: 9999;
  padding: .4rem;
  display: inline-block;
  color: #FFFFFF;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  border-radius: .1rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  word-break: break-all;
}
// .popup {
//   position: fixed;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   // opacity: 0.5;
//   z-index: 999;
//   left: 0;
//   top: 0;
//   div{
//     position: absolute;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%,-50%);
//     width: 60%;
//     color: #FFF;
//     border-radius: 6px;
//     background: #000;
//   }
// }
</style>
