<template>
  <div id="app" class="flexbox">
    <div class="app-left flexbox flex-column">
      <div class="search-wrapper centerVertical">
        <form class="search-form flexbox">
          <select class="search-select flex1" v-model="searchType">
            <option value="3">DiggBT</option>
            <option value="1">80s</option>
            <option value="2">韩饭</option>
          </select>
          <input type="text" name="keywords" class="search-input flex1" placeholder="想看什么就搜一搜吧" v-model="keywords">
          <a class="search-btn centerVertical flex1" @click="searchOpt">搜索</a>
        </form>
      </div>
      <div class="weblist-wrapper flex1">
        <h2>搜索历史：<a class="clear-all" title="清空搜索历史记录" v-show="historyList.length > 0" @click="clearHistory">清空</a></h2>
        <div class="history-wrapper">
          <template v-if="historyList.length > 0">
            <a class="history-item" v-for="(item, index) in historyList" @click="searchThis(item)">{{item}}<span class="clear-this" @click.stop="chearThis(index)">X</span></a>
          </template>
          <p v-else>暂无搜索记录</p>
        </div>
      </div>
    </div>
    <div class="app-right flexbox flex-column">
      <div class="webtitle-wrapper border-bottom">
        <div class="header">
          <a class="header-btn close" @click="closeWindow">x</a>
          <a class="header-btn small" @click="hideWindow">_</a>
        </div>
        <h2 class="webtitle">搜索结果</h2>
        <a class="init-home" @click="initHome">首页</a>
      </div>
      <div class="web-wrapper flex1">
        <div class="tip-wrapper" v-show="showTip">
          <h2>提示：</h2>
          <h3>1、DiggBT-免费的BT种子搜索神器、P2P种子搜索器、万能BT种子搜索下载神器、磁力链接搜索下载。</h3>
          <h3>2、80s-高清手机电影迅雷下载_最新MP4电视剧磁力下载</h3>
          <h3>3、韩饭-韩国娱乐新闻、综艺、KPOP、韩剧</h3>
          <h3>4、推荐使用DiggBT搜索</h3>
          <h3>5、使用80s搜索或者韩饭搜索时，有时会出现白屏现象，程序性能待优化</h3>
        </div>
        <div class="load-wrapper" v-show="!isLoad"></div>
        <div class="transform-wrapper" v-show="isLoad" 
          :style="{ transform: 'rotateY(' + rotateDeg + 'deg)' }"
          :class="[ rotateDeg === 0 ? 'front' : 'back' ]">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { ipcRenderer } from 'electron'

  import Clipboard from 'clipboard'
  import FUNC from './assets/js/common.js'

  export default {
    name: 'app',
    data () {
      return {
        keywords: '',
        searchType: '3',
        historyList: FUNC.getStorage('historyList') ? FUNC.getStorage('historyList').split(':::') : []
      }
    },
    computed: {
      ...mapGetters(['showTip', 'isLoad', 'rotateDeg'])
    },
    mounted () {
      let that = this

      document.onkeydown = function (e) {
        if (e && e.keyCode === 13) {
          that.searchOpt()
        }
      }

      let clipboard = new Clipboard('.copy-btn')

      clipboard.on('success', function (e) {
        FUNC.toast('复制链接成功')
        e.clearSelection()
      })

      clipboard.on('error', function (e) {
        FUNC.toast('复制链接失败')
      })
    },
    methods: {
      ...mapActions(['search80s', 'searchHf', 'searchDt']),
      ...mapMutations({
        isLoadTrue: 'CHANGE_ISLOAD',
        changeShowTip: 'CHANGE_SHOWTIP',
        changeKeywords: 'CHANGE_KEYWORDS',
        changeSearchType: 'CHANGE_SEARCHTYPE',
        changeRotatedeg: 'CHANGE_ROTATEDEG',
        initSearchData: 'INIT_SEARCHDATA'
      }),
      initHome () {
        this.changeRotatedeg(0)
        this.isLoadTrue(true)
        this.initSearchData()
        this.changeShowTip(true)
      },
      saveHistory (keywords) {
        for (let i = 0, len = this.historyList.length; i < len; i++) {
          if (keywords === this.historyList[i]) {
            this.historyList.splice(i, 1)
            break
          }
        }
        if (this.historyList.length >= 20) {
          this.historyList.pop()
        }
        this.historyList.splice(0, 0, keywords)
        FUNC.setStorage('historyList', this.historyList.join(':::'))
      },
      clearHistory () {
        this.historyList = []
        FUNC.delStorage('historyList')
      },
      chearThis (index) {
        this.historyList.splice(index, 1)
        FUNC.setStorage('historyList', this.historyList.join(':::'))
      },
      searchThis (keywords) {
        this.keywords = keywords
        this.searchOpt()
      },
      searchOpt () {
        if (!this.isLoad && !this.showTip) {
          return
        }
        if (!this.keywords) {
          FUNC.toast('请输入关键词')
          return
        }
        this.changeShowTip(false)
        this.isLoadTrue(false)
        this.changeKeywords(this.keywords)
        this.changeSearchType(this.searchType)
        if (this.searchType === '1') {
          this.search80s(this.keywords)
          .then((results) => {
            this.isLoadTrue(true)
            this.saveHistory(this.keywords)
          })
        } else if (this.searchType === '2') {
          this.searchHf({keywords: this.keywords})
          .then((results) => {
            this.isLoadTrue(true)
            this.saveHistory(this.keywords)
          })
        } else if (this.searchType === '3') {
          this.searchDt({keywords: this.keywords})
          .then((results) => {
            this.isLoadTrue(true)
            this.saveHistory(this.keywords)
          })
        }
      },
      closeWindow () {
        ipcRenderer.send('close-window')
      },
      hideWindow () {
        ipcRenderer.send('hide-window')
      }
    }
  }
