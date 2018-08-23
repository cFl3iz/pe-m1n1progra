// pages/productDetail/productDetail.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    productDetail: null,
    showBottomPopup: false,//是否显示下单弹出层
    quantity: 1,//购买数量
    address: null,//送货地址
    time: null,//送货时间
    orderType: null,//下单类型
  },

  //选择送货时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  //选择收货地址
  address: function () {
    const that = this
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          address: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo + ' ' + res.userName + ' ' + res.telNumber
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '需要您授权使用通讯地址才能发货给您！',
          confirmText: '授权',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  that.address()
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
  },

  //修改购买数量
  handleChangeQuantity({ detail }) {
    this.setData({
      quantity: detail.value
    })
  },

  //下单弹出层显示或隐藏
  showBottomPopup(e) {
    const orderType = e.detail.target.dataset.ordertype
    this.setData({
      orderType: orderType,
      showBottomPopup: true
    })
  },

  hideBottomPopup: function () {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    })
  },

  //查询商品详情
  queryCatalogProductDetail: function (productId) {
    const that = this
    const url = ServiceUrl.platformManager + 'queryCatalogProductDetail'
    const data = {
      openId: app.globalData.openId,
      productId: productId,
    }
    Request.postRequest(url, data).then(function (data) {
      //console.log('查询商品详情======>>>>>>' + JSON.stringify(data))
      const { code, productDetail } = data;
      if (code === '200') {
        that.setData({
          productDetail: productDetail
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { productId } = options
    if (productId) {
      this.queryCatalogProductDetail(productId)
    }
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
})