import ServiceUrl from './utils/serviceUrl'
import Request from './utils/request.js'
const Towxml = require('/towxml/main');
const User = require('/utils/user');
const Pages = require('/utils/pages');
App({
  //初始化APP
  onLaunch: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        // console.log('latitude=' + latitude)
        // console.log('longitude=' + longitude)
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;
      }
    }) 


    console.log('启动APP')
    wx.onUserCaptureScreen(function (res) {
      wx.showModal({
        title: '提示',
        content: '你截屏想给谁看?要我帮你打开分享吗?',
        success: function (res) {
          if (res.confirm) { 
          } else if (res.cancel) { 
          }
        }
      })
    })
   
    this.weChatLogin().then(
      function(){ 
        that.getUserInfo().then(
          function(){ 
          //  console.log('>>>>>>>>>>>>>global data  code = ' + that.globalData.code );
            that.getUnionId(that.globalData.code)
          }
        );
      }
    ); 
 
  },
  towxml: new Towxml(),
  user: new User(),
  pages: new Pages(),
  set_page_more(tis, res) {
    console.log('res.total=' + res.total)
    console.log('tis.data.page=' + tis.data.page)
    var flag = (tis.data.page == res.total)
    if (res.total <= 0) {
      tis.setData({
        no_data: true,
        no_more: false,
        more: false,
      })
    }
    if (flag) {
      console.log('in this fun !!!!!!!!!!')
      tis.setData({
        no_more: true,
        more: false,
        more_data: "没有更多了"
      })
    } else if (res.last_page > tis.data.page) {
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
          console.log('>Login Over -> ' + JSON.stringify(loginok))
          var code = loginok.code;
          var appid = 'wx299644ef4c9afbde';                 //填写微信小程序appid
          var secret = '7ba298224c1ae0f2f00301c8e5b312f7';  //填写微信小程序secret
          resolve(code)
          that.globalData.code = code;
        }
      })
    })
  },
  //每次真的要用了再拿
  getUnionId: function (code) {
    // console.log('获取unicodeId' + code)
    const that = this
    const url = ServiceUrl.platformManager + 'jscode2session'
    const data = {
      code: code,
      nickName: that.globalData.userInfo.nickName,
      gender: that.globalData.userInfo.gender,
      language: that.globalData.userInfo.language,
      avatarUrl: that.globalData.userInfo.avatarUrl
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('设置全局unicodeId = ' + data)
      const unicodeId = data
      that.globalData.unicodeId = unicodeId //设置全局unicodeId
      // return unicodeId
    })
    // .then(function (data) {
    //   that.get_data(data)
    // })
  },
  //获取用户信息
  getUserInfo: function (cb) {
    const that = this
    return new Promise(function (resolve, reject){
      console.log('获取用户信息') 
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          resolve(res.userInfo)
          console.log('当前登录用户:' + JSON.stringify(that.globalData.userInfo.nickName))
        }
      })
    })
  
  },
  //全局变量
  globalData: {
    userInfo: null,
    code: null,
    unicodeId: null,
    collectProduct: null,
    latitude:null,
    longitude:null
  }
})