// pages/productDetail/productDetail.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import Zan from '../../zanui/index.js'
import Login from '../../utils/login.js'
Page(Object.assign({}, Zan.Stepper, {
  data: {
    productId: null,
    imgUrls: [
      'http://img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg',
      'http://img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg',
      'http://img.alicdn.com/imgextra/i2/2185325717/TB2fTC9cb1YBuNjSszhXXcUsFXa_!!2185325717.jpg_430x430q90.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    productDetailData: null,
    showBottomPopup: false,//显示下单弹出页面
    featureArray: null,//产品特性
    selectColor: null,//选中的颜色
    selectSize: null, //选中的尺码
    stepper1: {    //购买数量
      stepper: 1,
      min: 1,
      max: 20
    },
    address: null,//收货地址
    salesRepId: null,//销售代表ID
    productStoreId: null,//店家ID
    isShare: false//判断页面shi fou
  },

  //修改购买数量
  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;
    this.setData({
      [`${componentId}.stepper`]: stepper
    });
  },

  //下单选特征
  selectFeature: function (event) {
    let type = event.currentTarget.dataset.type
    let selectValue = event.currentTarget.dataset.selectvalue
    if (type === '颜色') {
      this.setData({
        selectColor: selectValue
      })
    } else if (type === '尺码') {
      this.setData({
        selectSize: selectValue
      })
    }
  },

  //修改购买数量
  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;
    this.setData({
      [`${componentId}.stepper`]: stepper
    });
  },

  //切换下单弹出层显示隐藏
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  //收货地址
  address: function (e) {
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
      }
    })
  },

  //转发
  onShareAppMessage: function (res) {
    return {
      title: this.data.productDetailData.internalName,
      path: 'pages/productDetail/productDetail?productId=' + this.data.productDetailData.productId + "&salesRepId=" + this.data.salesRepId + '&isShare=true',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },

  //添加顾客店铺角色
  addPlacingCustRoleToStore: function (productStoreId) {
    const that = this
    const data = {
      openId: app.globalData.openId,
      productStoreId: productStoreId,
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'addRoleToStore'
    Request.postRequest(url, data).then(function (data) {
      console.log('添加顾客店铺角色=>>>>>>>>' + JSON.stringify(data))
    })
  },


  //轮播图相关事件
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  //查询产品详情
  queryCatalogProductDetail: function () {
    const that = this
    const url = ServiceUrl.platformManager + 'queryCatalogProductDetail'
    const data = {
      openId: app.globalData.openId,
      productId: that.data.productId,
    }
    console.log(data)
    Request.postRequest(url, data).then(function (data) {
      console.log('查询产品详情=>>>>' + JSON.stringify(data))
      const { productDetail, code } = data
      if (code === '200') {
        let featureArray = []
        let colorArray = [];
        let sizeArray = [];
        for (let a of productDetail.features) {
          if (Object.keys(a)[0] === 'COLOR_DESC') {
            colorArray.push(Object.values(a)[0])
          } else if (Object.keys(a)[0] === 'SIZE') {
            sizeArray.push(Object.values(a)[0])
          }
        }
        featureArray.push({ type: '颜色', value: colorArray })
        featureArray.push({ type: '尺码', value: sizeArray })
        that.setData({
          productDetailData: productDetail,
          featureArray: featureArray,
          selectColor: colorArray[0],
          selectSize: sizeArray[0]
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: '服务器请求错误',
          icon: 'none"',
          duration: 2000
        })
      }
    })
  },

  //确定下单
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
    const data = {
      productId: this.data.productId,
      amount: this.data.stepper1.stepper,
      prodCatalogId: app.globalData.prodCatalogId,
      productStoreId: app.globalData.productStoreId,
      feature: `COLOR_DESC=${this.data.selectColor},SIZE=${this.data.selectSize}`,
      tarjeta: app.globalData.tarjeta,
      remark: '不想添加备注',
      salesRepId: this.data.salesRepId
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'buyProduct'
    Request.postRequest(url, data).then(function (data) {
      console.log('下单=>>>>>>>>' + JSON.stringify(data))
      const { code, orderId } = data
      if (code === '200') {
        that.createPersonPartyPostalAddress(orderId)
      }
    })
  },

  // 设置收货地址
  createPersonPartyPostalAddress: function (orderId) {
    const that = this
    const data = {
      orderId: orderId,
      tarjeta: app.globalData.tarjeta,
      userName: this.data.address.userName,
      postalCode: this.data.address.postalCode,
      provinceName: this.data.address.provinceName,
      cityName: this.data.address.cityName,
      countyName: this.data.address.countyName,
      detailInfo: this.data.address.detailInfo,
      nationalCode: this.data.address.nationalCode,
      telNumber: this.data.address.telNumber,
    }
    const url = ServiceUrl.platformManager + 'createPersonPartyPostalAddress'
    Request.postRequest(url, data).then(function (data) {
      console.log('设置收货地址=>>>>' + JSON.stringify(data))
      const { code } = data
      if (code === "200") {
        wx.showToast({
          title: '下单成功',
          icon: 'none"',
          duration: 2000
        })
        that.toggleBottomPopup()
        wx.navigateToMiniProgram({
          appId: 'wx119831dae45a3f3f',
          path: 'pages/index/index?orderId=' + orderId,
          extraData: {
            foo: 'bar'
          },
          envVersion: 'develop',
          success(res) {
            // 打开成功
            console.log(res)
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    //查看传递参数
    const { productId, salesRepId, isShare } = options
    console.log('产品详情页面参数productId>>>>>>' + productId + 'isShare>>>>>>' + isShare)
    this.setData({
      productId: productId
    })
    //判断是否是分享页面
    if (isShare) {
      this.setData({
        isShare: true
      })
    }
    //判断是否登录
    let AuthToken = wx.getStorageSync('AuthToken')
    if (AuthToken == '' || AuthToken == null) {
      Login.userLogin().then(function () {
        that.queryCatalogProductDetail()//查询产品详情
      })
    } else {
      that.queryCatalogProductDetail()//查询产品详情
    }
    //这个是为了下单时下到转发的第一个销售代表中
    if (salesRepId == null) {
      this.setData({
        salesRepId: app.globalData.openId
      })
    } else {
      this.setData({
        salesRepId: salesRepId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
}));
