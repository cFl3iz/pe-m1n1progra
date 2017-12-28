import ServiceUrl from './utils/serviceUrl'
import Request from './utils/request.js'
App({
  //初始化APP
  onLaunch: function () {
    console.log('启动APP')
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