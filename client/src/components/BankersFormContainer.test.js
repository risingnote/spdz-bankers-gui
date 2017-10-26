import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { SocketIO, Server } from 'mock-socket'
import BankersFormContainer from './BankersFormContainer'
import BankersForm from './BankersForm'
import { noProxiesSpdzConfig, twoProxiesWith1Connected, twoProxiesWith2Connected } from '../test_support/ProxyServerList'

const convertToArray = immutList => immutList.toArray().map( immutableMap => immutableMap.toObject())

// Mock out REST call
jest.mock('spdz-gui-lib/dist/rest_api')
import { sendInputsWithShares } from 'spdz-gui-lib/dist/rest_api'

const mockFn = jest.fn()

describe('Bankers Container rendering and behaviour', () => {
  it('Renders as expected (compared to a snapshot) at start of game', () => {
    const tree = renderer.create(
      <BankersFormContainer updateConnectionStatus={mockFn} changeToDiners={mockFn}
                        spdzProxyServerList={convertToArray(twoProxiesWith1Connected)}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) at start of game, no proxies found', () => {
    const tree = renderer.create(
      <BankersFormContainer updateConnectionStatus={mockFn} changeToDiners={mockFn}
                        spdzProxyServerList={convertToArray(noProxiesSpdzConfig)}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  // Until work out how to include websockets in these tests, just exclude
  xit('Handles the submission of the bonus', () => {
    //Mock out the sockets server
    const mockServer = new Server('http://localhost:3001/diners')
    mockServer.on('joinMeal', (msg, resultCallback) => {
        resultCallback()
    })
    window.io = SocketIO

    sendInputsWithShares.mockImplementation(() => Promise.resolve())

    const wrapper = mount(
      <BankersFormContainer allProxiesConnected={true} spdzProxyServerList={twoProxiesWith2Connected}
                        spdzApiRoot={'/spdzapi'} clientPublicKey={'a1b2c3d4'} />
    )

    const form = wrapper.find(BankersForm)
    const input = form.find('[id="bonusValue"]') //property selector find
    //Simulate user input followed by click submit
    const userInput = 123
    input.simulate('change', {target: {value: userInput}})
    form.simulate('submit')

    expect(sendInputsWithShares.mock.calls.length).toEqual(1)
    expect(sendInputsWithShares.mock.calls[0]).toEqual([[userInput], true, twoProxiesWith2Connected, '/spdzapi', 'a1b2c3d4'])

    sendInputsWithShares.mockClear()
  })
})
