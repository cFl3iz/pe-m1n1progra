import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
Page({
  data: {
    nowPartyId: '',
    productDetail: null,
    shareName: '',
    comments: [],
    availableToPromiseTotal: null,
    contactTel: null
  },
  onLoad: function (options) {
    var that = this
    console.log('this. data . productid = ' + options.productid)
    that.flushData(options.productid)
  },
  flushData: function (productid) {
    console.log(' flush data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    var that = this
    const data = {
      unioId: app.globalData.unicodeId,
      productId: productid
    }
    Request.postRequest('https://www.yo-pe.com/api/common/queryResourceDetail', data).then
      (
      function (data) {
        console.log('return data = ' + JSON.stringify(data))
        // console.log('data.resourceDetail=' + data)
        if (data.resourceDetail == undefined) {
          // that.setDemoData()
        } else {
          console.log('return data = ' + JSON.stringify(data))
          that.setData({
            nowPartyId: data.nowPartyId,
            productDetail: data.resourceDetail,
            shareName: data.resourceDetail.title,
            comments: data.resourceDetail.tuCaoList,
            availableToPromiseTotal: data.resourceDetail.availableToPromiseTotal,
            contactTel: data.resourceDetail.contactNumber
          })
          wx.hideLoading()
        }

      }
      )
  },
  formSubmit: function (e) {
    let that = this

    if (e.detail.value.title == '') {
      wx.showToast({
        title: '请填写标题',
        icon: 'success',
        duration: 10000
      })
      return false
    }
    wx.showToast({
      title: '施工中...',
      icon: 'success',
      duration: 20000
    })
    return false;

    //that.releaseProduct(e)
  },
  releaseProduct(e) {
    const that = this

    wx.showToast({
      title: '正在保存..',
      icon: 'loading',
      duration: 10000
    })


    const url = ServiceUrl.platformManager + 'updateResource'


    console.log('go to update resource' + that.data.latitude)
    var tel = that.data.contactTel
    const reqdata = {
      title: e.detail.value.title,
      kuCun: e.detail.value.count,
      desc: e.detail.value.desc,
      price: e.detail.value.price,
      unioId: app.globalData.unicodeId,
      address: e.detail.value.address,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      tel: tel == null ? '' : tel
    }
    Request.postRequest(url, reqdata).then(function (data) {

      console.log('update over - > = ' + JSON.stringify(data))
 

      wx.showModal({
        title: '提示',
        content: '更新完成',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          }
        }
      })
    })
  },

})