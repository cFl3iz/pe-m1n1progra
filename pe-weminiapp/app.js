import ServiceUrl from './utils/request.js'
const User = require('/utils/user')
const Pages = require('/utils/pages')
App({
  //APP初始化
  onLaunch: function () {
    this.checkForUpdate()
    this.getUserInfo()
    // var that = this
    // this.weChatLogin().then(
    //   function () {
    //     that.getUserInfo().then(
    //       function () {
    //         that.getUnionId(that.globalData.code)
    //       }
    //     );
    //   }
    // );
  },
  //获取头像和昵称
  getUserInfo(cb) {
    const that=this
    wx.getUserInfo({
      success: function (res) {
        console.log('获取用户信息:' + res.userInfo)
        that.globalData.userInfo = res.userInfo
      },
    })
  },
  //检查小程序是否有新版本
  checkForUpdate: function () {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('请求完新版本信息的回调>>>>>>' + res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该小程序，请升级到最新微信版本后重试。'
      })
    }
  },
  //修改tabBar的active值  
  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态  
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  //全局变量
  globalData: {
    openId: null,
    userInfo: null,
    code: null,
    unicodeId: null,
    isSalesRep: 'false',//是否时销售代表
    productStoreId: null,//d
    prodCatalogId: null,//产品分类ID
    tarjeta: null,
    partyId: null,
    appId: 'wx299644ef4c9afbde',//小程序Id
    secret: '7ba298224c1ae0f2f00301c8e5b312f7',//小程序密匙
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/deputyHome/deputyHome",
          "text": "简介",
          "iconPath": "/images/tabbar/zero_icon_gray@3x.png",
          "selectedIconPath": "https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/serviceSales/zero_icon%403x.png",
          "selectedColor": "#000000",
          active: false
        },
        {
          "pagePath": "/pages/companyProduct/companyProduct",
          "text": "商品",
          "iconPath": "/images/tabbar/shangpin_default.png",
          "selectedIconPath": "/images/tabbar/shangpin.png",
          "selectedColor": "#000000",
          active: false
        },
        {
          "pagePath": "/pages/my/my",
          "text": "我的",
          "iconPath": "/images/tabbar/me_default.png",
          "selectedIconPath": "/images/tabbar/me.png",
          "selectedColor": "#000000",
          active: false
        }
      ]
    },
  }
})