import { List, Map } from 'immutable'
import { generateProxyStatusList } from './ProxyStatusHelper'
import { ProxyStatusCodes } from 'spdz-gui-lib'

const proxyList =  List([
   Map({ "url": "http://spdzproxyhere:3001", "publicKey": "0102030405060708010203040506070801020304050607080102030405060708", "encryptionKey": undefined }),
   Map({ "url": "http://spdzproxyhere:3002", "publicKey": "a1b2c3d4e5a6b7c8010203040506070801020304050607080102030405060708", "encryptionKey": undefined }),
   Map({ "url": "http://spdzproxyhere:3003", "publicKey": "11b2c3d4e5a6b7c8010203040506070801020304050607080102030405060708", "encryptionKey": undefined })   
])

describe('Helper functions to manage spdz proxy status', () => {

  test('I can combine the proxy list and status list', () => {

    const statusList = [
      { id: 0, status: 3 },
      { id: 1, status: 2 },
      { id: 2, status: 3 }
    ]

    const displayList = generateProxyStatusList(proxyList, statusList)

    expect(displayList.get(0).get('url')).toEqual('http://spdzproxyhere:3001')
    expect(displayList.get(1).get('url')).toEqual('http://spdzproxyhere:3002')
    expect(displayList.get(2).get('url')).toEqual('http://spdzproxyhere:3003')    
    expect(displayList.get(0).get('status')).toEqual(ProxyStatusCodes.Failure)
    expect(displayList.get(1).get('status')).toEqual(ProxyStatusCodes.Connected)
    expect(displayList.get(2).get('status')).toEqual(ProxyStatusCodes.Failure)
  })

  test('I can combine the proxy list with an empty status list', () => {
    const statusList = []

    const displayList = generateProxyStatusList(proxyList, statusList)

    expect(displayList.get(0).get('url')).toEqual('http://spdzproxyhere:3001')
    expect(displayList.get(1).get('url')).toEqual('http://spdzproxyhere:3002')
    expect(displayList.get(2).get('url')).toEqual('http://spdzproxyhere:3003')    
    expect(displayList.get(0).get('status')).toEqual(ProxyStatusCodes.Disconnected)
    expect(displayList.get(1).get('status')).toEqual(ProxyStatusCodes.Disconnected)
    expect(displayList.get(2).get('status')).toEqual(ProxyStatusCodes.Disconnected)
  })

})
 