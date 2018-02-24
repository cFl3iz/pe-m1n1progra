function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 删除本地的Storage
var removeStorage = function (key) {
  wx.removeStorage({
    key: key,
    success: function (res) {
    }
  })
};
// 添加本地的Storage
var setStorage = function (key, val) {
  wx.setStorage({
    key: key,
    data: val
  })
};

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  removeStorage: removeStorage,
  setStorage: setStorage
}
 
 