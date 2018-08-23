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
    actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'close',
        background: '#ed3f14'
      },
      {
        name: '编辑',
        width: 100,
        color: '#fff',
        fontsize: '20',
        icon: 'editor',
        background: '#5cadff'
      }
    ],
    productData:null
  },

  //选择删除或编辑
  handlerButton:function(e){
    const { detail, currentTarget}=e
    const productId = currentTarget.dataset.productid
    if (detail.index==0){
      this.doRemoveProductFromCategory(productId)
    }
  },

  //调用删除接口
  doRemoveProductFromCategory: function (productId) {
    let that = this
    const url = ServiceUrl.platformManager + 'doRemoveProductFromCategory'
    const data={
      productId: productId
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('删除商品=====>>>>' + JSON.stringify(data))
      const { code } = data
      if (code === '200') {
        that.queryCatalogProduct()
      }
    })
  },

  //查询我的产品列表
  queryCatalogProduct: function () {
    const that = this
    const url = ServiceUrl.platformManager + 'queryCatalogProduct'
    const data = {
      openId: app.globalData.openId,
      prodCatalogId: app.globalData.prodCatalogId,
      pageIndex: 0
    }
    Request.postRequest(url, data).then(function (data) {
      //console.log('查询我的产品列表=>>>>>>>>' + JSON.stringify(data))
      const { code, productList } = data
      if (code === '200') {
        that.setData({
          productData: productList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryCatalogProduct()
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