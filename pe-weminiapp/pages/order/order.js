import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
var id = '';
var navlist = [
  { id: "ALL", title: "全部", icon: "" },
  { id: "PAYMENT", title: "已付款", icon: "" },
  { id: "SHIPMENT", title: "已发货", icon: "" },
  { id: "CANCEL", title: "已取消", icon: "" },
];
Page({
  data: { 
    touchStartTime: '',
    touchEndTime: '',
    selectOrderId:null,
    partyId:null,
    unioId:null, 
    scanCode:null,
    showModal: false,
    winWidth: 0,
    winHeight: 0,   
    currentTab: 0,  
    pageNo: 1,
    activeIndex: 0,
    navList: navlist,
    systemInfo: [],
    salesList:null,
    loadingHidden: true,
    list: [
      {
        orderId: 1,
        productName: '照相机订单',
        detailImageUrl: 'timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
      {
        orderId: 2,
        productName: '芒果订单',
        detailImageUrl: 'timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
      {
        orderId: 3,
        productName: '男装订单',
        detailImageUrl: 'timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
    ],
    num: 1,
    limt: 20,
    tab: ''
  },
  // viewOrderItem:function(e){
  //   wx.navigateTo({
  //     url: '../orderDetail/orderDetail?orderId=10000' + e.currentTarget.orderId
  //   })
     
  // },
  //切换采购订单
  onTapTagBuyOrder:function(e){
    var that = this;
    var tab = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      activeIndex: index,
      tab: tab,
      pageNo: 1
    })
    app.globalData.orderStatus = tab
    console.log(index, tab)

    that.getCollectProduct(that.data.unioId, tab)
  },
  //切换销售订单
  onTapTag: function (e) {
    var that = this;
    var tab = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      activeIndex: index,
      tab: tab,
      pageNo: 1 
    })
    console.log(index, tab)
    app.globalData.orderStatus = tab
    //刷销售单列表
    that.getSalesOrder(that.data.unioId, tab)


    // if (tab == 'shaixuan') {    //筛选跳转到specValue
    //   wx.navigateTo({
    //     url: '../specValue/specValue',    //加参数
    //   })
    // } else {
    //   that.getData();
    // }
  },
  /** 
  * 点击tab切换 
  */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },  
  //长按
  longTap: function (e) {
    console.log("long tap")
    var that = this
    let orderid = e.currentTarget.dataset.orderid
  
    wx.showModal({
      title: '提示',
      content: '取消订单?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          const url = ServiceUrl.platformManager + 'orderCancel'

          const data = {
            orderId: orderid 
          }
          Request.postRequest(url, data).then(function (data) {
            

            const { code: code } = data
            if (code === '200') {
              wx.showToast({
                title: '订单已取消',
                icon: 'success',
                duration: 2000
              })
              //刷销售单列表
              that.getSalesOrder(that.data.unioId,"ALL")
            } else {
              wx.showToast({
                title: '失败',
                icon: 'success',
                duration: 2000
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /// 按钮触摸开始
  touchStart: function (e) {
    this.data.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.data.touchEndTime = e.timeStamp
  },
  onShow:function(unioId){
    wx.showToast({
      title: '加载中',
      icon: 'success',
      duration: 9999
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.getCollectProduct(unioId, app.globalData.orderStatus) 
    this.getSalesOrder(unioId, app.globalData.orderStatus)
  },
  //获取订单数据
  getCollectProduct: function (reqScopeOpenId, orderStatus) {
    const that = this
  
    const url = ServiceUrl.platformManager + 'queryMyOrder'
    let openId = app.globalData.unicodeId
    if (!openId){
      openId = reqScopeOpenId
    }
    const data = {
      unioId: openId,
      orderStatus: orderStatus
    }
    Request.postRequest(url, data).then(function (data) {
      // console.log("我的订单=>:" + JSON.stringify(data))
      
      const { code: code, orderList: orderList } = data
      if (code === '200') {
        
        that.setData({
          list: orderList
        })
        wx.hideLoading()
      }
    })
  },
  //发货
  orderShipment:function(e){
    var that = this
    let orderid = e.currentTarget.dataset.orderid
    let partyId = e.currentTarget.dataset.partyid
    this.setData({
      partyId: partyId,
      selectOrderId:orderid
    })
    this.showDialogBtn();
   
  },
  //确认收款
  orderPayment:function(e){
    var that = this
    let orderid = e.currentTarget.dataset.orderid
    let partyId = e.currentTarget.dataset.partyid
    console.log('orderId='+orderid)
    console.log('partyId=' + partyId)
    wx.showModal({
      title: '提示',
      content: '确认收到款吗?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          const url = ServiceUrl.platformManager + 'orderPaymentReceived'
          
          const data = {
            orderId: orderid,
            partyId: partyId
          }
          Request.postRequest(url, data).then(function (data) {
            console.log("确认收款:" + JSON.stringify(data))

            const { code: code } = data
            if (code === '200') {
              wx.showToast({
                title: '已确认',
                icon: 'success',
                duration: 2000
              })
              //刷销售单列表
              that.getSalesOrder(that.data.unioId,"ALL")
            }else{
              wx.showToast({
                title: '失败',
                icon: 'success',
                duration: 2000
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getSalesOrder: function (reqScopeOpenId, orderStatus) {
    const that = this

    const url = ServiceUrl.platformManager + 'queryMyResourceOrderFromWeChat'
    let openId = app.globalData.unicodeId
    if (!openId) {
      openId = reqScopeOpenId
    }
    const data = {
      unioId: openId,
      orderStatus: orderStatus
    }
    Request.postRequest(url, data).then(function (data) {
      console.log("我的销售订单=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>:" + JSON.stringify(data))

      const { code: code } = data
      if (code === '200') {

        that.setData({
          salesList: data.queryMyResourceOrderList
        })
        wx.hideLoading()
      }
    })
  },
  onLoad: function (options) {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'success',
      duration: 9999
    })

    console.log(' -> app.globalData.orderStatus=' + app.globalData.orderStatus)

    // wx.showLoading({
    //   title: '加载中',
    // })
    if (null == options.unioId || options.unioId == "" || options.unioId == undefined){
      that.setData({
        unioId: options.unioId
      })
      that.getCollectProduct(options.unioId, app.globalData.orderStatus)
      that.getSalesOrder(options.unioId, app.globalData.orderStatus)
    }else{
      
      app.weChatLogin().then(function (data) {
        that.getUnionId(data) 
      })
      that.getCollectProduct(that.data.unioId, app.globalData.orderStatus)
      that.getSalesOrder(that.data.options.unioId, app.globalData.orderStatus)
    }
    

  },
  getUnionId: function (code) {
    console.log('IN ORDER ->获取unicodeId' + code)
    const that = this
    const url = ServiceUrl.platformManager + 'jscode2session'
    const data = {
      code: code
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('*jscode2session Global Data unio_Id = ' + data.unionid)
      const unicodeId = data.unionid
      const openId = data.openId
      app.globalData.openId = openId
      app.globalData.unicodeId = unicodeId //设置全局unicodeId
      that.setData({
        unioId: unicodeId
      })
      return unicodeId
    }).then(function (data) {
      that.getCollectProduct(data)
    })
  },
  viewOrderItem(e) {
    let orderid = e.currentTarget.dataset.orderid 
    wx.navigateTo
    ({
      url: '../orderDetail/orderDetail?orderId=' + orderid
    })
  },




  /**
    * 弹窗
    */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框 自己配送 按钮点击事件
   */
  faHuo: function (orderid, partyId, sinceTheSend, code, carrierCode, name){
    const url = ServiceUrl.platformManager + 'updateShipGroupShipInfoForWeChat'
    let that = this
    const data = {
      orderId: orderid,
      partyId: partyId,
      sinceTheSend: sinceTheSend,
      code: code,
      carrierCode: carrierCode,
      contactMechId: '',
      shipmentMethodId: '',
      name: name
    }
    Request.postRequest(url, data).then(function (data) {
      console.log("确认发货:" + JSON.stringify(data)) 
      
      if (data.code === '200') {
        wx.showToast({
          title: '发货成功',
          icon: 'success',
          duration: 3000
        })
        that.getSalesOrder(that.data.unioId,"ALL")
      } else {
        wx.showToast({
          title: '失败,再试一次?',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  onCancel: function (e) {
    var that  = this
    this.hideModal();
    let orderid = this.data.selectOrderId
    let partyId = this.data.partyId
    wx.showModal({
      title: '确认',
      content: '好的,请再确认一次',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.faHuo(orderid,partyId,'1','','','') 
          //刷销售单列表
          //that.getSalesOrder(that.data.unioId)
        } else if (res.cancel) {
          wx.showToast({
            title: '您取消了操作',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
    
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    this.scan();
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    this.getCollectProduct(this.data.unioId, app.globalData.orderStatus)
    this.getSalesOrder(this.data.unioId, app.globalData.orderStatus)
 
    
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
 
  },
  scan() {
    var that = this
    wx.scanCode({
      scanType:'barCode',
      success: (res) => {
        console.log("扫码结果");
        console.log(res); 
        this.setData({
          scanCode: res.result
        })
        const url = ServiceUrl.platformManager + 'queryExpressInfo'

        const data = {
          code: res.result
        }
        Request.postRequest(url, data).then(function (data) {
          wx.showModal({
            title: '提示',
            content: data.name+':'+res.result + '确认发货吗?',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                that.faHuo(that.data.selectOrderId, that.data.partyId, '0', res.result, data.carrierCode, 'EXPRESS');
                //刷销售单列表
               
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        });
         
        

      },
      fail: (res) => {
        console.log(res);
      }
    })
  }  
})