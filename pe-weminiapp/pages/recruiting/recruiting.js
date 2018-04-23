// pages/recruiting/recruiting.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl'
import Request from '../../utils/request.js'
import Login from '../../utils/login.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tel: null,
    codeText: null,//验证码
    captcha: '获取验证码',//验证码按钮,
    name:null,//真实姓名
    storeId: null,
    isShare: false,   //当前是否是分享页面
    isSalesRep: null,//是否是销售代表
  },

  //设置手机号码
  setTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  //设置验证码
  setCodeText: function (e) {
    this.setData({
      codeText: e.detail.value
    })
  },

  //设置真实性命
  setName:function(e){
    this.setData({
      name: e.detail.value
    })
  },

  //验证码倒计时
  getCode: function (options) {
    let that = this;
    let currentTime = 20
    let interval = setInterval(function () {
      currentTime--;
      that.setData({
        captcha: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          captcha: '获取验证码',
        })
      }
    }, 1000)
  },

  //获取验证码
  getCaptcha: function () {
    if (this.data.tel) {
      this.getCode();
      const that = this
      const url = 'https://www.yo-pe.com/api/common/getCaptcha'
      const data = {
        tel: this.data.tel,
      }
      console.log(url)
      Request.postRequest(url, data).then(function (data) {
        console.log('获取验证码' + JSON.stringify(data))
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '手机号码输入错误',
        showCancel: false,
      })
    }
  },

  //接受招募
  recruitingPartyToParty: function () {
    if (this.data.tel && this.data.codeText) {
      const that = this
      const url = 'https://www.yo-pe.com/api/common/recruitingPartyToParty'
      const data = {
        teleNumber: this.data.tel,
        captcha: this.data.codeText,
        userName: this.data.name,
        openId: app.globalData.openId,
        storeId: this.data.storeId
      }
      console.log(data)
      Request.postRequest(url, data).then(function (data) {
        console.log('接受招募' + JSON.stringify(data))
        const { code } = data;
        if (code === '200') {
          //招募成功回首页
          wx.showModal({
            content: '恭喜您已加入素然服饰，快去转发你的产品赚钱吧！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/home/home'
                })
              }
            }
          });
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '手机号码或验证码输入错误',
        showCancel: false,
      })
    }
  },

  //转发
  onShareAppMessage: function (res) {
    console.log(this.data.storeId)
    return {
      title: '素然服饰招募啦',
      path: 'pages/recruiting/recruiting?isShare=true&storeId=' + this.data.storeId,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const that = this
    //判断是否登录
    let AuthToken = wx.getStorageSync('AuthToken')
    console.log(AuthToken)
    const { isShare, storeId } = options
    if (AuthToken == '' || AuthToken == null) {
      Login.userLogin().then(function () {
          that.setData({
            storeId: app.globalData.productStoreId,
            isSalesRep: app.globalData.isSalesRep
          })
        if (isShare) {
          that.setData({
            isShare: true,
            storeId: storeId,
          })
        }
      })
    } else {
      that.setData({
        storeId: app.globalData.productStoreId,
        isSalesRep: app.globalData.isSalesRep
      })
      if (isShare) {
        that.setData({
          isShare: true,
          storeId: storeId,
        })
      }
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