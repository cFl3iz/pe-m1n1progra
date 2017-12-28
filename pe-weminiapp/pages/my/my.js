//mime.js
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    const that = this
    app.getUserInfo(function(data){
      that.setData({
        userInfo:data
      })
    })
  },
  //点击管理地址
  addressAdd(e) {
    wx.navigateTo({
      url: '../addressAdd/addressAdd'
    })
  },
  //点击查询物流信息
  deliveryInfo(e){
    wx.navigateTo({
      url: '../deliveryInfo/deliveryInfo'
    })
  }
})