import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { List, Map } from 'immutable'

import BankersGUI from './BankersGUI'

const spdzProxyConfig = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        publicKey: "0102030405060708010203040506070801020304050607080102030405060708", 
        encryptionKey: "AA02030405060708010203040506070801020304050607080102030405060708"
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        publicKey: "3302030405060708010203040506070801020304050607080102030405060708",         
        encryptionKey: "BB02030405060708010203040506070801020304050607080102030405060708"
      })
    )

describe('Bankers GUI display component rendering', () => {
  it('Renders as expected (compared to a snapshot).', () => {

    const tree = renderer.create(
      <BankersGUI spdzProxyServerList={spdzProxyConfig} spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Checks proxy connection status state is set after component mounts', () => {
    
    const wrapper = mount(<BankersGUI spdzProxyServerList={spdzProxyConfig} 
                                      spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'}/>)

    expect(wrapper.state().spdzProxyStatus).toEqual([])
  })

})
