import { connectToSpdzProxies, consumeDataFromSpdzProxies } from './SpdzApiHelper'

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

describe('Client requests a fixed number of triples to use as shares', () => {
  xit('Returns the valid triples from 2 SPDZ proxies', () => {
  })
})