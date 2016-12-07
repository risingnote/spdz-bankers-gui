import connectToSpdzProxies from './SpdzApiHelper'
import { List, Map } from 'immutable'
import ProxyStatusCodes from '../setup/ProxyStatusCodes'

//Mocking. Can't use es6 import and then redefine function in test so have to use require....
jest.mock('./SpdzApi')
const spdzApi = require('./SpdzApi')

describe('Client making multiple Spdz proxy to engine connections', () => {
  afterEach(() => {
    spdzApi.connectProxyToEngine.mockClear()
  })

  const spdzProxyServerList = List.of(
    Map({
      "url": "http://spdzProxy.one:4000",
      "status": ProxyStatusCodes.Disconnected
    }),
    Map({
      "url": "http://spdzProxy.two:4000",
      "status": ProxyStatusCodes.Disconnected
    }),
    Map({
      "url": "http://spdzProxy.three:4000",
      "status": ProxyStatusCodes.Disconnected
    })
  )

  it('Sets the connection status when all connections work', (done) => {

    spdzApi.connectProxyToEngine = jest.fn()
        .mockImplementationOnce(() => Promise.resolve('somelocation'))
        .mockImplementationOnce(() => Promise.resolve('somelocation'))
        .mockImplementationOnce(() => Promise.resolve('somelocation'))

    const expectedResult = [
      { id: 0, status: 2 },
      { id: 1, status: 2 },
      { id: 2, status: 2 }
    ]
 
    connectToSpdzProxies(spdzProxyServerList, '/apiroot', 0)
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

    spdzApi.connectProxyToEngine = jest.fn()
        .mockImplementationOnce(() => Promise.resolve('somelocation'))
        .mockImplementationOnce(() => Promise.reject(new Error('Forced in testing')))
        .mockImplementationOnce(() => Promise.resolve('somelocation'))

    const expectedResult = [
      { id: 0, status: 2 },
      { id: 1, status: 3 },
      { id: 2, status: 2 }
    ]
 
    connectToSpdzProxies(spdzProxyServerList, '/apiroot', 0)
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
