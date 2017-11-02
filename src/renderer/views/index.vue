<template>
  <div class="web-all">
    <home :searchData="searchData" :searchType="searchType" @get-detail="getDetail" @go-page="goPage"></home>
    <one v-if="type === '1'" :detailData="detail80s" @go-back="backHome"></one>
    <two v-if="type === '2'" :detailData="detailHf" @go-back="backHome"></two>
  </div>
</template>

<script>
  import home from './home.vue'
  import one from './details/one.vue'
  import two from './details/two.vue'

  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        isClick: false,
        type: ''
      }
    },
    components: {
      home,
      one,
      two
    },
    computed: {
      ...mapGetters(['searchData', 'searchType', 'detail80s', 'detailHf'])
    },
    methods: {
      ...mapActions(['isLoadTrue', 'changeRotateDeg', 'get80sDetail', 'getHfDetail', 'searchHf', 'searchDt']),
      getDetail (opt) {
        this.isLoadTrue(false)
        this.isClick = true
        this.type = opt.type
        if (this.type === '1') {
          this.get80sDetail(opt.href)
        } else if (this.type === '2') {
          this.getHfDetail(opt.href)
        }
      },
      backHome () {
        this.changeRotateDeg(0)
      },
      goPage (opt) {
        if (opt.type === '1') {
          this.searchHf({href: opt.href})
        } else if (opt.type === '2') {
          this.searchDt({href: opt.href})
        }
      }
    }
  }
</script>
