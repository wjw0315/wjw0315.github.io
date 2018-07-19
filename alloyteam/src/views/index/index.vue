<template>
  <div ref="navs" class="view">
    <!-- <Heads v-if="false" :titles="title"></Heads> -->
    <!-- {{novelty}} -->
    <div ref="nav" class="left"></div>
    <div class="right blur">
      <div class="type" v-if="type">
        <div class="copy" @click="copy">复制</div>
        <div class="input"><input ref="Json" type="text" name="" :value="JSON.stringify(novelty)"></div>
      </div>
      <div class="T1" v-for="(T1,K1) in novelty">
        <h1 class="pageT1"><v-svg :data="'#icon-'+ T1.T1Name"></v-svg>{{T1.pageT1}}</h1>
        <div class="T2" v-for="(T2,K2) in T1.pageC1">
          <h2 class="pageT2"><v-svg :data="'#icon-'+ T2.T2Name"></v-svg>{{T2.pageT2}}</h2>
          <div class="main">
            <div class="lists" :style="'order:' + T2.pageC2[K3].Num" @click="onCopy(K1,K2,K3,List)" v-for="(List,K3) in T2.pageC2">
              <!-- <a :href="List.Href" target="_blank"> -->
                <div class="list" :class="{new: List.New}">
                  <div class="title" :class="{noTitle: !List.Title}">
                    <!-- <div class="paper"><img :src="List.Img || 'https://luuman.github.io/apple-touch-icon.png'"></div> -->
                    <!-- <div v-lazy:background-image="List.Img || '../../assets/img/png.png'" class="paper bg-box" :style="'background-color:' + color">
                      <i v-if="!List.Img">{{List.Name.charAt(0)}}</i>
                    </div> -->
                    
                    <div v-if="!List.Img" class="paper bg-box" :style="'background-color: #' + color[Math.floor(Math.random() * color.length)]">
                       <i>{{List.Name.charAt(0)}}</i>
                    </div>
                    <div v-else v-lazy:background-image="List.Img" class="paper bg-box">
                    </div>
                    <h3>{{List.Name}}</h3>
                  </div>
                  <h4>{{List.Title}}</h4>
                </div>
              <!-- </a> -->
            </div>
            <div v-if="type" class="add" @click="addList(K1,K2,T2.pageC2)">
              <div class="list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <com-copy v-model="showValue" :list="Copy"></com-copy>
  </div>
