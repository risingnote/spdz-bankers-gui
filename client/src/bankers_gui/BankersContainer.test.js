import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import BankersContainer from './BankersContainer'
import BankersForm from './BankersForm'
import { twoProxiesWith1Connected, twoProxiesWith2Connected } from '../test_support/ProxyServerList'

// Mock out REST call
jest.mock('../rest_support/SpdzApiHelper')
import { sendInputsWithShares } from '../rest_support/SpdzApiHelper'

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
    sendInputsWithShares.mockImplementation(() => Promise.resolve())

    const wrapper = mount(
      <BankersContainer allProxiesConnected={true} spdzProxyServerList={twoProxiesWith2Connected}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    )

    const form = wrapper.find(BankersForm)
    const input = form.find('[type="text"]') //property selector find
    //Simulate user input followed by click submit
    const userInput = 123
    input.simulate('change', {target: {value: userInput}})
    form.simulate('submit')

    expect(sendInputsWithShares.mock.calls.length).toEqual(1)
    expect(sendInputsWithShares.mock.calls[0]).toEqual([[userInput], true, twoProxiesWith2Connected, '/spdzapi', 'a1b2c3d4'])

    sendInputsWithShares.mockClear()
  })
})
