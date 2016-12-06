import HttpStatus from 'http-status-codes'

import { getProxyConfig, connectProxyToEngine } from './SpdzApi'
import mockResponse from './MockResponse'

describe('Prove the SpdzApi with mock responses from fetch', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Reads the GUI config successfully from /spdzconfig', (done) => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, '{ "foo": "bar" }'))
    )
  
    getProxyConfig()
      .then((json) => {
        expect(json).toEqual({"foo": "bar"})
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })
  
  it('Reads the GUI config and throws an error from /spdzconfig', (done) => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(500))
    )
  
    getProxyConfig()
      .then((json) => {
        expect(json).toBeFalsy()
        done()
      })
      .catch((err) => {
        expect(err.message).toEqual('Unable to read spdz proxy config. Status: 500.')
        done()
      })  
  })
})

describe('Connect the Spdz Proxy to the Spdz Engine for a client', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Successfully runs the connect setup', (done) => {
    window.fetch = jest.fn().mockImplementation(() => {
      let headers = new Headers()
      headers.set('Location', 'http://somelocation')
      return Promise.resolve(mockResponse(HttpStatus.CREATED, null, headers))
    })
    
  
    connectProxyToEngine()
      .then((location) => {
        expect(location).toEqual('http://somelocation')
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })

  it('Throws an error if connect setup did not work', (done) => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(HttpStatus.SERVICE_UNAVAILABLE, '{ "status": "503", "message": "test error" }'))
    )
  
    connectProxyToEngine('http://spdzProxy', '/spdzApi', 23)
      .then((response) => {
        done.fail()
      })
      .catch((err) => {
        expect(err.message).toEqual('Unable to make spdz proxy engine connection. Status: 503. Reason: test error')
        expect(err.reason).toEqual({ "status": "503", "message": "test error" })
        done() 
      })  
  })

})
