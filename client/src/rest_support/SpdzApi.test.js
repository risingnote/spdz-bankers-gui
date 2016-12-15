import HttpStatus from 'http-status-codes'

import { getProxyConfig, connectProxyToEngine, consumeDataFromProxy } from './SpdzApi'
import mockResponse from '../test_support/MockResponse'

describe('Prove the SpdzApi with mock responses from fetch', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Reads the GUI config successfully from /spdzconfig', (done) => {
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers({'Content-type':'application/json'})
      return Promise.resolve(mockResponse(200, '{ "foo": "bar" }', headers))
    })
  
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
      const headers = new Headers({'Location': 'http://somelocation'})
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
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers({'Content-type':'application/json'})
      return Promise.resolve(mockResponse(HttpStatus.SERVICE_UNAVAILABLE, 
      '{ "status": "503", "message": "test error" }', headers))
    })
  
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

describe('Consume a binary value from the Spdz Proxy', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Successfully retrieves some binary data', (done) => {
    const expectedBuffer = Uint8Array.of(1,2,3,4,5,6,7,8,9,10,11)
    const responseBody = new Blob([expectedBuffer.buffer])

    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers({'Content-type': 'application/octet-stream'})
      return Promise.resolve(mockResponse(HttpStatus.OK, responseBody, headers))
    })
    
    consumeDataFromProxy()
      .then((buffer) => {
        expect(buffer).toEqual(expectedBuffer)
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })

  it('Throws an error if no data to retrieve', (done) => {
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers()
      return Promise.resolve(mockResponse(HttpStatus.NO_CONTENT, null, headers)) 
    })
  
    consumeDataFromProxy()
      .then((response) => {
        done.fail()
      })
      .catch((err) => {
        expect(err.message).toEqual('No data is available to consume from the spdz proxy. Status: 204.')
        expect(err.reason).toBeUndefined()
        done() 
      })  
  })
  
})