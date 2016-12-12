import { List } from 'immutable'
import { initSpdzServerList, updateSpdzServerStatus, allProxiesConnected } from './SetupContainerHelper'
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
    const updates = [
      { id: 0, status: 3 },
      { id: 1, status: 2 },
      { id: 2, status: 3 }
    ]

    const newState = updateSpdzServerStatus(state, updates)

    expect(state).not.toBe(newState)

    expect(newState.get(0).get('status')).toEqual(ProxyStatusCodes.Failure)
    expect(newState.get(1).get('status')).toEqual(ProxyStatusCodes.Connected)
    expect(newState.get(2).get('status')).toEqual(ProxyStatusCodes.Failure)
  })

  test('I get an exception thrown if trying to update with mismatching list lengths', () => {
    const state = initSpdzServerList(myjson)
    const updates = [
      { id: 0, status: 3 },
      { id: 1, status: 2 }
    ]

    const functionWithThrow = () => updateSpdzServerStatus(state, updates)

    expect(functionWithThrow).toThrowError('Expecting the spdz proxy list 3 to be the same length as the status list 2.')
  })

  test('I can detect if all spdz proxies are connected', () => {
    const state = initSpdzServerList(myjson)
    expect(allProxiesConnected(state)).toBeFalsy()

    const updates = [
      { id: 0, status: 2 },
      { id: 1, status: 2 },
      { id: 2, status: 2 }
    ]

    const newState = updateSpdzServerStatus(state, updates)
    expect(allProxiesConnected(newState)).toBeTruthy()
  })
})
 