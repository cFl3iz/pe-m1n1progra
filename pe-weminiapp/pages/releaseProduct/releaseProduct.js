var app = getApp()
var Utils = require("../../utils/util.js");
import ServiceUrl from '../../utils/serviceUrl.js'
const ctx = wx.createCanvasContext('myCanvas'); // 压缩图片
import Request from '../../utils/request.js'
Page({
  data: {
    files: [],          //图片
    picturePaths: '',    //OSS返回的图片已“，”拼接，发布备用
    upLoadCount: 0,      //已上传张数
    showTopTips: true,  //高级选项切换
    date: "2016-09-01",
    time: "12:01",
    countryCodeIndex: 0,
    countryIndex: 0,
    accountIndex: 0,
    isAgree: false
  },
  //选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  //高级选项
  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      showTopTips: !e.detail.value
    })
  },
  //显示大图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //表单
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
  //上传相片
  foreachUploada(inputData) {
    let that = this
    let count = that.data.files.length
    console.log('共' + count)
    for (let image of that.data.files) {
      const uploadTask = wx.uploadFile({
        url: ServiceUrl.platformManager + 'uploadFileToOss', //仅为示例，非真实的接口地址
        filePath: image,
        name: 'file',
        formData: {
        },
        success: function (res) {
          that.setData({
            picturePaths: that.data.picturePaths + JSON.parse(res.data).filePath + ',',
            upLoadCount: parseInt(parseInt(that.data.upLoadCount) + 1)
          })
          if (that.data.upLoadCount == count) {
            // wx.showToast({
            //   title: '上传完毕',
            //   icon: 'success',
            //   duration: 2000
            // })
            that.releaseProduct(inputData);
          }
        }
      })
      uploadTask.onProgressUpdate((res) => {
        wx.showToast({
          title: '发布中',
          icon: 'loading',
          duration: 6000
        })
      })
    }
  },
  //发布产品
  releaseProduct: function (inputData) {
    inputData.filePaths = this.data.picturePaths
    const url = ServiceUrl.platformManager + 'releaseResource'
    Request.postRequest(url, inputData).then(function (data) {
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
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../myProduct/myProduct'
            })
          }
        }
      })
    })
  },
  //提交表单
  onSubmit: function (e) {
    const inputData = {
      title: e.detail.value.title,
      desc: e.detail.value.desc,
      kuCun: e.detail.value.kuCun,
      price: e.detail.value.price,
      unioId: app.globalData.unicodeId,
    }
    this.foreachUploada(inputData)
  }
});
// var datalist = {
//   textareaFocus: true,                              // 文本域的自动调取键盘
//   textareaVal: "",                                     // 文本域的val
//   arrimg: [],           // 上传img的attr     => 页面显示的img                  
//   len: 4,              // 上传的img的最大的length
//   index: 0,         // 上传完成的个数
//   successArr: [],      // 存储上传返回的img的url =>发送的数据
//   questions: {},        // 提交数据存储到本地的josn
//   bool: true,  // 是否通过上传的权限
//   mun: 1,
//   tempFilePath: "",
//   address: '',
//   picturePaths: '',
//   upLoadCount: 0,
//   latitude: '',
//   longitude: '',
//   tel: '',
//   grantPermission:false
// }

// Page({
//   data: datalist,
//   onLoad: function (options) {
//     // 页面初始化 options为页面跳转所带来的参数 
//     console.log('!!!!!!!!!!!!!!!!!!!!! app.globalData.unicodeId = ' + app.globalData.unicodeId)
//     Utils.removeStorage("tw");
//     var tel = app.globalData.contactInfo.contactTel
//     this.setData({
//       tel: tel
//     })
//   },
//   previewImage: function (e) {
//     var current = e.target.dataset.src;

//     wx.previewImage({
//       current: current, // 当前显示图片的http链接  
//       urls: this.data.arrimg // 需要预览的图片http链接列表  
//     })
//   },
//   getPhoneNumber: function (e) {
//     var that = this
//     that.setData({
//       grantPermission:true
//     })
//     console.log(e.detail.errMsg)
//     console.log(e.detail.iv)
//     console.log(e.detail.encryptedData)
//     if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
//       wx.showModal({
//         title: '提示',
//         showCancel: false,
//         content: '(灬ꈍ ꈍ灬)不要拒绝嘛~',
//         success: function (res) { }
//       })
//     } else {
//       wx.showModal({
//         title: '提示',
//         showCancel: false,
//         content: '已授权',
//         success: function (res) {
//           that.getTelFromEncryptedData(e.detail.iv, e.detail.encryptedData);
//         }
//       })
//     }
//   },
//   //去后台解密拿手机号
//   getTelFromEncryptedData(iv, encryptedData) {
//     var that = this
//     wx.login({
//       success: function (loginok) {

