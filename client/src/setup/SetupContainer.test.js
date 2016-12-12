/**
 * Runs full DOM rendering to allow lifecycle methods to be tested.
 */
import React from 'react'
import SetupContainer from './SetupContainer'
import { mount } from 'enzyme'
import { List } from 'immutable'

// As this is a higher order component, need to execute function with dummy GUI component.
const ComponentUnderTest = SetupContainer(
  class Dummy extends React.Component {
    render() {
      return <div>Dummy component not important</div>
    }
  })

// Mock out REST call
jest.mock('../rest_support/SpdzApi')
import { getProxyConfig } from'../rest_support/SpdzApi'

describe('Setup controller component behaviour', () => {

  it('Checks state is set after getting /spdzProxyConfig', (done) => {
    const exampleJsonConfig = 
          {
            "spdzApiRoot": "/spdzapi",
            "spdzProxyList": [
              {
                "url": "http://spdzproxyhere:3001",
                "publicKey": "0102030405060708010203040506070801020304050607080102030405060708" 
              },
              {
                "url": "http://spdzproxythere:3002",
                "publicKey": "a1b2c3f4g5a6b7c8010203040506070801020304050607080102030405060708" 
              }
            ]
          }
    
    getProxyConfig.mockImplementation(() => Promise.resolve(exampleJsonConfig))

    // Mount and retrieve nodes doesn't work for stateless components (Setup), 
    // so just render and then check state
    const wrapper = mount(<ComponentUnderTest />)

    //To manage async componentDidMount use timeout
    setTimeout(() => { 
      try {
        expect(wrapper.state().spdzApiRoot).toEqual('/spdzapi')
        expect(wrapper.state().spdzProxyList).toBeInstanceOf(List);
        expect(wrapper.state().spdzProxyList.size).toEqual(2)
        expect(wrapper.state().spdzProxyList.get(0).get('url')).toEqual('http://spdzproxyhere:3001')
        expect(wrapper.state().spdzProxyList.get(1).get('url')).toEqual('http://spdzproxythere:3002')
        done()
      } catch (err) {
        done.fail(err)
      }
    }, 500)

    getProxyConfig.mockClear()
  })
})
