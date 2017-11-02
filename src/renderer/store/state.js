const state = {
  showTip: true,
  isLoad: false,
  rotateDeg: 0,
  searchData: {
    search80sData: [],
    searchHfData: null,
    searchDtData: null
  },
  keywords: '',
  searchType: '1',
  detail80s: {
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
  },
  detailHf: {
    title: '',
    poster: '',
    info: [],
    video: '',
    download: []
  }
}
export default state
