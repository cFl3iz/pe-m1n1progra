var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import { formatTime } from '../../utils/util'
import Login from '../../utils/login.js'

//个人用户
// const individualUser = [
//   { type: '我的', url: '../../images/home/me@3x.png', backgroundColor: '#f78259', router: '/pages/myProduct/myProduct' },
//   {
//     type: '好友', url: '../../images/home/friends@3x.png', backgroundColor: '#73bbf7', router: '/pages/dimensionsRetrieve/dimensionsRetrieve'
//   },
//   { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/componyOrder/componyOrder' },
//   { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
// ]
//是销售员
const isSalesman = [
  { type: '产品', url: '../../images/home/chanpin@3x.png', backgroundColor: '#ffffff', router: '/pages/companyProduct/companyProduct' },
  { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/componyOrder/componyOrder' },
  { type: '招募', url: '../../images/home/zhaomu@3x.png', backgroundColor: '#ffffff', router: '/pages/recruiting/recruiting' },
  { type: '统计', url: '../../images/home/tongji@3x.png', backgroundColor: '#ffffff', router: '/pages/statistics/statistics' },
  { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
]
//不是销售员
const notSalesman = [
  { type: '产品', url: '../../images/home/chanpin@3x.png', backgroundColor: '#ffffff', router: '/pages/companyProduct/companyProduct' },
  { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/componyOrder/componyOrder' },
  { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
]
Page({
  /**
 * 页面的初始数据
 */
  data: {
    grids: null,
  },

  //检查小程序是否有新版本
  checkForUpdate: function () {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('请求完新版本信息的回调>>>>>>' + res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该小程序，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    Login.userLogin().then(function () {
      console.log('是不是销售代表：' + app.globalData.isSalesRep)
      if (app.globalData.isSalesRep === 'true') {
        that.setData({
          grids: isSalesman
        })
      } else {
        that.setData({
          grids: notSalesman
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkForUpdate()
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
});