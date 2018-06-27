// components/dialog/dialog.js
var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Component({
  options: {
    multipleSlots: true,     // 在组件定义时的选项中启用多slot支持
  },
  /** 
   * 组件的属性列表 
   * 用于组件自定义设置 
   */
  properties: {
    // 弹窗标题 
    title: {                // 属性名 
      type: String,         // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型） 
      value: '标题'          // 属性初始值（可选），如果未指定则会根据类型选择一个 
    },
    // 弹窗内容 
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 弹窗取消按钮文字 
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字 
    confirmText: {
      type: String,
      value: '确定'
    },
    // 扫描快递单号
    scanAwb: {
      type: String,
      value: '扫描'
    },
    // 订单号
    orderId: {
      type: String,
      value: '10000',
      observer: function (newVal, oldVal, changedPath) {
        console.log(newVal, oldVal, changedPath)
        this.setData({
          orderId: newVal
        })
      }
    },
  },

  /** 
   * 私有数据,组件的初始数据 * 可用于模版渲染 
   */
  data: {
    // 弹窗显示控制 
    isShow: false,
    inputValue: null,
    orderId: null
  },

  attached: function (e) {
    console.log(e)
  },
  moved: function () {
    console.log(2)
  },
  detached: function () {
    console.log(3)
  },

  /** 
   * 组件的方法列表 
   * 更新属性和数据的方法与更新页面数据的方法类似 
   */
  methods: {
    /* 
    * 公有方法 
    */
    //隐藏弹框 
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框 
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /* 
    * 内部私有方法建议以下划线开头 
    * triggerEvent 用于触发事件
    */
    _cancelEvent() {
      //触发取消回调 
      this.triggerEvent("cancelEvent")
    },

    //确定发货
    _confirmEvent() {

      if (!this.data.inputValue){
        wx.showModal({
          title: '提示',
          content: '运单号不能为空',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.address()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return
      }
      console.log(this.data.orderId)
      wx.showLoading({
        title: '发货中...',
      })
      const that = this
      const url = ServiceUrl.platformManager + 'quickShipEntireOrder'
      const data = {
        orderId: this.data.orderId,
        trackingNumber: this.data.inputValue,
      }
      console.log(data)
      Request.postRequest(url, data).then(function (data) {
        console.log('确定发货=>>>>>>>>' + JSON.stringify(data))
        const { code } = data
        if (code === '200') {
          wx.hideLoading()
          //触发成功回调 
          that.triggerEvent("confirmEvent");
        }
      })
    },

    //扫描货运单号
    _scanAwb: function () {
      const that = this;
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log(res)
          that.setData({
            inputValue: res.result
          })
        }
      })
    },

    //绑定运单号的🈯值
    _bindAwd: function (e) {
      var value = e.detail.value
      var pos = e.detail.cursor
      this.setData({
        inputValue: value
      })
      console.log(value, pos)
    },
  }
})


