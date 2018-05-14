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
      },
        // {
        //   id: 'sign',
        //   title: '已完成'
        // }
      ],
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
    isSalesRep: 'false'//判断是否是销售代表
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
      console.log('查询销售订单=>>>>>>>>' + JSON.stringify(data))
      const { code, queryMyResourceOrderList } = data;
      //确定订单状态
      for (let a of queryMyResourceOrderList) {
        if (a.orderPayStatus === '待付款') {
          a.orderState = '待付款'
        } else if (a.orderPayStatus === '已付款' && a.orderShipment === '待发货') {
          a.orderState = '待发货'
        } else if (a.orderShipment === '待收货') {
          a.orderState = '待收货'
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
    console.log(data)
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

  //删除订单
  deleteOrder:function(e){
    const orderId = e.target.dataset.orderid;
    wx.showModal({
      title: '提示',
      content: '删除订单不能回复哦!',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          const that = this;
          const data = {
            orderId: orderId,
          }
          console.log('删除订单参数：' + JSON.stringify(data))
          const url = ServiceUrl.platformManager + 'orderCancel'
          Request.postRequest(url, data).then(function (data) {
            console.log('删除订单：=>>>>>>>>' + JSON.stringify(data))
            // const { code, queryMyResourceOrderList } = data;
            // if (code === "200") {
            //   wx.hideLoading()
            // }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //选择订单类型
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


  //显示切换订单Actionsheet
  toggleActionsheet() {
    this.setData({
      'baseActionsheet.show': true
    });
  },

  handleZanActionsheetCancel({ componentId }) {
    this.setData({
      [`${componentId}.show`]: false
    });
  },

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
  },
  //支付接口
  goPaymentOrder: function (e) {
    console.log(e)
    const orderId = e.target.dataset.orderid;
    const productName = e.target.dataset.productname;
    const price = e.target.dataset.price;
    const quantity = e.target.dataset.quantity;
    const that = this
    const data = {
      openId: app.globalData.openId,
      total_fee: parseFloat(price * quantity) * 100,//parseFloat(price * quantity)
      wx_body: '友评订单:' + productName,
      orderId: orderId,
      appId: app.globalData.appId
    }
    console.log(data)
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

  //待付款订单剩余支付时间倒计时

  /* 毫秒级倒计时 */
  count_down: function (total_micro_second) {
    for (let a of this.data.orderDataShow){
      if(a.time){
        
      }
    }
    // 渲染倒计时时钟
    this.setData({
      clock: date_format(total_micro_second)
    });

    if (total_micro_second <= 0) {
      that.setData({
        clock: "已经截止"
      });
      // timeout则跳出递归
      return;
    }
    setTimeout(function () {
      // 放在最后--
      total_micro_second -= 10;
      count_down(that);
    }, 10)
  },

  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  date_format: function (micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

    return hr + ":" + min + ":" + sec + " " + micro_sec;
  },

  // 位数不足补零
  fill_zero_prefix: function (num) {
    return num < 10 ? "0" + num : num
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({
      isSalesRep: app.globalData.isSalesRep
    })
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

  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  }
}));
