<template>
  <div class="dialog" @touchmove="onTouchMove">
    <transition :name="maskTransition">
      <div @click="hide"><div class="vue-mask" @click="hideOnBlur && (currentValue = false)" v-show="currentValue"></div></div>
    </transition>
    <transition :name="dialogTransition">
      <div class="vue-dialog" v-show="currentValue" >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      maskTransition: {
        type: String,
        default: 'vue-mask'
      },
      dialogTransition: {
        type: String,
        default: 'vue-dialog'
      },
      hideOnBlur: Boolean,
      scroll: {
        type: Boolean,
        default: true
      }
    },
    created () {
      if (typeof this.value !== 'undefined') {
        this.currentValue = this.value
      }
    },
    data: () => ({
      currentValue: false
    }),
    watch: {
      // value: {
      //   handler: function (val) {
      //     this.currentValue = val
      //     // 高斯模糊
      //     if (val) {
      //       document.body.className = 'modal-active'
      //     } else {
      //       document.body.className = ''
      //     }
      //   },
      //   immediate: true
      // },
      value (val) {
        this.currentValue = val
        // 高斯模糊
        if (val) {
          document.body.className = 'modal-active'
        } else {
          document.body.className = ''
        }
      },
      currentValue (val) {
        this.$emit(val ? 'on-show' : 'on-hide')
        this.$emit('input', val)
      }
    },
    methods: {
      onTouchMove (event) {
        // !this.scroll && event.preventDefault()
      },
      hide () {
        this.$parent.showValue = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .dialog{
    .vue-mask{
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0,.6);
    }
    .weui-mask_transparent{
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
  .vue-dialog {
    filter: blur(-3px);
    position: fixed;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    text-align: center;
    border-radius: 6px;
    // overflow: hidden;
  }
</style>
