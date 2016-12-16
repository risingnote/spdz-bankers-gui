import Gfp from '../math/Gfp'
import { retrieveShares, sendInputsWithShares } from './SpdzApiHelper'
import { twoProxiesWith2Connected } from '../test_support/ProxyServerList'

jest.mock('./SpdzApiAggregate')
import { consumeDataFromProxies, sendInputsToProxies } from './SpdzApiAggregate'

describe('Client sending an input to 2 proxies', () => {
  afterEach(() => {
    consumeDataFromProxies.mockClear()
    sendInputsToProxies.mockClear()
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

    sendInputsWithShares([input], false, twoProxiesWith2Connected, '/apiroot', 0)
        .then(() => {
          expect(sendInputsToProxies.mock.calls.length).toEqual(1)
          expect(sendInputsToProxies.mock.calls[0]).toEqual([[inputToSend]])
          done()
        })
        .catch((err) => {
          done.fail(err)
        })  
  })  
})

