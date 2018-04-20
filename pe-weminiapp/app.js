import ServiceUrl from './utils/serviceUrl'
import Request from './utils/request.js'
const User = require('/utils/user');
const Pages = require('/utils/pages');
App({
  //APP初始化
  onLaunch: function () {
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
  //全局变量
  globalData: {
    openId: null,
    userInfo: null,
    code: null,
    unicodeId: null,
    storeList: null,
    prodCatalogId: null,//产品分类ID
    tarjeta:null,
    partyId: null,
    isSalesRep:null//是否时销售代表
  }
})