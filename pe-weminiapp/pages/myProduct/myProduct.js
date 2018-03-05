import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
Page({
  data: {
    myProductList: []
  },
  onLoad: function (options) {
    this.runderList()
  },
  editProduct:function(e){
    var productid = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '../editProduct/editProduct?productid='+ productid,
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