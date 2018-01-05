var app = getApp()
import { formatTime } from '../../utils/util'
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({
  data: {
    list: [{
      productId: 1,
      name: '龙熙',
      productName: '不知道说啥呀',
      detailImageUrl: 'ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1513230018&di=d0fc05b0ccea3713e9029d44582cc155&src=http://pic.58pic.com/58pic/16/53/58/08358PICSbi_1024.jpg',
    },
    {
      productId: 2,
      name: '小沈',
      productName: '不知道说啥呀',
      detailImageUrl: 'ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1513230018&di=d0fc05b0ccea3713e9029d44582cc155&src=http://pic.58pic.com/58pic/16/53/58/08358PICSbi_1024.jpg'
    },]
  },
  //跳转到聊天页面
  goPage(e) {
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
  //转发给好友
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取unicodeId
  getUnionId: function (code) {
    console.log('获取unicodeId' + code)
    const that = this
    const url = ServiceUrl.platformManager + 'jscode2session'
    const data = {
      code: code
    }
    Request.postRequest(url, data).then(function (data) {
      const unicodeId = data
      app.globalData.unicodeId = unicodeId //设置全局unicodeId
      return unicodeId
    }).then(function (data) {
      that.getCollectProduct(data)
    })
  },
  //获取意向产品列表
  getCollectProduct: function (unicodeId) {
    const that = this
    console.log('获取意向产品列表' + unicodeId)
    const url = ServiceUrl.platformManager + 'queryMyCollectProduct'
    console.log(unicodeId)
    const data = {
      unioId: unicodeId
    }
    Request.postRequest(url, data).then(function (data) {
      console.log(data.collectList)
      if (data.collectList.length>0){
        that.setData({
          list: data.collectList
        })
      }
    })
  },
  onLoad() {
    const that = this
    app.weChatLogin().then(function (data) {
      that.getUnionId(data)
      app.getUserInfo()
    })
  }
})