import * as types from './mutation-types'

const mutations = {
  [types.CHANGE_SHOWTIP] (state, bol) {
    state.showTip = bol
  },
  [types.CHANGE_ISLOAD] (state, bol) {
    state.isLoad = bol
  },
  [types.CHANGE_ROTATEDEG] (state, deg) {
    state.rotateDeg = deg
  },
  [types.CHANGE_KEYWORDS] (state, data) {
    state.keywords = data
  },
  [types.CHANGE_SEARCHTYPE] (state, type) {
    state.searchType = type
  },
  [types.GETSEARCH80S] (state, data) {
    state.searchData.search80sData = data
  },
  [types.GETSEARCHHF] (state, data) {
    state.searchData.searchHfData = data
  },
  [types.GETSEARCHDT] (state, data) {
    state.searchData.searchDtData = data
  },
  [types.INIT_SEARCHDATA] (state) {
    state.searchData = {
      search80sData: [],
      searchHfData: null,
      searchDtData: null
    }
  },
  [types.GETDETAIL80S] (state, data) {
    state.detail80s = data
  },
  [types.GETDETAILHF] (state, data) {
    state.detailHf = data
  }
}

export default mutations
