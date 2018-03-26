
var app = getApp()
var page = undefined;
// common utils.js
let utils = require('../../utils/util.js');
import Request from '../../utils/request.js'
import ServiceUrl from '../../utils/serviceUrl.js'
var items = [{ id: '0', desc: '卖家是我的亲戚', name: '亲戚' }, { id: '02', desc: '卖家是我的朋友', name: '朋友' }]
// mybook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    salerName: null,
    relationList:null,
    num: 1,
    minusStatus: 'disabled',
    actionSheetHidden: true,
    actionSheetItems: items,
    nowPartyId: '',
    contactTel: '',
    hiddenmodalput: true,
    availableToPromiseTotal: null,
    payToPartyId: '',
    doommData: [],
    productid: null,
    productModel: '',
    shareName: '',
    bookInfo: {}, // 书本信息
    bookInfoData: {}, // 书本信息不更新到页面
    commentPageNum: 1, // 评论页码
    comments: [], //评论数量
    isComment: 1, // 是否有评论，0 有， 1 无
    showComment: false // 输入评论, 
  },
  actionSheetTap: function (e) {
    console.log(this);
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    console.log("点击ation-sheet-cancel，会触发action-sheet绑定的事件。在这里可以通过改变hidden控制菜单的隐藏");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.showToast({
      title: '正在处理',
      icon: 'loading',
      duration: 2500
    })

    var spm = options.spm 
    page = this;
    for (var i = 0; i < items.length; ++i) {
      (function (relation) {
        page['bind' + relation] = function (e) {
          var selectRelation = e.currentTarget.dataset.item
          console.log('select ' + JSON.stringify(selectRelation))
          if (selectRelation.id == '0') {
            wx.showToast({
              title: '已是' + selectRelation.name + '了',
              icon: 'success',
              duration: 2000
            });
          } else {
            // 增加关联
            const url = ServiceUrl.platformManager + 'addPartyRelationShip' 
          

            const reqdata = {
              partyIdTo: this.data.payToPartyId,
              tarjeta: this.data.bookInfo.tarjeta,
              partyRelationshipTypeId: selectRelation.id
            } 
            var that = this
            Request.postRequest(url, reqdata).then(function (data) {
               
              if (data.code === '200') {
                wx.showToast({
                  title: '关联成功!',
                  icon: 'success',
                  duration: 2000
                });
                that.flushData(that.data.productid).then(
                  (data) => {
                    console.log('data=' + JSON.stringify(data))
                     
                    that.setData({
                      actionSheetItems: data.resourceDetail.returnPersonalRelationsTypeList,
                      relationList: data.resourceDetail.returnRelationsList,
                      salerName: data.resourceDetail.user.firstName
                    });
                   
                  }
                )

              }
            });
          }

          this.setData({
            actionSheetHidden:true
          })


        }
      })(items[i])
    }
    const that = this

    var unicodeId = app.globalData.unicodeId

    console.log('unicodeId=>' + unicodeId)

  
      app.weChatLogin().then(function (data) {
        app.getUnionId(data)
      
      })

    unicodeId = app.globalData.unicodeId

    console.log(' after unicodeId=>' + unicodeId)
    console.log('options.productid=>' + options.productid)
    console.log('options.paytopartyid=>' + options.paytopartyid)


    that.setData({
      productid: options.productid,
      productModel: options.productModel,
      payToPartyId: options.paytopartyid
      // bookInfo: options,
      // bookInfoData: options
    });

    that.flushData(options.productid).then(
      (data) => {
        console.log('data='+JSON.stringify(data))
        this.receivedInformation(spm, options.paytopartyid)
        this.setData({
          actionSheetItems: data.resourceDetail.returnPersonalRelationsTypeList,
          relationList: data.resourceDetail.returnRelationsList,
          salerName: data.resourceDetail.user.firstName
        });
        // wx.hideLoading() 
        wx.hideToast();
      }
    )




    wx.setNavigationBarTitle({
      // title: that.data.bookInfo.title
      title: '资源介绍'
    });

    // that.getCollectProduct();
    
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    if (num + 1 > this.data.availableToPromiseTotal) {
      wx.showToast({
        title: '库存仅' + this.data.availableToPromiseTotal + '件!',
        icon: 'success',
        duration: 2000
      });
      this.setData({
        num: 1
      })
      return
    }
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    return false;
    // var num = e.detail.value;
    // // 将数值与状态写回  
    // this.setData({
    //   num: num
    // });
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var that = this
    console.log('current=' + current)
    var pictureArray = []
    //   pictureArray = that.data.bookInfo.morePicture
    console.log('that.data.bookInfo.morePicture=' + JSON.stringify(that.data.bookInfo.morePicture))

    if (that.data.bookInfo.morePicture.length == 0 || that.data.bookInfo.morePicture[0].drObjectInfo == null) {
      pictureArray.push(current)
    } else {
      for (var i = 0; i < that.data.bookInfo.morePicture.length; i++) {
        var rowPic = that.data.bookInfo.morePicture[i]
        pictureArray.push('https://' + rowPic.drObjectInfo)
      }
    }
    console.log(pictureArray)

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: pictureArray // 需要预览的图片http链接列表  
    })
  },
  getCollectProduct: function () {
    const that = this

    const url = ServiceUrl.platformManager + 'queryCustRequestListByProduct'
    //const url = ServiceUrl.platformManager + 'queryCustRequestList'
    let productId = that.data.productid

    const reqdata = {
      productId: productId
    }
    // const reqdata = {
    //   unioId: 'o3kcL1sG1pwsuWLCcfRaCbVdx66A'
    // }
    Request.postRequest(url, reqdata).then(function (data) {
      console.log("请求列表->:" + JSON.stringify(reqdata))
      console.log("请求列表:" + JSON.stringify(data))

      const { code: code, custRequestList: custRequestList } = data
      if (code === '200') {
        for (var custRequest in custRequestList) {
          var line = custRequestList[custRequest].createdDate + custRequestList[custRequest].user.firstName + '购买过..';
          doommList.push(new Doomm(line, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
          that.setData({
            doommData: doommList
          })
        }

      }


    })
  },
  bindbt: function () {
    doommList.push(new Doomm("龙熙购买过", Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
    this.setData({
      doommData: doommList
    })
  },
  goHome: function (e) {
    console.log('go home ')
    wx.reLaunch({
      url: '../dimensionsRetrieve/dimensionsRetrieve'
    })
  },
  contactB: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.contactTel //仅为示例，并非真实的电话号码
    })
  },//取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
    this.buyProduct('无备注');
  },
  input: function (e) {
    this.setData({
      'remark': e.detail['value']
    })

  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
    this.buyProduct(this.data.remark);
  },
  buyProduct(remark) {

    console.log('remark == ' + remark)
    console.log('productid=' + this.data.productid)
    console.log('payToPartyId=' + this.data.payToPartyId)

    var that = this


    const data = {
      productId: this.data.productid,
      payToPartyId: this.data.payToPartyId,
      unioId: app.globalData.unicodeId,
      tarjeta: this.data.bookInfo.tarjeta,
      productStoreId: this.data.bookInfo.productStoreId,
      prodCatalogId: this.data.bookInfo.prodCatalogId,
      remark: remark,
      amount: this.data.num
    }
    Request.postRequest('https://www.yo-pe.com/api/common/buyProduct', data).then
      (
      function (data) {
        console.log('>>>>>>>>>>>>>>>>>>>>>> data = ' + JSON.stringify(data))
        wx.vibrateShort({
          complete: function (res) {
            wx.showToast({
              title: '下单成功!',
              icon: 'success',
              duration: 2000
            });
            that.selectAddress(data.orderId).then(
              (data) => {
                console.log('select address result = ' + JSON.stringify(data))
                that.goOrderPage(app.globalData.unicodeId)
              }
            );
          }
        });
      }
      )

  },
  selectAddress: function (orderId) {
    var that = this
    return new Promise(function (resolve, reject) {
      //选择收货地址
      wx.chooseAddress({
        success: function (res) {
          console.log(res.userName)
          console.log(res.postalCode)
          console.log(res.provinceName)
          console.log(res.cityName)
          console.log(res.countyName)
          console.log(res.detailInfo)
          console.log(res.nationalCode)
          console.log(res.telNumber)

          const createShipAddressdata = {
            tarjeta: that.data.bookInfo.tarjeta,
            userName: res.userName,
            postalCode: res.postalCode,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            nationalCode: res.nationalCode,
            telNumber: res.telNumber,
            orderId: orderId
          }
          Request.postRequest('https://www.yo-pe.com/api/common/createPersonPartyPostalAddress', createShipAddressdata).then
            (
            function (data) {
              resolve(data)


            }
            )


        },
        fail: function (err) {
          that.selectAddress(orderId)
        }

      })

    });

  },
  goOrderPage: function (unioId) {
    wx.showToast({
      title: '已确认地址',
      icon: 'success',
      duration: 1000
    });
    console.log('unioId=' + unioId)
    wx.switchTab({
      url: "../order/order?unioId=" + unioId,
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onShow(unioId);
      }
    })
  },
  contactC: function () {
    var that = this
    var availableToPromiseTotal = that.data.availableToPromiseTotal
    console.log('that - data - availableToPromiseTotal = ' + availableToPromiseTotal)
    //如果卖家不限制库存,那么可以买?
    if (null == availableToPromiseTotal || parseInt(availableToPromiseTotal) > 0) {
      this.setData({
        hiddenmodalput: false
      })
    } else {
      wx.showToast({
        title: '卖光了',
        icon: 'error',
        duration: 2000
      });
    }

  },
  openLocationByAddress(e) {
    console.log('open wx location ! e.target.dataset.la =' + e.target.dataset.la)
    console.log('open wx location !  e.target.dataset.lg =' + e.target.dataset.lg)
    wx.openLocation({
      latitude: Number(e.target.dataset.la),
      longitude: Number(e.target.dataset.lg),
      scale: 28
    })
  },

  flushData: function (productid) {
    var that = this
    return new Promise(function (resolve, reject) {
      console.log(' flush data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      const data = {
        unioId: app.globalData.unicodeId,
        productId: productid
      }
      Request.postRequest('https://www.yo-pe.com/api/common/queryResourceDetail', data).then
        (
        function (data) {
          console.log('return data = ' + JSON.stringify(data))
          // console.log('data.resourceDetail=' + data)
          if (data.resourceDetail == undefined) {
            // that.setDemoData()
          } else {
            console.log('return data = ' + JSON.stringify(data))
            var cover_url = data.resourceDetail.cover_url
            var map = {
              drObjectInfo: cover_url
            };
            data.resourceDetail.morePicture.unshift(map)
            resolve(data)
            that.setData({
              nowPartyId: data.nowPartyId,
              bookInfo: data.resourceDetail,
              shareName: data.resourceDetail.title,
              data: data,
              bookInfoData: true,
              comments: data.resourceDetail.tuCaoList,
              availableToPromiseTotal: data.resourceDetail.availableToPromiseTotal,
              contactTel: data.resourceDetail.contactNumber
            })
            wx.hideLoading()
          }

        }
        )
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
    let that = this
    console.log('that.data.productid = ' + that.data.productid)
    console.log('that.data.nowPartyId=' + that.data.nowPartyId)
    var shareName = that.data.shareName
    return {
      title: shareName,
      path: '/pages/previewreadResource/previewreadResource?' + 'productid=' + that.data.productid + '&paytopartyid=' + that.data.payToPartyId + '&spm=' + that.data.nowPartyId,
      success: function (res) {
        console.log('on share success')
        that.onShare()
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  receivedInformation(spm, payToPartyId) {
    const data = {
      tarjeta: this.data.bookInfo.tarjeta,
      productId: this.data.productid,
      payToPartyId: payToPartyId,
      spm: spm
    }

    Request.postRequest('https://www.yo-pe.com/api/common/receivedInformation', data).then
      (
      function (data) {
        console.log('received Information = ' + JSON.stringify(data))
      }
      )
  },
  onShare() {
    const data = {
      productId: this.data.productid,
      payToPartyId: this.data.payToPartyId,
      tarjeta: this.data.bookInfo.tarjeta
    }
    Request.postRequest('https://www.yo-pe.com/api/common/shareInformation', data).then
      (
      function (data) {
        console.log('share over data = ' + JSON.stringify(data))
      }
      )
  },

  // 去听书
  readBook: function (event) {
    let bookId = event.currentTarget.dataset.bookid;
    console.log(bookId);
    wx.navigateTo({
      url: '../readbook/readbook?bookId=' + bookId
    })
  },

  palyComment: function () {
    let that = this;
    if (that.data.showComment) {
      that.setData({
        showComment: false
      });
    } else {
      that.setData({
        showComment: true
      });
    }
  },

  //提交评论
  submitComment: function (event) {
    wx.showToast({
      title: '正在提交..',
      icon: 'loading',
      duration: 10000
    })

    let that = this;
    console.log(event.detail.value.comment);
    if (event.detail.value.comment) {

      const data = {
        unioId: app.globalData.unicodeId,
        productId: that.data.productid,
        text: event.detail.value.comment
      }

      console.log('tuCao=' + JSON.stringify(data))

      Request.postRequest('https://www.yo-pe.com/api/common/tuCao', data).then
        (
        function (data) {

          console.log('data=' + JSON.stringify(data))

          if (data.code == 200) {
            wx.showToast({
              title: '吐槽成功!',
              icon: 'success',
              duration: 10000
            })
            that.flushData(that.data.productid)

            that.setData({
              showComment: false
            });

          } else {

          }

        }
        )

    } else {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'loading',
        duration: 1000
      })
    }
  },

  // 更多操作
  moreAct: function (event) {
    let that = this;
    let bookId = event.target.dataset.bookid;
    console.log(event);
    wx.showActionSheet({
      itemList: ['投稿', '编辑', '删除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../agreement/agreement?bookId=' + that.data.bookInfo.bookId +
            '&title=' + that.data.bookInfo.title +
            '&author=' + that.data.bookInfo.author +
            '&coverUrl=' + that.data.bookInfo.coverUrl +
            '&actType=' + that.data.bookInfo.bookReader
          })
        } else if (res.tapIndex == 1) {
          // 编辑
          wx.navigateTo({
            url: '../editbook/editbook?bookId=' + bookId
          })
        } else if (res.tapIndex == 2) {
          wx.showModal({
            title: '提示',
            content: '确认删除?',
            success: function (res) {
              if (res.confirm) {
                getApp().delBook(bookId, function (data) {
                  console.log(data);
                  wx.reLaunch({
                    url: '../profile/profile'
                  });
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  },

  // 举报内容
  tipOff: function (event) {
    let that = this;
    let bookId = event.currentTarget.dataset.bookid;
    let reportList = ['广告或垃圾信息', '抄袭或未授权转载', '其他'];
    wx.showActionSheet({
      itemList: ['广告或垃圾信息', '抄袭或未授权转载', '其他'],
      success: function (res) {
        console.log(res);
        if (res.tapIndex) {
          getApp().report(bookId, reportList[res.tapIndex], function (data) {
            console.log(data);
            wx.showToast({
              title: '举报成功',
              icon: 'success',
              duration: 1000
            });
          });
        }

      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  },

  // like动作
  likeIt: function (event) {
    let that = this;
    if (that.data.bookInfo.is_like == 'false') {
      const data = {
        unioId: app.globalData.unicodeId,
        productId: that.data.productid
      }

      Request.postRequest('https://www.yo-pe.com/api/common/likeResource', data).then
        (
        function (data) {

          console.log('data=' + JSON.stringify(data))

          if (data.code == 200) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 2000
            })
            that.flushData(that.data.productid)
          } else {

          }

        }
        )

    } else {
      wx.showToast({
        title: '您已经赞过了',
        icon: 'success',
        duration: 2000
      })
    }

  }

})
var doommList = [];
var i = 0;//用做唯一的wx:key
class Doomm {
  constructor(text, top, time, color) {
    //this.text = text + i;
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = i++;
    setTimeout(function () {
      doommList.splice(doommList.indexOf(that), 1);//动画完成，从列表中移除这项
      page.setData({
        doommData: doommList
      })
    }, this.time * 2000)//定时器动画完成后执行。
  }
}
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}