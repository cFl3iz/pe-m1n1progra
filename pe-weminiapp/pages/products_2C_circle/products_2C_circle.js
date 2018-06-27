// pages/otherProduct/otherProduct.js
var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productsData:[]
  },

  //查询其他人的商品
  queryFriendResources: function () {
    const that = this
    const url = ServiceUrl.platformManager + 'queryFriendResources'
    const data = {
      openId: app.globalData.openId,
      page: 0
    }
    console.log(data)
    Request.postRequest(url, data).then(function (data) {
      console.log('查询其他人的商品=>>>>>>>>' + JSON.stringify(data))
      const { code, resourcesList} = data
      if (code === '200') {
        that.setData({
          productsData:resourcesList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryFriendResources()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})