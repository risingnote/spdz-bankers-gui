import React from 'react'
import Setup from './Setup'
import renderer from 'react-test-renderer'

describe('Setup display component rendering', () => {
  it('Renders as expected (compared to a snapshot) when passed properties', () => {
    const spdzProxyServerList = [
      {
      "key": "1",
      "url": "http://spdzProxy.one:4000",
      "status": "notconnected"
      },
      {
      "key": "2",        
      "url": "http://spdzProxy.two:4000",
      "status": "notconnected"
      }
    ]
    const tree = renderer.create(
      <Setup setupForRun={() => {}} spdzProxyServerList={spdzProxyServerList} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Executes the call back when the setup button is clicked', () => {
    const mockCallBack = jest.fn((e) => {})

    const tree = renderer.create(
      <Setup setupForRun={mockCallBack} spdzProxyServerList={[]} />
    ).toJSON()

    let button = tree.children.find((element) => {return (element['type'] === 'button')})

    button.props.onClick()
    expect(mockCallBack).toHaveBeenCalled()
  })
})
