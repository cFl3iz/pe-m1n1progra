// pages/qrCode/qrCode.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: null
  },
  saveImgToPhotosAlbumTap: function () {
    wx.downloadFile({
      url: this.data.img_url,
      success: function (res) {
        console.log(res)
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log(res)
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (res) {
                console.log(res)
                wx.showToast({
                  title: '保存失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail:function(){
            wx.showToast({
              title: '获取保存相册权限失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '下载图片失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      img_url: app.globalData.qrPath
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})