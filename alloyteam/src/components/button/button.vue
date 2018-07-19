<template>
  <button @click="reppleClick" class="cov-button-ripple" :class="{active: repple_button.toggle}">
    <slot></slot>
    <span class="cov-ripple" :class="{'animate': repple_button.animate}"></span>
  </button>
</template>
<script>
  export default {
    data () {
      return {
        repple_button: {
          animate: false,
          toggle: false
        }
      }
    },
    methods: {
      reppleClick (e) {
        this.repple_button.animate = true
        let button = e.target
        let ripple = button.querySelector('.cov-ripple')
        if (ripple) {
          let d = Math.max(button.offsetHeight, button.offsetWidth)
          let x = e.layerX - ripple.offsetWidth / 2
          let y = e.layerY - ripple.offsetHeight / 2
          ripple.setAttribute('style', 'height: ' + d + 'px; width: ' + d + 'px; top: ' + y + 'px; left: ' + x + 'px;')
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.repple_button.animate = false
          }, 660)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	@import '../../assets/scss/mixin.scss';
  .cov-button-ripple {
    background: transparent;
    border: none;
    border-radius: size(2);
    color: #000;
    position: relative;
    height: size(36);
    min-width: size(64);
    padding: 0 size(16);
    display: inline-block;
    font-family: Roboto,Helvetica,Arial,sans-serif;
    font-size: size(14);
    font-weight: 500;
    text-transform: uppercase;
    line-height: size(36);
    letter-spacing: 0;
    overflow: hidden;
    will-change: box-shadow,transform;
    -webkit-transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
    transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    line-height: size(36);
    vertical-align: middle;
    min-width: size(96);
  }
  .cov-button-ripple:hover {
    // background-color: hsla(0,0%,62%,.2);
  }
  .cov-ripple {
    display: block; 
    position: absolute;
    background: hsla(0, 0%, 65%, 0.66);
    border-radius: 100%;
    transform: scale(0);
  }
  .cov-ripple.animate {
    animation: ripple 0.65s linear;
  }
  @keyframes ripple {
    100% {opacity: 0; transform: scale(2.5);}
  }
</style>
