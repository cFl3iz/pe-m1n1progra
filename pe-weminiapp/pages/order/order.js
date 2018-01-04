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
        productName: '照相机',
        detailImageUrl: '../../images/testImage/testImage.jpeg',
      },
      {
        orderId: 2,
        productName: 'aaa',
        detailImageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
      {
        orderId: 3,
        productName: 'bbb',
        detailImageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513833520380&di=0aa8c697ed66f1857bd14632eb2e8f71&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F3812b31bb051f819b05efd42d0b44aed2e73e7bb.jpg',
      },
    ],
    num: 1,
    limt: 20,
    tab: ''
  },
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
  getCollectProduct: function () {
    const that = this
    console.log('获取我的订单:' + app.globalData.unicodeId)
    const url = ServiceUrl.platformManager + 'queryMyOrder'
    const data = {
      unioId: app.globalData.unicodeId
    }
    Request.postRequest(url, data).then(function (data) {
      
      const { code: code, orderList: orderList } = data
      if (code === '200') {
        console.log("我的订单:" + JSON.stringify(data))
        that.setData({
          list: orderList
        })
      }
    })
  },
  onLoad: function (options) {
    this.getCollectProduct()
  },
})