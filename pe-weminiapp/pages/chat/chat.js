const app = getApp()
import { formatTime } from '../../utils/util'
import socket from '../../utils/socket'

app.getUserInfo();
Page({
  data: {
    list: [
      {
        id:1,
        name:'龙熙',
        text:'不知道说啥呀',
        avatar:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1513230018&di=d0fc05b0ccea3713e9029d44582cc155&src=http://pic.58pic.com/58pic/16/53/58/08358PICSbi_1024.jpg',
      },
      {
        id: 2,
        name: '小沈',
        text: '不知道说啥呀',
        avatar: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1513230018&di=d0fc05b0ccea3713e9029d44582cc155&src=http://pic.58pic.com/58pic/16/53/58/08358PICSbi_1024.jpg'
      },
    ]
  },
  goPage(e) {
    wx.navigateTo({
      url: '../message/message?name=' + e.currentTarget.dataset.name + "&id=" + e.currentTarget.dataset.id
      //url: '../webChat/webChat?name=' + e.currentTarget.dataset.name + "&id=" + e.currentTarget.dataset.id
    })
  },
  onLoad() {
    socket.onMessage((data) => {
      console.log('我接受不到你的话')
      console.log(data)
      if (data.cmd != "CMD" || data.subCmd != 'ROOMS')
        return
      data.rooms.forEach((room) => {
        room.updated = formatTime(room.updated)
      })
      if (data.cmd == 'CMD' && data.subCmd == 'ROOMS') {
        this.setData({
          list: data.rooms
        })
      }
    })
    // setTimeout(() => {

    //   socket.sendMessage({
    //     cmd: 'ROOMS'
    //   })
    // }, 2000)
  }
})