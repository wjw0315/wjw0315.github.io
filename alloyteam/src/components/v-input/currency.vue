<template>
  <div class="">
    <label v-if="label">{{ label }}</label>
    <input
      ref="input"
      v-bind:value="value"
      v-on:input="updateValue($event.target.value)"
      v-on:focus="selectAll"
      v-on:blur="formatValue">
  </div>
</template>
<script>
  import {loadScript} from 'UTIL/common'
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      },
      label: {
        type: String,
        default: ''
      }
    },
    data: () => ({
    }),
    mounted: function () {
      loadScript('https://cdn.rawgit.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e/raw/98739fb8ac6779cb2da11aaa9ab6032e52f3be00/currency-validator.js', this.formatValue())
      // let url = 'https://cdn.rawgit.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e/raw/98739fb8ac6779cb2da11aaa9ab6032e52f3be00/currency-validator.js'
      // let script = document.createElement('script')
      // script.setAttribute('src', url)
      // document.getElementsByTagName('head')[0].appendChild(script)
      // document.onreadystatechange = this.formatValue()
    },
    methods: {
      updateValue: function (value) {
        var result = window.currencyValidator.parse(value, this.value)
        if (result.warning) {
          this.$refs.input.value = result.value
        }
        this.$emit('input', result.value)
      },
      formatValue: function () {
        this.$refs.input.value = window.currencyValidator.format(this.value)
      },
      selectAll: function (event) {
        // Workaround for Safari bug
        // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
        setTimeout(function () {
          event.target.select()
        }, 0)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
</style>
