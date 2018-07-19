<template>
  <div :class="{'transparent': isUserPage, 'header': true, 'show': isShow}" ref="header">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    mounted () {
      window.addEventListener('scroll', this.Top)
      let Height = this.$refs.header.offsetHeight
      // console.log(Height)
      document.getElementById('app').style.paddingTop = Height + 'px'
    },
    data: () => ({
      wait: false,
      isShow: false
    }),
    methods: {
      Top () {
        let scroll = document.body.scrollTop
        if (scroll === 0 && this.isUserPage) {
          this.$refs.header.classList.add('transparent')
          console.log(scroll)
        } else {
          console.log(scroll)
          this.$refs.header.classList.remove('transparent')
        }
        // if (!this.wait) {
        //   window.requestAnimationFrame(() => {
        //     if (scroll === 0 && this.isUserPage) {
        //       this.$refs.header.classList.add('transparent')
        //       console.log('scroll')
        //     } else {
        //       this.$refs.header.classList.remove('transparent')
        //       console.log('scroll')
        //     }
        //     this.wait = false
        //   })
        //   this.wait = true
        // }
      }
    },
    computed: {
      isUserPage () {
        return this.$route.name === 'UserDetail'
      }
    },
    components: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .header{
    height: size(44);
    position: fixed;
    left: 0;
    top: 0;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    color: #FFF;
    width: 100%;
    text-align: center;
    @include font-size(14px);
    // position: relative;
    z-index: 2;
    background-color: #0f2035;
    transform: translate3d(0, 0, 0);
    box-shadow: 0 3px 5px 0 rgba(15, 31, 52, 0.4);
    transition: background-color 0.3s;
  }
  .transparent{
    background-color: #224365;
    box-shadow: none;
  }
</style>
