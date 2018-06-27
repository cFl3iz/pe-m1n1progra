import { Actionsheet, Tab, extend } from '../../zanui/index';
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page(extend({}, Tab, Actionsheet, {
  data: {
    tab1: {
      list: [{
        id: 'all',
        title: '全部'
      }, {
        id: 'topay',
        title: '待付款'
      }, {
        id: 'tosend',
        title: '待发货'
      }, {
        id: 'send',
        title: '待收货'
      }],
      selectedId: 'all'
    },
    baseActionsheet: {
      show: false,
      cancelText: '关闭',
      closeOnClickOverlay: true,
      componentId: 'baseActionsheet',
      actions: [{
        name: '销售订单',
        className: 'action-class',
        loading: false
      }, {
        name: '购买订单',
        className: 'action-class',
        loading: false
      }]
    },
    orderType: '销售订单',
    orderData: [],
    orderDataShow: [],
    isSalesRep: 'false',//判断是否是销售代表
    appServiceType: null,//app服务类型是2B或2C
    selectOrderId: null,
    showPopup:false,//2C付款码
  },

  //查询销售订单
  queryMyResourceOrderFromWeChat: function () {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    const data = {
      openId: app.globalData.openId,
      orderStatus: 'ALL'
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'queryMyResourceOrderFromWeChat'
    Request.postRequest(url, data).then(function (data) {
      //console.log('查询销售订单=>>>>>>>>' + JSON.stringify(data))
      const { code, queryMyResourceOrderList } = data;
      //确定订单状态
      for (let a of queryMyResourceOrderList) {
        if (a.orderPayStatus === '待付款') {
          a.orderState = '待付款'
        } else if (a.orderPayStatus === '已付款' && a.orderShipment === '待发货') {
          a.orderState = '待发货'
        } else if (a.orderShipment === '待收货') {
          a.orderState = '待收货'
        } else if (a.orderPayStatus === '已取消') {
          a.orderState = '已取消'
        }
      }
      if (code === "200") {
        that.setData({
          orderData: queryMyResourceOrderList,
          orderDataShow: queryMyResourceOrderList
        })
        wx.hideLoading()
      }
    })
  },

  //查询采购订单
  queryMyOrder: function () {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    const data = {
      openId: app.globalData.openId,
      orderStatus: 'ALL'
    }
    console.log('查询采购订单参数' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'queryMyOrder'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询采购订单=>>>>>>>>' + JSON.stringify(data))
      const { code, orderList } = data;
      //确定订单状态
      for (let a of orderList) {
        if (a.orderPayStatus === '待付款') {
          a.orderState = '待付款'
        } else if (a.orderPayStatus === '已付款' && a.orderShipment === '待发货') {
          a.orderState = '待发货'
        } else if (a.orderShipment === '待收货') {
          a.orderState = '待收货'
        } else if (a.orderPayStatus === '已取消') {
          a.orderState = '已取消'
        }
      }
      if (code === "200") {
        that.setData({
          orderData: orderList,
          orderDataShow: orderList
        })
        wx.hideLoading()
      }
    })
  },

  //取消订单
  cancalOrder: function (e) {
    const orderId = e.target.dataset.orderid;
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          const data = {
            orderId: orderId,
            orderStatus: 'ORDER_CANCELLED'
          }
          console.log('取消订单参数：' + JSON.stringify(data))
          const url = ServiceUrl.platformManager + 'orderCancel'
          Request.postRequest(url, data).then(function (data) {
            console.log('取消订单：=>>>>>>>>' + JSON.stringify(data))
            const { code } = data;
            if (code === "200") {
              wx.hideLoading()
              if (that.data.orderType === '销售订单') {
                that.queryMyResourceOrderFromWeChat()
              } else {
                that.queryMyOrder()
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //删除订单
  deleteOrder: function (e) {
    const orderId = e.target.dataset.orderid;
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          const data = {
            orderId: orderId,
            tarjeta: app.globalData.tarjeta
          }
          console.log('删除订单参数：' + JSON.stringify(data))
          const url = ServiceUrl.platformManager + 'hiddenOrder'
          Request.postRequest(url, data).then(function (data) {
            console.log('删除订单：=>>>>>>>>' + JSON.stringify(data))
            const { code } = data;
            if (code === "200") {
              wx.hideLoading()
              if (that.data.orderType === '销售订单') {
                that.queryMyResourceOrderFromWeChat()
              } else {
                that.queryMyOrder()
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //2C确定收款
  orderPaymentReceived2c: function (e) {
    const orderId = e.target.dataset.orderid;
    const that = this
    wx.showModal({
      title: '提示',
      content: '您是否真的收到买家付款？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          const data = {
            orderId: orderId,
            partyId: app.globalData.openId
          }
          console.log('2C确定收款参数：' + JSON.stringify(data))
          const url = ServiceUrl.platformManager + 'orderPaymentReceived2c'
          Request.postRequest(url, data).then(function (data) {
            console.log('2C确定收款：=>>>>>>>>' + JSON.stringify(data))
            const { code } = data;
            if (code === "200") {
              wx.hideLoading()
              that.queryMyResourceOrderFromWeChat()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //筛选订单类型
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    let filterData
    if (selectedId === 'all') {
      filterData = this.data.orderData
    } else if (selectedId === 'topay') {
      filterData = this.data.orderData.filter((d, i) => {
        return d.orderPayStatus === '待付款';
      });
    } else if (selectedId === 'tosend') {
      filterData = this.data.orderData.filter((d, i) => {
        return d.orderShipment === '待发货' && d.orderPayStatus === '已付款'
      });
    } else if (selectedId === 'send') {
      filterData = this.data.orderData.filter((d, i) => {
        return d.orderShipment === '待收货' && d.orderPayStatus === '已付款'
      });
    }
    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      orderDataShow: filterData
    });
  },

  //查询物流
  goDeliveryInfo: function (e) {
    const internalCode = e.target.dataset.internalcode;
    const contactAddress = e.target.dataset.contactaddress
    wx.navigateTo({
      url: '/pages/deliveryInfo/deliveryInfo?internalCode=' + internalCode + '&contactAddress=' + contactAddress
    })
  },

  //显示切换订单类型Actionsheet
  toggleActionsheet() {
    this.setData({
      'baseActionsheet.show': true
    });
  },

  //隐藏切换订单类型Actionsheet
  handleZanActionsheetCancel({ componentId }) {
    this.setData({
      [`${componentId}.show`]: false
    });
  },

  //切换订单类型 销售和采购
  handleZanActionsheetClick({ componentId, index }) {
    console.log(`item index ${index} clicked`);
    this.data.tab1.selectedId = 'all'
    if (index === 0) {
      this.setData({
        orderType: '销售订单',
        tab1: this.data.tab1
      })
      this.queryMyResourceOrderFromWeChat()
    } else {
      this.setData({
        orderType: '购买订单',
        tab1: this.data.tab1
      })
      this.queryMyOrder()
    }

    this.setData({
      [`${componentId}.actions[${index}].loading`]: true
    });

    setTimeout(() => {
      this.setData({
        [`${componentId}.show`]: false,
        [`${componentId}.actions[${index}].loading`]: false
      });
    }, 1500);
    console.log(this.data.orderType)
  },

  //2B调用微信支付接口
  goPaymentOrder: function (e) {
    console.log(e)
    const orderId = e.target.dataset.orderid;
    const productName = e.target.dataset.productname;
    const price = e.target.dataset.price;
    const quantity = e.target.dataset.quantity;
    const that = this
    const data = {
      openId: app.globalData.openId,
      total_fee: app.globalData.isDemo ? 1 : price * 100,
      wx_body: '友评订单:' + productName,
      orderId: orderId,
      appId: app.globalData.appId
    }
    console.log('支付接口参数' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'signPayConfig'
    Request.postRequest(url, data).then(function (data) {
      console.log('支付接口返回>>>>>>>>' + JSON.stringify(data[0]))
      wx.requestPayment({
        timeStamp: data[0].timeStamp,
        nonceStr: data[0].nonceStr,
        package: data[0].package,
        signType: 'MD5',
        paySign: data[0].paySign,
        'success': function (rs) {
          const { errMsg } = rs
          if (errMsg === 'requestPayment:ok') {
            that.setData({
              tab1: {
                list: [{
                  id: 'all',
                  title: '全部'
                }, {
                  id: 'topay',
                  title: '待付款'
                }, {
                  id: 'tosend',
                  title: '待发货'
                }, {
                  id: 'send',
                  title: '待收货'
                },
                  // {
                  //   id: 'sign',
                  //   title: '已完成'
                  // }
                ],
                selectedId: 'all'
              }
            })
            that.queryMyOrder()
          }
        },
        'fail': function (rs) {

        }
      })
    })
  },

  //2C支付二维码弹出层
  togglePopup(e) {
    console.log(e)
    this.setData({
      showPopup: !this.data.showPopup
    });
    wx.downloadFile({
      url: 'https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/pay_qr_code/' + e.currentTarget.dataset.mediaid + '.png',
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

  //进入订单详情
  orderDetail: function (e) {
    console.log(e)
    const orderItem = JSON.stringify(e.currentTarget.dataset.orderitem)
    const custPersonName = e.currentTarget.dataset.custpersonname
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderItem=' + orderItem + '&custPersonName=' + custPersonName,
    })
  },

  //2C发货提示框
  showDialog(e) {
    console.log(e.currentTarget.dataset.orderid)
    this.setData({
      selectOrderId: e.currentTarget.dataset.orderid
    })
    this.dialog.showDialog();
  },

  //2C取消发货事件 
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },

  //2C确认发货事件 
  _confirmEvent(e) {
    console.log('你点击了确定', e);
    this.dialog.hideDialog();
    this.queryMyResourceOrderFromWeChat()
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

    //判断当前是2B，2C
    console.log('判断当前是2B，2C====>>>'+app.globalData.serviceType)
    this.setData({
      isSalesRep: app.globalData.isSalesRep,     //2B是否是销售代表
      appServiceType: app.globalData.serviceType
    })

    //2B如果是销售代表 查询销售订单，否则查询购买订单
    if (app.globalData.isSalesRep === 'true') {
      this.queryMyResourceOrderFromWeChat()
    } else {
      this.queryMyOrder()
      this.setData({
        orderType: '购买订单'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    //加载外部组件
    this.dialog = this.selectComponent("#dialog");
  },

  /**
  * 用户点击右上角分享
  */
  // onShareAppMessage: function () {

  // }
}));
