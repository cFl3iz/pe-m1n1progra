var app = getApp()
Page({
  data: {
    indicatorDots: false,     //轮播图的相关属性
    autoplay: false,
    interval: 5000,
    duration: 500,
    isSalesRep: 'false',
    imageData: null,
    homeData:null
  },

  products: function () {
    wx.redirectTo({
      url: '/pages/companyProduct/companyProduct',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();//添加tabBar数据  
    this.setData({
      isSalesRep: app.globalData.isSalesRep,
    })
    console.log(app.globalData.appContentDataResource.MINIPROGRAM_HOME[0])
    if (app.globalData.appContentDataResource){
      this.setData({
        imageData: app.globalData.appContentDataResource.MINIPROGRAM_BIMAGE,
        homeData: app.globalData.appContentDataResource.MINIPROGRAM_HOME[0]
      })
    }
    //设置首页标题
    wx.setNavigationBarTitle({
      title: app.globalData.appName
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
    return {
      title: app.globalData.shareTitle,
      path: 'pages/companyProduct/companyProduct',
      imageUrl: app.globalData.coverImage,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  }
})