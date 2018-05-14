import { Tab, extend } from '../../zanui/index';
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page(extend({}, Tab, {
  data: {
    showTopPopup: false,
    tab2: {
      list: [{
        id: '1',
        title: '已出账'
      }, {
        id: '2',
        title: '未出账'
      }],
      selectedId: '1',
      scroll: true,
      height: 45
    },
    commissionData: []
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    this.queryOrderCpsReport()
  },
  //查询分成账单
  queryOrderCpsReport:function(){
    const that = this;
    const data = {
      tarjeta: app.globalData.tarjeta,
      statusId: this.data.tab2.selectedId === '2' ? 'ORDER_APPROVED' :'ORDER_COMPLETED',
      year:'2018'
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'queryOrderCpsReport'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询分成账单=>>>>>>>>' + JSON.stringify(data))
      const { code} = data
      if (code==='200'){
          that.setData({
            commissionData: data
          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryOrderCpsReport()
  },
}));
