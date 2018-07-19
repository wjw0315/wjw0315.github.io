<template>
	<div class="item">
		<span>Item # {{ index }}</span>
	</div>
</template>

<script>
export default {
  props: ['index']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
	.item {
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
		border-bottom: 1px solid #eee;
	}
</style>
