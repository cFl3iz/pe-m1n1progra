// pages/notice/notice.js
var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeData:[],
    shareImage: 'https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/serviceSales/%E8%BD%AC%403x.png',
    orderImage:'https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/serviceSales/%E8%AE%A2%403x.png',
    deleteImage:'https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/serviceSales/%E5%88%A0%E9%99%A4%403x.png'
  },

  //查询我的通知列表
  loadChatMessage:function(){
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const url = ServiceUrl.platformManager + 'loadChatMessage'
    const data = {
      partyIdTo: app.globalData.partyId,
      partyIdFrom:'NA',
      objectId:'NA'
    }
    console.log(data)
    Request.postRequest(url, data).then(function (data) {
      console.log('查询我的通知列表=>>>>>>>>' + JSON.stringify(data))
      const { code, messages}=data
      if(code==='200'){
        that.setData({
          noticeData: messages
        })
        wx.hideLoading()
      }
    })
  },

  //删除一通知纪录
  deleteMessage:function(e){
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const url = ServiceUrl.platformManager + 'deleteMessage'
    const data = {
      messageId: e.currentTarget.dataset.messageid,
    }
    console.log(data)
    Request.postRequest(url, data).then(function (data) {
      console.log('删除一通知纪录=>>>>>>>>' + JSON.stringify(data))
      const {code}=data
      if(code==='200'){
        that.loadChatMessage()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadChatMessage()
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