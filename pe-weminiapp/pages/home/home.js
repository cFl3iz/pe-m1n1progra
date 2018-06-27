var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import { formatTime } from '../../utils/util'
import Login from '../../utils/login.js'

//个人用户
const individualUser = [
  { type: '商品', url: '../../images/home/me@3x.png', backgroundColor: '#f78259', router: '/pages/products_2C/products_2C' },
  {
    type: '圈子', url: '../../images/home/friends@3x.png', backgroundColor: '#73bbf7', router: '/pages/products_2C_circle/products_2C_circle'
  },
  { type: '发布', url: '../../images/home/cpfabu@3x.png', backgroundColor: '#f78259', router: '/pages/releaseProduct/releaseProduct' },
  { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/orders/orders' },
  { type: '统计', url: '../../images/home/tongji@3x.png', backgroundColor: '#ffffff', router: '/pages/statistics/statistics' },
  { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
]
//是销售员
const isSalesman = [
  { type: '商品', url: '../../images/home/chanpin@3x.png', backgroundColor: '#ffffff', router: '/pages/products/products' },
  { type: '订单', url: '../../images/home/dingdanl@3x.png', backgroundColor: '#ffffff', router: '/pages/orders/orders' },
  { type: '招募', url: '../../images/home/zhaomu@3x.png', backgroundColor: '#ffffff', router: '/pages/recruiting/recruiting' },
  { type: '统计', url: '../../images/home/tongji@3x.png', backgroundColor: '#ffffff', router: '/pages/statistics/statistics' },
  { type: '消息', url: '../../images/home/message@3x.png', backgroundColor: '#ffffff', router: '/pages/notice/notice' },
  { type: '扫我', url: '../../images/home/erweima@3x.png', backgroundColor: '#ffffff', router: '/pages/qrCode/qrCode' },
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
    grids: null,      //根据小程序类型 显示首页模块内容
    isSalesRep: null,
    booting: null,     //开机GIF
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //进入副首页
  deputyHome: function () {
    wx.redirectTo({
      url: '/pages/deputyHome/deputyHome',
    })
  },

  //扫描二维码成为二维码拥有者的客户
  assocCustToSalesRep: function (salesPartyId = '10614') {
    const that = this
    const url = ServiceUrl.platformManager + 'assocCustToSalesRep'
    const data = {
      tarjeta: app.globalData.tarjeta,
      salesPartyId: salesPartyId
    }
    console.log(data)
    return new Promise(function (resolve, reject) {
      Request.postRequest(url, data).then(function (data) {
        console.log('二维码拥有者=>>>>>>>>' + JSON.stringify(data))
        const { code } = data
        if (code === '200') {
          wx.showToast({
            title: '谢谢使用',
            icon: 'success',
            duration: 2000
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('首页参数===>>>>>' + JSON.stringify(options))
    const { selsPartyId } = options
    const that = this
    app.editTabBar();//添加tabBar数据  
    wx.showLoading({
      title: '加载中',
    })
    //判断小程序类型
    if (app.globalData.serviceType === '2B') {
      this.setData({
        grids: isSalesman
      })
    } else if (app.globalData.serviceType === '2C') {
      this.setData({
        grids: individualUser
      })
    }
    //用户登陆
    Login.userLogin()
      .then(function () {
        console.log('是不是销售代表：' + app.globalData.isSalesRep)
        that.setData({
          isSalesRep: app.globalData.isSalesRep,
        })
        //添加开机图片
        if (app.globalData.appContentDataResource.MINIPROGRAM_STARTPIC){
          that.setData({
            booting: app.globalData.appContentDataResource.MINIPROGRAM_STARTPIC[0]
          })
        }
        //判断是否为扫码进入小程序的用户
        if (selsPartyId) {
          that.assocCustToSalesRep(selsPartyId)
        }
        console.log(app.globalData.appContentDataResource.MINIPROGRAM_BIMAGE)
        //如果没有简介直接跳到商品列表
        if (app.globalData.isSalesRep === 'false') {
          if (app.globalData.appContentDataResource.MINIPROGRAM_BIMAGE){
            wx.redirectTo({
              url: '/pages/deputyHome/deputyHome'
            })
          }else{
            wx.redirectTo({
              url: '/pages/products/products'
            })
          }
        }
        //设置首页标题
        if (app.globalData.appName) {
          wx.setNavigationBarTitle({
            title: app.globalData.appName
          })
        }
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
  // onShareAppMessage: function () {

  // }
});