var cheerio = require('cheerio')
var superagent = require('superagent')
require('superagent-charset')(superagent)
// var http = require('http')
var https = require('https')

export const isLoadTrue = ({ commit }, bol) => {
  commit('CHANGE_ISLOAD', bol)
}

export const changeRotateDeg = ({ commit }, deg) => {
  commit('CHANGE_ROTATEDEG', deg)
}

export const search80s = ({ commit }, keywords) => {
  return new Promise((resolve, reject) => {
    let searchData = []
    superagent.post('https://www.80s.tt/search')
      .send({keyword: keywords})
      .end(function (err, sres) {
        if (!err) {
          let $ = cheerio.load(sres.text, {decodeEntities: false})
          $('.list-group-item').each(function (idx, element) {
            let $element = $(element)
            searchData.push({
              title: $element.find('.search-list-img').attr('alt'),
              subTitle: $element.find('em').html(),
              href: 'https://www.80s.tt' + $element.attr('href'),
              poster: $element.find('.search-list-img').attr('src')
            })
          })
        }
        commit('GETSEARCH80S', searchData)
        resolve(searchData)
      })
  })
}

export const get80sDetail = ({ commit }, href) => {
  let detail = {
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
  https.get(href, function (res) {
    let html = ''
    res.setEncoding('utf-8')
    res.on('data', function (chunk) {
      html += chunk
    })
    res.on('end', function () {
      let $ = cheerio.load(html, {decodeEntities: false})
      detail.title = $('h1').html()
      detail.subTitle = $('#movie_tip').html()
      detail.poster = $('#poster a').attr('href')
      detail.description = $('#movie_description').html()
      $('.movie-info a').removeAttr('href')
      detail.info = ($('.movie-info').eq(0).html() + $('.movie-info').eq(1).html()).replace(/豆瓣评论/g, '<br>')
      detail.screenshot = $('.img-responsive.img-thumbnail').attr('src')

      $('.panel.panel-quality-5').each(function (idx, element) {
        let $element = $(element)
        $element.find('.row').each(function (idx, element1) {
          let $element1 = $(element1)
          detail.higher.push({
            name: $element1.find('.td-dl-links a').html(),
            format: $element1.find('.label-quality-5').html(),
            size: $element1.find('.label-filesize').html(),
            link: $element1.find('.td-dl-links a').attr('href')
          })
        })
      })

      $('.panel.panel-quality-4').each(function (idx, element) {
        let $element = $(element)
        $element.find('.row').each(function (idx, element1) {
          let $element1 = $(element1)
          detail.high.push({
            name: $element1.find('.td-dl-links a').html(),
            format: $element1.find('.label-quality-4').html(),
            size: $element1.find('.label-filesize').html(),
            link: $element1.find('.td-dl-links a').attr('href')
          })
        })
      })

      $('.panel.panel-quality-3').each(function (idx, element) {
        let $element = $(element)
        $element.find('.row').each(function (idx, element1) {
          let $element1 = $(element1)
          detail.normal.push({
            name: $element1.find('.td-dl-links a').html(),
            format: $element1.find('.label-quality-3').html(),
            size: $element1.find('.label-filesize').html(),
            link: $element1.find('.td-dl-links a').attr('href')
          })
        })
      })

      $('.panel.panel-quality-2').each(function (idx, element) {
        let $element = $(element)
        $element.find('.row').each(function (idx, element1) {
          let $element1 = $(element1)
          detail.low.push({
            name: $element1.find('.td-dl-links a').html(),
            format: $element1.find('.label-quality-2').html(),
            size: $element1.find('.label-filesize').html(),
            link: $element1.find('.td-dl-links a').attr('href')
          })
        })
      })

      $('.panel.panel-quality-1').each(function (idx, element) {
        let $element = $(element)
        $element.find('.row').each(function (idx, element1) {
          let $element1 = $(element1)
          detail.bad.push({
            name: $element1.find('.td-dl-links a').html(),
            format: $element1.find('.label-quality-1').html(),
            size: $element1.find('.label-filesize').html(),
            link: $element1.find('.td-dl-links a').attr('href')
          })
        })
      })

      commit('GETDETAIL80S', detail)
      commit('CHANGE_ISLOAD', true)
      commit('CHANGE_ROTATEDEG', 180)
    })
  }).on('error', function (err) {
    console.log(err)
    commit('GETDETAIL80S', detail)
    commit('CHANGE_ISLOAD', true)
    commit('CHANGE_ROTATEDEG', 180)
  })
}

let getHfData = function (err, sres) {
  let searchData = {
    data: [],
    pageData: [],
    totalPage: '1'
  }
  if (!err) {
    let $ = cheerio.load(sres.text, {decodeEntities: false})
    $('.excerpt').each(function (idx, element) {
      let $element = $(element)
      searchData.data.push({
        title: $element.find('.focus img').attr('alt'),
        subTitle: $element.find('.meta .pv').html(),
        poster: $element.find('.focus img').attr('data-src'),
        href: $element.find('.focus').attr('href')
      })
    })
    $('.pagination li').each(function (idx, element) {
      var $element = $(element)
      if ($element.hasClass('active')) {
        searchData.pageData.push({
          page: $element.find('span').html(),
          name: $element.find('span').html(),
          isCurrent: true
        })
      } else {
        if ($element.children().is('a')) {
          let page = $element.find('a').attr('href').replace(/http:\/\/www.hanfan.cc\//g, '').replace(/page\//g, '').replace(/\//g, '')
          if (!page) {
            page = '1'
          }
          searchData.pageData.push({
            page: page,
            name: $element.find('a').html(),
            href: $element.find('a').attr('href'),
            isCurrent: false
          })
        }
      }
    })
    searchData.totalPage = $('.pagination li').last().find('span').html()
  }
  return searchData
}

export const searchHf = ({ commit }, options) => {
  return new Promise((resolve, reject) => {
    if (options.href) {
      superagent.get(options.href)
        .end(function (err, sres) {
          let searchData = getHfData(err, sres)
          resolve(searchData)
          commit('GETSEARCHHF', searchData)
        })
    } else {
      superagent.post('http://www.hanfan.cc/')
        .query({s: options.keywords})
        .end(function (err, sres) {
          let searchData = getHfData(err, sres)
          resolve(searchData)
          commit('GETSEARCHHF', searchData)
        })
    }
  })
}

export const getHfDetail = ({ commit }, href) => {
  superagent.get(href)
    .end(function (err, sres) {
      let detail = {
        title: '',
        poster: '',
        info: [],
        video: '',
        download: []
      }
      if (!err) {
        let $ = cheerio.load(sres.text, {decodeEntities: false})
        detail.title = $('.article-title a').html()
        detail.poster = $('.article-content img').eq(0).attr('src')
        detail.video = $('.article-content iframe').attr('src')

        let part = $('.part_content .part').eq(1)
        if (part.html()) {
          $('.part_content .part strong').remove()
          $('.part_content .part br').remove()
          part.find('a').each(function (idx, element) {
            let $element = $(element)
            detail.download.push({href: $element.attr('href')})
          })
          $('.part_content .part a').remove()
          let partHtml = part.html().replace(/(天使_TSKS：)|(幻想乐园：)|(\|)|(\s)/g, '').split('密码')
          let k = 0
          for (let i = 1; i < partHtml.length; i++) {
            if (partHtml[i] && detail.download[k]) {
              detail.download[k].password = partHtml[i]
              k++
            }
          }
        }
        $('.article-content center').remove()
        $('.article-content div').remove()
        $('.article-content img').remove()
        $('.article-content p').each(function (idx, element) {
          let $element = $(element)
          if ($element.is('p')) {
            detail.info.push($element.html())
          }
        })
      }
      commit('GETDETAILHF', detail)
      commit('CHANGE_ISLOAD', true)
      commit('CHANGE_ROTATEDEG', 180)
    })
}

let getDtData = function (err, sres) {
  let searchData = {
    data: [],
    pageData: [],
    totalPage: '1'
  }
  if (!err) {
    let $ = cheerio.load(sres.text, {decodeEntities: false})
    $('.list-area .item').each(function (idx, element) {
      let $element = $(element)
      searchData.data.push({
        title: $element.find('.item-title a').html(),
        subTitle: $element.find('.item-title .category').html(),
        href: $element.find('.item-title a').attr('href'),
        download: $element.find('.item-detail span').eq(0).find('a').attr('href'),
        downloadType: $element.find('.item-detail span').eq(0).find('a').html(),
        time: $element.find('.item-detail span').eq(1).html().replace(/收录日期:/g, ''),
        size: $element.find('.item-detail span').eq(2).html().replace(/大小:/g, ''),
        num: $element.find('.item-detail span').eq(3).html().replace(/文件数:/g, ''),
        speed: $element.find('.item-detail span').eq(4).html().replace(/速度:/g, '')
      })
    })
    $('.pagination').children().each(function (idx, element) {
      let $element = $(element)
      if (idx === 0) {
        searchData.totalPage = $element.html()
      }
      if ($element.is('a')) {
        searchData.pageData.push({
          name: $element.html().replace(/»/g, '尾页').replace(/«/g, '首页'),
          href: $element.attr('href'),
          isCurrent: false
        })
      }
      if ($element.is('strong')) {
        searchData.pageData.push({
          name: $element.html(),
          href: '',
          isCurrent: true
        })
      }
    })
  }
  return searchData
}

export const searchDt = ({ commit }, options) => {
  return new Promise((resolve, reject) => {
    if (options.href) {
      superagent.get(options.href)
        .end(function (err, sres) {
          let searchData = getDtData(err, sres)
          commit('GETSEARCHDT', searchData)
          resolve(searchData)
        })
    } else {
      superagent.post('http://diggbt.fyi/')
        .send({keyword: options.keywords})
        .type('form')
        .end(function (err, sres) {
          let searchData = getDtData(err, sres)
          commit('GETSEARCHDT', searchData)
          resolve(searchData)
        })
    }
  })
}
