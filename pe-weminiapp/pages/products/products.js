// pages/companyProduct/companyProduct.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import Login from '../../utils/login.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productData: null,
    total: 0,//总产品数
    isSalesRep: 'false',
    arry: []
  },

  //查询公司的商品
  queryCatalogProduct: function () {
    const that = this
    const url = ServiceUrl.platformManager + 'queryCatalogProduct'
    const data = {
      openId: app.globalData.openId,
      prodCatalogId: app.globalData.prodCatalogId,
      pageIndex: 0
    }
    console.log(data)
    Request.postRequest(url, data).then(function (data) {
      //console.log('查询公司的商品=>>>>' + JSON.stringify(data))
      const { productList, total, code } = data
      if (code === '200') {
        that.setData({
          productData: productList,
          total: total
        })
        wx.hideLoading()
        let len = productList.length;
        let arry = []
        for (let i = 0; i <= len; i++) {
          if (i < 4) {
            arry.push(true)
          } else {
            arry.push(false)
          }
        }
        that.setData({
          arry: arry
        })
        console.log(that.data.arry)
      }
    })
  },

  //进入产品详情
  enterProductDetail: function (productId) {
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
    app.editTabBar();//添加tabBar数据  
    this.setData({
      isSalesRep: app.globalData.isSalesRep
    })
    //判断是否登录
    let AuthToken = wx.getStorageSync('AuthToken')
    if (AuthToken == '' || AuthToken == null) {
      Login.userLogin().then(function () {
        this.queryCatalogProduct()
      })
    } else {
      this.queryCatalogProduct()
    }
  },

  //监听页面滚动事件
  onPageScroll: function (res) {
    var _this = this;
    var imageHeight = wx.getSystemInfoSync().windowHeight*0.25
    console.log(res.scrollTop, imageHeight)
    var str = parseInt(res.scrollTop / imageHeight);
    console.log(str)
    _this.data.arry[str + 3] = true;
    _this.data.arry[str + 4] = true;
    _this.setData({
      arry: _this.data.arry
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
    return {
      title: app.globalData.shareTitle,
      path: 'pages/home/home',
      imageUrl: app.globalData.coverImage,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  }
})