const App = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({
    data: {
        order: {
            item: {},
        },
    },
    onLoad(option) {
        // this.order = App.HttpResource('/order/:id', {id: '@id'})
        this.order = []
        console.log('!!!!!!!!!!!!!!!!! o r d e r i d =' + option.orderId)
        this.setData({
          orderId: option.orderId
        })
    },
    onShow() {
        this.getOrderDetail(this.data.orderId)
    },
    getOrderDetail(orderId) {
      var that = this;
        // 先不做那么复杂。直接扒老金代码
        // App.HttpService.getOrderDetail(id)
       
        // this.order.getAsync({id: id})
        // .then(data => {
        //     console.log(data)
        //     if (data.meta.code == 0) {
        //         this.setData({
        //             'order.item': data.data
        //         })
        //     }
        // })

      console.log('获取我的订单详情:')
      const url = ServiceUrl.platformManager + 'queryMyOrderDetail'
      const data = {
        orderId: orderId
      }
      Request.postRequest(url, data).then(function (data) {

        const { code: code, orderDetail: orderDetail } = data
        if (code === '200') {
          console.log("我的订单详情:" + JSON.stringify(data))
          that.setData({
            orderDetail: orderDetail
          })
        }
      })


    },
})