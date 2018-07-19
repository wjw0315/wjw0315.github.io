<template>
  <div class="list">
    <div class="paper">
      <router-link :to="{name: 'User', params: {username: avatarUrl}}"><img v-lazy="avatarImg" :data-srcset="avatarImg"></router-link>
    </div>
    <div class="right">
      <div class="top">
        {{type}}
        <v-svg :data="'#icon-' + types"></v-svg>
        {{times}}
        <router-link :to="{name: 'User', params: {Id: issueUrl}}"><span>{{repoName}}</span></router-link>
      </div>
      <div class="dec">{{title}}</div>
    </div>
  </div>
</template>
<script>
  // import Heads from 'COMPONENT/heads'
  import {formatDate, formatType} from 'UTIL/tool'
  export default {
    props: {
      avatarImg: String,
      title: String,
      type: String,
      issueUrl: String,
      repoName: String,
      avatarUrl: String,
      time: String
    },
    data: () => ({
    }),
    components: {},
    computed: {
      times () {
        return formatDate(this.time)
      },
      types () {
        return formatType(this.type)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .list{
    width: size(360);
    margin: size(7.5);
    margin-top: size(6);
    margin-bottom: size(16);
    display: flex;
    box-shadow: 0 size(1) size(10) rgba(59, 59, 60, 0.5);
    .paper{
      width: size(100);
      height: size(100);
      overflow: hidden;
      flex: none;
    }
    .right{
      margin-left: size(4);
    }
  }
  .List
  .main:first-child{
    .list{
      flex-direction: column;
      .paper{
        width: size(360);
        height: size(200);
        position: relative;
        img{
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: size(-180);
        }
      }
      .right{
      }
    }
  }
</style>
