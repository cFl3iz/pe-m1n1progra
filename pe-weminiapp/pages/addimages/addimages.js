var Utils = require("../../utils/util.js");
import ServiceUrl from '../../utils/serviceUrl.js'
const ctx = wx.createCanvasContext('myCanvas'); // 压缩图片
var app = getApp()
import Request from '../../utils/request.js'
var datalist = {
    textareaFocus:true,                              // 文本域的自动调取键盘
    textareaVal: "",                                     // 文本域的val
    arrimg:[],           // 上传img的attr     => 页面显示的img                  
    len:4,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    successArr:[],      // 存储上传返回的img的url =>发送的数据
    questions:{},        // 提交数据存储到本地的josn
    bool: true,  // 是否通过上传的权限
    mun:0,
    tempFilePath:"",
    address:'',
    picturePaths:'',
    upLoadCount:0,
}

Page({
data:datalist,
onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 
  console.log('!!!!!!!!!!!!!!!!!!!!! app.globalData.unicodeId = ' + app.globalData.unicodeId)
    Utils.removeStorage("tw");
},
previewImage: function (e) {
  var current = e.target.dataset.src;
  wx.previewImage({
    current: current, // 当前显示图片的http链接  
    urls: this.data.arrimg // 需要预览的图片http链接列表  
  })
},
foreachUploada(e){
  let that = this
  let count = that.data.arrimg.length
  console.log('共'+count)
  for (var i in that.data.arrimg) { 
    console.log('Upload -> i = ' + i)
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
        picturePaths: that.data.picturePaths + JSON.parse(data).filePath + ',' ,
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
        that.releaseProduct(that.data.picturePaths,e);
      }
    }
  })

    uploadTask.onProgressUpdate((res) => {
    wx.showToast({
      title: '第' + (parseInt(i)+1)+'张:' + res.progress+'%',
      icon: 'loading',
      duration: 1000
     }) 
    // console.log('上传进度', res.progress)
    // console.log('已经上传的数据长度', res.totalBytesSent)
    // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
   

     }) 
    
  }
},
//图都传完了再发布产品
 releaseProduct(picturePaths,e){
   const that = this

   wx.showToast({
     title: '正在发布..',
     icon: 'loading',
     duration: 10000
   }) 


   const url = ServiceUrl.platformManager + 'releaseResource'
    
   

   const reqdata = {
      title: e.detail.value.title,
      kuCun: e.detail.value.count,
      desc: e.detail.value.desc,
      price: e.detail.value.price,
      unioId: app.globalData.unicodeId,
      filePaths: picturePaths
   } 
   Request.postRequest(url, reqdata).then(function (data) {
      
      console.log('release over - > = ' + JSON.stringify(data))
      let productId = data.productId
      wx.showToast({
        title: '发布成功!',
        icon: 'success',
        duration: 1000
      });
      wx.showModal({
        title: '提示',
        content: '发布成功!点击右上角,选择转发可以让交易更快达成!',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            that.goToSharePage(productId)
          } 
        }
      }) 
   })
   
 },
 goToSharePage: function (mapObj) {
   console.log('mapObj=' + mapObj)
   wx.redirectTo({
     url: "../previewreadResource/previewreadResource?productModel=" + this.data.productModel + "&productid=" + JSON.parse(mapObj).productId + "&payToPartyId=" + JSON.parse(mapObj).payToPartyId
   })
 },
