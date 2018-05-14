// pages/statistics/statistics.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareInfoList:[],
    userInfo:null,
    shareCount:0,
    salesRepCount:0
  },

  //查询转发列表
  queryShareCpsReport: function () {
    const that=this
    const data = {
      tarjeta: app.globalData.tarjeta,
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'queryShareCpsReport'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询转发列表=>>>>>>>>' + JSON.stringify(data))
      const { code, shareInfoList, shareCount, salesRepCount} = data
      if (code === '200') {
        that.setData({
          shareInfoList: shareInfoList,
          shareCount: shareCount,
          salesRepCount: salesRepCount
        })
      }
    })
  },

  //进入查询分成页面
  queryCommission:function(){
    wx.navigateTo({
      url: '/pages/commission/commission'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    this.queryShareCpsReport()
    this.setData({
      userInfo: app.globalData.userInfo
    })
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