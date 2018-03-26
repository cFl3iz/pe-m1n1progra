import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
var app = getApp();
Page({
  data: {
    showModalStatus: false,
    nowPartyId:'',
    tarjeta:'',
    myProductList: [],
    touchStartTime: '',
    touchEndTime: ''
  },
  onLoad: function (options) {
    this.runderList()
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  } ,

  //编辑
  editProduct:function(e){
    if (this.data.touchEndTime - this.data.touchStartTime < 350) {
    var productid = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '../editProduct/editProduct?productid='+ productid,
    })
    }
  },
  /// 按钮触摸开始
  touchStart: function (e) {
    this.data.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.data.touchEndTime = e.timeStamp
  },
  removeProductFromCategory:function(productId){
    var that = this 
    console.log('removeProductFromCategory =>' + productId)
    const data = {
      productId: productId
    }
    Request.postRequest('https://www.yo-pe.com/api/common/doRemoveProductFromCategory', data).then(function (data) {
      wx.showToast({
        title: '删除完毕',
        icon: 'success',
        duration: 2000
      })
      that.runderList()
    })
  },
  //长按
  longTap: function (e) {
    var that = this
    console.log("long tap")
    wx.showModal({
      title: '提示',
      content: '永久删除?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var productid = e.currentTarget.dataset.productid
          that.removeProductFromCategory(productid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    //doRemoveProductFromCategory
  },
  onShareAppMessage: function (e) {
    console.log(JSON.stringify(e))
    let that = this
    var productid = e.target.dataset.productid
    var shareName = e.target.dataset.sharename  
    var payToPartyId = e.target.dataset.paytopartyid
    var nowPartyId = this.data.nowPartyId
    var tarjeta = this.data.tarjeta

    console.log('productid=' + productid)
    console.log('shareName=' + shareName)
    console.log('payToPartyId=' + payToPartyId)
    console.log('nowPartyId=' + nowPartyId)
    console.log('tarjeta=' + tarjeta)

    return {
      title: shareName,
      path: '/pages/previewreadResource/previewreadResource?' + 'productid=' + productid + '&paytopartyid=' + payToPartyId + '&spm=' + nowPartyId,
      success: function (res) {
        console.log('on share success')
        that.onShare(productid, payToPartyId, tarjeta)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShare(productid,paytopartyid,tarjeta) {
    const data = {
      productId: productid, 
      payToPartyId: paytopartyid,
      tarjeta: tarjeta
    }
    Request.postRequest('https://www.yo-pe.com/api/common/shareInformation', data).then
      (
      function (data) {
        console.log('share over data = ' + JSON.stringify(data))
      }
      )
  },

  salesDiscontinuation:function(e){
    var that  = this
    console.log('salesDiscontinuation=>')
    var productid = e.currentTarget.dataset.productid
    const data = {
      productId: productid
    }
    Request.postRequest('https://www.yo-pe.com/api/common/salesDiscontinuation', data).then(function (data) {
      wx.showToast({
        title: '下架完毕',
        icon: 'success',
        duration: 2000
      })
      that.runderList()
    })
  },
  runderList: function () {
    console.log('=>app.globalData.unicodeId=' + app.globalData.unicodeId)
    const that = this
    const data = {
      unioId: app.globalData.unicodeId
    }
    Request.postRequest('https://www.yo-pe.com/api/common/queryMyProduct', data).then(function (data) {
      console.log('=>>>>'+JSON.stringify(data))
      that.setData({
        myProductList: data.productList,
        tarjeta: data.tarjeta,
        nowPartyId: data.nowPartyId
      })
    })
  }
})