import ServiceUrl from './serviceUrl.js'
import Request from './request.js'
const forward = {

  //创建转发链
  createForwardChain: function (tarjeta, objectId, objectType, dateKey) {
    const that = this
    const data = {
      tarjeta: tarjeta,
      objectId: objectId,
      objectType: objectType,
      dateKey: dateKey,
    }
    console.log('创建转发链=>>>>>>>>参数' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'createForwardChain'
    Request.postRequest(url, data).then(function (data) {
      console.log('创建转发链结果=>>>>>>>>' + JSON.stringify(data))
    })
  },

  //加入转发链
  joinForwardChain: function (tarjeta, objectId, objectType, dateKey,partyIdFrom,appId) {
    const that = this
    const data = {
      tarjeta: tarjeta,
      objectId: objectId,
      objectType: objectType,
      dateKey: dateKey,
      partyIdFrom: partyIdFrom,
      appId: appId
    }
    console.log('加入转发链>>>>参数' + JSON.stringify(data))
    const url = ServiceUrl.platformManager + 'joinForwardChain'
    Request.postRequest(url, data).then(function (data) {
      console.log('加入转发链结果=>>>>>>>>' + JSON.stringify(data))
    })
  },
}
export default forward