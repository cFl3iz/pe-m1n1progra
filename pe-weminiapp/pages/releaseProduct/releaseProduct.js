var app = getApp()
var Utils = require("../../utils/util.js");
import ServiceUrl from '../../utils/serviceUrl.js'
const ctx = wx.createCanvasContext('myCanvas'); // 压缩图片
import Request from '../../utils/request.js'
Page({
  data: {
    files: [],              //图片
    picturePaths: '',       //OSS返回的图片已“，”拼接，发布备用
    upLoadCount: 0,         //已上传张数
    showTopTips: true,      //高级选项切换
    countryCodeIndex: 0,
    countryIndex: 0,
    accountIndex: 0,
    title: null,
    desc: null,
    kuCun: null,
    price: null,
    unioId: null,
    pageType: 'create',      //定义当前页面为创建或编辑
    showDeleteIcon: false,   //是否显示删除图片Icon
    paymentCode: null,       //收款码  
    hasPaymentCode:false,    //是否使用旧的收款码      
  },

  //本地相册选择图片
  chooseImage: function (e) {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],     // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],          // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  //选择收款码
  choosePaymentCode: function () {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],     // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],          // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          paymentCode: res.tempFilePaths[0],
          hasPaymentCode:false
        });
      }
    })
  },

  //显示删除图片ICON
  showDeleteIcon: function () {
    this.setData({
      showDeleteIcon: !this.data.showDeleteIcon
    })
  },

  //高级选项
  switchChange: function (e) {
    this.setData({
      showTopTips: !e.detail.value
    })
  },

  //显示大图片
  previewImage: function (e) {
    if (!this.data.showDeleteIcon) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    }
  },

  //删除指定图片
  deleteImage: function (e) {
    const index = e.currentTarget.dataset.idx
    let data = this.data.files.filter((d, i) => {
      return i != index
    })
    this.setData({
      files: data
    })
  },

  //显示高级选项表单
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //上传收款方式二维码
  uploadQrCodeFile: function () {
    const that=this
    console.log(that.data.paymentCode)
    console.log(ServiceUrl.platformManager + 'uploadQrCodeFile')
    return new Promise(function (resolve, reject) {
      if (that.data.hasPaymentCode){
        resolve()
      }else{
        wx.uploadFile({
          url: ServiceUrl.platformManager + 'uploadQrCodeFile',
          filePath: that.data.paymentCode,
          name: 'file',
          formData: {
          },
          success: function (res) {
            console.log('上传收款方式二维码' + JSON.stringify(res))
            const { statusCode, data } = res
            if (statusCode === 200) {
              app.globalData.collectionQrCode = that.data.paymentCode    //设置全局收款二维码
              console.log(data)
              resolve(data)
            }
          }
        })
      }
    })
  },

  //上传商品相片
  foreachUploada(media_id) {

    let that = this
    let count = that.data.files.length  //发布商品图片数

    //上传相片产品图
    for (let image of that.data.files) {
      const uploadTask = wx.uploadFile({
        url: ServiceUrl.platformManager + 'uploadFileToOss',
        filePath: image,
        name: 'file',
        formData: {
        },
        success: function (res) {
          console.log('上传相片产品图' + JSON.stringify(res))
          that.setData({
            picturePaths: that.data.picturePaths + JSON.parse(res.data).filePath + ',',
            upLoadCount: parseInt(parseInt(that.data.upLoadCount) + 1)
          })
          if (that.data.upLoadCount == count) {
            that.releaseProduct(media_id);//上传完毕发布商品
          }
        }
      })

      //上传进度
      uploadTask.onProgressUpdate((res) => {
        console.log(res)
      })
    }
  },

  //发布产品
  releaseProduct: function (media_id='') {
    const url = ServiceUrl.platformManager + 'releaseResource'
    const data = {
      unioId: app.globalData.openId,
      title: this.data.title,
      desc: this.data.desc,
      kuCun: this.data.kuCun,
      price: this.data.price,
      filePaths: this.data.picturePaths,
      media_id: media_id
    }
    console.log('发布产品参数======>>>>>>' + JSON.stringify(data))
    Request.postRequest(url, data).then(function (data) {
      console.log('发布产品======>>>>>>' + JSON.stringify(data))
      const { productId, code } = data;
      if (code === '200') {
        wx.showToast({
          title: '发布成功!',
          icon: 'success',
          duration: 1000
        });
        wx.redirectTo({
          url: '/pages/products_2C/products_2C',
        })
      }
    })
  },

  //提交表单
  onSubmit: function (e) {

    //验证表单
    if (e.detail.value.title===''){
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } else if (e.detail.value.price === ''){
      wx.showModal({
        title: '提示',
        content: '价格不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } else if (this.data.paymentCode==null){
      wx.showModal({
        title: '提示',
        content: '收款码不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } else if (this.data.files.length===0) {
      wx.showModal({
        title: '提示',
        content: '至少上传一张产品图片',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }

    //发布步骤 1.上传收款码(如果已存在未替换不需要再次上传)2.上传商品图3.发布接口
    
    wx.showLoading({
      title: '发布中...',
    })
    const that=this
    this.setData({
      title: e.detail.value.title,
      desc: e.detail.value.desc,
      kuCun: e.detail.value.kuCun,
      price: e.detail.value.price,
      unioId: app.globalData.openId,
    })

    this.uploadQrCodeFile().then(function (media_id){
      that.foreachUploada(media_id)
    })
  },

  onLoad: function (options) {

    //判断是否存在收款码
    console.log('判断是否存在收款码==>'+app.globalData.collectionQrCode)
    if (app.globalData.collectionQrCode) {
      this.setData({
        paymentCode: app.globalData.collectionQrCode,
        hasPaymentCode:true
      })
    }

    //是否是编辑页面
    const { productData, pageType } = options
    if (pageType === 'edit') {
      wx.setNavigationBarTitle({
        title: '编辑产品'
      })
      const data = JSON.parse(productData)
      const files = []
      files.push('https://' + data.detailImageUrl)
      for (let a of data.morePicture) {
        files.push('https://' + a.drObjectInfo)
      }
      this.setData({
        pageType: pageType,
        title: data.productName,
        desc: data.description,
        kuCun: data.quantityOnHandTotal,
        price: data.price,
        unioId: app.globalData.openId,
        files: files
      })
    }
  },
});