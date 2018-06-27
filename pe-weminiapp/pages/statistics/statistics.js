// pages/statistics/statistics.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
const { Tab, extend } = require('../../zanui/index');
Page(extend({}, Tab, {
  data: {
    tab1: {
      list: [{
        id: '1',
        title: '转发链条'
      }, {
        id: '2',
        title: '转发排行'
      }],
      selectedId: '1'
    },
    shareInfoList123: [],//产品转发排行数据前3
    shareInfoList456: [],//产品转发排行数据除了前3
    salesCount:0,
    forwardCount: 0,
    firstChainData: [],
    secondChainData: [],
    thirdChainData: [],
    productId: null,
  },

  //切换显示内容  人的转发情况  和产品转发排行
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });

    if (selectedId === '2') {
      //this.queryShareCpsReport()
    }
  },

  //切换选中的人
  selectPerson: function (e) {
    const selectId = e.target.dataset.id
    const level = e.target.dataset.level
    const partyIdTo = e.target.dataset.partyidto
    const shareNumber = e.target.dataset.sharenumber
    const that = this
    console.log(selectId, level, shareNumber, partyIdTo)
    if (shareNumber == 0) {
      wx.showToast({
        title: '他还没有帮您转发过',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (level === '1') {
        const firstChainData = this.data.firstChainData
        for (let a of firstChainData) {
          if (a.partyIdTo === partyIdTo) {
            a.selected = true
          } else {
            a.selected = false
          }
        }
        this.setData({
          firstChainData: firstChainData,
          thirdChainData: []
        })
        this.queryForwardChainFirstLines(2, selectId, partyIdTo)
      } else if (level === '2') {
        const secondChainData = this.data.secondChainData
        for (let a of secondChainData) {
          if (a.partyIdTo === partyIdTo) {
            a.selected = true
          } else {
            a.selected = false
          }
        }
        this.setData({
          secondChainData: secondChainData
        })
        this.queryForwardChainFirstLines(3, selectId, partyIdTo)
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
  queryForwardChainFirstLines: function (level, partyIdTo = '', workEffortId = '') {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const url = ServiceUrl.platformManager + 'queryForwardChainFirstLines'
    const data = {
      tarjeta: app.globalData.tarjeta,
      addresseePartyId: partyIdTo,
      workEffortId: workEffortId
    }
    //console.log('查询转发链(' + level + ')层数据参数' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      Request.postRequest(url, data).then(function (data) {
        //console.log('查询转发链第(' + level + ')层数据=>>>>>>>>' + JSON.stringify(data))
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

  //查询转发排行列表
  queryProductCpsReport: function () {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const data = {
      tarjeta: app.globalData.tarjeta,
    }
    console.log(data)
    const url = ServiceUrl.platformManager + 'queryProductCpsReport'
    Request.postRequest(url, data).then(function (data) {
      console.log('查询转发排行列表=>>>>>>>>' + JSON.stringify(data))
      const { code, reportList, forwardCount, salesCount} = data
      if (code === '200') {
        that.setData({
          shareInfoList123: reportList.slice(0,3),
          shareInfoList456: reportList.slice(3),
          salesCount: salesCount,
          forwardCount: forwardCount,
        })
        wx.hideLoading()
      }
    })
  },

  //进入查询分成页面
  queryCommission: function () {
    wx.navigateTo({
      url: '/pages/commission/commission'
    })
  },

  //进入统计详情
  statisticsDetail:function(e){
    let productId = e.currentTarget.dataset.productid
    let dataId = e.currentTarget.dataset.dataid
    wx.navigateTo({
      url: '/pages/statisticsDetail/statisticsDetail?productId=' + productId +'&dataId='+dataId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryProductCpsReport()
    this.queryForwardChainFirstLines(1)
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
}));