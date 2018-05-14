var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const testData = [
  { id: 1, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '刘德华', selected: true, isSale: true },
  { id: 2, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '张学友', selected: false, isSale: true },
  { id: 3, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '黎明', selected: false, isSale: true },
  { id: 4, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '郭富城', selected: false, isSale: false },
  { id: 5, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '周杰伦', selected: false, isSale: false },
  { id: 6, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '王思聪', selected: false, isSale: false },
  { id: 7, touxiang: 'http://img2.imgtn.bdimg.com/it/u=2809576112,626361756&fm=27&gp=0.jpg', name: '王健林', selected: false, isSale: true }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstChainData: [],
    secondChainData: [],
    thirdChainData: [],
    productId: null
  },

  //切换选中的人
  selectPerson: function (e) {
    const selectId = e.target.dataset.id
    const level = e.target.dataset.level
    const shareNumber = e.target.dataset.sharenumber
    const that = this
    console.log(selectId, level, shareNumber)
    if (shareNumber==0){
      wx.showToast({
        title: '他还没有帮您转发过',
        icon: 'none',
        duration: 2000
      })
    }else{
      if (level === '1') {
        const firstChainData = this.data.firstChainData
        for (let a of firstChainData) {
          if (a.rowParty === selectId) {
            a.selected = true
          } else {
            a.selected = false
          }
        }
        this.setData({
          firstChainData: firstChainData,
          thirdChainData: []
        })
        this.queryBProductShareFirstLines(2, selectId)
      } else if (level === '2') {
        const secondChainData = this.data.secondChainData
        for (let a of secondChainData) {
          if (a.rowParty === selectId) {
            a.selected = true
          } else {
            a.selected = false
          }
        }
        this.setData({
          secondChainData: secondChainData
        })
        this.queryBProductShareFirstLines(3, selectId)
      } else if (level === '3') {
        // const thirdChainData = this.data.thirdChainData
        // for (let a of thirdChainData) {
        //   if (a.rowParty === selectId) {
        //     a.selected = true
        //   } else {
        //     a.selected = false
        //   }
        // }
        // this.setData({
        //   thirdChainData: thirdChainData
        // })
      }
    }
  },

  //查询转发链单层数据
  queryBProductShareFirstLines: function (level, sharePartyId = '') {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const url = ServiceUrl.platformManager + 'queryBProductShareFirstLines'
    const data = {
      tarjeta: app.globalData.tarjeta,
      productId: this.data.productId,
      sharePartyId: sharePartyId
    }
    console.log(data)
    return new Promise(function (resolve, reject) {
      Request.postRequest(url, data).then(function (data) {
        console.log('查询转发链第(' + level + ')层数据=>>>>>>>>' + JSON.stringify(data))
        const { code, firstShareLines } = data
        if (code === '200') {
          if (level === 1) {
            that.setData({
              firstChainData: firstShareLines
            })
          } else if (level === 2) {
            that.setData({
              secondChainData: firstShareLines
            })
          } else if (level === 3) {
            that.setData({
              thirdChainData: firstShareLines
            })
          }
          resolve(firstShareLines)
          wx.hideLoading()
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { productId } = options
    const that = this
    this.setData({
      productId: productId
    })
    //查询👋行数据
    this.queryBProductShareFirstLines(1)
    //.then(function (data) {
    //   if (data.length > 0 && data[0].xiaJiRenShu !== 0) {
    //     that.queryBProductShareFirstLines(2, data[0].rowParty).then(function (data) {
    //       if (data.length > 0&&data[0].xiaJiRenShu !== 0) {
    //         that.queryBProductShareFirstLines(3, data[0].rowParty)
    //       }
    //     })
    //   }
    // })
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

  }
})