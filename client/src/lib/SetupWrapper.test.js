/**
 * Runs full DOM rendering to allow lifecycle methods to be tested.
 */
import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'
import renderer from 'react-test-renderer'

import SetupWrapper from './SetupWrapper'

// As this is a higher order component, need to execute function with dummy GUI component.
const ComponentUnderTest = SetupWrapper(
  class Dummy extends React.Component {
    render() {
      return <div>Dummy component</div>
    }
  })

// Mock out REST call
jest.mock('./guiApi')
import { getProxyConfig } from './guiApi'

jest.mock('spdz-gui-lib/dist/crypto')
import { createClientPublicKey, createEncryptionKey } from 'spdz-gui-lib/dist/crypto'

beforeEach(() => {
  getProxyConfig.mockImplementation(() => Promise.resolve(
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
  ))
  createClientPublicKey.mockImplementation(() => '900fac89aaeb349c657a60354b2edc47ce56e1dc6c50580bbf815b2753a10014')
  createEncryptionKey.mockImplementation(() => '900fac89aaeb349c657a60354b2edc47ce56e1dc6c50580bbf815b2753a10014')
})

afterEach(() => {
  getProxyConfig.mockClear()
  createClientPublicKey.mockClear()
  createEncryptionKey.mockClear()
})

describe('Setup container behaviour', () => {

  it('Checks state is set after getting /spdzProxyConfig', (done) => {

    // Mount and retrieve nodes doesn't work for stateless components (Connection), 
    // so just render and then check state - not sure about this
    const wrapper = mount(<ComponentUnderTest />)

    //To manage async componentDidMount use timeout
    setTimeout(() => { 
      try {
        expect(wrapper.state().spdzApiRoot).toEqual('/spdzapi')
        expect(wrapper.state().clientPublicKey).toEqual('900fac89aaeb349c657a60354b2edc47ce56e1dc6c50580bbf815b2753a10014')
        expect(wrapper.state().spdzProxyList).toBeInstanceOf(List);
        expect(wrapper.state().spdzProxyList.size).toEqual(2)
        expect(wrapper.state().spdzProxyList.get(0).get('url')).toEqual('http://spdzproxyhere:3001')
        expect(wrapper.state().spdzProxyList.get(1).get('url')).toEqual('http://spdzproxythere:3002')
        expect(wrapper.state().spdzProxyList.get(0).get('publicKey')).toEqual('0102030405060708010203040506070801020304050607080102030405060708')
        expect(wrapper.state().spdzProxyList.get(1).get('publicKey')).toEqual('a1b2c3d4e5a6b7c8010203040506070801020304050607080102030405060708')
        expect(wrapper.state().spdzProxyList.get(0).get('encryptionKey').length).toEqual(64)
        expect(wrapper.state().spdzProxyList.get(1).get('encryptionKey').length).toEqual(64)
        done()
      } catch (err) {
        done.fail(err)
      }
    }, 500)
  })

  it('Passes properties through to wrapped component', () => {
    
    const ComponentShowProps = SetupWrapper(
      class Dummy extends React.Component {
        render() {
          return <div>
            <div id='passthrough'>{this.props.passThrough}</div>
            <div id='spdzProxyServerList'></div>
            <div id='spdzApiRoot'>{this.props.spdzApiRoot}</div>
            <div id='clientPublicKey'>{this.props.clientPublicKey}</div>
          </div>
        }
      })

    const tree = renderer.create(
      <ComponentShowProps passThrough='hijomio'/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

})
