// pages/statisticsDetail/statisticsDetail.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const { Tab, extend } = require('../../zanui/index');
Page(extend({}, Tab, {

  /**
   * 页面的初始数据
   */
  data: {
    tab1: {
      list: [{
        id: '1',
        title: '转发人员'
      }, {
        id: '2',
        title: '浏览人员'
      },
      {
        id: '3',
        title: '购买人员'
      }],
      selectedId: '1'
    },
    detailList: null,
    productMap: null
  },

  //切换显示内容  转发 浏览 购买
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    var bizType = 'FORWARD_PRODUCT'
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });

    if (selectedId === '2') {
      bizType = 'ADDRESSEE_PRODUCT'
    } else if (selectedId === '3') {
      bizType = 'BUY_PRODUCT'
    }
    const { productId, dataId } = this.data
    this.queryProductCpsReportDetail(productId, dataId, bizType)
  },

  //查询商品统计排行详情
  queryProductCpsReportDetail: function (productId, dataId, bizType = 'FORWARD_PRODUCT') {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const data = {
      tarjeta: app.globalData.tarjeta,
      productId: productId,
      dataId: dataId,
      bizType: bizType
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'queryProductCpsReportDetail'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询商品统计排行详情=>>>>>>>>' + JSON.stringify(data))
      const { code, detailList, productMap } = data
      if (code === '200') {
        that.setData({
          detailList: detailList,
          productMap: productMap
        })
        wx.hideLoading()
        wx.setNavigationBarTitle({
          title: productMap.productName
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { productId, dataId } = options

    this.setData({
      productId: productId,
      dataId: dataId
    })
    
    this.queryProductCpsReportDetail(productId, dataId)
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
}))