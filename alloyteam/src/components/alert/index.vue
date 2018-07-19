<template>
  <VDialog class="vue-alert" v-model="showValue"
    :mask-transition="maskTransition"
    :dialog-transition="dialogTransition"
    @on-hide="$emit('on-hide')"
    @on-show="$emit('on-show')">
    <div class="vue-popout" :class="{'remind': !buttons || !buttons.length}">
      <div class="main">
        <div class="title" v-if="title">{{title}}</div>
        <div class="text" v-html="text" v-if="text"></div>
        <!-- <input autofocus class="text-input" :placeholder="placeholder" v-model="value" v-if="input" /> -->
      </div>
      <div
        class="footer"
        v-if="buttons && buttons.length"
        :class="{'btns': buttons.length >= 2}">
        <a
          href="javascript:;"
          class="btn" v-for="(button, index) in buttons"
          @click.prevent.stop="onClick(button, index)">{{button.text}}
        </a>
      </div>
    </div>
  </VDialog>
</template>
<script>
  import VDialog from 'COMPONENT/v-dialog'
  const ANIMATION_TIME = 800
  export default {
    props: {
      value: Boolean,
      title: String,
      text: String,
      buttons: Array,
      remindDuration: {
        type: Number,
        default: 0
      },
      maskTransition: {
        type: String,
        default: 'vue-mask'
      },
      dialogTransition: {
        type: String,
        default: 'vue-dialog'
      }
    },
    watch: {
      value (val) {
        this.showValue = val
      },
      showValue (val) {
        this.$emit('input', val)
      },
      buttons (val) {
        if (!val.length) {
          this.activate()
          console.log('activate')
        }
      }
    },
    methods: {
      activate: function () {
        // let self = this
        if (!this.buttons || !this.buttons.length) {
          setTimeout(() => {
            this.showValue = false
            // this._deferred.resolve()
          }, ANIMATION_TIME + Number(this.remindDuration))
        }

        // return this._deferred.promise
      },
      onClick (button, index) {
        if (typeof button.onClick === 'function') {
          button.onClick()
          this.showValue = false
        }
      }
    },
    created () {
      if (typeof this.value !== 'undefined') {
        this.showValue = this.value
      }
    },
    data: () => ({
      showValue: false
    }),
    components: {VDialog}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .vue-popout{
    .main{
      padding: 0 size(15);
    }
    .title{
      font-weight: 400;
      @include font-size(18px);
      padding: size(20) size(25) size(5);
    }
    .text{
      padding: 0 size(20) size(10);
      min-height: size(40);
      @include font-size(15px);
      line-height: 1.3;
      word-wrap: break-word;
      word-break: break-all;
      color: #999;
    }
    .text-input{
      outline: 0;
      box-sizing: border-box;
      height: size(30);
      background: #fff;
      margin: size(15) 0;
      // margin-top: size(15);
      padding: 0 size(5);
      border: size(1) solid #a0a0a0;
      border-radius: size(5);
      width: 100%;
      @include font-size(15px);
      font-family: inherit;
      display: block;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      appearance: none;
    }
    .footer{
      position: relative;
      line-height: size(48);
      @include font-size(18px);
      display: flex;
      &:after{
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: size(1);
        border-top: size(1) solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
      .btn{
        display: block;
        flex: 1;
        color: #3cc51f;
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        position: relative;
        &:after{
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          width: size(1);
          bottom: 0;
          border-left: size(1) solid #d5d5d6;
          color: #d5d5d6;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleX(.5);
          transform: scaleX(.5);
        }
      }
      .btn:first-child{
        color: #000;
        &:after{
          content: none;
        }
      }
    }
  }
  .remind{
    background-color: rgba(0, 0, 0, .8);
    .title{
      padding: size(20) size(25);
      color: #FFF;
    }
  }
</style>
