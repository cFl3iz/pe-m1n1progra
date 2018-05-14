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
    indicatorDots: false,
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
    salesRepId: '',//当前销售代表ID
    productStoreId: null,//店家ID
    isShare: false,//判断页面shi fou
    placeOrderImage: null,
    shareFromId: '',//分享来自谁
    selectSku: null,//选好特征的SKU
    selectSkuKucun: null,//选好SKU的库存
    listData: [       //尺码表数据
      { "code": "2/160/80A", "code1": "100", "code3": "200", 'code4': '300', 'code5': '300', 'code6': '300', 'code2': '300' },
      { "code": "2/160/80A", "code1": "100", "code3": "200", 'code4': '300', 'code5': '300', 'code6': '300', 'code2': '300' },
      { "code": "2/160/80A", "code1": "100", "code3": "200", 'code4': '300', 'code5': '300', 'code6': '300', 'code2': '300' },
    ]

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

  //切换下单弹出层显示隐藏
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  //修改购买数量
  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;
    this.setData({
      [`${componentId}.stepper`]: stepper
    });
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
        selectColor: selectValue,
        placeOrderImage: this.data.productDetailData.featureMap[selectValue].drObjectInfo
      })
    } else if (type === '尺码') {
      this.setData({
        selectSize: selectValue
      })
    }

    if (this.data.selectColor != null && this.data.selectSize != null) {
      this.querySku()
    }
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

  //转发产品
  onShareAppMessage: function (res) {
    this.shareBProductInformation()
    return {
      title: this.data.productDetailData.internalName,
      path: 'pages/productDetail/productDetail?productId=' + this.data.productDetailData.productId + "&salesRepId=" + this.data.salesRepId + '&isShare=true' + '&shareFromId=' + app.globalData.partyId,
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

  //转发发起链条
  shareBProductInformation: function () {
    const that = this
    const data = {
      tarjeta: app.globalData.tarjeta,
      productId: this.data.productId,
      salesRepId: this.data.salesRepId,
      shareFromId: app.globalData.partyId
    }
    console.log('转发发起链条=>>>>>>>>参数' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'shareBProductInformation'
    Request.postRequest(url, data).then(function (data) {
      console.log('转发发起链条=>>>>>>>>' + JSON.stringify(data))
    })
  },

  //转发记录到转发链条中
  receivedBProductInformation: function (salesRepId, shareFromId) {
    const that = this
    const data = {
      tarjeta: app.globalData.tarjeta,
      productId: this.data.productId,
      shareFromId: shareFromId,
      salesRepId: salesRepId
    }
    console.log('转发记录到转发链条中>>>>参数' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'receivedBProductInformation'
    Request.postRequest(url, data).then(function (data) {
      console.log('转发记录到转发链条中=>>>>>>>>' + JSON.stringify(data))
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
    console.log('查询产品详情>>>>参数' + JSON.stringify(data))
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
          } else if (Object.keys(a)[0] === 'SIZE_DESC') {
            sizeArray.push(Object.values(a)[0])
          }
        }
        featureArray.push({ type: '颜色', value: colorArray })
        featureArray.push({ type: '尺码', value: sizeArray })
        that.setData({
          productDetailData: productDetail,
          featureArray: featureArray,
          placeOrderImage: productDetail.imgArray[0],
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

  //查询真实的SKU
  querySku: function () {
    const that = this
    const data = {
      productId: this.data.productId,
      color: this.data.selectColor,
      size: this.data.selectSize
    }
    console.log(data)
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'querySku'
      Request.postRequest(url, data).then(function (data) {
        console.log('查询真实的SKU=>>>>>>>>' + JSON.stringify(data))
        const { code, sku, availableToPromiseTotal } = data
        if (code === '200') {
          that.setData({
            selectSku: sku,//选好特征的SKU
            selectSkuKucun: parseInt(availableToPromiseTotal)//选好SKU的库存
          })
          resolve(sku)
        }
      })
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
    } else if (this.data.selectColor == null || this.data.selectSize == null) {
      wx.showModal({
        title: '提示',
        content: '却少参数',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } else if (this.data.selectSkuKucun < parseInt(this.data.stepper1.stepper)) {
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
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
    let data = {
      productId: this.data.selectSku,
      amount: that.data.stepper1.stepper,
      prodCatalogId: app.globalData.prodCatalogId,
      productStoreId: app.globalData.productStoreId,
      feature: `COLOR_DESC=${that.data.selectColor},SIZE=${that.data.selectSize}`,
      tarjeta: app.globalData.tarjeta,
      remark: '不想添加备注',
      salesRepId: that.data.salesRepId
    }
    console.log('下单参数:' + JSON.stringify(data))
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
    console.log('设置收货地址参数=>>>>' + JSON.stringify(data))
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
        that.goPaymentOrder(orderId)
      }
    })
  },

  //支付成功或失败跳转到订单页面
  goOrderPage: function () {
    wx.redirectTo({
      url: '/pages/componyOrder/componyOrder'
    })
  },

  //调用微信支付
  goPaymentOrder: function (orderId) {
    const that = this
    const data = {
      openId: app.globalData.openId,
      total_fee: parseFloat(this.data.productDetailData.price * this.data.stepper1.stepper * 100),
      wx_body: '友评订单:' + this.data.productDetailData.productName,
      orderId: orderId,
      appId: app.globalData.appId
    }
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
    const that = this
    wx.showLoading({
      title: '加载中',
    })

    //查看传递参数
    const { productId, salesRepId, isShare, shareFromId } = options
    console.log('产品详情页面参数productId>>>>>>' + productId + 'isShare>>>>>>' + isShare)
    this.setData({
      productId: productId,
    })

    //判断是否登录
    let AuthToken = wx.getStorageSync('AuthToken')
    console.log('判断是否登录=====>' + AuthToken)
    if (AuthToken == '' || AuthToken == null) {
      console.log('未登录的用户')
      Login.userLogin().then(function () {
        console.log('用户授权了' + typeof isShare)
        //判断是否是分享页面
        if (isShare === 'true') {
          that.setData({
            isShare: true,
            shareFromId: shareFromId
          })
          that.receivedBProductInformation(salesRepId, shareFromId)
        }
      })
    } else {
      console.log('已登录的用户')
      //判断是否是分享页面
      if (isShare === 'true') {
        that.setData({
          isShare: true,
          shareFromId: shareFromId
        })
        that.receivedBProductInformation(salesRepId, shareFromId)
      }
    }
    that.queryCatalogProductDetail()//查询产品详情

    //设置当前页面中的销售代表   如果被转发人是销售代表 使用他的ID 作为销售代表ID，否则使用传递的销售代表ID。
    if (app.globalData.isSalesRep === 'true') {
      this.setData({
        salesRepId: app.globalData.partyId
      })
    } else {
      if (salesRepId) {
        this.setData({
          salesRepId: salesRepId
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
}));
