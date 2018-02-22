// setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '年/月/日',
    taste: ['服装'] //兴趣爱好
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  changeSlider :function (e){
    let value = e.detail.value
    let that = this
    wx.showToast({
      title: '切换关系网络..',
      icon: 'loading',
      duration: 2000
    })
    wx.showToast({
      title: '切换成功!',
      icon: 'success',
      duration: 2000
    })
    var onedList = ['服装', '食品']
    var towdList = ['服装', '食品', '日用', '家居']
    var threedList = ['食品', '日用', '家居', '人工服务', '品牌', '体育', '养生', '书记', '艺术', '科技产品', '知识', '社会','科研','制造','医药','地理','其他']
     if(value == 1){
       that.setData({
         taste: onedList 
       });
     }
     if (value == 2) {
       that.setData({
         taste: towdList
       });
     }
     if (value == 3) {
       that.setData({
         taste: threedList
       });
     }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})