import React from 'react'
import { List, Map } from 'immutable'
import renderer from 'react-test-renderer'

import Setup from './Setup'
import ProxyStatusCodes from './ProxyStatusCodes'

describe('Setup display component rendering', () => {
  it('Renders as expected (compared to a snapshot) when passed properties', () => {
    const spdzProxyServerList = List.of(
      Map({
        "url": "http://spdzProxy.one:4000",
        "status": ProxyStatusCodes.Disconnected
      }),
      Map({
        "url": "http://spdzProxy.two:4000",
        "status": ProxyStatusCodes.Connected
      })
    )

    const tree = renderer.create(
      <Setup setupForRun={() => {}} spdzProxyServerList={spdzProxyServerList} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Executes the call back when the setup button is clicked', () => {
    //Need to use 
    const mockCallBack = jest.fn((e) => {})

    const tree = renderer.create(
      <Setup setupForRun={mockCallBack} spdzProxyServerList={List()} />
    ).toJSON()

    let button = tree.children.find((element) => {return (element['type'] === 'button')})

    button.props.onClick()
    expect(mockCallBack).toHaveBeenCalled()
  })
})
