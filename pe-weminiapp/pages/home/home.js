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
    grids: isSalesman,
    isSalesRep:null
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //进入副首页
  deputyHome:function(){
    wx.redirectTo({
      url: '/pages/deputyHome/deputyHome',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();//添加tabBar数据  
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    Login.userLogin()
    .then(function () {
      console.log('是不是销售代表：' + app.globalData.isSalesRep)
        that.setData({
          isSalesRep: app.globalData.isSalesRep
        })
        // if (app.globalData.isSalesRep==='false'){
        //   wx.redirectTo({
        //     url: '/pages/companyProduct/companyProduct'
        //   })
        // }
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
});