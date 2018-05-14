const app = getApp()
import Request from '../../utils/request.js'
// app.getUserInfo();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    internalCode:'VB41145956364',
    contactAddress:'',
    steps: [],
  },
  //查询物流消息
  getALiDeliveryInfo: function (internalCode) {
    let url = 'https://goexpress.market.alicloudapi.com/goexpress?no=' + internalCode + '&type=' + 'auto';
    console.log(url)
    let that = this
    wx.request({
      url: url,
      header: {
        'Authorization': 'APPCODE 8141fb4bfc2f44b1b21e7397de8c22ff'
      },
      success: function (res) {
        console.log('查询物流消息'+JSON.stringify(res))
        const { data } = res
        if (data.code==='OK'){
          data.list[0].current = true
          data.list[0].done = true
          that.setData({
            steps: data.list
          })
          wx.hideLoading()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.showToast({
      title: '正在处理',
      icon: 'loading',
      duration: 2500
    })
    console.log(JSON.stringify(options))
    const { internalCode, contactAddress } = options
    if (internalCode){
      this.setData({
        internalCode: internalCode,
        contactAddress: contactAddress
      })
      this.getALiDeliveryInfo(internalCode)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面被卸载了")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})