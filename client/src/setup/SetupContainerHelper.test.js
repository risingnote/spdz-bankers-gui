import { List } from 'immutable'
import { initSpdzServerList, updateSpdzServerStatus } from './SetupContainerHelper'
import ProxyStatusCodes from './ProxyStatusCodes'

const myjson = 
[
    {
      "url": "http://localhost:3001",
      "publicKey": "0102030405060708010203040506070801020304050607080102030405060708" 
    },
    {
      "url": "http://localhost:3002",
      "publicKey": "a1b2c3f4g5a6b7c8010203040506070801020304050607080102030405060708" 
    },
    {
      "url": "http://localhost:3003",
      "publicKey": "a1b2c3f4g5a6b7c8010203040506070801020304050607080102030405060708" 
    }        
]


describe('Helper functions to parse and update spdz proxy status', () => {
  test('I can parse the spdz proxy json config into an immutable data structure', () => {
    const state = initSpdzServerList(myjson)
    expect(List.isList(state)).toBeTruthy()
    expect(state.size).toEqual(3)
    for (let i=0; i<3; i++) {
      expect(state.get(i).get('status')).toEqual(ProxyStatusCodes.Disconnected)
    } 
  })

  test('I can update the spdz proxy status using an immutable data structure', () => {
    const state = initSpdzServerList(myjson)
    const newState = updateSpdzServerStatus(state, 1, ProxyStatusCodes.Connected)

    expect(state).not.toBe(newState)

    expect(newState.get(0).get('status')).toEqual(ProxyStatusCodes.Disconnected)
    expect(newState.get(1).get('status')).toEqual(ProxyStatusCodes.Connected)
    expect(newState.get(2).get('status')).toEqual(ProxyStatusCodes.Disconnected)
  })
  
})
 