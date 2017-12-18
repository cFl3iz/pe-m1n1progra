//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //获取用户信息
  getUserInfo: function (cb) {
    var that = this
    if (wx.getStorageSync('userInfo')) {
      typeof cb == "function" && cb(wx.getStorageSync('userInfo'))
    } else {
      wx.login({
        success: function (loginok) {
          var code = loginok.code;
          var appid = 'wx299644ef4c9afbde'; //填写微信小程序appid
          var secret = '7ba298224c1ae0f2f00301c8e5b312f7'; //填写微信小程序secret
          var openid = null;
          var unionid = '';
          //调用request请求api转换登录凭证
          wx.getUserInfo({
            success: function (res) {
              //保存微信数据到本地
              wx.setStorage({
                key: 'userInfo',
                data: res.userInfo,
              })
              // var getopenidurl='https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code';
              //  var getopenidurl = "http://www.lyndonspace.com:3400/wechatminiprogram/control/jscode2session";
              var getopenidurl = "https://www.yo-pe.com/" + code + "/jscode2session/";
              //"https://www.yo-pe.com/wechatminiprogram/control/jscode2session";
              wx.request({
                url: getopenidurl,
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (response) {
                  //保存OPENID到本地
                  wx.setStorage({
                    key: 'openId',
                    data: response.data,
                  })
                }
              });
            }
          })
        }
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    openId: null
  }
})