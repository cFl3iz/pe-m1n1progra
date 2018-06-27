var app = getApp();
import ServiceUrl from './serviceUrl.js'
import Request from './request.js'
export default class Login {
  constructor() {

  }
  //微信登录获取code
  static weChatLogin() {
    const that = this
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (loginok) {
          console.log('微信登录获取code======>>>> ' + JSON.stringify(loginok))
          var code = loginok.code;
          resolve(code)
          app.globalData.code = code;
        }
      })
    })
  }
  //更新用户信息
  static updateGenericPersonInfo(name, imgPath, gender) {
    const that = this
    const url = ServiceUrl.platformManager + 'updateGenericPersonInfo'
    const data = {
      tarjeta: app.globalData.tarjeta,
      name: name,
      imgPath: imgPath,
      gender: gender
    }
    console.log(data)
    return new Promise(function (resolve, reject) {
      Request.postRequest(url, data).then(function (data) {
        console.log('更新用户信息=>>>>>>>>' + JSON.stringify(data))
        const { code } = data
        if (code === '200') {
          const userInfo = {};
          userInfo.nickName = name;
          userInfo.avatarUrl = imgPath;
          wx.setStorageSync('userInfo', userInfo)
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
        nickName: app.globalData.userInfo ? app.globalData.userInfo.nickName : '',
        gender: app.globalData.userInfo ? app.globalData.userInfo.gender : '',
        language: app.globalData.userInfo ? app.globalData.userInfo.language : '',
        avatarUrl: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '',
        appId: app.globalData.appId
      }
      console.log(data)
      Request.postRequest(url, data).then(function (data) {
        console.log('获取UnioID' + JSON.stringify(data))
        const { unionid, openId, tarjeta, partyId, personInfo } = data
        if (personInfo && personInfo.firstName !== '匿名') {
          const userInfo = {};
          userInfo.nickName = personInfo.firstName;
          userInfo.avatarUrl = personInfo.headPortrait;
          app.globalData.userInfo = userInfo
        }
        //设置全局unionid，openId
        app.globalData.openId = openId
        app.globalData.unicodeId = unionid
        app.globalData.tarjeta = tarjeta
        app.globalData.partyId = partyId
        wx.setStorageSync('AuthToken', tarjeta)
        resolve()
      })
    })
  }
  //查询小程序服务对象数据(tabbar)
  static queryMiniAppConfig(code) {
    const that = this
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'queryMiniAppConfig'
      const data = {
        appId: app.globalData.appId
      }
      Request.postRequest(url, data).then(function (data) {
        console.log('查询小程序服务对象数据=>>>>>>>>' + JSON.stringify(data))
        const { code, appContentDataResource } = data
        let tabBar = appContentDataResource.MINIPROGRAM_TBAR ? appContentDataResource.MINIPROGRAM_TBAR[0] : null
        if (code === '200') {
          app.globalData.appContentDataResource = appContentDataResource
          app.globalData.tabBar = tabBar
          resolve()
        }
      })
    })
  }
  //查询我的已加入的公司信息
  static queryProductStoreAndRole(code) {
    const that = this
    const url = ServiceUrl.platformManager + 'queryProductStoreAndRole'
    const data = {
      openId: app.globalData.openId,
      appId: app.globalData.appId
    }
    console.log(data)
    return new Promise(function (resolve, reject) {
      Request.postRequest(url, data).then(function (data) {
        console.log('查询我的已加入的公司信息=>>>>>>>>' + JSON.stringify(data))
        const { isSalesRep, productStoreId, prodCatalogId, code, qrPath, storePromos, appName, isDemoStore, appServiceType, hasShoppingCart, pay_media} = data
        if (code === '200') {
          app.globalData.prodCatalogId = prodCatalogId
          app.globalData.productStoreId = productStoreId
          app.globalData.isSalesRep = isSalesRep
          app.globalData.qrPath = qrPath
          app.globalData.storePromos = storePromos          //促销
          app.globalData.appName = appName                  //AppName
          app.globalData.isDemo = isDemoStore === 'false' ? false : true               //是否是DEMO
          app.globalData.serviceType = appServiceType       //服务2B，2C
          app.globalData.hasShoppingCart = hasShoppingCart === 'false' ? false : true   //是否需要购物车
          app.globalData.collectionQrCode = 'https://'+pay_media
          resolve()
        }
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
          that.getUnionId().then(
            function () {
              that.queryProductStoreAndRole().then(
                function () {
                  that.queryMiniAppConfig().then(function () {
                    resolve()
                  })
                })
            })
        }
      );
    })
  }
}