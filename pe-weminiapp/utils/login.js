var app = getApp();
import ServiceUrl from './serviceUrl.js'
import Request from './request.js'
export default class Login {
  constructor() {

  }
  //微信登录
  static weChatLogin() {
    const that = this
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (loginok) {
          console.log('>Login Over -> ' + JSON.stringify(loginok))
          var code = loginok.code;
          var appid = 'wx299644ef4c9afbde';                 //填写微信小程序appid
          var secret = '7ba298224c1ae0f2f00301c8e5b312f7';  //填写微信小程序secret
          resolve(code)
          app.globalData.code = code;
        }
      })
    })
  }
  //获取用户信息
  static getUserInfo(cb) {
    const that = this
    return new Promise(function (resolve, reject) {
      wx.getUserInfo({
        success: function (res) {
          app.globalData.userInfo = res.userInfo
          resolve(res.userInfo)
          //console.log('获取用户信息:' + JSON.stringify(that.globalData.userInfo))
        }
      })
    })
  }
  //获取UnioID
  static getUnionId(code) {
    const that = this
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'jscode2session'
      const data = {
        code: app.globalData.code,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        language: app.globalData.userInfo.language,
        avatarUrl: app.globalData.userInfo.avatarUrl,
      }
      console.log(data)
      Request.postRequest(url, data).then(function (data) {
        console.log('获取UnioID' + JSON.stringify(data))
        resolve()
        const { unionid, openId, tarjeta, partyId } = data
        //设置全局unionid，openId
        app.globalData.openId = openId
        app.globalData.unicodeId = unionid
        app.globalData.tarjeta = tarjeta
        app.globalData.partyId = partyId
        wx.setStorageSync('AuthToken', tarjeta)
      })
    })
  }
  //查询我的已加入的公司信息
  static queryProductStoreAndRole(code) {
    const that = this
    const url = ServiceUrl.platformManager + 'queryProductStoreAndRole'
    const data = {
      openId: app.globalData.openId,
      appId :'wx299644ef4c9afbde'
    }
    console.log(data)
    return new Promise(function (resolve, reject) {
      Request.postRequest(url, data).then(function (data) {
        console.log('查询我的已加入的公司信息=>>>>>>>>' + JSON.stringify(data))
        const { isSalesRep, productStoreId, prodCatalogId,code} = data
        if (code==='200') {
          app.globalData.prodCatalogId = prodCatalogId
          app.globalData.productStoreId = productStoreId
          app.globalData.isSalesRep = isSalesRep
        }
        resolve()
        wx.hideLoading()
      })
    })
  }
  //登录
  static userLogin() {
    const that = this
    return new Promise(function (resolve, reject) {
      that.weChatLogin().then(
        function () {
          that.getUserInfo().then(
            function () {
              that.getUnionId().then(
                function () {
                  that.queryProductStoreAndRole().then(function(){
                    resolve()
                  })
                })
            }
          );
        }
      );
    })
  }
}