</template>
<script>
  import navbar from 'UTIL/navbar'

  function makeNavListItem (element) {
    var li = document.createElement('li')
    var label = document.createElement('span')
    var spot = document.createElement('span')

    // A label should have a nav-label class and contain the same text as the
    // element.
    // console.log(element)
    label.className = 'nav-label'
    label.innerHTML = element.innerHTML

    // spot.textContent = '●'
    spot.className = 'nav-spot'

    li.appendChild(label)
    li.appendChild(spot)

    // Custom className for our CSS purposes only. navbar will work around
    // existing classes by appending or removing the navbar-active class.
    li.className = 'nav-element'

    // I want clicks on nav items to scroll the relevant title into view.
    li.addEventListener('click', function () {
      element.scrollIntoView(true)
    })

    // Remember to return the list element at the end!
    // console.log(li)
    return li
  }
  import comCopy from 'COMPONENT/v-list/copy'
  import API from 'API'
  export default {
    data: () => ({
      novelty: [],
      type: false,
      showValue: false,
      color: ['fecc2f', '7c55fb', 'feb42e', '3189fc', '23d1b9', '22c5f8'],
      Copy: {},
      title: ''
    }),
    components: {comCopy},
    mounted () {
      if (this.$route.query.type === 'copy') {
        this.type = true
      }
      API.List()
      .then(res => {
        this.novelty = res
        // console.log('nav')
      }, (res) => {
      })
    },
    updated () {
      // Generate a nav list element for every h2 element on the page.
      var nav = navbar({
        elementList: document.querySelectorAll('h2'),
        // elementList: document.querySelectorAll('h1, h2'),
        makeNavListItem: makeNavListItem,
        debounceTime: 100
      })
      // console.log(nav)
      // Finally, append the element to the document. In this demo the navbar is
      // fixed, so I have simply appended to the body.
      this.$refs.nav.innerHTML = ''
      this.$refs.nav.appendChild(nav)
      // document.querySelector('body').appendChild(nav)
    },
    computed: {
    },
    methods: {
      onCopy (K1, K2, K3, content) {
        if (!this.type) {
          window.open(content.Href)
          return
        }
        this.showValue = true
        this.Copy = content
      },
      addList (K1, K2, content) {
        let data = this.novelty
        content[content.length] = {'Name': 'Name', 'Title': 'Title', 'Href': '', 'Num': 99, 'Img': ''}
        data[K1].pageC1[K2].pageC2 = content
        this.novelty = this.novelty.concat(data)
      },
      copy () {
        this.$refs.Json.select()
        document.execCommand('Copy')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../assets/scss/mixin.scss';
  @media (min-width: 768px){}
  .view{
    display: flex;
  }
  .right{
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: 130px;
  }
  .pageT1{
    color: $font1;
    background-color: $bgt1;
    // border: 1px solid #c6daff;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    // max-width: 1200px;
    margin: 20px auto;
    font-size: 14px;
    padding-left: 29px;
    box-shadow: 0 4px 16px 1px rgba(0, 0, 0, 0.05);
  }
  .T2{
    background: $bg2;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
    // max-width: 1200px;
    // margin: 20px auto;
    // padding-bottom: 20px;
    box-shadow: 0 4px 16px 1px rgba(0, 0, 0, .05);
    .pageT2{
      padding: 10px;
      border-radius: 4px 4px 0 0;
      padding-left: 29px;
    }
  }
  .main{
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .lists,.add{
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 10px;
      transition: width 1s;
      @media (min-width: 768px){
        width: 50%;
      }
      @media (min-width: 992px){
        width: 33.33%;
      }
      @media (min-width: 1200px){
        width: 25%;
      }
      .list{
        background: $bg3;
        height: 87px;
        padding: 10px;
        border-radius: 6px;
        // border: 1px solid #e4ecf3;
        margin: 20px 0 0 0;
        transition: all 0.3s ease;
        .title{
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          h3{
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 10px;
          }
        }
        h4{
          font-size: 13px;
          color: $font2;
          display: -webkit-box !important;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .noTitle{
          .paper{
            width: 80px;
            height: 80px;
            i{
              font-size: 32px;
            }
          }
        }
        .paper{
          width: 40px;
          height: 40px;
          // flex: 1;
          // flex-basis: 40px;
          background-color: #607d8b;
          background-size: cover;
          overflow: hidden;
          border-radius: 50%;
          box-shadow: 0.08rem 0.16rem 0.26667rem rgba(59, 59, 60, 0.7);
          position: relative;
          i{
            position: absolute;
            font-style: normal;
            width: 40px;
            line-height: 40px;
            text-align: center;
            margin-left: -20px;
            margin-top: -20px;
            left: 50%;
            top: 50%;
            color: #FFF;
            font-size: 18px;
          }
        }
      }
      &:hover{
        transform: translateY(-6px);
        box-shadow: $shadow1;
        transition: all 0.3s ease;
        .list{
          // background: linear-gradient(90deg, #121c29 0%, #102848 100%);
          // background: linear-gradient(90deg, #143456 20%, #141f2b 100%);
        }
      }
    }
    .add{
      order: 100;
      width: 117px;
      .list{
        width: 87px;
        height: 87px;
      }
    }
  }
  .type{
    .copy{
      position: fixed;
      right: 0;
      bottom: 0;
    }
    .input{
      input{
        width: 100%;
        border: 0;
      }
    }
  }
</style>
