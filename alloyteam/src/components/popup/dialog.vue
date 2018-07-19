<template>
  <div></div>
</template>

<script>
  export default {
    // computed: function () {
    //   console.log('created')
    //   if (this.popups.show === 1 && this.popups['time'] > 0) {
    //     setTimeout(this.popups.show = 0, this.popups['time'])
    //   }
    // },
    props: ['popups'],
    data () {
      return {
        open: this.popups
      }
    },
    watch: {
      'open': function (val) {
        console.log('popups' + val)
      }
    },
    componentUpdated (el, binding, vnode, oldVnode) {
      console.log('popups' + el)
    },
    computed: {
      showed: function () {
        if (this.popups.show === 1 && this.popups['time'] > 0) {
          //
          // setTimeout(this.popups.show = 0, 300000)
          // let thist = this
          // console.log('popups' + this)
          // setTimeout(function (thist) {
          //   console.log('popups')
          //   thist.popups.show = 0
          // }, 3000)
          // setTimeout(console.log('popups'), 3000000)
          // setTimeout(this.popups.show = 0, this.popups['time'])
        }
      }
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import '../../assets/scss/mixin.scss';
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
