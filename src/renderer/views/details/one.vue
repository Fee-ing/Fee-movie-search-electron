<template>
  <div class="web-movie-detail">
    <a class="back-home centerVertical" @click="goBack">返回<br>主页</a>
    <div class="detail-wrapper">
      <h1 class="detail-title" v-html="detailData.title"></h1>
      <div class="info-wrapper flexbox">
        <div class="info-left">
          <img :src="detailData.poster">
        </div>
        <div class="info-right flex1" v-html="detailData.info"></div>
      </div>
      <div class="detail-item">
        <div class="detail-item-title">剧情简介：</div>
        <div class="detail-item-content" v-html="detailData.description"></div>
      </div>
      <div class="detail-item">
        <div class="detail-item-title">影片截图：</div>
        <div class="detail-item-content">
          <img :src="detailData.screenshot">
        </div>
      </div>
      <div class="detail-item">
        <h2 class="download-title">资源下载</h2>
        <template v-if="detailData.higher.length > 0">
          <div class="detail-item-title detail-item-title1">超清：</div>
          <div class="detail-item-content">
            <table border="1" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="width400">资源名称</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailData.higher">
                  <td class="width400">{{item.name}}</td>
                  <td>{{item.format}}</td>
                  <td>{{item.size}}</td>
                  <td>
                    <a :href="item.link" class="btn">迅雷下载</a>
                    <a :data-clipboard-text="item.link" class="btn copy-btn">复制下载链接</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-if="detailData.high.length > 0">
          <div class="detail-item-title detail-item-title1">高清：</div>
          <div class="detail-item-content">
            <table border="1" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="width400">资源名称</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailData.high">
                  <td class="width400">{{item.name}}</td>
                  <td>{{item.format}}</td>
                  <td>{{item.size}}</td>
                  <td>
                    <a :href="item.link" class="btn">迅雷下载</a>
                    <a :data-clipboard-text="item.link" class="btn copy-btn">复制下载链接</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-if="detailData.normal.length > 0">
          <div class="detail-item-title detail-item-title1">标清：</div>
          <div class="detail-item-content">
            <table border="1" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="width400">资源名称</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailData.normal">
                  <td class="width400">{{item.name}}</td>
                  <td>{{item.format}}</td>
                  <td>{{item.size}}</td>
                  <td>
                    <a :href="item.link" class="btn">迅雷下载</a>
                    <a :data-clipboard-text="item.link" class="btn copy-btn">复制下载链接</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-if="detailData.low.length > 0">
          <div class="detail-item-title detail-item-title1">清晰：</div>
          <div class="detail-item-content">
            <table border="1" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="width400">资源名称</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailData.low">
                  <td class="width400">{{item.name}}</td>
                  <td>{{item.format}}</td>
                  <td>{{item.size}}</td>
                  <td>
                    <a :href="item.link" class="btn">迅雷下载</a>
                    <a :data-clipboard-text="item.link" class="btn copy-btn">复制下载链接</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-if="detailData.bad.length > 0">
          <div class="detail-item-title detail-item-title1">流畅：</div>
          <div class="detail-item-content">
            <table border="1" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="width400">资源名称</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailData.bad">
                  <td class="width400">{{item.name}}</td>
                  <td>{{item.format}}</td>
                  <td>{{item.size}}</td>
                  <td>
                    <a :href="item.link" class="btn">迅雷下载</a>
                    <a :data-clipboard-text="item.link" class="btn copy-btn">复制下载链接</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
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
            subTitle: '',
            poster: '',
            description: '',
            info: '',
            screenshot: '',
            bad: [],
            low: [],
            normal: [],
            high: [],
            higher: []
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
