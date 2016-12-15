import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import BigInt from 'big-integer'

import BankersContainer from './BankersContainer'
import BankersForm from './BankersForm'
import { twoProxiesWith1Connected, twoProxiesWith2Connected } from '../test_support/ProxyServerList'
import Gfp from '../math/Gfp'

// Mock out REST call
jest.mock('../rest_support/SpdzApiHelper')
import { retrieveShares } from '../rest_support/SpdzApiHelper'

describe('Bankers GUI (not wrapped in SetupContainer) rendering and behaviour', () => {
  it('Renders as expected (compared to a snapshot) when proxies are not all connected', () => {
    const tree = renderer.create(
      <BankersContainer allProxiesConnected={false} spdzProxyServerList={twoProxiesWith1Connected}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) when proxies are connected', () => {
    const tree = renderer.create(
      <BankersContainer allProxiesConnected={true} spdzProxyServerList={twoProxiesWith2Connected}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Handles the submission of the bonus', () => {
    retrieveShares.mockImplementation(() => Promise.resolve( [Gfp.fromString('1357', true)] ))

    const wrapper = mount(
      <BankersContainer allProxiesConnected={true} spdzProxyServerList={twoProxiesWith2Connected}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    )

    const form = wrapper.find(BankersForm)
    const input = form.find('[type="text"]') //property selector find
    //Simulate user input followed by click submit
    input.simulate('change', {target: {value: 123}})
    form.simulate('submit')

    expect(retrieveShares.mock.calls.length).toEqual(1)
    expect(retrieveShares.mock.calls[0]).toEqual([1, true, twoProxiesWith2Connected, '/spdzapi', 'a1b2c3d4'])

    //validate send of gfp input 50197844390672583818590000880091071578

    retrieveShares.mockClear()
    //Add asserts when handleSubmitBonus does something
    // expect(mockCallBack).toHaveBeenCalled()
  })
})
