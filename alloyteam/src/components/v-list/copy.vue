<template>
  <VDialog class="vue-alert" v-model="showValue"
    :mask-transition="maskTransition"
    :dialog-transition="dialogTransition"
    @on-hide="$emit('on-hide')"
    @on-show="$emit('on-show')">
    <div class="vue-popout">
      <div class="main">
        <div class="top">
          <div class="paper"><img :src="list.Img"></div>
          <div class="login">
            <p>{{list.Name}}</p>
          </div>
        </div>
        <div class="big">
          <ul>
            <li>
              <span class="svg">Name</span>
              <input v-model="list.Name" class="text">
            </li>
            <li>
              <span class="svg">Title</span>
              <input v-model="list.Title" class="text">
            </li>
            <li>
              <span class="svg">Href</span>
              <input v-model="list.Href" class="text">
            </li>
            <li>
              <span class="svg">Img</span>
              <input v-model="list.Img" class="text">
            </li>
            <li>
              <span class="svg">Num</span>
              <input v-model="list.Num" class="text">
            </li>
            <li>
              <span class="svg">New</span>
              <input v-model="list.New" class="text">
            </li>
          </ul>
        </div>
      </div>
      <div class="footer btns">
        <a class="btn" @click="_onHide" href="javascript:;">Follow</a>
        <a class="btn" @click="_onHide" href="javascript:;">Look</a>
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
      list: Object,
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
    computed: {
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
      },
      _onHide () {
        this.showValue = false
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
    // width: 400px;
    .main{
      .top{
        // widows: 100%;
        background: linear-gradient(45deg, rgb(220, 160, 26), rgba(226, 18, 18, 0.85));
        // background: linear-gradient(45deg, #56b4ea, #031b49);
        position: relative;
        border-radius: size(6) size(6) 0 0;
        .paper{
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          background: $bg3;
          left: 50%;
          top: -40px;
          margin-left: -50px;
          // border: size(2) solid #FFF;
          box-shadow: size(3) size(6) size(10) rgba(59, 59, 60, 0.7);
        }
        .login{
          padding-top: 90px;
          @include font-size(20px);
          padding-bottom: size(10);
          line-height: size(40);
          font-family: fantasy, cursive, sans-serif;
          color: #FFF;
        }
      }
      .big{
        background: linear-gradient(45deg, rgb(220, 160, 26), rgba(226, 18, 18, 0.85));
        padding: 10px 0;
        ul{
          li{
            line-height: 40px;
            display: flex;
            input{
              background: transparent;
              border: 0;
              padding: 10px;
              color: $font1;
            }
            .svg{
              flex: 1;
              color: $font1;
              svg{
                vertical-align: text-bottom;
                width: 20px;
                height: 20px;
              }
            }
            .text{
              flex: 3;
              text-align: left;
              @include font-size(12px);
              align-items: flex-end;
            }
          }
        }
      }
    }
    .footer{
      position: relative;
      line-height: 40px;
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
  // .remind{
  //   background-color: rgba(0, 0, 0, .8);
  //   .title{
  //     padding: size(20) size(25);
  //     color: #FFF;
  //   }
  // }
</style>
