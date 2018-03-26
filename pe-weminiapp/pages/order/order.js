import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
var id = '';
var navlist = [
  { id: "all", title: "全部", icon: "" },
  { id: "shaixuan", title: "待发货", icon: "../../images/list_sx.png" },
  { id: "salenum", title: "未完成", icon: "" },
  { id: "goodsStorePrice", title: "已完成", icon: "../../images/pop_select_pray.png" },
];
Page({
  data: { 
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
  //切换TAB
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
  onShow:function(unioId){
    wx.showToast({
      title: '加载中',
      icon: 'success',
      duration: 9999
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.getCollectProduct(unioId) 
  },
  //获取订单数据
  getCollectProduct: function (reqScopeOpenId) {
    const that = this
  
    const url = ServiceUrl.platformManager + 'queryMyOrder'
    let openId = app.globalData.unicodeId
    if (!openId){
      openId = reqScopeOpenId
    }
    const data = {
      unioId: openId
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
  orderShipment:function(){
    this.showDialogBtn();
   
  },
  //确认收款
  orderPayment:function(){
    wx.showModal({
      title: '提示',
      content: '确认收到款吗?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getSalesOrder: function (reqScopeOpenId) {
    const that = this

    const url = ServiceUrl.platformManager + 'queryMyResourceOrderFromWeChat'
    let openId = app.globalData.unicodeId
    if (!openId) {
      openId = reqScopeOpenId
    }
    const data = {
      unioId: openId
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
    wx.showToast({
      title: '加载中',
      icon: 'success',
      duration: 9999
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.getCollectProduct(options.unioId)
    this.getSalesOrder(options.unioId)
  },
  viewOrderItem(e) {
    let orderid = e.currentTarget.dataset.orderid
     

    wx.navigateTo({
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
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    this.scan();
  },
  scan() {
    wx.scanCode({
      scanType:'barCode',
      success: (res) => {
        console.log("扫码结果");
        console.log(res); 
        this.setData({
          scanCode: res.result
        })
        wx.showModal({
          title: '提示',
          content: res.result+'确认发货吗?',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              wx.showToast({
                title: '已发货',
                icon: 'success',
                duration: 3999
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      },
      fail: (res) => {
        console.log(res);
      }
    })
  }  
})