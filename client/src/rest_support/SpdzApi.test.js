import GetProxyConfig from './SpdzApi'
import MockResponse from './MockResponse'

describe('Prove the SpdzApi with mock responses from fetch', () => {
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('Reads the GUI config successfully from /spdzconfig', (done) => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(MockResponse(200, null, '{ "foo": "bar" }'))
    )
  
    GetProxyConfig()
      .then((json) => {
        expect(json).toEqual({"foo": "bar"})
        done()
      })
      .catch((err) => {
        expect(err).toBeFalsy()
        done.fail(err)
      })  
  })
  
  it('Reads the GUI config and throws an error from /spdzconfig', (done) => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(MockResponse(500, 'testing error', null))
    )
  
    GetProxyConfig()
      .then((json) => {
        expect(json).toBeFalsy()
        done()
      })
      .catch((err) => {
        expect(err.message).toEqual('Parsing response from /spdzProxyConfig failed: Status: 500 Message: testing error')
        done()
      })  
  })
})