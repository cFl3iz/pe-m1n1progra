// pages/shoppingCart/shoppingCart.js
var app = getApp();
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
import Zan from '../../zanui/index.js'
import Util from '../../utils/util.js'

Page(Object.assign({}, Zan.Stepper, {
  data: {
    checkboxItems: [],  //购物车数据 
    checkAll: true,    //全选
    total: 0,            //合计金额
    preferential: 0,     //优惠金额
  },

  //全选
  checkAll: function (e) {
    console.log('全选事件，携带value值为：', e.detail.value);
    this.setData({
      checkAll: !this.data.checkAll,
    })
    let checkAll = this.data.checkAll
    var checkboxItems = this.data.checkboxItems
    for (let a of checkboxItems) {
      a.checked = checkAll
    }
    this.setData({
      checkboxItems: checkboxItems
    })
  },

  //选择购物车商品
  checkboxChange: function (e) {
    let index = e.currentTarget.dataset.index
    let values = e.detail.value;
    let checkboxItems = this.data.checkboxItems
    console.log('checkbox发生change事件，携带value值为：', index, values);
    if (values.length > 0) {
      for (let a of checkboxItems) {
        if (a.value === values[0]) {
          a.checked = true
          break
        }
      }
    } else {
      checkboxItems[index].checked = false
      this.setData({
        checkAll: false
      })
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },

  //修改购买数量
  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;
    console.log('修改数量' + componentId + '/' + stepper)
    const checkboxItems = this.data.checkboxItems
    for (let a of checkboxItems) {
      if (a.productId === componentId) {
        a.stepper3.stepper = stepper
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
    this.updateSkuAmountToShoppingCart(componentId, stepper)
  },

  //查询我的购物车
  queryShoppingCart: function () {
    const that = this
    let data = {
      openId: app.globalData.openId,
    }
    console.log('查询我的购物车参数:' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'queryShoppingCart'
      Request.postRequest(url, data).then(function (data) {
        console.log('查询我的购物车=>>>>>>>>' + JSON.stringify(data))
        const { code, shoppingCart } = data
        let num = 0
        let total = 0.00
        let preferential = 0.00
        if (code === '200') {
          for (let a of shoppingCart) {
            a.checked = true,
              a.value = JSON.stringify(num++)
            a.stepper3 = {
              stepper: a.amount,
              min: 1,
              max: 20
            }
            total += parseInt(a.price) * parseInt(a.amount)
          }
          that.setData({
            checkboxItems: shoppingCart,
            total: total,
            preferential: app.globalData.storePromos[0]?Util.toDecimal(total * app.globalData.storePromos[0].discount):0
          })
        }
      })
    })
  },

  //修改购物车数量
  updateSkuAmountToShoppingCart: function (productId, amount) {
    const that = this
    let data = {
      openId: app.globalData.openId,
      productId: productId,
      amount: amount
    }
    console.log('修改购物车数量参数:' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'updateSkuAmountToShoppingCart'
      Request.postRequest(url, data).then(function (data) {
        console.log('修改购物车数量=>>>>>>>>' + JSON.stringify(data))
        const { code } = data;
        if (code === '200') {
          that.queryShoppingCart()
        }
      })
    })
  },

  //删除购物车指定产品
  removeProductFromShoppingCart: function (productId) {
    const that = this
    let data = {
      openId: app.globalData.openId,
      productId: productId,
    }
    console.log('删除购物车指定产品参数:' + JSON.stringify(data))
    return new Promise(function (resolve, reject) {
      const url = ServiceUrl.platformManager + 'removeProductFromShoppingCart'
      Request.postRequest(url, data).then(function (data) {
        console.log('删除购物车指定产品=>>>>>>>>' + JSON.stringify(data))
        const { code } = data
        if (code === '200') {
          that.queryShoppingCart()
        }
      })
    })
  },

  //进入下单页面
  placeOrder: function () {
    let shoppingData = this.data.checkboxItems.filter((d, i) => {
      return d.checked == true
    })
    app.globalData.shoppingData = shoppingData
    if (shoppingData.length > 0) {
      wx.navigateTo({
        url: '/pages/placeOrder/placeOrder',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择商品',
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
  },

  /**
   * 显示删除按钮
   */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, -65)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex

    this.setXmove(productIndex, 0)
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, xmove) {
    let checkboxItems = this.data.checkboxItems
    checkboxItems[productIndex].xmove = xmove

    this.setData({
      checkboxItems: checkboxItems
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    console.log(e)
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 删除产品
   */
  handleDeleteProduct: function (e) {
    let productId = e.currentTarget.dataset.productid
    console.log(productId)
    this.removeProductFromShoppingCart(productId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.queryShoppingCart()
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.queryShoppingCart()
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
}));
