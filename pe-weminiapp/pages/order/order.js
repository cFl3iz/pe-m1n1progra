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
    pageNo: 1,
    activeIndex: 0,
    navList: navlist,
    systemInfo: [],
    loadingHidden: true,
    list: [
      {
        orderId: 1,
        productName: '照相机询价',
        detailImageUrl: 'timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
      {
        orderId: 2,
        productName: '芒果询价',
        detailImageUrl: 'timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
      {
        orderId: 3,
        productName: '男装询价',
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
  //获取订单数据
  getCollectProduct: function (reqScopeOpenId) {
    const that = this
  
    const url = ServiceUrl.platformManager + 'queryCustRequestList'
    let openId = app.globalData.unicodeId
    if (!openId){
      openId = reqScopeOpenId
    }
    const data = {
      unioId: openId
    }
    Request.postRequest(url, data).then(function (data) {
      console.log("我的请求:" + JSON.stringify(data))
      
      const { code: code, custRequestList: custRequestList } = data
      if (code === '200') {
        
        that.setData({
          list: custRequestList
        })
      }
    })
  },
  onLoad: function (options) {

    this.getCollectProduct(options.unioId)
  },
  viewOrderItem(e) {
    let orderid = e.currentTarget.dataset.orderid
    wx.showToast({
      title: '卖家还没给回馈',
      icon: 'loading',
      duration: 1000
    });

    // wx.navigateTo({
    //   url: '../orderDetail/orderDetail?orderId=' + orderid
    // })
  },
})