formSubmit: function (e) {
  let that = this
  
  if (this.data.arrimg == '') {
    wx.showToast({
      title: '至少给一张图',
      icon: 'success',
      duration: 10000
    })
    return false
  }
  if (e.detail.value.title == '') {
    wx.showToast({
      title: '请填写标题',
      icon: 'success',
      duration: 10000
    })
    return false
  }
  wx.showToast({
    title: 'upload->oss',
    icon: 'loading',
    duration: 10000
  })
  that.foreachUploada(e);

  // wx.uploadFile({
  //   header: {
  //     'content-type': 'multipart/form-data' // 默认值
  //   },
  //   url: ServiceUrl.platformManager + 'releaseResource',
  //   filePath: this.data.arrimg,
  //   name: 'file',
  //   formData: {
  //     title: e.detail.value.title,
  //     kuCun: e.detail.value.count,
  //     desc: e.detail.value.desc,
  //     price: e.detail.value.price,
  //     unioId: app.globalData.unicodeId
  //   },
  //   success: function (res) {
  //     console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + res.data)
  //     wx.vibrateShort({
  //       complete: function (res) {
  //         wx.showToast({
  //           title: '发布成功!',
  //           icon: 'success',
  //           duration: 2000
  //         });
  //       }
  //       });


  //     let productId = res.data
  //     that.goToSharePage(productId)
     
  //   },
  //   fail: function (err) {
  //     console.log(err)
  //   }
  // })
},
submitFn: function () {   // 提交数据
    Utils.setStorage("Reset", "/pages/questions/questions");
    var _this = this;
    // 获取到  textarea的val
    var textareaVal = this.data.textareaVal;
    // 获取到上传成功返回的img的src the list
    var imgsList = this.data.successArr;
    // 获取到本地存储的数据
    var questions = _this.data.questions;
    // 提交的数据 不为空的话 那么就存储到本地

    if (textareaVal.trim() != "") {

    questions.textareaVal = textareaVal;
    questions.url = imgsList;
    Utils.setStorage("tw", questions);

    var value = wx.getStorageSync('login');
        if (value != "") {
            
            wx.navigateTo({
                    url: '/pages/questions/questions'
            })
        } else {
        
            wx.redirectTo({
                url: '/pages/forgot_password/forgot_password'
            })
        }
    }else{
        Utils.showModal("问题不能空");
        return false
    }
},
textareaFn: function (ev) {        // 输入动态获取textarea的value
    this.setData({
        textareaVal: ev.detail.value
    })
},
chooseimage:function(e){
    this.chooseImageFn();   // 上传的fn
},
getUserLocation:function(){
  let that = this
  wx.chooseLocation({
    success: function(res) {
        that.setData({
          address: res.address
        })
    },
  })
  // wx.getLocation({
  //   type: 'wgs84',
  //   success: function (res) {
  //     var latitude = res.latitude
  //     var longitude = res.longitude
  //     var speed = res.speed
  //     var accuracy = res.accuracy
  //     wx.openLocation({
  //       latitude: latitude,
  //       longitude: longitude,
  //       scale: 28
  //     })
  //   }
  // })
},
chooseImageFn:function(){   // 上传的fn
    var _this = this;
    var len = _this.data.len;   // 获取data的上传的总个数
    var mun = _this.data.index;  // 获取data的上传完成的个数
    var arr = _this.data.arrimg;         // 获取data的img的list 
    var suArr = _this.data.successArr; // 存储上传返回的img的src

    // 调取手机的上传
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {       // 成功
            console.log(res)
            var tempFilePaths = res.tempFilePaths[0].toString();
            len == mun ? mun = 4 : mun++;
            if (_this.data.index <= 3) {// 上传之前的验证个数
                arr.push(tempFilePaths);
                _this.setData({
                    arrimg: arr,
                    index: mun
                })
                console.log('arrimg =' + _this.data.arrimg)
                // wx.uploadFile({    
                //     url: Utils.url + '/index.php/upload?server=1',
                //     filePath: arr[arr.length - 1],
                //     name: 'file',
                //     formData: {
                //         'user': 'test'
                //     },
                //     success: function (res) {
                //         // 返回上传完成的img的src
                //         var path = Utils.url + JSON.parse(res.data).data.path;
                //         suArr.push(path);
                //         _this.setData({
                //             successArr: suArr
                //         })
                //     }
                // })
            }
        }
    })
},
closeImgFn:function(e){
    var doId = e.currentTarget.id;      // 对应的img的唯一id
    var doarrimg = this.data.arrimg;    // 页面显示的img the list    
    var doindex = this.data.index;   // 上传显示的个数
    var suArr = this.data.successArr;      // 发送的img的list的数组
    doarrimg.splice(doarrimg[doId], 1);     // 删除当前的下标的数组
    suArr.splice(suArr[doId], 1); 
    doindex --;       // 删除一个上传的个数就递减
    this.setData({
        arrimg: doarrimg,
        index: doindex,
        successArr: suArr
    })
},
getSetting:function(){  // 请求权限
    var _this = this ;
    wx.getSetting({
        success(res) {
            if (res.authSetting["scope.record"]) {
                if (_this.data.bool) {
                    wx.startRecord({
                        success: function (res) {
                            var tempFilePath = res.tempFilePath;
                            _this.setData({
                                tempFilePath: tempFilePath
                            })
                        }
                    })
                    _this.setData({
                        bool: false
                    })
                } else {
                    wx.stopRecord()
                    _this.setData({
                        bool: true
                    })
                }

            }
        }
    })
}
});