import HttpStatus from 'http-status-codes'

import NoContentError from './NoContentError'
import { getProxyConfig, connectProxyToEngine, consumeDataFromProxy, sendDataToProxy } from './SpdzApi'
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

  it('Throws a no content error if no data to retrieve', (done) => {
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers()
      return Promise.resolve(mockResponse(HttpStatus.NO_CONTENT, null, headers)) 
    })
  
    consumeDataFromProxy()
      .then((response) => {
        done.fail()
      })
      .catch((err) => {
        expect(err).toBeInstanceOf(NoContentError)
        expect(err.message).toEqual('No data is available to consume from the spdz proxy. Status: 204.')
        expect(err.reason).toBeUndefined()
        done() 
      })  
  })

  it('Throws a general error with bad http response', (done) => {
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers({'Content-type':'application/json'})
      return Promise.resolve(mockResponse(HttpStatus.SERVICE_UNAVAILABLE, 
      '{ "status": "503", "message": "test error" }', headers))
    })
  
    consumeDataFromProxy()
      .then((response) => {
        done.fail()
      })
      .catch((err) => {
        try {
          expect(err).toBeInstanceOf(Error)
          expect(err.message).toEqual('Unable to consume data from spdz proxy. Status: 503. Reason: test error')
          expect(err.reason).toEqual({ "status": "503", "message": "test error" })
          done() 
        }
        catch(ex) {
          done.fail(ex)
        }
      })  
  })
  
})

describe('Sends array of base64 encoded integers to the Spdz Proxy', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Successfully sends data', (done) => {
    const examplePayloadData = ['J72LqIgKBjKu5zFKt1vo4g==', 'J72LqIgKBjKu5zFKt1vo4g==']

    window.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve(mockResponse(HttpStatus.OK))
    })
    
    sendDataToProxy('http://somehost', 'apiroot', '123', examplePayloadData)
      .then(() => {
        done()
      })
      .catch((err) => {
        done.fail(err)
      })  
  })

  it('Manages non OK status code', (done) => {
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers({'Content-type': 'application/json'})
      const responseBody = '{"status": "400", "message": "force error for testing"}'
      return Promise.resolve(mockResponse(HttpStatus.BAD_REQUEST, responseBody, headers)) 
    })
  
    sendDataToProxy('http://somehost', 'apiroot', '123', "wrong format data")
      .then((response) => {
        done.fail()
      })
      .catch((err) => {
        expect(err.message).toEqual('Unable to send data to spdz proxy. Status: 400. Reason: force error for testing')
        expect(err.reason).toEqual({
              "message": "force error for testing",
              "status": "400"
            })
        done()
      })  
  })
 
})