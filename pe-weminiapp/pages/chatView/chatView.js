const app = getApp()
app.getUserInfo();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:null,
    password:null,
    payToPartyId:null,
    productId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log('inthis options.username=' + options.username +"options.password="+options.password)
    console.log('inthis options.productId=' + options.productId + "options.payToPartyId=" + options.payToPartyId)
    this.setData({
      username: options.username,
      password: options.password,
      payToPartyId: options.payToPartyId,
      productId: options.productId
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})