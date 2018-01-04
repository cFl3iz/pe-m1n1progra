const app = getApp()
app.getUserInfo();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliveryInfoList: [
      { "id": "1", "data": [{ 'current': true, "time": "2017-11-14 23:11:56", "ftime": "2017-11-14 23:11:56", "context": "[广东顺德区公司勒流振兴分部]快件已被 已签收 签收", "location": "广东顺德区公司勒流振兴分部" }, { "time": "2017-11-14 09:36:10", "ftime": "2017-11-14 09:36:10", "context": "[广东顺德区公司勒流振兴分部]进行派件扫描；派送业务员：陈少平；联系电话：13534421035", "location": "广东顺德区公司勒流振兴分部" }, { "time": "2017-11-14 06:40:03", "ftime": "2017-11-14 06:40:03", "context": "[广东顺德区公司勒流振兴分部]到达目的地网点，快件将很快进行派送", "location": "广东顺德区公司勒流振兴分部" }, { "time": "2017-11-14 05:26:31", "ftime": "2017-11-14 05:26:31", "context": "[广东顺德区公司]进行快件扫描，将发往：广东顺德区公司勒流振兴分部", "location": "广东顺德区公司" }, { "time": "2017-11-14 05:24:11", "ftime": "2017-11-14 05:24:11", "context": "[广东佛山分拨中心]从站点发出，本次转运目的地：广东顺德区公司", "location": "广东佛山分拨中心" }, { "time": "2017-11-13 23:11:41", "ftime": "2017-11-13 23:11:41", "context": "[广东广州分拨中心]进行装车扫描，即将发往：广东佛山分拨中心", "location": "广东广州分拨中心" }, { "time": "2017-11-13 22:16:36", "ftime": "2017-11-13 22:16:36", "context": "[广东广州分拨中心]在分拨中心进行卸车扫描", "location": "广东广州分拨中心" }, { "time": "2017-11-12 23:30:53", "ftime": "2017-11-12 23:30:53", "context": "[云南昆明分拨中心]进行装车扫描，即将发往：广东广州分拨中心", "location": "云南昆明分拨中心" }, { "time": "2017-11-12 23:28:38", "ftime": "2017-11-12 23:28:38", "context": "[云南昆明分拨中心]在分拨中心进行称重扫描", "location": "云南昆明分拨中心" }, { "time": "2017-11-12 11:56:08", "ftime": "2017-11-12 11:56:08", "context": "[云南富宁县公司]进行揽件扫描", "location": "云南富宁县公司" }, { "time": "2017-11-10 18:08:10", "ftime": "2017-11-10 18:08:10", "context": "[云南富宁县公司]进行揽件扫描", "location": "云南富宁县公司" }] }, { "id": "2", "data": [{ 'current': true,"time": "2017-11-14 23:11:56", "ftime": "2017-11-14 23:11:56", "context": "[广东顺德区公司勒流振兴分部]快件已被 已签收 签收", "location": "广东顺德区公司勒流振兴分部" }, { "time": "2017-11-14 09:36:10", "ftime": "2017-11-14 09:36:10", "context": "[广东顺德区公司勒流振兴分部]进行派件扫描；派送业务员：陈少平；联系电话：13534421035", "location": "广东顺德区公司勒流振兴分部" }, { "time": "2017-11-14 06:40:03", "ftime": "2017-11-14 06:40:03", "context": "[广东顺德区公司勒流振兴分部]到达目的地网点，快件将很快进行派送", "location": "广东顺德区公司勒流振兴分部" }, { "time": "2017-11-14 05:26:31", "ftime": "2017-11-14 05:26:31", "context": "[广东顺德区公司]进行快件扫描，将发往：广东顺德区公司勒流振兴分部", "location": "广东顺德区公司" }, { "time": "2017-11-14 05:24:11", "ftime": "2017-11-14 05:24:11", "context": "[广东佛山分拨中心]从站点发出，本次转运目的地：广东顺德区公司", "location": "广东佛山分拨中心" }, { "time": "2017-11-13 23:11:41", "ftime": "2017-11-13 23:11:41", "context": "[广东广州分拨中心]进行装车扫描，即将发往：广东佛山分拨中心", "location": "广东广州分拨中心" }, { "time": "2017-11-13 22:16:36", "ftime": "2017-11-13 22:16:36", "context": "[广东广州分拨中心]在分拨中心进行卸车扫描", "location": "广东广州分拨中心" }, { "time": "2017-11-12 23:30:53", "ftime": "2017-11-12 23:30:53", "context": "[云南昆明分拨中心]进行装车扫描，即将发往：广东广州分拨中心", "location": "云南昆明分拨中心" }, { "time": "2017-11-12 23:28:38", "ftime": "2017-11-12 23:28:38", "context": "[云南昆明分拨中心]在分拨中心进行称重扫描", "location": "云南昆明分拨中心" }, { "time": "2017-11-12 11:56:08", "ftime": "2017-11-12 11:56:08", "context": "[云南富宁县公司]进行揽件扫描", "location": "云南富宁县公司" }, { "time": "2017-11-10 18:08:10", "ftime": "2017-11-10 18:08:10", "context": "[云南富宁县公司]进行揽件扫描", "location": "云南富宁县公司" }]}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log(options.username, options.password)
    this.setData({
      username: options.username,
      password: options.password
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