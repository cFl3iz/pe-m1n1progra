const User = require('/utils/user')
const Pages = require('/utils/pages')
App({
  //APP初始化
  onLaunch: function () {
    this.checkForUpdate()
    this.getUserInfo()
  },
  //获取头像和昵称
  getUserInfo(cb) {
    console.log('获取头像和昵称')
    const that = this
    wx.getUserInfo({
      success: function (res) {
        console.log('获取用户信息成功')
        that.globalData.userInfo = res.userInfo
      },
      fail: function (res) {
        console.log('获取用户信息失败')
        const userInfo = {
          nickName: '匿名',
          gender: '1',
          language: 'zh_CN',
          avatarUrl: 'https://personerp.oss-cn-hangzhou.aliyuncs.com/datas/serviceSales/default_person.png'
        }
        that.globalData.userInfo = userInfo
      }
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
    if (tabBar){
      for (var i = 0; i < tabBar.list.length; i++) {
        tabBar.list[i].active = false;
        if (tabBar.list[i].pagePath == _pagePath) {
          tabBar.list[i].active = true;//根据页面地址设置当前页面状态  
        }
      }
      _curPage.setData({
        tabBar: tabBar
      });
    }
  },
  //全局变量
  globalData: {
    appId: 'wx299644ef4c9afbde',                        //小程序Id
    secret: '7ba298224c1ae0f2f00301c8e5b312f7',         //小程序密匙
    isDemo: false,                                      //是否是demo小程序 demo支付为0.01元
    serviceType: '2C',                                  //小程序是2B,2C区分
    appName: null,                                      //小程序名称 首页导航标题
    hasShoppingCart: null,                              //是否需要购物车
    hasIntroduction: true,                              //是否需要简介（首页）        
    openId: null,
    userInfo: null,
    code: null,
    unicodeId: null,
    isSalesRep: 'false',                                //是否是销售代表
    productStoreId: null,                               //店铺ID
    prodCatalogId: null,                                //产品分类ID
    tarjeta: null,
    partyId: null,
    qrPath: null,                                       //销售代表二维码
    storePromos: null,                                  //促销方式
    tabBar: null,
    appContentDataResource: null,                       //2B产品图片数据
    shareTitle:'测试转发',                               //全局分享文字  
    coverImage: null,
    collectionQrCode:null,                              //收款二维码
  }
})