</script>

<style lang="less">
html, body, #app{
  width: 1100px;
  height: 700px;
  position: relative;
}
#app{
  .app-left{
    width: 300px;
    padding: 10px 15px;
    background-color: #ECEAE8;
    .search-wrapper{
      height: 70px;
      .search-form{
        width: 100%;
        height: 40px;
        border: 1px solid #ccc;
        .search-select, .search-input{
          font-size: 12px;
          padding: 0 5px;
          border: none;
          outline: none;
          background-color: transparent;
        }
        .search-select{
          width: 80px;
        }
        .search-btn{
          width: 40px;
          font-size: 12px;
          &:hover{
            color: #000;
          }
        }
      }
    }
    .weblist-wrapper{
      overflow-y: auto;
      h2{
        font-size: 14px;
        font-weight: normal;
        position: relative;
        .clear-all{
          position: absolute;
          right: 0px;
          top: 0px;
          font-weight: normal;
          font-size: 12px;
          padding: 1px 3px;
        }
      }
      p{
        font-size: 12px;
        margin-top: 10px;
        margin-left: 10px;
      }
      .history-wrapper{
        font-size: 12px;
        .history-item{
          display: block;
          margin-left: 10px;
          margin-top: 10px;
          position: relative;
          &:hover{
            .clear-this{
              display: block;
            }
          }
          .clear-this{
            display: none;
            position: absolute;
            right: 7px;
            top: 1px;
            height: 18px;
            width: 18px;
            font-size: 12px;
            line-height: 17px;
            text-align: center;
            background-color: #444;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }
  .app-right{
    width: 800px;
    background-color: #f5f5f5;
    .webtitle-wrapper{
      position: relative;
      padding: 25px 15px 15px;
      .header{
        position: absolute;
        width: 100%;
        height: 25px;
        top: 0;
        left: 0;
        z-index: 100;
        overflow: hidden;
        .header-btn{
          float: right;
          width: 40px;
          height: 100%;
          text-align: center;
          color: #444;
          &.close{
            line-height: 25px;
            &:hover{
              background-color: #444;
              color: #fff;
            }
          }
          &.small{
            width: 30px;
            font-weight: bold;
            line-height: 10px;
            font-size: 18px;
            &:hover{
              background-color: #999;
              color: #fff;
            }
          }
        }
      }
      h2{
        font-weight: normal;
        font-size: 18px;
      }
      .init-home{
        position: absolute;
        right: 15px;
        bottom: 15px;
        font-size: 12px;
      }
    }
    .web-wrapper{
      overflow: hidden;
      .load-wrapper{
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100px 100px;
        background-image: url(./assets/imgs/loading.gif)
      }
      .tip-wrapper{
        height: 100%;
        text-align: left;
        padding: 0 8%;
        h2{
          margin-top: 8%;
          font-weight: normal;
        }
        h3{
          margin-top: 20px;
          font-weight: normal;
        }
      }
      .transform-wrapper{
        height: 100%;
        transition: all 0.8s;
        &.front{
          .web-all{
            .web-movie-home{
              z-index: 10;
              background-color: #f5f5f5;
            }
            .web-movie-detail{
              z-index: 5;
            }
          }
        }
        &.back{
          .web-all{
            .web-movie-home{
              z-index: 5;
            }
            .web-movie-detail{
              z-index: 10;
              background-color: #f5f5f5;
            }
          }
        }
        .web-all{
          position: relative;
          height: 100%;
          .web-movie-home, .web-movie-detail{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-color: transparent;
            transition: all 0.8s;
          }
          .web-movie-home{
            z-index: 10;
            padding: 0 20px 30px;
            overflow-y: auto;
            -webkit-overflow-scrolling : touch;
          }
          .web-movie-detail{
            z-index: 5;
            transform: rotateY(-180deg);
            overflow: hidden;
            .detail-wrapper{
              height: 100%;
              padding: 0 20px 30px;
              overflow-y: auto;
              -webkit-overflow-scrolling : touch;
              &.detail-wrapper1{
                overflow: hidden;
                padding: 0;
              }
              .iframe{
                width: 100%;
                height: 100%
              }
            }
            .back-home{
              position: fixed;
              right: 25px;
              bottom: 80px;
              z-index: 100;
              width: 50px;
              height: 50px;
              background-color: rgba(0, 0, 0, 0.6);
              border-radius: 50%;
              color: #fff;
              font-size: 12px; 
              &:hover{
                background-color: #000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
