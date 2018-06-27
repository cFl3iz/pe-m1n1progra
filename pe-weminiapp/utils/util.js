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

//保留两位小数  
//功能：将浮点数四舍五入，取小数点后2位 
function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  //f = Math.round(x * 100) / 100;//取小数点后2位 
  f = Math.round(x);//取小数点后0位 
  return f;
}


//制保留2位小数，如：2，会在2后面补上00.即2.00 
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
} 

module.exports = {
  formatTime: formatTime,
  removeStorage: removeStorage,
  setStorage: setStorage,
  toDecimal: toDecimal,
  toDecimal2: toDecimal2,
  fomatFloat: fomatFloat
}
 
 