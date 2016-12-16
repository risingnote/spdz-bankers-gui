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

// Mock out REST calls
jest.mock('../rest_support/SpdzApi')
import { getProxyConfig } from'../rest_support/SpdzApi'
jest.mock('../rest_support/SpdzApiAggregate')
import { connectToProxies } from '../rest_support/SpdzApiAggregate'

describe('Setup controller component behaviour', () => {

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
              "publicKey": "a1b2c3d4e5a6b7c8010203040506070801020304050607080102030405060708" 
            }
          ]
        }

  it('Checks state is set after getting /spdzProxyConfig', (done) => {
    
    getProxyConfig.mockImplementation(() => Promise.resolve(exampleJsonConfig))

    // Mount and retrieve nodes doesn't work for stateless components (Setup), 
    // so just render and then check state - not sure about this
    const wrapper = mount(<ComponentUnderTest />)

    //To manage async componentDidMount use timeout
    setTimeout(() => { 
      try {
        expect(wrapper.state().spdzApiRoot).toEqual('/spdzapi')
        expect(wrapper.state().spdzProxyList).toBeInstanceOf(List);
        expect(wrapper.state().spdzProxyList.size).toEqual(2)
        expect(wrapper.state().spdzProxyList.get(0).get('url')).toEqual('http://spdzproxyhere:3001')
        expect(wrapper.state().spdzProxyList.get(1).get('url')).toEqual('http://spdzproxythere:3002')
        expect(wrapper.state().spdzProxyList.get(0).get('encryptionKey').length).toEqual(32)
        expect(wrapper.state().spdzProxyList.get(1).get('encryptionKey').length).toEqual(32)
        done()
      } catch (err) {
        done.fail(err)
      }
    }, 500)

    getProxyConfig.mockClear()
  })

  it('When the setup button is clicked the spdz proxy state is changed.', (done) => {
    getProxyConfig.mockImplementation(() => Promise.resolve(exampleJsonConfig))
    // mock out successful connection for both proxies 
    connectToProxies.mockImplementation(() => Promise.resolve([
      { id: 0, status: 2 },
      { id: 1, status: 2 }
    ]))

    const wrapper = mount(<ComponentUnderTest />)

    //To manage async componentDidMount use timeout
    setTimeout(() => { 
      try {
        //simulate click on connect event
        const btnContainer = wrapper.find('[className="Setup-panel"]')
        expect(btnContainer).toBeDefined()
        const btn = btnContainer.find('button')
        expect(btn).toBeDefined()
        btn.simulate('click')
        
        // Introduce more delays for async state setting to be applied
        setTimeout(() => {
        try {
          // check mock calls
          expect(connectToProxies.mock.calls.length).toEqual(1)
          expect(connectToProxies.mock.calls[0]).toEqual(
            [List.of('http://spdzproxyhere:3001', 'http://spdzproxythere:3002'), '/spdzapi', undefined])

          // check state updated
          expect(wrapper.state().spdzProxyList.size).toEqual(2)
          expect(wrapper.state().spdzProxyList.get(0).get('status')).toEqual(2)
          expect(wrapper.state().spdzProxyList.get(1).get('status')).toEqual(2)

          done()
          } catch (err) {
            done.fail(err)
          }
        }, 500)
          
      } catch (err) {
        done.fail(err)
      }
    }, 500)

    connectToProxies.mockClear()    
  })

})
