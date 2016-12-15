import Gfp from '../math/Gfp'
import { connectToSpdzProxies, consumeDataFromSpdzProxies, retrieveShares } from './SpdzApiHelper'
import { twoProxiesWith2Connected } from '../test_support/ProxyServerList'

jest.mock('./SpdzApi')
import { connectProxyToEngine, consumeDataFromProxy } from './SpdzApi'

const spdzProxyUrlList = [
  "http://spdzProxy.one:4000",
  "http://spdzProxy.two:4000",
  "http://spdzProxy.three:4000"
]

describe('Client making multiple Spdz proxy to engine connections', () => {
  afterEach(() => {
    connectProxyToEngine.mockClear()
  })

  it('Sets the connection status when all connections work', (done) => {
    connectProxyToEngine
        .mockImplementationOnce(() => Promise.resolve('somelocation'))
        .mockImplementationOnce(() => Promise.resolve('somelocation'))
        .mockImplementationOnce(() => Promise.resolve('somelocation'))

    const expectedResult = [
      { id: 0, status: 2 },
      { id: 1, status: 2 },
      { id: 2, status: 2 }
    ]
 
    connectToSpdzProxies(spdzProxyUrlList, '/apiroot', 0)
      .then((values) => {
        expect(values.length).toEqual(3)
        expect(values).toEqual(expectedResult)
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })

  it('Sets the connection status when some connections do not work', (done) => {
    connectProxyToEngine
        .mockImplementationOnce(() => Promise.resolve('somelocation'))
        .mockImplementationOnce(() => Promise.reject(new Error('Forced in testing')))
        .mockImplementationOnce(() => Promise.resolve('somelocation'))

    const expectedResult = [
      { id: 0, status: 2 },
      { id: 1, status: 3 },
      { id: 2, status: 2 }
    ]
 
    connectToSpdzProxies(spdzProxyUrlList, '/apiroot', 0)
      .then((values) => {
        expect(values.length).toEqual(3)
        expect(values).toEqual(expectedResult)
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })  
})

describe('Client requesting data from multiple Spdz proxies', () => {
  afterEach(() => {
    consumeDataFromProxy.mockClear()
  })

  it('Successfully receives the data from each proxy', (done) => {
    const buffer0 = Uint8Array.of(1,2,3)
    const buffer1 = Uint8Array.of(4,5,6)
    const buffer2 = Uint8Array.of(7,8,9)

    consumeDataFromProxy
        .mockImplementationOnce(() => Promise.resolve(buffer0))
        .mockImplementationOnce(() => Promise.resolve(buffer1))
        .mockImplementationOnce(() => Promise.resolve(buffer2))

    const expectedResult = [buffer0, buffer1, buffer2]
 
    consumeDataFromSpdzProxies(spdzProxyUrlList, '/apiroot', 0)
      .then((values) => {
        expect(values.length).toEqual(3)
        expect(values).toEqual(expectedResult)
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })

  it('Handles missing data from one of the proxies', (done) => {
    const buffer0 = Uint8Array.of(1,2,3)
    const buffer2 = Uint8Array.of(7,8,9)

    consumeDataFromProxy
        .mockImplementationOnce(() => Promise.resolve(buffer0))
        .mockImplementationOnce(() => Promise.reject(new Error('Forced in testing')))
        .mockImplementationOnce(() => Promise.resolve(buffer2))

    consumeDataFromSpdzProxies(spdzProxyUrlList, '/apiroot', 0)
      .then((values) => {
        done.fail()
      })
      .catch((err) => {
        expect(err.message).toEqual('Forced in testing')
        expect(err.reason).toBeUndefined()
        done()
      })  
  })  
})

describe('Client requests 1 set of triples from 2 proxies to use as shares', () => {
  afterEach(() => {
    consumeDataFromProxy.mockClear()
  })

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
    consumeDataFromProxy
        .mockImplementationOnce(() => Promise.resolve(byteBuffer1))
        .mockImplementationOnce(() => Promise.resolve(byteBuffer2))

    retrieveShares(1, false, twoProxiesWith2Connected, '/apiroot', 0)
        .then((shareList) => {
          expect(shareList.length).toEqual(1)
          expect(shareList[0]).toEqual(Gfp.fromString('8', true))
          done()
        })
        .catch((err) => {
          done.fail(err)
        })  
  })
})