//         var code = loginok.code;
//         console.log('getTelFromEncryptedData code=' + code)
//         console.log('getTelFromEncryptedData iv=' + iv)
//         console.log('getTelFromEncryptedData encryptedData=' + encryptedData)
//         const data = {
//           code: code,
//           iv: iv,
//           encryptedData: encryptedData
//         }

//         Request.postRequest('https://www.yo-pe.com/api/common/getTelFromEncryptedData', data).then
//           (
//           function (data) {

//             console.log('data=' + JSON.stringify(data))

//             if (data.code == 200) {
//               that.setData(
//                 {
//                   tel: data.tel
//                 }
//               )
//             } else { 
//             } 
//           }
//           ) 
//       }
//     }) 
//   },
//   foreachUploada(e) {
//     let that = this
//     let count = that.data.arrimg.length
//     console.log('共' + count)
//     for (var i in that.data.arrimg) {
//       console.log('Upload -> i = ' + i)
//       const uploadTask = wx.uploadFile({
//         url: ServiceUrl.platformManager + 'uploadFileToOss', //仅为示例，非真实的接口地址
//         filePath: that.data.arrimg[i],
//         name: 'file',
//         formData: {
//         },
//         success: function (res) {
//           var data = res.data
//           console.log('data = ' + JSON.stringify(data))
//           that.setData({
//             picturePaths: that.data.picturePaths + JSON.parse(data).filePath + ',',
//             upLoadCount: parseInt(parseInt(that.data.upLoadCount) + 1)
//           })
//           //do something
//           console.log('that.data.upLoadCount=' + that.data.upLoadCount)
//           console.log('count=' + count)
//           if (that.data.upLoadCount == count) {
//             console.log('Over that.data.picturePaths = ' + that.data.picturePaths)
//             wx.showToast({
//               title: '上传完毕',
//               icon: 'success',
//               duration: 2000
//             })
//             that.releaseProduct(that.data.picturePaths, e);
//           }
//         }
//       })
//       uploadTask.onProgressUpdate((res) => {
//         wx.showToast({
//           title: '第' + (parseInt(i) + 1) + '张:' + res.progress + '%',
//           icon: 'loading',
//           duration: 1000
//         })
//       })
//     }
//   },
//   //图传完发布产品
//   releaseProduct(picturePaths, e) {
//     const that = this
//     wx.showToast({
//       title: '正在发布..',
//       icon: 'loading',
//       duration: 10000
//     })

//     const url = ServiceUrl.platformManager + 'releaseResource'


//     var tel = that.data.tel
//     const reqdata = {
//       title: e.detail.value.title,
//       kuCun: e.detail.value.count,
//       desc: e.detail.value.desc,
//       price: e.detail.value.price,
//       unioId: app.globalData.unicodeId,
//       address: e.detail.value.address,
//       latitude: that.data.latitude,
//       longitude: that.data.longitude,
//       filePaths: picturePaths,
//       tel: tel == null ? '' : tel
//     }
//     Request.postRequest(url, reqdata).then(function (data) {

//       console.log('release over - > = ' + JSON.stringify(data))
//       let productId = data.productId
//       wx.showToast({
//         title: '发布成功!',
//         icon: 'success',
//         duration: 1000
//       });
//       wx.showModal({
//         title: '提示',
//         content: '发布成功!点击右上角,选择转发可以让交易更快达成!',
//         showCancel: false,
//         success: function (res) {
//           if (res.confirm) {
//             that.goToSharePage(data)
//           }
//         }
//       })
//     })

//   },
//   goToSharePage: function (mapObj) {
//     console.log('mapObj=' + JSON.stringify(mapObj))
//     wx.redirectTo({
//       url: "../previewreadResource/previewreadResource?productModel=" + this.data.productModel + "&productid=" + mapObj.productId + "&payToPartyId=" + mapObj.payToPartyId
//     })
//   },
//   formSubmit: function (e) {
//     let that = this

//     if (this.data.arrimg == '') {
//       wx.showToast({
//         title: '至少给一张图',
//         icon: 'success',
//         duration: 10000
//       })
//       return false
//     }
//     if (e.detail.value.title == '') {
//       wx.showToast({
//         title: '请填写标题',
//         icon: 'success',
//         duration: 10000
//       })
//       return false
//     }
//     wx.showToast({
//       title: 'upload->oss',
//       icon: 'loading',
//       duration: 10000
//     })
//     that.foreachUploada(e);
//   },
//   submitFn: function () {   // 提交数据
//     Utils.setStorage("Reset", "/pages/questions/questions");
//     var _this = this;
//     // 获取到  textarea的val
//     var textareaVal = this.data.textareaVal;
//     // 获取到上传成功返回的img的src the list
//     var imgsList = this.data.successArr;
//     // 获取到本地存储的数据
//     var questions = _this.data.questions;
//     // 提交的数据 不为空的话 那么就存储到本地

