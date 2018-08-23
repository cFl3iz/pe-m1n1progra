var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    showPage: false,
    images: null,//资源图片
    productName: null,
    description: null,
    price: null,
    stock: null,
    tel: null,
    collectionCode: null,
    indicatorDots: false,//轮播图属性
    autoplay: false,
    interval: 5000,
    duration: 1000,
    showLeft: false,//添加字段选项
    group: [{
      id: 1,
      name: '描述',
      show: false
    }, {
      id: 2,
      name: '价格',
      show: false
    }, {
      id: 3,
      name: '库存',
      show: false
    }, {
      id: 4,
      name: '联系方式',
      show: false
    }],
    current: [],//已选择协同人员
    position: 'right',
  },

  //上传图片
  uploadImages() {
    $Toast({
      content: '上传图片..',
      type: 'loading',
      duration: 0,
      mask: false
    });
    const that = this
    let len = 0;
    const currentImagesUrl = []
    return new Promise(function (resolve, reject) {
      for (let image of that.data.images) {
        const uploadTask = wx.uploadFile({
          url: ServiceUrl.platformManager + 'uploadFileToOss',
          filePath: image,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log('上传图片返回', res)
            const { statusCode, data } = res
            const imageInfo = JSON.parse(data)
            currentImagesUrl.push(imageInfo.filePath)
            len++
            if (len == that.data.images.length) {
              resolve(currentImagesUrl)
            }
          },fail:function(err){
            console.log(err)
          }
        })
        uploadTask.onProgressUpdate((res) => {

        })
      }
    })
  },

  //发布产品调用接口
  releaseProduct: function (currentImagesUrl = []) {
    console.log(currentImagesUrl)
    const url = ServiceUrl.platformManager + 'releaseResource'
    const data = {
      unioId: app.globalData.openId,
      title: this.data.productName,
      desc: this.data.description,
      kuCun: this.data.stock||1,
      price: this.data.price||0,
      filePaths: currentImagesUrl,
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('发布产品======>>>>>>' + JSON.stringify(data))
      const { productId, code } = data;
      if (code === '200') {
        wx.reLaunch({
          url: '/pages/home/home',
        })
      }
    })
  },

  //点击发布按钮
  releaseClick:function(){
    const that=this
    this.uploadImages().then((currentImagesUrl)=>{
      that.releaseProduct(currentImagesUrl)
    })
  },

  //设置产品属性值
  setInputValue: function (e) {
    const attr = e.currentTarget.dataset.attr;
    const value = e.detail.detail.value
    switch (attr) {
      case 'productName':
        this.setData({
          productName: value
        })
        break;
      case 'description':
        this.setData({
          description: value
        })
        break;
      case 'price':
        this.setData({
          price: value
        })
        break;
      case 'stock':
        this.setData({
          stock: value
        })
        break;
      case 'tel':
        this.setData({
          tel: value
        })
        break;
      default:
        return
    }
  },

  //修改选中字段
  handleChange({ detail = {} }) {
    console.log(detail)
    let currentGroup = this.data.group
    for (let a of currentGroup) {
      if (a.name === detail.value) {
        a.show = !a.show
        break
      }
    }
    this.setData({
      group: currentGroup
    })
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
  },
  handleClick() {
    this.setData({
      position: this.data.position.indexOf('left') !== -1 ? 'right' : 'left',
    });
  },

  //添加字段
  toggleLeft: function () {
    this.setData({
      showLeft: !this.data.showLeft
    });
  },

  //物品拍照或选择图片
  cameraImage: function () {
    const that = this
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera','album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          images: tempFilePaths
        })
      }
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})