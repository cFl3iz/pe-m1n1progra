import { Actionsheet,Tab, extend } from '../../zanui/index';
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
      }, {
        id: 'sign',
        title: '已完成'
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
    orderType:'销售订单',
    orderData:[],
  },
  //查询销售订单
  queryMyResourceOrderFromWeChat: function () {
    wx.showLoading({
      title: '加载中',
    })
    const that=this;
    const data={
      openId: app.globalData.openId,
      orderStatus:'ALL'
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'queryMyResourceOrderFromWeChat'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询销售订单=>>>>>>>>' + JSON.stringify(data))
      const { code, queryMyResourceOrderList}=data;
      if(code==="200"){
        that.setData({
          orderData: queryMyResourceOrderList
        })
        wx.hideLoading()
      }
    })
  },

  //查询采购订单
  queryMyOrder:function(){
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
      if (code === "200") {
        that.setData({
          orderData: orderList
        })
        wx.hideLoading()
      }
    })
  },

  //选择订单类型
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
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
    if(index===0){
      this.setData({
        orderType: '销售订单'
      })
      this.queryMyResourceOrderFromWeChat()
    }else{
      this.setData({
        orderType: '购买订单'
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
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryMyResourceOrderFromWeChat()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
}));
