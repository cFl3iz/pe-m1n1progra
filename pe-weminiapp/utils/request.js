const request={
  postRequest:function(url,data){
    return new Promise(function (resolve, reject){ 
      wx.request({
        url: url,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: data,
        method: 'POST',
        success: function (res) {
          resolve(res.data)
        },
        fail: function (res) {
          reject(res)
        },
        complete: function () {
          if (typeof doComplete == "function") {
            doComplete();
          }
        }
      });
    })
  }
}
export default request