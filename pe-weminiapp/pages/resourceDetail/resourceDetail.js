Page({
  data: {
    id: 0,
    show_page: false,
    data: {},
    wenda: [],
    page: 1,
    class_id: 0,
    more_data: "加载更多中..",
    no_more: false,
    no_data: false,
    more: false,
    ls_load: false
  },
  onLoad: function (option) {
    let id = option.id
    this.setData({
      id: id
    })
    wx.showLoading({
      title: '加载中',
    })
    this.get_data()
  },
  get_data() {
    this.setData({
      is_load: true
    })
    let demoData = '{"current_page":1,"data":[],"from":null,"last_page":0,"next_page_url":null,"path":"","per_page":10,"prev_page_url":null,"to":null,"total":0,"wenda":{"id":210,"user_id":3811,"title":"Vssv cdgwvc","desc":"Xxx,x","pics":[],"created_at":"2018-01-22 00:15:08","view_count":0,"source":"doc","source_id":23,"is_like":false,"like_count":0,"user":{"id":3811,"name":"jack","title":"haha","avatar":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosfuYCyHjScIecib9jG0l5MnPqiaCPibVh7ZIMGDMw4WwvMH2pEBt8Vhv1fH2dckEaeoZx72dqhTia9w/0"},"created":"","pics_arr":[],"pics_type":3,"source_info":{"id":23,"title":"Java","desc":"Java","cover":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosfuYCyHjScIecib9jG0l5MnPqiaCPibVh7ZIMGDMw4WwvMH2pEBt8Vhv1fH2dckEaeoZx72dqhTia9w/0","h_cover":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosfuYCyHjScIecib9jG0l5MnPqiaCPibVh7ZIMGDMw4WwvMH2pEBt8Vhv1fH2dckEaeoZx72dqhTia9w/0","page_id":0,"cover_url":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosfuYCyHjScIecib9jG0l5MnPqiaCPibVh7ZIMGDMw4WwvMH2pEBt8Vhv1fH2dckEaeoZx72dqhTia9w/0","h_cover_url":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosfuYCyHjScIecib9jG0l5MnPqiaCPibVh7ZIMGDMw4WwvMH2pEBt8Vhv1fH2dckEaeoZx72dqhTia9w/0"}}}';
         this.setData({
           data: JSON.parse(demoData),
           wenda: JSON.parse(demoData).wenda,
            show_page: true
          })
         wx.hideLoading()
    // wx.request({
    //   url: 'https://cloud-doc.leyix.com/api/v3/wenda-page?id=210',
    //   // header: {
    //   //   'Authorization': 'Bearer ' + getApp().user.ckLogin()
    //   // },
    //   // data: {
    //   //   id: this.data.id,
    //   //   page: this.data.page
    //   // },
    //   success: res => {
    //     if (res.data.current_page == 1) {
    //       this.setData({
    //         data: res.data,
    //         wenda: res.data.wenda,
    //         show_page: true
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
    //   }, complete: res => {
    //     wx.hideLoading()
    //   }
    // })
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

  },
  show_image(event) {
    let item = event.currentTarget.dataset.src;
    let pics = []
    this.data.wenda.pics_arr.map(item => {
      pics.push(item.path)
    })
    wx.previewImage({
      current: item,
      urls: pics
    })
  },
  wenda_like(event) {
   
    let id = event.currentTarget.dataset.id;
    let ty = event.currentTarget.dataset.type;
    if (this.data.wenda.is_like && ty == 'wenda') {
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
              if (ty == 'wenda') {
                let wenda = this.data.wenda
                wenda.is_like = true
                wenda.like_count = wenda.like_count + 1
                this.setData({
                  wenda: wenda
                })
              }
            }else{
              wx.showToast({
                title: '已经赞过了',
              })
            }
          }else{
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