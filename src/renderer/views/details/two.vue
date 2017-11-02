<template>
  <div class="web-movie-detail">
    <a class="back-home centerVertical" @click="goBack">返回<br>主页</a>
    <div class="detail-wrapper eightdetail-wrapper">
      <h1 class="detail-title detail-title1">{{detailData.title}}</h1>
      <div class="detail-item">
        <div class="detail-item-content">
          <div class="center-img">
            <img :src="detailData.poster">
          </div>
        </div>
      </div>
      <div class="detail-item" v-if="detailData.video">
        <div class="detail-item-content">
          <iframe :src="detailData.video" class="video"></iframe>
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-item-content">
          <p class="p" v-for="item in detailData.info" v-html="item"></p>
        </div>
      </div>
      <div class="detail-item" v-if="detailData.download.length > 0">
        <div class="detail-item-title detail-item-title1 detail-item-title2">资源下载：</div>
        <div class="detail-item-content">
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>网盘链接</th>
                <th>密码</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailData.download">
                <td>{{item.href}}</td>
                <td>{{item.password}}</td>
                <td>
                  <a :href="item.href" target="_blank" class="btn">前往下载</a>
                  <a :data-clipboard-text="item.href" class="btn copy-btn">复制链接</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      detailData: {
        type: Object,
        default: function () {
          return {
            title: '',
            poster: '',
            info: [],
            video: '',
            download: []
          }
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      goBack () {
        document.querySelector('.detail-wrapper').scrollTop = 0
        this.$emit('go-back')
      }
    }
  }
</script>

<style lang="less" scoped>
  .threedetail-wrapper{
    padding-top: 20px !important;
  }
</style>
