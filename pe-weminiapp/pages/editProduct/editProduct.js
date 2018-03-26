import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
Page({
  data: {
    morePicture: [],
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 4,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    successArr: [],      // 存储上传返回的img的url =>发送的数据
    questions: {},        // 提交数据存储到本地的josn
    bool: true,  // 是否通过上传的权限
    mun: 1,
    tempFilePath: "",
    picturePaths: '',
    upLoadCount: 0,
    productId: '',
    nowPartyId: '',
    productDetail: null,
    shareName: '',
    comments: [],
    availableToPromiseTotal: null,
    contactTel: null,
    latitude: '',
    longitude: '',
    address: ''
  },
  onLoad: function (options) {
    var that = this
    console.log('this. data . productid = ' + options.productid)
    this.setData(
      {
        productId: options.productid
      }
    )
    that.flushData(options.productid)
  },
  chooseimage: function (e) {
    this.chooseImageFn();   // 上传的fn
  },

  chooseImageFn: function () {   // 上传的fn 
    var _this = this;
    var len = _this.data.len;   // 获取data的上传的总个数
    var mun = _this.data.index;  // 获取data的上传完成的个数
    var arr = _this.data.arrimg;         // 获取data的img的list 
    var suArr = _this.data.successArr; // 存储上传返回的img的src

    // 调取手机的上传
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {       // 成功
        console.log(res)
        // var tempFilePaths = res.tempFilePaths[0].toString();
        var filePathArray = res.tempFilePaths;
        console.log('tempFilePaths=' + JSON.stringify(filePathArray))
        let mun = _this.data.mun;
        let dataIndex = _this.data.index;
        console.log('->data Index = ' + dataIndex);
        if (dataIndex != 0) {

          let arrIndex = filePathArray.length;
          console.log('data index in arrIndex=' + arrIndex);
          for (let path of filePathArray) {
            // len == mun ? mun = 4 : mun++;
            if (_this.data.index <= 3) {// 上传之前的验证个数
              arr.push(path);
              var onePicture = {
                contentId: 'NA',
                drObjectInfo: path
              }
              var tempPictures = _this.data.morePicture
              tempPictures.unshift(onePicture)
              _this.setData({
                arrimg: arr,
                morePicture: tempPictures
              })
              console.log('arrimg =' + _this.data.arrimg)
            }
          }
          if (_this.data.index <= 3) {
            _this.setData({
              index: _this.data.index + arrIndex
            })
          }
        } else {
          for (let path of filePathArray) {
            // len == mun ? mun = 4 : mun++;
            if (_this.data.index <= 3) {// 上传之前的验证个数
              arr.push(path);

              var onePicture = {
                contentId: 'NA',
                drObjectInfo: path
              }
              var tempPictures = _this.data.morePicture
              tempPictures.unshift(onePicture)

              _this.setData({
                arrimg: arr,
                morePicture: tempPictures,
                index: mun
              })
              console.log('arrimg =' + _this.data.arrimg)
            }
            mun++;
          }
        }
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log('this.data.arrimg=' + this.data.arrimg)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.arrimg // 需要预览的图片http链接列表  
    })
  },

  flushData: function (productid) {
    console.log(' flush data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    var that = this
    const data = {
      unioId: app.globalData.unicodeId,
      productId: productid
    }
    Request.postRequest('https://www.yo-pe.com/api/common/queryResourceDetail', data).then
      (
      function (data) {

        var cover_url = data.resourceDetail.cover_url
        if (null != cover_url && cover_url != '') {


          var map = {
            drObjectInfo: cover_url,
            contentId: '308561217_784838898'
          };
          data.resourceDetail.morePicture.unshift(map)
        }
        var tempArray = []
        for (var key of data.resourceDetail.morePicture) {
          console.log('key=' + key);
          tempArray.unshift("https://" + key.drObjectInfo)
          key.drObjectInfo = "https://" + key.drObjectInfo
        }

        that.setData({
          nowPartyId: data.nowPartyId,
          productDetail: data.resourceDetail,
          shareName: data.resourceDetail.title,
          comments: data.resourceDetail.tuCaoList,
          availableToPromiseTotal: data.resourceDetail.availableToPromiseTotal,
          contactTel: data.resourceDetail.contactNumber,
          arrimg: tempArray,
          morePicture: data.resourceDetail.morePicture,
          dataIndex: data.resourceDetail.morePicture.length,
          index: data.resourceDetail.morePicture.length
        })
        wx.hideLoading()
        console.log('dataIndex = ' + that.data.dataIndex)

      }
      )
  },
  closeImgFn: function (e) {



    var contentId = e.currentTarget.id.substr(e.currentTarget.id.indexOf('/') + 1);

    var doId = e.currentTarget.id.substr(0, e.currentTarget.id.indexOf('/'));

    console.log('del contentId=' + contentId)
    console.log('del doId=' + doId)
    var doarrimg = this.data.arrimg;    // 页面显示的img the list    
    var doindex = this.data.index;   // 上传显示的个数
    console.log('del doindex=' + doindex)
    console.log('del doarrimg=' + doarrimg[doId])
    doarrimg.splice(doId, 1);     // 删除当前的下标的数组
    doindex--;       // 删除一个上传的个数就递减

    var tempPictures = this.data.morePicture
    tempPictures.splice(doId, 1)
    this.setData({
      arrimg: doarrimg,
      index: doindex,
      morePicture: tempPictures
    })

    console.log('tempPictures=' + JSON.stringify(tempPictures))
    var that = this
    if (contentId != null && contentId != 'NA') {
      //说明要删后台及OSS数据
      const url = ServiceUrl.platformManager + 'removeResourcePicture'

      const reqdata = {
        productId: that.data.productId,
        contentId: contentId
      }
      Request.postRequest(url, reqdata).then(function (data) {

        console.log('delete picture - > = ' + JSON.stringify(data))
        wx.showToast({
          title: '已删除!',
          icon: 'success',
          duration: 2000
        })
        that.flushData(that.data.productId)
      })
    }



  },
  formSubmit: function (e) {
    let that = this

    if (e.detail.value.title == '') {
      wx.showToast({
        title: '请填写标题',
        icon: 'success',
        duration: 10000
      })
      return false
    }

    that.releaseProduct(e)
  },
  getUserLocation: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        console.log('getUserLocation - > ' + res.latitude);
        console.log('getUserLocation - > ' + res.longitude);
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  },


  foreachUploada(e) {
    let that = this
    let count = 0
    //说明这是没有持久化过的新图,这个我才传
    console.log('that.data.arrimg=' + JSON.stringify(that.data.arrimg))
    for (var i in that.data.arrimg) {
      if (that.data.arrimg[i].indexOf('http://tmp/') >= 0) {
        count++
      }
    }
    console.log('共' + count)
    if (count > 0) {


      // wx.showLoading({
      //   title: '正在更新..',
      // })
      wx.showToast({
        title: '正在更新',
        icon: 'success',
        duration: 9999
      })


      for (var i in that.data.arrimg) {
        console.log('Upload -> i = ' + i)
        //说明这是没有持久化过的新图,这个我才传
        if (that.data.arrimg[i].indexOf('http://tmp/') >= 0) {
          const uploadTask = wx.uploadFile({
            url: ServiceUrl.platformManager + 'uploadFileToOss', //仅为示例，非真实的接口地址
            filePath: that.data.arrimg[i],
            name: 'file',
            formData: {
            },
            success: function (res) {
              var data = res.data
              console.log('data = ' + JSON.stringify(data))
              that.setData({
                picturePaths: that.data.picturePaths + JSON.parse(data).filePath + ',',
                upLoadCount: parseInt(parseInt(that.data.upLoadCount) + 1)
              })
              //do something
              console.log('that.data.upLoadCount=' + that.data.upLoadCount)
              console.log('count=' + count)
              if (that.data.upLoadCount == count) {
                console.log('Over that.data.picturePaths = ' + that.data.picturePaths)
                wx.showToast({
                  title: '上传完毕',
                  icon: 'success',
                  duration: 2000
                })
                that.updateProduct(that.data.picturePaths, e);
              }
            }
          })

          uploadTask.onProgressUpdate((res) => {
            wx.showToast({
              title: '跑图中:' + res.progress + '%',
              icon: 'loading',
              duration: 1000
            })
            wx.showToast({
              title: '请稍后..',
              icon: 'success',
              duration: 9999
            })
          })

        }
      }
    } else {
      that.updateProduct('', e);
    }
  },
  //更新产品
  updateProduct: function (picturePaths, e) {
    const that = this
    wx.showToast({
      title: '正在更新..',
      icon: 'loading',
      duration: 10000
    })


    const url = ServiceUrl.platformManager + 'updateResource'


    console.log('go to update resource' + that.data.latitude)
    var tel = that.data.contactTel
    const reqdata = {
      filePaths: picturePaths,
      productId: that.data.productId,
      title: e.detail.value.title,
      kuCun: e.detail.value.count,
      desc: e.detail.value.desc,
      price: e.detail.value.price,
      unioId: app.globalData.unicodeId,
      address: e.detail.value.address,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      tel: e.detail.value.tel
    }
    Request.postRequest(url, reqdata).then(function (data) {

      console.log('update over - > = ' + JSON.stringify(data))
      wx.showToast({
        title: '更新完毕',
        icon: 'success',
        duration: 2000
      })
      that.flushData(that.data.productId)
    })
  },


  //BTN按钮点击事件
  releaseProduct(e) {
    if (this.data.arrimg == '') {
      wx.showToast({
        title: '至少给一张图',
        icon: 'success',
        duration: 10000
      })
      return false
    }
    this.foreachUploada(e)

  },

})