var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import { formatTime } from '../../utils/util'
import Login from '../../utils/login.js'

//个人用户
const individualUser = [
  { type: '我的', url: '../../images/home/me@3x.png', backgroundColor: '#f78259', router: '/pages/myProduct/myProduct' },
  {
    type: '好友', url: '../../images/home/friends@3x.png', backgroundColor: '#73bbf7', router: '/pages/dimensionsRetrieve/dimensionsRetrieve'
  },
  { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/componyOrder/componyOrder' },
  { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
]
//企业用户
const companyUser = [
  { type: '产品', url: '../../images/home/chanpin@3x.png', backgroundColor: '#ffffff', router: '/pages/companyProduct/companyProduct' },
  { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/componyOrder/componyOrder' },
  { type: '招募', url: '../../images/home/zhaomu@3x.png', backgroundColor: '#ffffff', router: '/pages/recruiting/recruiting' },
  { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
]
Page({
  /**
 * 页面的初始数据
 */
  data: {
    grids: companyUser,
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
      console.log('是不是销售代表：'+app.globalData.isSalesRep)
      if (app.globalData.isSalesRep!=='true') {
        console.log('是销售代表>>>>>>>>')
        that.setData({
          grids: companyUser
        })
      } else {
        console.log('不是销售代表>>>>>>>')
        that.setData({
          grids: individualUser
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.queryProductStoreList()
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