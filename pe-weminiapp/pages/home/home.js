var app = getApp()
import { formatTime } from '../../utils/util'
import ServiceUrl from '../../utils/serviceUrl.js'
import Request from '../../utils/request.js'
Page({
  data: {
    grids: [
      { type: '我的', url: '../../images/home/me/me@3x.png', backgroundColor: '#f78259', router:'/pages/myProduct/myProduct' },
      { type: '好友', url: '../../images/home/friend/friends@3x.png', backgroundColor: '#73bbf7' },
      { type: '素然', url: '../../images/home/sucsug/zero拷贝@3x.png', backgroundColor: '#efc553' },
      { type: '消息', url: '../../images/home/message/message@3x.png', backgroundColor: '#fb73aa' },
      { type: '关于', url: '../../images/home/about/about@3x.png', backgroundColor: '#9ec308' },
      { type: '订单', url: '../../images/home/bigorder/bigorderl@3x.png', backgroundColor: ' #ef9153' },
    ],
    text: '123'
  }
});