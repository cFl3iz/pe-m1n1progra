
var app = getApp()
var page = undefined;
// common utils.js
let utils = require('../../utils/util.js');
import Request from '../../utils/request.js'
import ServiceUrl from '../../utils/serviceUrl.js'
// mybook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payToPartyId: '',
    doommData: [],
    productid: null,
    productModel: '',
    bookInfo: {}, // 书本信息
    bookInfoData: {}, // 书本信息不更新到页面
    commentPageNum: 1, // 评论页码
    comments: [], //评论数量
    isComment: 1, // 是否有评论，0 有， 1 无
    showComment: false // 输入评论, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    page = this;

    const that = this

    var unicodeId = app.globalData.unicodeId

    console.log('unicodeId=>' + unicodeId)

    if (unicodeId == null) {
      app.weChatLogin().then(function (data) {
        app.getUnionId(data)
        // app.getUserInfo()
      })
    }
    unicodeId = app.globalData.unicodeId

    console.log(' after unicodeId=>' + unicodeId)

    console.log('options.productid=>' + options.productid)
    console.log('options.productModel=>' + options.productModel)
    that.setData({
      productid: options.productid,
      productModel: options.productModel,
      payToPartyId: options.payToPartyId
      // bookInfo: options,
      // bookInfoData: options
    });

    that.flushData(options.productid)

    // reader 0 书本  1 朗读 
    // getApp().getCommentList(that.data.bookInfo.bookId, that.data.bookInfo.reader, that.data.commentPageNum, function (res) {
    //   if (res.payload.comments.length !== 0) {
    //     res.payload.comments.forEach(function (element, index) {
    //       res.payload.comments[index].ts = utils.formatTime(new Date(element.ts * 1000));
    //     }, this);
    //     that.setData({
    //       comments: res.payload.comments,
    //       isComment: 0
    //     });
    //   }
    // })



    wx.setNavigationBarTitle({
      // title: that.data.bookInfo.title
      title: '资源介绍'
    });

    // that.getCollectProduct();

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
          var line = custRequestList[custRequest].createdDate + custRequestList[custRequest].user.firstName+'购买过..';
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
      phoneNumber: '15000035538' //仅为示例，并非真实的电话号码
    })
  },
  contactC: function () {
    console.log('productid=' + this.data.productid)
    console.log('payToPartyId=' + this.data.payToPartyId)

    var that = this
    const data = {
      productId: this.data.productid,
      payToPartyId: this.data.payToPartyId,
      unioId: app.globalData.unicodeId
    }
    Request.postRequest('https://www.yo-pe.com/api/common/createCustRequestFromMiniApp', data).then
      (
      function (data) {
        console.log('>>>>>>>>>>>>>>>>>>>>>> data = ' + JSON.stringify(data))
        wx.vibrateShort({
          complete: function (res) {
            wx.showToast({
              title: '询价成功!',
              icon: 'success',
              duration: 2000
            }); 
          }
        });
      }
      )
  },

  flushData: function (productid) {
    var that = this
    const data = {
      unioId: app.globalData.unicodeId,
      productId: productid
    }
    Request.postRequest('https://www.yo-pe.com/api/common/queryResourceDetail', data).then
      (
      function (data) {
        // console.log('data.resourceDetail=' + data)
        if (data.resourceDetail == undefined) {
          // that.setDemoData()
        } else {
          console.log('return data = ' + JSON.stringify(data))
          that.setData({
            bookInfo: data.resourceDetail,
            data: data,
            bookInfoData: true,
            comments: data.resourceDetail.tuCaoList
          })
          wx.hideLoading()
        }

      }
      )
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
    return {
      title: '我发现了一个好东西,分享给你',
      path: '/pages/previewreadResource/previewreadResource?productModel=' + that.data.productModel + '&productid=' + that.data.productid + '&payToPartyId=' + that.data.payToPartyId,
      success: function (res) {
        // 转发成功productModel
      },
      fail: function (res) {
        // 转发失败
      }
    }
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
          } else {

          }

        }
        )
      // getApp().addComment(that.data.bookInfo.bookid, that.data.bookInfo.reader, event.detail.value.comment, function (res) {
      //   if (res.code == 0) {
      //     res.payload.comment.ts = utils.formatTime(new Date(res.payload.comment.ts * 1000));
      //     let data = that.data.comments.concat(res.payload.comment);
      //     wx.showToast({
      //       title: '评论成功',
      //       icon: 'success',
      //       duration: 1000
      //     });
      //     that.setData({
      //       comments: data,
      //       showComment: false,
      //       isComment: 0
      //     });
      //   }
      // });
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

    // if (that.data.bookInfoData.hasLiked == 1) {
    //   that.data.bookInfoData.hasLiked = 0;
    //   that.data.bookInfoData.likeCnt = that.data.bookInfoData.likeCnt - 1;
    //   that.setData({
    //     bookInfo: that.data.bookInfoData
    //   });
    //   getApp().likeAct(that.data.bookInfo.bookId, that.data.bookInfo.reader, 0, function (res) {
    //     console.log('取消点赞');
    //   });
    // } else {
    //   that.data.bookInfoData.hasLiked = 1;
    //   that.data.bookInfoData.likeCnt = (that.data.bookInfoData.likeCnt - 0) + 1;
    //   that.setData({
    //     bookInfo: that.data.bookInfoData
    //   });
    //   getApp().likeAct(that.data.bookInfo.bookId, that.data.bookInfo.reader, 1, function (res) {
    //     console.log('点赞成功');
    //   });
    // }
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