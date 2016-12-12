import React from 'react'
import { List, Map } from 'immutable'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import BankersContainer from './BankersContainer'
import BankersForm from './BankersForm'

describe('Bankers GUI (not wrapped in SetupContainer) rendering and behaviour', () => {
  it('Renders as expected (compared to a snapshot) when proxies are not connected', () => {
    const tree = renderer.create(
      <BankersContainer allProxiesConnected={false} spdzProxyServerList={new List()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) when proxies are connected', () => {
    const tree = renderer.create(
      <BankersContainer allProxiesConnected={true} spdzProxyServerList={new List()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Handles the submission of the bonus', () => {
    //const mockCallBack = jest.fn((e) => {})

    const wrapper = mount(
      <BankersContainer allProxiesConnected={true} spdzProxyServerList={new List()} />
    )

    const form = wrapper.find(BankersForm)
    const input = form.find('[type="text"]') //property selector find
    //Simulate user input followed by click submit
    input.simulate('change', {target: {value: 123}})
    form.simulate('submit')

    //Add asserts when handleSubmitBonus does something
    // expect(mockCallBack).toHaveBeenCalled()
  })
})
