import ServiceUrl from './utils/serviceUrl'
import Request from './utils/request.js'
const Towxml = require('/towxml/main');
const User = require('/utils/user');
const Pages = require('/utils/pages'); 
App({
  //Initial App
  onLaunch: function () {
    var that = this

    

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy 
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;
      },
      fail:function(){
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy
            that.globalData.latitude = latitude;
            that.globalData.longitude = longitude;
          } 
        }) 
      }
    }) 


    console.log('START-APP')
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
   
    //LOGIN->GET USER INFO -> GET UNIO_ID
    this.weChatLogin().then(
      function(){ 
        that.getUserInfo().then(
          function(){  
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
  //Wx Login
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
  //Get Unio Id
  getUnionId: function (code) { 
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
      console.log('Global Data unio_Id = ' + data)
      const unicodeId = data
      that.globalData.unicodeId = unicodeId  
    
      //查询用户联系手机、邮政地址。
       that.findUserContactInfo(unicodeId) 
    })
    
  },
  findUserContactInfo:function(unioId){
    var that = this
    const data = {
      unioId: unioId
    }

    Request.postRequest('https://www.yo-pe.com/api/common/getUserContactInfo', data).then
      (
      function (data) {

        console.log('data=' + JSON.stringify(data))

        if (data.code == 200) {
          that.globalData.contactInfo = data.contactInfo 
        } else {

        }

      }
      ) 
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
          console.log('当前登录用户:' + JSON.stringify(that.globalData.userInfo))
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
    longitude:null,
    contactInfo:null
  }
})