// pages/companyProduct/companyProduct.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const productData=[
  { id: 1, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName:'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01',price:3000},
  { id: 2, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName: 'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01', price: 3000},
  { id: 3, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName: 'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01', price: 3000 },
  { id: 4, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName: 'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01', price: 3000 },
  { id: 5, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName: 'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01', price: 3000 },
  { id: 6, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName: 'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01', price: 3000 },
  { id: 7, detailImageUrl: 'img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg', productName: 'ZUCZUG/素然手语系列 环保棉内搭衬衫T S161BL01', price: 3000 }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productData: productData,
    total:7//总产品数
  },

  //查询公司的商品
  queryCatalogProduct:function(){
    const that = this
    const url = ServiceUrl.platformManager + 'queryCatalogProduct'
    const data = {
      openId: app.globalData.openId,
      prodCatalogId: app.globalData.prodCatalogId,
      pageIndex:0
    }
    console.log(data)
    Request.postRequest(url, data).then(function (data) {
      console.log('查询公司的商品=>>>>' + JSON.stringify(data))
      const { productList, last_page,code}=data
      if(code==='200'){
        that.setData({
          productData: productList,
          total: last_page
        })
        wx.hideLoading()
      }
    })
  },

  //进入产品详情
  enterProductDetail: function (productId){
    wx.navigateTo({
      url: 'pages/productDetail/productDetail?productId=' + productId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
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
  onShareAppMessage: function () {
  
  }
})