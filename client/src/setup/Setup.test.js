import React from 'react'
import { List } from 'immutable'
import renderer from 'react-test-renderer'

import Setup from './Setup'
import { twoProxiesWith1Connected } from '../test_support/ProxyServerList'

describe('Setup display component rendering', () => {
  it('Renders as expected (compared to a snapshot) when passed properties', () => {

    const tree = renderer.create(
      <Setup setupForRun={() => {}} spdzProxyServerList={twoProxiesWith1Connected} />
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
