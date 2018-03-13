var app = getApp()
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({
  data: {
    show_page: false,
    data: {
    },
    page: 0,
    class_id: 0,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false,
    touchStartTime: '',
    touchEndTime: '',
    unioId:''

  },
  onLoad: function (options) {
    const that = this

    wx.showLoading({
      title: '加载中',
    })
    // app.weChatLogin().then(function (data) { 
    //   // app.getUserInfo()
    //   that.getUnionId(data) 
    // }) 
    // console.log('gat->'+this.getDistance('31.22114', '121.54409', '31.14603695389824','121.49938345485485'))

    // console.log(that.data.getDistance('31.22114', '121.54409', '31.14603695389824', '121.49938345485485'))

    setTimeout(function () {
      that.get_data(app.globalData.unicodeId);
    },2500);
   

//


  },
  goRelease(){
    wx.navigateTo({
      url: '../addimages/addimages'
    }) 
  },
  getLocations(){
    var that = this
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          // console.log('latitude=' + latitude)
          // console.log('longitude=' + longitude)
          resolve(latitude)
          resolve(longitude)
          that.globalData.latitude = latitude;
          that.globalData.longitude = longitude;
        },
        fail:function(){
          that.getLocations()
        }
      }) 
    })



    
  },
  cleanDataList(data) {
    var that = this
    return new Promise(
      function (resolve, reject) {
        var tmpList = data.resourcesList
        // console.log('tmpList =' + JSON.stringify(tmpList))
        for (var row in tmpList) {
          var rowObj = tmpList[row] 
          var rowLongitude = rowObj.longitude
          var rowLatitude = rowObj.latitude
         // console.log('rowLatitude=' + rowLatitude)
          if(rowLongitude == null){
            rowObj['juLi'] = '/';
          }else{
            var juLi = that.getDistance(rowLatitude, rowLongitude, app.globalData.latitude, app.globalData.longitude)
            juLi = juLi.toFixed(1)
            rowObj['juLi'] = juLi;
           // console.log(app.globalData.latitude + '>>>>>>>>>>>>>>>>>>>>>>>>>>>> 距离:' + juLi)
           // console.log(app.globalData.latitude + '>>>>>>>>>>>>>>>>>>>>>>>>>>>> 距离:' + juLi) 
          }
          
        }
        data['resourcesList'] = tmpList
        resolve(data)
      }
    );
  },

  get_data(unioId) {

    console.log('get_data unnioId = ' + unioId)
    let str = '{"total":-1,"resourcesList":[{"productId":209,"user_id":3,"productName":"我的Java教程资源。包含从初级到高级的全套9400课，共670090课时","pics":[],"created_at":"2018-01-18 22:59:18","view_count":0,"source":"doc","source_id":37,"user":{"id":3,"firstName":"金樽对月","title":"云档小白","headPortrait":"https://wx.qlogo.cn/mmopen/vi_32/hbu8MniciaFlu8hunwK13htjL9qWKkQQgZ2pLIhEKW6waFwFnDvBib847RlhyMTDrtLxy8eib2FMO62BG2cpwH8JbA/0"},"created":"18小时前","morePicture":[],"pics_type":3,"reply_count":0,"source_info":{"id":37,"title":"龙熙的转发","desc":"微信小程序（weixinxiaochengxu），简称小程序，缩写XCX，英文名mini program，是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户扫一扫或搜一下即可打开应用。 全面开放申请后，主体类型为企业、政府、媒体、其他组织或个人的开发者，均可申请注册小程序。小程序、订阅号、服务号、企业号是并行的体系。","cover":"image/Group 5.png","h_cover":"image/Group.png","page_id":0,"cover_url":"http://cloud-doc-img.leyix.com/image/Group 5.png!225x300","h_cover_url":"http://cloud-doc-img.leyix.com/image/Group.png!540x300.jpg"}},{"productId":203,"user_id":2844,"productName":"转手一本React Native丛书,我已精读!","pics":["question/pbufTezS0bcn5Kw03mc1gH6t8t1HuSOWlXyZj4Gn.jpeg"],"created_at":"2017-12-15 10:40:45","view_count":0,"source":"doc","source_id":37,"user":{"id":2844,"firstName":"龙熙","title":"云档小白","headPortrait":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIfsScXYWcuJ9iaIwiawPejxNEFBurDfavlYntzw9Fqfr8QH1846HM3J1DM1JHcrXglUcYicwGPp1lxg/0"},"created":"1个月前","morePicture":[{"drObjectInfo":"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3694062258,786431746&fm=27&gp=0.jpg","path":"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3694062258,786431746&fm=27&gp=0.jpg"}],"pics_type":1, "reply_count":0, "source_info":{ "id":37, "title":"龙熙的发布", "cover":"image/Group 5.png", "h_cover":"image/Group.png", "page_id":0, "cover_url":"http://cloud-doc-img.leyix.com/image/Group 5.png!225x300", "h_cover_url":"http://cloud-doc-img.leyix.com/image/Group.png!540x300.jpg" }},{"productId":190,"user_id":2897,"productName":"有谁认识导游,我想去这个地方玩!","pics":["question/lb3Xy5dWVBnwxhyyt79rwiT3Znwxo1FAZpFIxjUr.jpeg","question/EXpUTB4RoNXhYep9amrfM2F88TNJAWoI88wvb0tz.jpeg"],"created_at":"2017-10-31 00:15:29","view_count":0,"source":"doc","source_id":37,"user":{"id":2897,"firstName":"董梦洁","title":"云档小白","headPortrait":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiaiaiadhG1DibbvZnKyallLFjovCrXM6GWD77ovqwbngdMnU4kE7HnD55cz6u9JvHPqhxgzzzb6W35A/0"},"created":"2个月前","morePicture":[{"drObjectInfo":"http://cloud-doc-img.leyix.com/question/lb3Xy5dWVBnwxhyyt79rwiT3Znwxo1FAZpFIxjUr.jpeg!200x200","path":"http://cloud-doc-img.leyix.com/question/lb3Xy5dWVBnwxhyyt79rwiT3Znwxo1FAZpFIxjUr.jpeg"},{"drObjectInfo":"http://cloud-doc-img.leyix.com/question/EXpUTB4RoNXhYep9amrfM2F88TNJAWoI88wvb0tz.jpeg!200x200","path":"http://cloud-doc-img.leyix.com/question/EXpUTB4RoNXhYep9amrfM2F88TNJAWoI88wvb0tz.jpeg"}],"pics_type":2,"reply_count":0,"source_info":{"id":37,"title":"冯浩的转发","desc":"微信小程序（weixinxiaochengxu），简称小程序，缩写XCX，英文名mini program，是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户扫一扫或搜一下即可打开应用。 全面开放申请后，主体类型为企业、政府、媒体、其他组织或个人的开发者，均可申请注册小程序。小程序、订阅号、服务号、企业号是并行的体系。","cover":"image/Group 5.png","h_cover":"image/Group.png","page_id":0,"cover_url":"http://cloud-doc-img.leyix.com/image/Group 5.png!225x300","h_cover_url":"http://cloud-doc-img.leyix.com/image/Group.png!540x300.jpg"}}]}';
    this.setData({
      is_load: true,
      //data:JSON.parse(str)
    })
    //这行代码正式时应该注掉
    //wx.hideLoading()
    const that = this
 //   console.log('page: this.data.page=' + that.data.page)
    const data = {
      unioId: unioId,
      page: that.data.page
    }
    Request.postRequest('https://www.yo-pe.com/api/common/queryFriendResources', data).then(function (data) {
      // console.log('准备获取数据--------------------------------data.current_page-----' + JSON.stringify(data.current_page) + '|data.total=' + data.total + 'DATA = ' + JSON.stringify(data))
     
      //计算那个什么距离\
      that.getLocations().then(
        function(){
          that.cleanDataList(data).then(
            function (data) {
            //  console.log('出来以后的data=' + data) 
              //如果没有任何数据
              if (data.total == -1 || data.total == 'undefined') {
                that.setData({
                  show_page: true,
                  is_load: true,
                  data: JSON.parse(str)
                })
            //    console.log('that.data.resourcesList = ' + JSON.stringify(that.data.data))
                wx.hideLoading()
                wx.stopPullDownRefresh()
              } else {
                //有数据,是第一页
                if (data.current_page == 1) {
                  that.setData({
                    data: data,
                    show_page: true
                  })

                } else {

                  let o_data = that.data.data;
             
                  for (var index in data.resourcesList) {
                    o_data.resourcesList.push(data.resourcesList[index])
                  }
                  that.setData({
                    data: o_data
                  })

                }

              }

            }
          );
        }
      )
      

      app.set_page_more(that, data)
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })

    //写完接口请使用这个  全部反注释
    // wx.request({
    //   //url: getApp().api.v3_wenda_index,
    //   url:'https://www.yo-pe.com/api/common/queryFriendResources',   
    //   // header: {
    //   //   'Authorization': 'Bearer ' + getApp().user.ckLogin()
    //   // },
    //   data: {
    //     page: this.data.page,
    //     unioId: unioId
    //   },
    //   success: res => { 
    //     console.log('res.data.current_page---------------------------------------------------------------------' + res.data.current_page)
    //     if (res.data.current_page == '1') {
    //       console.log('准备获取数据---------------------------------------------------------------------')
    //       console.log(JSON.stringify(res.data))
    //       this.setData({
    //         data: res.data,
    //         show_page: true
    //       })
    //     } else {
    //       console.log('准备获取数据2---------------------------------------------------------------------')
    //       let o_data = this.data.data;
    //       for (var index in res.data.data) {
    //         o_data.data.push(res.data.data[index])
    //       }
    //       this.setData({
    //         data: o_data
    //       })
    //     }
    //     getApp().set_page_more(this, res)
    //     wx.stopPullDownRefresh()
    //   }, complete: res => {
    //     wx.hideLoading()
    //   }
    // })

  },
  getDistance: function (lat1, lng1, lat2, lng2) { 
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    //最后除了1000 是想拿公里数
    return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2))) / 1000
  },
  getUnionId: function (code) {
    const that = this

    console.log('获取unicodeId in index page' + code)

    const url = ServiceUrl.platformManager + 'jscode2session'
    const data = {
      code: code,
      nickName: app.globalData.userInfo.nickName,
      gender: app.globalData.userInfo.gender,
      language: app.globalData.userInfo.language,
      avatarUrl: app.globalData.userInfo.avatarUrl
    }
    console.log('index page request data = ' + JSON.stringify(data))
    Request.postRequest(url, data).then(function (data) {
      console.log('设置全局unicodeId = ' + JSON.stringify(data))
      const unicodeId = data
      app.globalData.unicodeId = unicodeId //设置全局unicodeId
      return unicodeId
    }).then(function (data) {
      that.get_data(data)
    })
  },
  //长按
  longTap: function (e) {
    console.log("long tap")
    wx.showModal({
      title: '提示',
      content: '不喜欢这类资源吗?',
      showCancel: true
    })
  },
  /// 按钮触摸开始
  touchStart: function (e) {
    this.data.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.data.touchEndTime = e.timeStamp
  },
  goDetail: function (e) {
    var that = this
    if (that.data.touchEndTime - that.data.touchStartTime < 350) {
      let productid = e.currentTarget.dataset.productid
      let paytopartyid = e.currentTarget.dataset.paytopartyid
      console.log('paytopartyid=>' + paytopartyid)
      wx.navigateTo({
        url: '/pages/previewreadResource/previewreadResource?productid=' + productid + '&paytopartyid=' + paytopartyid
      })
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      more: false,
      no_more: false
    })
    this.get_data()
  },
  onReachBottom: function () {
    console.log('this.data.more =' + this.data.more)
    console.log('this.data.ls_load =' + this.data.ls_load)
    if (this.data.more && !this.data.ls_load) {
      this.setData({
        page: this.data.page + 1,
        more_data: "正在加载更多.."
      })
      this.get_data(app.globalData.unicodeId)
    }
  },
  onShareAppMessage: function () {

  },
  globalData: {
    userInfo: null,
    code: null,
    unicodeId: null,
    collectProduct: null
  }
})