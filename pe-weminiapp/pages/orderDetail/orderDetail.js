const app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({
    data: {
        order: {
            item: {},
        },
    },
    onLoad(option) {
      wx.showLoading({
        title: '加载中',
      })
        // this.order = App.HttpResource('/order/:id', {id: '@id'})
        this.order = []
        console.log('!!!!!!!!!!!!!!!!! o r d e r i d =' + option.orderId)
        this.setData({
          orderId: option.orderId
        })
    },
    viewDeliveryInfo(e) {
      let orderid = e.currentTarget.dataset.orderid 
      let internalCode = e.currentTarget.dataset.internalcode 
      wx.redirectTo({
        url: '../deliveryInfo/deliveryInfo?orderId=' + orderid + '&internalCode=' + internalCode
      })
    },
    goChatView(e) {
      let username, password, nickname, avatar, payToPartyId, productId
      username = e.currentTarget.dataset.partyid
      password = e.currentTarget.dataset.partyid + '111'
      avatar = app.globalData.userInfo.avatarUrl
      nickname = app.globalData.userInfo.nickName
      payToPartyId = e.currentTarget.dataset.paytopartyid
      productId = e.currentTarget.dataset.productid
      console.log(username, password, nickname, avatar, payToPartyId, productId)
      const that = this
      const url = ServiceUrl.platformManager + 'register'
      const data = {
        username: username,
        password: password,
        avatar: avatar,
        nickname: nickname
      }
      Request.postRequest(url, data).then(function (data) {
        console.log(JSON.stringify(data))
      }).then(function () {
        wx.navigateTo({
          url: '../chatView/chatView?username=' + username + "&password=" + password + "&payToPartyId=" + payToPartyId + "&productId=" + productId
        })
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
          wx.hideLoading()
        }
      })


    },
})