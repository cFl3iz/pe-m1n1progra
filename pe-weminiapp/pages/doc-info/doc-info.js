var app = getApp()
let ArrayList = require("../../utils/arrayList.js");
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({
  data: {
    productId:null,
    doc_id: 0,
    doc: {},
    my_doc: [],
    is_add: true,
    add_text: "已加入",
    show_page: false,
    data: {},
    page: 1,
    class_id: 0,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false
  },
  onLoad: function (option) {
    const that = this
    console.log('in this block !!!!!!!!!!!!!!!!option.productid!!!!!!!!!!!' + option.productid)
    let old_my_doc = wx.getStorageSync("old_my_doc");
    if (old_my_doc == '') {
      old_my_doc = { arr: [] };
    }
    let list = new ArrayList(old_my_doc.arr);
    list.setType("number")
    let id = option.doc_id
    this.setData({
      doc_id: id,
      my_doc: list,
      productId: option.productid
    })
    wx.showLoading({
      title: '加载中',
    })


    app.weChatLogin().then(function (data) {
      that.getUnionId(data)
      app.getUserInfo()
    }) 
   // this.get_data()
  },
  setDemoData(){
    this.setData({
      doc: JSON.parse('{"id":80,"title":"SQLite全套视频教程23集","desc":"SQLit真是一个好东西啊,我们很喜欢这种小型数据库......  ","doc_class_id":"55","cover":"","h_cover":"","user_id":0,"source":"金龙熙的转发","source_url":null,"is_end":0,"order":99999,"is_hot":1,"created_at":"2017-08-15 15:27:27","updated_at":"2017-08-30 09:13:39","deleted_at":null,"state":1,"user":{"firstName":"冯浩"},"is_follow":false,"is_like":false,"like_count":3,"likes":[{"id":3364,"firstName":"Jack","avatar":"https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKT1GyUvvZfAglMDVwt9Tia74gUh2LcJop63jvsa85ibxbDicpJficSFtfDRGvL894RtXtKftwtuFibfPg/0","pivot":{"followable_id":80,"user_id":3364,"followable_type":"","relation":"like","created_at":"2017-12-13 18:17:31"}},{"id":1738,"firstName":"安","avatar":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJpX356K341IDDAicf7icRrqfa8eTXMDIeFzMuuicdFt34dkul9DnxWWlADPY1JmqAYNGzf3msjPVibWg/0","pivot":{"followable_id":80,"user_id":1738,"followable_type":"","relation":"like","created_at":"2017-10-08 06:44:28"}},{"id":1451,"firstName":"吕丰泉","avatar":"https://wx.qlogo.cn/mmopen/PiajxSqBRaELPbZZjgklv6kRzZEws49cFv89LpAocKqUuxfmibAO1icFnck3DI0ibChlgzYd0ib0JaOgupicZ5aNDVdQ/0","pivot":{"followable_id":80,"user_id":1451,"followable_type":"","relation":"like","created_at":"2017-08-27 14:34:40"}}],"cover_url":"http://cloud-doc-img.leyix.com/image/Group 5 Copy 81.png!225x300","h_cover_url":"","doc_class":{"id":55,"title":"其他","desc":"其他","parent_id":5,"order":1,"icon":"","created_at":"2017-08-15 15:29:31","updated_at":"2017-08-15 15:29:31","state":1,"index_show":0,"icon_url":""}}'),
      data: JSON.parse('{"current_page":1,"data":[],"from":null,"last_page":0,"next_page_url":null,"path":"https://cloud-doc.leyix.com/api/v3/doc-info-2","per_page":15,"prev_page_url":null,"to":null,"total":0}'),
      show_page: true,
      is_load: true
    })

    wx.stopPullDownRefresh()
    wx.hideLoading()
  },
  get_data(unioId) {

 
    const that = this
    const data = {
         unioId: unioId,
         productId:that.data.productId,
         page: that.data.page
       }
       Request.postRequest('https://www.yo-pe.com/api/common/queryResourceDetail', data).then
       ( 
         function (data) {
           console.log('tdata.resourceDetail=' + data.resourceDetail)
              if ( data.resourceDetail == undefined ){
                that.setDemoData()
              }else{
                 console.log('return data = ' + JSON.stringify(data))
                          that.setData({
                            doc: data.resourceDetail,
                            data: data,
                            show_page: true
                          })
                          wx.hideLoading()
              }
            
          }
       )


    // wx.request({
    //   url: getApp().api.get_v3_2_doc_info,
    //   header: {
    //     'Authorization': 'Bearer ' + getApp().user.ckLogin()
    //   },
    //   data: {
    //     doc_id: this.data.doc_id,
    //     page: this.data.page
    //   },
    //   success: (res) => {
    //     if (res.data.current_page == 1) {
    //       console.log('in this block !!!!res.data=' + JSON.stringify(res.data))
    //       this.setData({
    //         doc: res.data.doc,
    //         data: res.data,
    //         show_page: true
    //       })
    //       if (!res.data.doc.is_follow) {
    //         this.setData({
    //           is_add: false,
    //           add_text: "加入档库"
    //         })
    //       }
    //       wx.setNavigationBarTitle({
    //         title: res.data.doc.title
    //       })
    //     } else {
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
    //   }, complete: () => {
    //     wx.hideLoading()
    //   }
    // })
  },
  getUnionId: function (code) {
    console.log('获取unicodeId' + code)
    const that = this
    const url = ServiceUrl.platformManager + 'jscode2session'
    const data = {
      code: code,
      nickName: app.globalData.userInfo.nickName,
      gender: app.globalData.userInfo.gender,
      language: app.globalData.userInfo.language,
      avatarUrl: app.globalData.userInfo.avatarUrl
    }
    Request.postRequest(url, data).then(function (data) {
      console.log('indetail 设置全局unicodeId = ' + JSON.stringify(data))
      const unicodeId = data
      app.globalData.unicodeId = unicodeId //设置全局unicodeId
      return unicodeId
    }).then(function (data) {
      that.get_data(data)
    })
  },
  go_menu: function (event) {
    let doc_id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../doc-menu/doc-menu?doc_id=' + doc_id
    })
  },
  add_my_doc: function (event) {
    let doc_id = event.currentTarget.dataset.id;
    getApp().user.isLogin(token => {
      wx.showNavigationBarLoading()
      wx.request({
        url: getApp().api.v3_user_follow,
        method: 'post',
        header: {
          'Authorization': 'Bearer ' + token
        },
        data: {
          key: doc_id,
          type: 'doc'
        }, success: res => {
          if (res.data.status_code == 200) {
            this.setData({
              is_add: true,
              add_text: "已加入"
            })
            wx.showToast({
              title: '加入成功',
            })
            try {
              getApp().pages.get('pages/user/user').get_data();
            } catch (e) {

            }
          }
        }, complete: res => {
          wx.hideNavigationBarLoading()
        }
      })
    })
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
    if (this.data.more && !this.data.ls_load) {
      this.setData({
        page: this.data.page + 1,
        more_data: "正在加载更多.."
      })
      this.get_data()
    }
  },
  onShareAppMessage: function () {
    return {
      title: "我觉得这个资源不错,推荐给你看看！"
    }
  },
  doc_like(event) {

    let id = event.currentTarget.dataset.id;
    let ty = event.currentTarget.dataset.type;
    if (this.data.doc.is_like && ty == 'doc') {
      wx.showToast({
        title: '已经赞过了',
      })
      return false;
    }
    getApp().user.isLogin(token => {
      wx.request({
        url: getApp().api.v3_user_like,
        header: {
          'Authorization': 'Bearer ' + getApp().user.ckLogin()
        },
        data: {
          'key': id,
          'type': ty
        }, success: res => {
          if (res.data.status_code == 200) {
            if (res.data.data.attached.length > 0) {
              wx.showToast({
                title: '赞+1',
              })
              if (ty == 'doc') {
                let doc = this.data.doc
                doc.is_like = true
                doc.like_count = doc.like_count + 1
                this.setData({
                  doc: doc
                })
              }
            } else {
              wx.showToast({
                title: '已经赞过了',
              })
            }
          } else {
            wx.showToast({
              title: '操作失败',
            })
          }
        }, complete: () => {
        }
      })
    })
  }
})