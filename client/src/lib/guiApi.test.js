/* global window, Headers */
import { getProxyConfig } from './guiApi'
import mockResponse from '../test_support/MockResponse'

//Setup fetch for testing simulating browser environment
window.fetch = undefined
import 'whatwg-fetch'

describe('Prove the SpdzApi with mock responses from fetch', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Reads the GUI config successfully from /spdzconfig', done => {
    window.fetch = jest.fn().mockImplementation(() => {
      const headers = new Headers({ 'Content-type': 'application/json' })
      return Promise.resolve(mockResponse(200, '{ "foo": "bar" }', headers))
    })

    getProxyConfig('/app/spdzProxyConfig')
      .then(json => {
        expect(json).toEqual({ foo: 'bar' })
        done()
      })
      .catch(err => {
        done.fail(err)
      })
  })

  it('Reads the GUI config and throws an error from /spdzconfig', done => {
    window.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponse(500)))

    getProxyConfig('/app/spdzProxyConfig')
      .then(json => {
        expect(json).toBeFalsy()
        done()
      })
      .catch(err => {
        expect(err.message).toEqual(
          'Unable to read SPDZ proxy config from /app/spdzProxyConfig. Status: 500.'
        )
        done()
      })
  })
})