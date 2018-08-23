var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
  },

  //点击微信登陆
  bindGetUserInfo(e) {
    const that = this
    wx.login({
      success: res => {
        app.globalData.code = res.code
        if (e.detail.userInfo) {
          const { nickName, avatarUrl, gender } = e.detail.userInfo
          that.login(nickName, avatarUrl, gender, res.code)
        }
      }
    })
  },

  //登陆
  login: function (nickName, avatarUrl, gender, code) {
    $Toast({
      type: 'loading',
      duration: 0,
      mask: false
    });
    const that = this
    const url = ServiceUrl.platformManager + 'jscode2session'
    const data = {
      nickName: nickName,
      avatarUrl: avatarUrl,
      code: code,
      appId: app.globalData.appId,
      gender: gender
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('用户登陆=>>>>>>>>' + JSON.stringify(data))
      const { code, openId, tarjeta, tel, userInfo, partyId } = data
      if (code === '200') {
        app.globalData.openId = openId
        app.globalData.tarjeta = tarjeta
        app.globalData.userInfo = userInfo
        app.globalData.partyId = partyId
        that.queryProductStoreAndRole()
      }
    })
  },

  //查询我的店铺信息
  queryProductStoreAndRole: function () {
    const that = this
    const url = ServiceUrl.platformManager + 'queryProductStoreAndRole'
    const data = {
      openId: app.globalData.openId,
      appId: app.globalData.appId
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('查询我的店铺信息=>>>>>>>>' + JSON.stringify(data))
      const { code, productStoreId, prodCatalogId } = data
      if (code === '200') {
        app.globalData.productStoreId = productStoreId
        app.globalData.prodCatalogId = prodCatalogId
        wx.redirectTo({
          url: '/pages/home/home',
        })
      }
    })
  },

  onLoad: function () {

  },
});