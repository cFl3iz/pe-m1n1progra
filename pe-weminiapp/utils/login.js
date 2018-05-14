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
          // var appid = 'wx1106576d138cd8e6';                 //填写微信小程序appid
          // var secret = '2bc06469373b6d6b5a5c92cea41ce9da';  //填写微信小程序secret
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
        const {code}=data
        if(code==='200'){
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
        nickName: '未认证用户',
        gender: '1',
        language: 'zh_CN',
        avatarUrl: ' https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/serviceSales/default_person.png ',
        appId: app.globalData.appId
      }
      //console.log(data)
      Request.postRequest(url, data).then(function (data) {
        console.log('获取UnioID' + JSON.stringify(data))
        const { unionid, openId, tarjeta, partyId, personInfo} = data
        if (personInfo.firstName!=='未认证用户'){
          const userInfo={};
          userInfo.nickName = personInfo.firstName;
          userInfo.avatarUrl = personInfo.headPortrait;
          wx.setStorageSync('userInfo', userInfo)
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
        const { isSalesRep, productStoreId, prodCatalogId, code } = data
        if (code === '200') {
          app.globalData.prodCatalogId = prodCatalogId
          app.globalData.productStoreId = productStoreId
          app.globalData.isSalesRep = isSalesRep
        }
        resolve(isSalesRep)
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
              that.queryProductStoreAndRole().then(function () {
                resolve()
              })
            })
        }
      );
    })
  }
}