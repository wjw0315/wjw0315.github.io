<template>
  <div class="err">
    <v-svg :data="'#icon-err'"></v-svg>
  </div>
</template>
<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .err{
    position: absolute;
    left: 50%;
    top: 50%;
    width: size(100);
    height: size(100);
    margin-left: size(-50);
    margin-top: size(-100);
    svg{
      color: #586069;
      width: 100%;
      height: 100%;
    }
  }
</style>
