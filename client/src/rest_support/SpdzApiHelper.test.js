import Gfp from '../math/Gfp'
import { retrieveShares, sendInputsWithShares, retrieveWinnerClientId } from './SpdzApiHelper'
import { twoProxiesWith2Connected } from '../test_support/ProxyServerList'

jest.mock('./SpdzApiAggregate')
import { consumeDataFromProxies, sendInputsToProxies } from './SpdzApiAggregate'

jest.mock('../math/clientIdFromBuffer')
import extractClientId from '../math/clientIdFromBuffer'

describe('Client sending an input to 2 proxies', () => {
  afterEach(() => {
    consumeDataFromProxies.mockClear()
    sendInputsToProxies.mockClear()
    extractClientId.mockClear()
  })

  // Construct some byte arrays which represent a valid triple
  const a1 = Uint8Array.of(5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
  const b1 = Uint8Array.of(6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
  const c1 = Uint8Array.of(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
  const byteBuffer1 = new Uint8Array(48)
  byteBuffer1.set(a1, 0)
  byteBuffer1.set(b1, 16)
  byteBuffer1.set(c1, 32)

  const a2 = Uint8Array.of(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
  const b2 = Uint8Array.of(4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
  const c2 = Uint8Array.of(0xca,0x5b,0x0a,0xd4,0x8c,0x16,0x37,0x01,0xfc,0xb2,0xc9,0xc6,0xf5,0x86,0x27,0x18)
  const byteBuffer2 = new Uint8Array(48)
  byteBuffer2.set(a2, 0)
  byteBuffer2.set(b2, 16)
  byteBuffer2.set(c2, 32)

  it('Returns a valid share from 2 SPDZ proxies', (done) => {
    consumeDataFromProxies.mockImplementationOnce(() => Promise.resolve([byteBuffer1, byteBuffer2]))

    const expectedShare = Gfp.fromString('8', true)

    retrieveShares(1, false, twoProxiesWith2Connected, '/apiroot', 0)
        .then((shareList) => {
          expect(shareList.length).toEqual(1)
          expect(shareList[0]).toEqual(expectedShare)
          done()
        })
        .catch((err) => {
          done.fail(err)
        })  
  })

  it('Sends an input combined with the valid share to 2 SPDZ proxies', (done) => {
    consumeDataFromProxies.mockImplementationOnce(() => Promise.resolve([byteBuffer1, byteBuffer2]))
    
    const input = 4444
    const inputGfpMontg = Gfp.fromString(input).toMontgomery()
    const expectedShare = Gfp.fromString('8', true)
    const inputToSend = inputGfpMontg.add(expectedShare)
    const proxyUrls = twoProxiesWith2Connected.map(spdzProxy => spdzProxy.get('url'))

    sendInputsWithShares([input], false, twoProxiesWith2Connected, '/apiroot', 0)
        .then(() => {
          expect(sendInputsToProxies.mock.calls.length).toEqual(1)
          expect(sendInputsToProxies.mock.calls[0]).toEqual([proxyUrls, '/apiroot', 0, [inputToSend]])
          done()
        })
        .catch((err) => {
          done.fail(err)
        })  
  })  

  it('Returns the winner client id from 2 SPDZ proxies', (done) => {
    const clientId1 = Uint8Array.of(1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0)
    const clientId2 = Uint8Array.of(1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0)
    consumeDataFromProxies.mockImplementationOnce(() => Promise.resolve([clientId1, clientId2]))
    
    const winningId = '0000000100000002000000030000000400000005000000060000000700000008'
    extractClientId.mockImplementationOnce(() => winningId)

    retrieveWinnerClientId(twoProxiesWith2Connected, '/apiroot', 'a1a2a3a4')
        .then((result) => {
          expect(result).toEqual(winningId)
          done()
        })
        .catch((err) => {
          done.fail(err)
        })  
  })

  it('Rejects if the number of return values does not match the number of proxies', (done) => {
    const clientId1 = Uint8Array.of(1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0)
    consumeDataFromProxies.mockImplementationOnce(() => Promise.resolve([clientId1]))
    
    retrieveWinnerClientId(twoProxiesWith2Connected, '/apiroot', 'a1a2a3a4')
        .then((result) => {
          done.fail('Expecting test to throw.')
        })
        .catch((err) => {
          expect(err.message).toEqual('Expecting 2 client ids from SPDZ, got 1.')
          done()
        })
  })
  
  it('Rejects if the retrieve client id function throws', (done) => {
    const clientId1 = Uint8Array.of(1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0)
    const clientId2 = Uint8Array.of(1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0)
    consumeDataFromProxies.mockImplementationOnce(() => Promise.resolve([clientId1, clientId2]))
    
    extractClientId.mockImplementationOnce(() => {throw new Error('Fake error for extractClientId.')})

    retrieveWinnerClientId(twoProxiesWith2Connected, '/apiroot', 'a1a2a3a4')
        .then((result) => {
          done.fail('Expecting test to throw.')
        })
        .catch((err) => {
          expect(err.message).toEqual('Fake error for extractClientId.')
          done()
        })
  })
})