//     if (textareaVal.trim() != "") {

//       questions.textareaVal = textareaVal;
//       questions.url = imgsList;
//       Utils.setStorage("tw", questions);

//       var value = wx.getStorageSync('login');
//       if (value != "") {

//         wx.navigateTo({
//           url: '/pages/questions/questions'
//         })
//       } else {

//         wx.redirectTo({
//           url: '/pages/forgot_password/forgot_password'
//         })
//       }
//     } else {
//       Utils.showModal("问题不能空");
//       return false
//     }
//   },
//   textareaFn: function (ev) {        // 输入动态获取textarea的value
//     this.setData({
//       textareaVal: ev.detail.value
//     })
//   },
//   chooseimage: function (e) {
//     this.chooseImageFn();   // 上传的fn
//   },
//   getUserLocation: function () {
//     let that = this
//     wx.chooseLocation({
//       success: function (res) {
//         console.log('getUserLocation - > ' + res.latitude);
//         console.log('getUserLocation - > ' + res.longitude);
//         that.setData({
//           address: res.address,
//           latitude: res.latitude,
//           longitude: res.longitude
//         })
//       },
//     })
//   },
//   chooseImageFn: function () {   // 上传的fn 
//     var _this = this;
//     var len = _this.data.len;   // 获取data的上传的总个数
//     var mun = _this.data.index;  // 获取data的上传完成的个数
//     var arr = _this.data.arrimg;         // 获取data的img的list 
//     var suArr = _this.data.successArr; // 存储上传返回的img的src

//     // 调取手机的上传
//     wx.chooseImage({
//       count: 4,
//       sizeType: ['compressed'],
//       sourceType: ['album', 'camera'],
//       success: function (res) {       // 成功
//         console.log(res)
//         // var tempFilePaths = res.tempFilePaths[0].toString();
//         var filePathArray = res.tempFilePaths;
//         console.log('tempFilePaths=' + JSON.stringify(filePathArray))
//         let mun = _this.data.mun;
//         let dataIndex = _this.data.index;
//         console.log('->data Index = ' + dataIndex);
//         if (dataIndex != 0) {

//           let arrIndex = filePathArray.length;
//           console.log('data index in arrIndex=' + arrIndex);
//           for (let path of filePathArray) {
//             // len == mun ? mun = 4 : mun++;
//             if (_this.data.index <= 3) {// 上传之前的验证个数
//               arr.push(path);
//               _this.setData({
//                 arrimg: arr
//               })
//               console.log('arrimg =' + _this.data.arrimg)
//             }
//           }
//           if (_this.data.index <= 3) {
//             _this.setData({
//               index: _this.data.index + arrIndex
//             })
//           }
//         } else {
//           for (let path of filePathArray) {
//             // len == mun ? mun = 4 : mun++;
//             if (_this.data.index <= 3) {// 上传之前的验证个数
//               arr.push(path);
//               _this.setData({
//                 arrimg: arr,
//                 index: mun
//               })
//               console.log('arrimg =' + _this.data.arrimg)
//             }
//             mun++;
//           }
//         }
//       }
//     })
//   },
//   closeImgFn: function (e) {
//     var doId = e.currentTarget.id;      // 对应的img的唯一id
//     console.log('del doId=' + doId)
//     var doarrimg = this.data.arrimg;    // 页面显示的img the list    
//     var doindex = this.data.index;   // 上传显示的个数
//     console.log('del doindex=' + doindex)
//     console.log('del doarrimg=' + doarrimg[doId])
//     doarrimg.splice(doId, 1);     // 删除当前的下标的数组
//     doindex--;       // 删除一个上传的个数就递减
//     this.setData({
//       arrimg: doarrimg,
//       index: doindex
//     })
//   },
//   getSetting: function () {  // 请求权限
//     var _this = this;
//     wx.getSetting({
//       success(res) {
//         if (res.authSetting["scope.record"]) {
//           if (_this.data.bool) {
//             wx.startRecord({
//               success: function (res) {
//                 var tempFilePath = res.tempFilePath;
//                 _this.setData({
//                   tempFilePath: tempFilePath
//                 })
//               }
//             })
//             _this.setData({
//               bool: false
//             })
//           } else {
//             wx.stopRecord()
//             _this.setData({
//               bool: true
//             })
//           }
//         }
//       }
//     })
//   }
// });