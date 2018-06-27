import { Actionsheet, Tab, extend } from '../../zanui/index';
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page(extend({}, Tab, {
  data: {
    showTips: true,
    showModalStatus: false,
    nowPartyId: '',
    tarjeta: '',
    productList: [],
    touchStartTime: '',
    touchEndTime: '',
    tab1: {
      list: [{
        id: 'upProduct',
        title: '上架产品'
      }, {
        id: 'underProduct',
        title: '下架产品'
      }],
      selectedId: 'upProduct'
    },
  },

  //切换产品类型（上架产品，下架产品）
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });

    if (this.data.tab1.selectedId === 'underProduct') {
      this.getOverDueResourceList()
    } else {
      this.runderList()
    }
  },

  //查询我的上架资源
  runderList: function () {
    const that = this
    const data = {
      unioId: app.globalData.openId,
      isDiscontinuation: '0'
    }
    const url = ServiceUrl.platformManager + 'queryMyProduct'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询我的上架资源=>>>>' + JSON.stringify(data))
      const { code, productList, tarjeta, nowPartyId } = data
      if (code === '200') {
        that.setData({
          productList: productList,
          tarjeta: tarjeta,
          nowPartyId: nowPartyId
        })
      }
    })
  },

  //我的下架资源
  getOverDueResourceList: function () {
    const that = this
    return new Promise(function (resolve, reject) {
      const data = {
        unioId: app.globalData.openId,
        isDiscontinuation: '1'
      }
      const url = ServiceUrl.platformManager + 'queryMyProduct'
      Request.postRequest(url, data).then(function (data) {
        console.log('查询我的下架资源 >>>> ' + JSON.stringify(data))
        const { code, productList, tarjeta, nowPartyId } = data
        if (code === '200') {
          that.setData({
            productList: productList,
            tarjeta: tarjeta,
          })
        }
        resolve(productList)
      })
    })
  },

  //产品上架
  recoveResource: function (e) {
    var productid = e.currentTarget.dataset.productid;
    var name = e.currentTarget.dataset.name;
    var that = this
    wx.showModal({
      title: '提示',
      content: '重新上架(' + name + ')?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          const data = {
            productId: productid
          }
          const url = ServiceUrl.platformManager + 'recoveResource'
          Request.postRequest(url, data).then(function (data) {
            console.log('recoveResource >>>> ' + JSON.stringify(data))
            const { code } = data
            if (code === '200') {
              wx.showToast({
                title: '已上架!',
                icon: 'success',
                duration: 2000
              })
              that.getOverDueResourceList()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  //编辑商品
  editProduct: function (e) {
    let productData = JSON.stringify(e.currentTarget.dataset.productdata)
    wx.navigateTo({
      url: '/pages/releaseProduct/releaseProduct?&pageType=edit&productData=' + productData,
    })
  },

  //删除商品
  removeProductFromCategory: function (e) {
    let that = this
    let productId = e.currentTarget.dataset.productid
    console.log('removeProductFromCategory =>' + productId)
    const data = {
      productId: productId
    }
    const url = ServiceUrl.platformManager + 'doRemoveProductFromCategory'
    Request.postRequest(url, data).then(function (data) {
      console.log('删除商品=====>>>>'+JSON.stringify(data))
      const { code } = data
      if (code === '200') {
        wx.showToast({
          title: '删除完毕',
          icon: 'success',
          duration: 2000
        })
        that.getOverDueResourceList()
      }
    })
  },

  //转发我的产品
  // onShareAppMessage: function (e) {
  //   console.log(JSON.stringify(e))
  //   let that = this
  //   var productid = e.target.dataset.productid
  //   var shareName = e.target.dataset.sharename
  //   var payToPartyId = e.target.dataset.paytopartyid
  //   var nowPartyId = this.data.nowPartyId
  //   var tarjeta = this.data.tarjeta
  //   console.log('productid=' + productid)
  //   console.log('shareName=' + shareName)
  //   console.log('payToPartyId=' + payToPartyId)
  //   console.log('nowPartyId=' + nowPartyId)
  //   console.log('tarjeta=' + tarjeta)
  //   return {
  //     title: shareName,
  //     path: '/pages/previewreadResource/previewreadResource?' + 'productid=' + productid + '&paytopartyid=' + payToPartyId + '&spm=' + nowPartyId,
  //     success: function (res) {
  //       console.log('on share success')
  //       that.onShare(productid, payToPartyId, tarjeta)
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },

  //下架产品
  salesDiscontinuation: function (e) {
    let that = this
    let productId = e.currentTarget.dataset.productid

    wx.showModal({
      title: '提示',
      content: '确定要下架吗?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          const url = ServiceUrl.platformManager + 'salesDiscontinuation'
          const data = {
            productId: productId
          }
          Request.postRequest(url, data).then(function (data) {
            const { code } = data;
            if (code === '200') {
              wx.showToast({
                title: '下架成功',
                icon: 'success',
                duration: 2000
              })
              that.runderList()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onLoad: function () {
    this.runderList();
  },
}));
