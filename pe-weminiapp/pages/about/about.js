//mime.js
var app = getApp()
import Login from '../../utils/login.js'
Page({
  data: {
    userInfo: {},
    isSalesRep: 'false',
    hasShoppingCart:true
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    app.editTabBar();//添加tabBar数据  
    this.setData({
      isSalesRep: app.globalData.isSalesRep,
      userInfo: app.globalData.userInfo,
      hasShoppingCart: app.globalData.hasShoppingCart
    })
    wx.hideLoading()
  },
  //点击管理地址
  addressAdd(e) {
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  //点击查询订单
  myOrder(e) {
    wx.navigateTo({
      url: '/pages/orders/orders'
    })
  },
  //点击查询购物车
  shoppingCart(e) {
    wx.navigateTo({
      url: '/pages/shoppingCart/shoppingCart'
    })
  },
  //联系我们
  callNumber: function () {
    wx.makePhoneCall({
      phoneNumber: '15618323607' //仅为示例，并非真实的电话号码
    })
  },
  //微信授权
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      const { nickName, avatarUrl, gender } = e.detail.userInfo
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo
      })
      Login.updateGenericPersonInfo(nickName, avatarUrl, gender)
    }
  }
})