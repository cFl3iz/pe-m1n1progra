//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //getUserInfo:function(cb){
  //  var that = this
  //  if(this.globalData.userInfo){
  //    typeof cb == "function" && cb(this.globalData.userInfo)
  //  }else{
  //    //调用登录接口
  //    wx.login({
  //      success: function () {
  //        wx.getUserInfo({
  //          success: function (res) {
  //            that.globalData.userInfo = res.userInfo
  //            typeof cb == "function" && cb(that.globalData.userInfo)
  //          }
  //        })
  //      }
  //    })
  //  }
  //},
  getUserInfo:function(cb){

    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
      that.globalData.userInfo.gender = that.globalData.unionid;
    }else{
    //调用登录接口
    wx.login({
      success: function (loginok) {

        var code  = loginok.code;
        var appid = 'wx299644ef4c9afbde'; //填写微信小程序appid
        var secret = '7ba298224c1ae0f2f00301c8e5b312f7'; //填写微信小程序secret
        var openid   =  null;
        var unionid = '';
        //调用request请求api转换登录凭证


        wx.getUserInfo({
          success: function (res) {
            console.log('拿头像了code='+code);

            that.globalData.userInfo = res.userInfo


           // var getopenidurl='https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code';
           var getopenidurl = "http://www.lyndonspace.com/wechatminiprogram/control/jscode2session?code="+code;
            wx.request({
              url: getopenidurl,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function(response){
                //openid = response.data.openid;


                console.log('response=' + JSON.stringify(response));
                var str = response.data;
                str = str.replace("//", "");
                console.log("in str:=" + str);
                var resultMap = JSON.parse(str);
                unionid = resultMap.unionid;
                console.log('!!!!!!!!!!!!!!response unionid=' +unionid);
                //that.globalData.gender = unionid;

                console.log('!!!!!!!!!!!!!!response=' +JSON.stringify(response));
                console.log('存入全局数据=' + JSON.stringify(that.globalData));
                that.globalData.userInfo.gender = unionid;
                console.log('!!!!!!!!!!!!!!that.globalData.userInfo.gender=' +JSON.stringify(that.globalData.userInfo.gender));
                typeof cb == "function" && cb(that.globalData.userInfo)


              }
            });

          }
        })

      }
    })
     }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData:{
    userInfo:null
  }
})