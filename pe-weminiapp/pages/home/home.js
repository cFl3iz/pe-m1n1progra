var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    pageTab: 'homepage',// 选中的tab项
    orderData: [//预约单数据
      { orderId: 10000, orderName: '摩卡', customer: '刘力扬', date: '2018-09-01 09:10:31', orderStatus: '预约单', quantity: 1, image: '/images/testData/moka.jpg', desc: '不加糖', price: 28 },
      { orderId: 10001, orderName: '拿铁', customer: '张扬', date: '2018-09-01 09:10:31', orderStatus: '预约单', quantity: 2, image: '/images/testData/natie.jpg', desc: '无备注', price: 32 },
      { orderId: 10002, orderName: '卡布奇诺', customer: '玛丽', date: '2018-09-01 09:10:31', orderStatus: '自送单', quantity: 1, image: '/images/testData/kbqn.jpg', desc: '下午一点钟送到A栋503', price: 30 },
    ],
    productData: [
      // { productId: '10000', productName: 'Cappuccino', price: '35', image: '/images/coffee/01.jpg' },
      // { productId: '10001', productName: 'Caffe Latte', price: '30', image: '/images/coffee/02.jpg' },
      // { productId: '10002', productName: 'Caffe Mocha', price: '35', image: '/images/coffee/03.jpg' },
      // { productId: '10003', productName: 'Hazelnut Latte', price: '25', image: '/images/coffee/04.jpg' },
      // { productId: '10004', productName: 'Caffe Anericano', price: '45', image: '/images/coffee/05.jpg' },
      // { productId: '10005', productName: 'Espresso Macchiato', price: '35', image: '/images/coffee/06.jpg' },
    ]
  },

  //查看产品详情
  productDetail:function(e){
    const productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?productId=' + productId,
    })
  },

  //切换tabbar选中项
  tabbarChange({ detail }) {
    this.setData({
      pageTab: detail.key
    });
    if (detail.key =='homepage'){
      wx.setNavigationBarTitle({
        title: '商品列表',
      })
    } else if (detail.key == 'order'){
      wx.setNavigationBarTitle({
        title: '订单列表',
      })
    } else if (detail.key == 'management'){
      wx.setNavigationBarTitle({
        title: '商品管理',
      })
    }
  },

  //发布产品
  releaseProduct: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200
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

  onLoad: function (options) {
    this.queryCatalogProduct()
  },

  //转发产品
  // onShareAppMessage: function (res) {

  // },
})
