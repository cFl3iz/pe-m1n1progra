const Request = {
  postRequest: function (url, data) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: data,
        method: 'POST',
        success: function (res) {
          console.log('网络请求成功')
          resolve(res.data)
        },
        fail: function (res) {
          console.log('网络请求失败')
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
export default Request