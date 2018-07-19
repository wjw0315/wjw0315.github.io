<template>
  <div class="github">{{popups}}
    <ul v-if="jsons">
      <li v-for="(dVote,index) in votes">
        <!-- <div class="bg-box" v-lazy:background-image="dVote.owner['avatar_url']">
          <img :src="dVote.owner['avatar_url']">
          <img src="error" v-lazy="dVote.owner['avatar_url']"/>
        </div> -->
        <div class="progressive bg-box">
          <img class="preview" :data-srcset="dVote.owner['avatar_url']" v-progressive="dVote.owner['avatar_url'] + '&s=10'" :src="dVote.owner['avatar_url']">
        </div>
        <a :href="dVote['html_url']"><h1>{{dVote.full_name}}</h1></a>
        <h2>{{dVote.description}}</h2>
        <div class="star"><span>
          <svg aria-hidden="true" class="octicon octicon-star" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg>
          {{dVote.forks_count}}
        </span></div>
        <div class="addstar" :class="{checked: dVote['votes']}" @click="addStar(dVote.owner.id, index)">关注</div>
      </li>
    </ul>
    <ul v-else><div class="loading"><img src="../../assets/img/loading.gif"></div></ul>
    <Popup :popups="popups"></Popup>
  </div>
</template>
<script>
  import Popup from 'COMPONENT/popup/popup'
  export default {
    components: {Popup},
    props: ['votes', 'jsons', 'sPolling', 'uPost', 'popups'],
    data () {
      return {
        Polling: this.sPolling
      }
    },
    methods: {
      addStar: function (id, index) {
        if (this.Polling) {
          console.log(!this.votes[index].votes)
          this.votes[index].votes ? this.votes[index].votes : 0
          if (!this.votes[index].votes) {
            this.popups.show = 1
            this.$http.get(this.uPost.url, this.uPost.data).then((res) => {
              console.log(this.uPost)
              this.votes[index].votes = 1
              console.log(this.votes[index].votes)
              this.votes[index].forks_count = this.votes[index].forks_count + 1
              this.Polling = this.Polling - 1
              // setTimeout(this.popups.show = 0, 100000)
            })
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  .tap{
    @include font-size(16px);
    text-align: center;
    line-height: size(40);
    color: #4da577;
  }
  .loading{
    width: size(200);
    height: size(200);
    margin: auto;
    overflow: hidden;
  }
  .github{
    width: size(375);
    margin: auto;
      box-sizing: border-box;
    overflow: visible;
    ul{
      padding-left: size(10);
    }
    li{
      float: left;
      width: size(172.5);
      margin-right: size(10);
      margin-bottom: size(10);
      overflow: hidden;
      box-shadow: 4px 4px 18px rgba(0,0,0,0.46);
      .bg-box {
          height: 0;
          background-size: cover;
          // padding-bottom: 100%;
          width: size(172.5);
          height: size(172.5);
          overflow: hidden;
          // background-image: url(../../assets/img/loading.gif);
        // border-radius: size(10);
      }
      .bg-box[lazy=loaded] {
          background-size: cover;
          -webkit-animation-duration: 1s;
          animation-duration: 1s;
          -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
          -webkit-animation-name: fadeIn;
          animation-name: fadeIn;
      }
      h1{
        line-height: size(30);
        color: #4da577;
        padding: 0 size(6);
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        @include font-size(14px);
      }
      h2{
        line-height: size(16);
        @include font-size(12px);
        padding: 0 size(6);
        height: size(32);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .star{
        text-align: center;
        span{
          line-height: size(40);
          @include font-size(14px);
          position: relative;
          color: #4da577;
          .octicon{
            width: size(15);
            height: size(15);
            position: absolute;
            left: size(-18);
            top: size(-1);
            fill: currentColor;
          }
        }
      }
      .addstar{
        width: size(80);
        height: size(30);
        border-radius: size(20);
        line-height: size(30);
        margin: size(10) auto;
        background: #e4071c;
        text-align: center;
        color: #FFF;
        @include font-size(16px);
      }
      .checked{
        background: #666;
      }
    }
  }
</style>
