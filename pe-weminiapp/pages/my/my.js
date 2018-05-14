//mime.js
var app = getApp()
import Login from '../../utils/login.js'
Page({
  data: {
    userInfo: {},
    isSalesRep: 'false'
  },
  onLoad: function () {
    app.editTabBar();//添加tabBar数据  
    this.setData({
      isSalesRep: app.globalData.isSalesRep
    })
    const that = this
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.showToast({
      title: '正在处理',
      icon: 'loading',
      duration: 2500
    })
    let userInfo = wx.getStorageSync('userInfo')
    // app.getUserInfo(function (data) { })
    if (userInfo!=null){
      that.setData({
        userInfo: userInfo
      })
    }
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
  //点击查询物流信息
  myOrder(e) {
    wx.navigateTo({
      url: '/pages/componyOrder/componyOrder'
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
    if (e.detail.userInfo){
      const { nickName, avatarUrl, gender } = e.detail.userInfo
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo
      })
      Login.updateGenericPersonInfo(nickName, avatarUrl, gender)
    }
  }
})