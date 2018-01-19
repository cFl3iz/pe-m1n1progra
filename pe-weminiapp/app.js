import ServiceUrl from './utils/serviceUrl'
import Request from './utils/request.js'
const Towxml = require('/towxml/main');
const User = require('/utils/user');
const Pages = require('/utils/pages');
App({
  //初始化APP
  onLaunch: function () {
    console.log('启动APP')
  },
  towxml: new Towxml(),
  user: new User(),
  pages: new Pages(),
  set_page_more(tis, res) {
    if (res.data.total <= 0) {
      tis.setData({
        no_data: true,
        no_more: false,
        more: false,
      })
    }
    if (res.data.last_page == tis.data.page) {
      tis.setData({
        no_more: true,
        more: false,
        more_data: "没有更多了"
      })
    } else if (res.data.last_page > tis.data.page) {
      tis.setData({
        more: true,
      })
    }
    tis.setData({
      is_load: false
    })
  },
  //微信登陆授权
  weChatLogin: function () {
    console.log('微信登陆授权')
    const that = this
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (loginok) {
          var code = loginok.code;
          var appid = 'wx299644ef4c9afbde';                 //填写微信小程序appid
          var secret = '7ba298224c1ae0f2f00301c8e5b312f7';  //填写微信小程序secret
          resolve(code)
        }
      })
    })
  },
  //获取用户信息
  getUserInfo: function (cb) {
    console.log('获取用户信息')
    const that = this
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo=res.userInfo
        if (typeof cb === 'function') {
          cb && cb(res.userInfo)
        }
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    code: null,
    unicodeId: null,
    collectProduct: null
  }
})