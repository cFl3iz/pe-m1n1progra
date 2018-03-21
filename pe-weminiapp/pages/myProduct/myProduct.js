import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
Page({
  data: {
    myProductList: [],
    touchStartTime: '',
    touchEndTime: ''
  },
  onLoad: function (options) {
    this.runderList()
  },
  editProduct:function(e){
    if (this.data.touchEndTime - this.data.touchStartTime < 350) {
    var productid = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '../editProduct/editProduct?productid='+ productid,
    })
    }
  },
  /// 按钮触摸开始
  touchStart: function (e) {
    this.data.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.data.touchEndTime = e.timeStamp
  },
  //长按
  longTap: function (e) {
    console.log("long tap")
    wx.showModal({
      title: '提示',
      content: '永久删除?',
      showCancel: true
    })
  },
  runderList: function () {
    console.log('=>app.globalData.unicodeId=' + app.globalData.unicodeId)
    const that = this
    const data = {
      unioId: app.globalData.unicodeId
    }
    Request.postRequest('https://www.yo-pe.com/api/common/queryMyProduct', data).then(function (data) {
      console.log('=>>>>'+JSON.stringify(data))
      that.setData({
        myProductList: data.productList
      })
    })
  }
})