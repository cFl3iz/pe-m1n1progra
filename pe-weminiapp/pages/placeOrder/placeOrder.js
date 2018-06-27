// pages/placeOrder/placeOrder.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import Util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoppingData: null,
    address: null,      //收货地址
    total: 0,
    preferential: 0,    //优惠金额
    discount: 0          //折扣
  },

  //选择收货地址
  address: function () {
    const that = this
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          address: {
            userName: res.userName,
            postalCode: res.postalCode,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            nationalCode: res.nationalCode,
            telNumber: res.telNumber
          }
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
                  //if (!res.authSetting['scope.address']) {
                  that.address()
                  // }
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  //付款购物车
  placeOrder: function () {
    const that = this
    if (this.data.address == null) {
      wx.showModal({
        title: '提示',
        content: '地址不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.address()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    wx.showLoading({
      title: '正在提交订单...',
    })
    let str = '';
    for (let a of app.globalData.shoppingData) {
      str += `${a.productId},`
    }
    let data = {
      openId: app.globalData.openId,
      tarjeta: app.globalData.tarjeta,
      productStoreId: app.globalData.productStoreId,
      prodCatalogId: app.globalData.prodCatalogId,
      remark: '不想备注',
      skus: str,
      userName: this.data.address.userName,
      postalCode: this.data.address.postalCode,
      provinceName: this.data.address.provinceName,
      cityName: this.data.address.cityName,
      countyName: this.data.address.countyName,
      detailInfo: this.data.address.detailInfo,
      nationalCode: this.data.address.nationalCode,
      telNumber: this.data.address.telNumber,
    }
    console.log('付款购物车参数:' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'settlementShoppingCart'
      Request.postRequest(url, data).then(function (data) {
        console.log('付款购物车=>>>>>>>>' + JSON.stringify(data))
        const { code, grandTotal, orderId } = data
        if (code === '200') {
          that.goPaymentOrder(orderId, grandTotal)
        }
      })
    })
  },

  //支付成功或失败跳转到订单页面
  goOrderPage: function () {
    wx.redirectTo({
      url: '/pages/componyOrder/componyOrder'
    })
  },

  //调用微信支付
  goPaymentOrder: function (orderId, grandTotal) {
    const that = this
    const data = {
      openId: app.globalData.openId,
      total_fee: app.globalData.isDemo ? 1 : grandTotal * 100,
      wx_body: '友评订单:' + this.data.shoppingData[0].productName,
      orderId: orderId,
      appId: app.globalData.appId
    }
    console.log('调用微信支付参数:' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'signPayConfig'
    Request.postRequest(url, data).then(function (data) {
      console.log('data = ' + JSON.stringify(data[0]))
      wx.requestPayment({
        timeStamp: data[0].timeStamp,
        nonceStr: data[0].nonceStr,
        package: data[0].package,
        signType: 'MD5',
        paySign: data[0].paySign,
        'success': function (rs) {
          that.goOrderPage();
        },
        'fail': function (rs) {
          that.goOrderPage();
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let num = 0
    let total = 0.00
    let preferential = 0.00
    for (let a of app.globalData.shoppingData) {
      total += parseInt(a.price) * parseInt(a.amount)
    }
    this.setData({
      shoppingData: app.globalData.shoppingData,
      total: total,
    })
    if (app.globalData.storePromos[0]) {
      this.setData({
        discount: (1 - parseFloat(app.globalData.storePromos[0].discount)) * 10,
        preferential: app.globalData.storePromos[0] ? Util.toDecimal(total * app.globalData.storePromos[0].discount) : 0
      })
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