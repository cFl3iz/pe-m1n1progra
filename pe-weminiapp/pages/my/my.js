//mime.js
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    const that = this
    // app.getUserInfo(function (data) { })
      that.setData({
        userInfo: app.globalData.userInfo
      })
    
  },
  //点击管理地址
  addressAdd(e) {
    // wx.navigateTo({
    //   url: '../addressAdd/addressAdd'
    // })
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
  myResources(e){
    wx.navigateTo({
      url: '../myProduct/myProduct'
    })
  }
})