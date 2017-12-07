//获取应用实例
var app = getApp()
Page({
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false,  // loading
        unionid:'',
        orderList:null
    },

    //事件处理函数
    //swiperchange: function(e) {
    //    //console.log(e.detail.current)
    //    var ticket = that.data.activityList[event.currentTarget.dataset.ind];
    //},
    //事件处理函数
    bindViewTap: function (event) {
        var that = this;
        var ticket = that.data.orderList[event.currentTarget.dataset.ind];
        //app.globalData.billid=ticket;
        //app.billid=ticket;

        ticket = JSON.stringify(ticket);

        //console.log(ticket);
        //wx.navigateTo({
        //    url: '../logs/logs?billid=' + ticket
        //})
    },
    showmybill: function () {
        //wx.navigateTo({
        //    url: '../mybill/mybill'
        //});
    },

    onLoad: function() {
        console.log('onLoad')
        var that = this

            //调用应用实例的方法获取全局数据
        //app.getUserInfo(function(userInfo) {
        //    console.log(JSON.stringify(userInfo))
        //    //更新数据
        //    that.setData({
        //
        //        userInfo: userInfo
        //    })
        //})

        app.getUserInfo(function (userInfo,orderList) {
            console.log('=in index================================' + userInfo.gender);
            that.data.unionid = userInfo.gender;
            //更新数据
            that.setData({
                userInfo: userInfo
            });
            if(userInfo) {

                //venuesList Order List 此处要改成POST
                console.log('hahas='+userInfo.gender);
                var serverUrl = 'http://www.lyndonspace.com:3400/wechatminiprogram/control/queryOrderListFromWeChat';
                var testUrl   = 'http://localhost/s/orderList/';
                wx.request({
                    url: testUrl,
                    method: 'GET',
                    data: {openId:userInfo.gender},
                    header: {
                        'Accept': 'application/json'
                    },
                    success: function(res) {

                        var str = res.data;

                        str = String(str).replace("//", "");
                        str = String(str).replace("\\", "");
                        console.log("in str:=" + str);

                        var resultMap = JSON.parse(str);
                        //
                        console.log("in Response:=" + resultMap);
                        that.data.orderList =  resultMap.orderList
                        that.setData({
                            orderList: resultMap.orderList
                        })

                       // console.log("!!!!!!!!!!!!!!!!!!!resultMap=" + JSON.stringify(res));
                        setTimeout(function () {
                            that.setData({
                                loadingHidden: true
                            })
                        }, 1500)
                    }
                })


            }
        });


        //sliderList
        //wx.request({
        //    url: 'http://huanqiuxiaozhen.com/wemall/slider/list',
        //    method: 'GET',
        //    data: {},
        //    header: {
        //        'Accept': 'application/json'
        //    },
        //    success: function(res) {
        //        that.setData({
        //            images: res.data
        //        })
        //    }
        //})



        //choiceList
        //wx.request({
        //    url: 'http://huanqiuxiaozhen.com/wemall/goods/choiceList',
        //    method: 'GET',
        //    data: {},
        //    header: {
        //        'Accept': 'application/json'
        //    },
        //    success: function(res) {
        //        that.setData({
        //            choiceItems: res.data.data.dataList
        //        })
        //        setTimeout(function () {
        //            that.setData({
        //                loadingHidden: true
        //            })
        //        }, 1500)
        //    }
        //})

    }
})
