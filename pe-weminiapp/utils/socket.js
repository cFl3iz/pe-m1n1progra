class Socket {
  constructor(host) {
    this.host = host
    this.connected = false
    //连接服务器
    wx.connectSocket({
      url: this.host,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1'],
      method: "GET"
    })
    console.log('链接小沈的socket' + this.host)
    // 监听连接成功
    wx.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！')
      wx.sendSocketMessage({
        data: 'Hello,World:' + Math.round(Math.random() * 0xFFFFFF).toString(),
      })
      //this.connected = true
      // wx.sendSocketMessage({
      //   data: JSON.stringify({
      //     peopleId: peopleId,
      //     cmd: 'JOIN',
      //     roomId: '1000'
      //   })
      // })
    })
    console.log('链接小沈的socket' + this.host)
    // 监听连接断开
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败，请检查！')
      this.connected = false
      wx.connectSocket({
        url: this.host
      })
    })

    // 监听连接关闭
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      this.connected = false
      wx.connectSocket({
        url: this.host
      })
    })
  }
  //发送消息
  sendMessage(data) {
    if (!this.connected) {
      console.log('not connected')
      return
    }
    wx.sendSocketMessage({
      data: 'JSON.stringify(data)'
    })
  }
  //接受消息
  onMessage(callback) {
    console.log(typeof callback)
    if (typeof (callback) != 'function'){
      return
    }else{
      console.log('接受消息呀啊啊啊')
      // 监听服务器消息
      wx.onSocketMessage((res) => {
        console.log(res)
        const data = JSON.parse(res.data)
        callback(data)
      })
    }
  }
}

const socket = new Socket('http://localhost:3000')

export default socket