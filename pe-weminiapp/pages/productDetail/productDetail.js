// pages/productDetail/productDetail.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import Forward from '../../utils/forward.js'
import Zan from '../../zanui/index.js'
import Login from '../../utils/login.js'
import Util from '../../utils/util.js'
Page(Object.assign({}, Zan.Stepper, {
  data: {
    productId: null,          //产品ID
    indicatorDots: false,     //轮播图的相关属性
    autoplay: false,
    interval: 5000,
    duration: 500,
    productDetailData: null,  //产品详情数据
    showBottomPopup: false,   //显示下单弹出页面
    showPopup: false,         //显示2C支付二维码
    featureArray: null,       //产品特性
    selectColor: null,        //选中的颜色
    selectSize: null,         //选中的尺码
    stepper1: {               //购买数量
      stepper: 1,
      min: 1,
      max: 20
    },
    address: null,            //收货地址
    salesRepId: '',           //当前销售代表ID
    productStoreId: null,     //店家ID
    isShare: false,           //判断页面是否是分享页面f
    placeOrderImage: null,    //下单选中商品特征的产品图
    shareFromId: '',          //分享来自谁
    selectSku: null,          //选好特征的SKU
    selectSkuKucun: null,     //选好SKU的库存
    preferential: 0,          //优惠金额
    discont: 0,               //折扣
    hasShoppingCart: true,    //是否需要购物车模块
    addShoppingCart: false,   //是否是添加购物车行为
    shoppingCartNumber: 0,    //购物车产品数量   
    prodCatalogId: null,      //当前产品所在店铺分类ID
    productStoreId: null,     //当前产品所在店铺ID 
    serviceType: null,        //当前服务类型 
    validationForm:false,     //是否可以提交表单
    sessionFrom:{},           //传给客户的参数
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

  //下单弹出层
  toggleBottomPopup(e) {
    
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      addShoppingCart: false
    });
    //记录formId便于推送
    // let formId = e.detail.formId;
    // let data = {
    //   openId: app.globalData.openId,
    //   formId: formId
    // }
    // console.log('记录formId:' + JSON.stringify(data))
    // const url = ServiceUrl.platformManager + 'addFormIdToUser'
    // Request.postRequest(url, data).then(function (data) {
    //   console.log('记录formId=>>>>>>>>' + JSON.stringify(data))
    // })
  },

  //2C支付二维码弹出层
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
    wx.downloadFile({
      url: 'https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/pay_qr_code/' + this.data.productDetailData.media_id +'.png',
      success: function (res) {
        console.log(res)
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log(res)
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (res) {
                console.log(res)
                wx.showToast({
                  title: '保存失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function () {
            wx.showToast({
              title: '获取保存相册权限失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '下载图片失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //添加购物车显示隐藏弹出层
  toggleShoppingCartPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      addShoppingCart: true
    });
  },

  //修改购买数量
  handleZanStepperChange(e) {
    let componentId = e.componentId;
    let stepper = e.stepper;
    this.setData({
      [`${componentId}.stepper`]: stepper,
    });
    this.data.sessionFrom.amount = JSON.stringify(stepper)
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

  //进入购物车
  shoppingCart: function () {
    wx.navigateTo({
      url: '/pages/shoppingCart/shoppingCart',
    })
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
        that.data.sessionFrom.address = that.data.address
        that.data.sessionFrom.salesRepId = that.data.salesRepId
        console.log(JSON.stringify(that.data.sessionFrom))
        that.setData({
          sessionFrom: JSON.stringify(that.data.sessionFrom)
        })
        // if (!that.data.addShoppingCart){
        //   that.validationForm()
        // }
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
      },
    })
  },

  //转发产品
  onShareAppMessage: function (res) {
    const dateKey = Date.parse(new Date());
    Forward.createForwardChain(app.globalData.tarjeta, this.data.productId, 'PRODUCT', dateKey)//创建转发链
    return {
      title: this.data.productDetailData.productName,
      path: 'pages/productDetail/productDetail?productId=' + this.data.productDetailData.productId + "&dateKey=" + dateKey + '&isShare=true' + '&shareFromId=' + app.globalData.partyId,
      imageUrl: 'http://' + this.data.productDetailData.imgArray[0],
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
      const { productDetail, code, productStoreId, prodCatalogId } = data
      console.log(productStoreId, prodCatalogId)
      that.data.sessionFrom.prodCatalogId = prodCatalogId
      that.data.sessionFrom.productStoreId = productStoreId
      if (code === '200') {
        if (productDetail.features) {
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
            featureArray: featureArray,
          })
        }

        that.setData({
          productDetailData: productDetail,
          placeOrderImage: productDetail.imgArray[0],
          selectSkuKucun: productDetail.availableToPromiseTotal,
          productStoreId: productStoreId,
          prodCatalogId: prodCatalogId
        })

        wx.getImageInfo({// 获取图片信息（此处可不要）  
          src: 'https://' + productDetail.imgArray[0],
          success: function (res) {
            console.log(res)
            console.log(res.height)
          }
        })  

        //设置优惠金额
        if (app.globalData.storePromos[0]) {
          const price = parseInt(productDetail.price) * app.globalData.storePromos[0].discount
          that.setData({
            preferential: Util.toDecimal(price)
          })
        }
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

  //查询我的购物车
  queryShoppingCart: function () {
    const that = this
    let data = {
      openId: app.globalData.openId,
    }
    console.log('查询我的购物车参数:' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'queryShoppingCart'
      Request.postRequest(url, data).then(function (data) {
        console.log('查询我的购物车=>>>>>>>>' + JSON.stringify(data))
        const { code, shoppingCart } = data
        let num = 0
        if (code === '200') {
          if (shoppingCart.length > 0) {
            for (let a of shoppingCart) {
              num += parseInt(a.amount)
            }
          }
          that.setData({
            shoppingCartNumber: num
          })
        }
      })
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

  //下单或添加购物车
  placeOrder: function () {
    const that = this
    if (!this.data.addShoppingCart) {
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
      } else if (this.data.featureArray && (this.data.selectColor == null || this.data.selectSize == null)) {
        wx.showModal({
          title: '提示',
          content: '请选择规格参数',
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
        productId: this.data.selectSku || this.data.productId,
        amount: that.data.stepper1.stepper,
        prodCatalogId: that.data.prodCatalogId,
        productStoreId: that.data.productStoreId,
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
    } else {
      this.addShoppingCart()//执行添加购物车
    }
  },

  //添加购物车
  addShoppingCart: function () {
    const that = this
    if (this.data.featureArray && (this.data.selectColor == null || this.data.selectSize == null)) {
      wx.showModal({
        title: '提示',
        content: '请选择规格参数',
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
      title: '添加中...',
    })
    let data = {
      productId: this.data.selectSku || this.data.productId,
      amount: that.data.stepper1.stepper,
      feature: `COLOR_DESC=${that.data.selectColor},SIZE=${that.data.selectSize}`,
      openId: app.globalData.openId,
      productName: this.data.productDetailData.productName,
      detailImage: this.data.placeOrderImage,
      price: this.data.productDetailData.price
    }
    console.log('添加购物车参数:' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'addProductToShoppingCart'
      Request.postRequest(url, data).then(function (data) {
        console.log('添加购物车=>>>>>>>>' + JSON.stringify(data))
        const { code } = data
        if (code === '200') {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          })
          that.setData({
            showBottomPopup: false
          })
          that.queryShoppingCart()
        }
      })
    })
  },

  //设置收货地址
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
        if (app.globalData.serviceType === '2B') {
          that.goPaymentOrder(orderId)
        } else {
          that.setData({
            showPopup: true
          })
        }
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
      total_fee: app.globalData.isDemo ? 1 : (this.data.productDetailData.price - this.data.preferential) * this.data.stepper1.stepper * 100,
      wx_body: '友评订单:' + this.data.productDetailData.productName,
      orderId: orderId,
      appId: app.globalData.appId
    }
    console.log('调用微信支付参数' + JSON.stringify(data))
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
    const { productId, salesRepId, isShare, shareFromId, dateKey } = options
    console.log('产品详情页面参数productId>>>>>>', productId, salesRepId, isShare, shareFromId, dateKey)

    //设置当前页面参数
    this.setData({
      productId: productId,
    })
    this.data.sessionFrom.productId = productId
    this.data.sessionFrom.amount='1'
    this.data.sessionFrom.tarjeta = app.globalData.tarjeta
    //判断是否为分享页面
    if (isShare === 'true') {
      
      that.setData({
        isShare: true,
        shareFromId: shareFromId,
      })
    }

    //判断是否登录
    if (app.globalData.tarjeta == null) {
      //用户登陆
      Login.userLogin().then(function () {

        wx.showToast({
          title: '谢谢使用',
          icon: 'success',
          duration: 2000
        })

        //设置当前是2B，2C 是否需要购物车模块
        that.setData({
          serviceType: app.globalData.serviceType,
          hasShoppingCart: app.globalData.hasShoppingCart
        })

        //设置折扣率
        if (app.globalData.storePromos && app.globalData.storePromos[0]) {
          that.setData({
            discont: (1 - parseFloat(app.globalData.storePromos[0].discount)) * 10
          })
        }

        //当页面是分享页面时进入转发链
        if (isShare === 'true') {
          Forward.joinForwardChain(app.globalData.tarjeta, that.data.productId, 'PRODUCT', dateKey, shareFromId, app.globalData.appId)
        }

      })
    } else {

      that.setData({
        serviceType: app.globalData.serviceType,
        hasShoppingCart: app.globalData.hasShoppingCart
      })

      //设置当前页面折扣率
      if (app.globalData.storePromos && app.globalData.storePromos[0]) {
        that.setData({
          discont: (1 - parseFloat(app.globalData.storePromos[0].discount)) * 10
        })
      }

      //当页面是分享页面时进入转发链
      if (isShare === 'true'){
        Forward.joinForwardChain(app.globalData.tarjeta, that.data.productId, 'PRODUCT', dateKey, shareFromId, app.globalData.appId)
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
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    if (app.globalData.hasShoppingCart) {
      this.queryShoppingCart()        //查询购物车数量
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

}));
