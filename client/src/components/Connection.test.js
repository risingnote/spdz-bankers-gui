import React from 'react'
import renderer from 'react-test-renderer'
import { List, Map } from 'immutable'
import { ProxyStatusCodes } from 'spdz-gui-lib/dist/rest_api'

import Connection from './Connection'

const twoProxies = List.of(
  Map({
    url: "http://spdzProxy.one:4000"
  }),
  Map({
    url: "http://spdzProxy.two:4000"
  })
)

const status1Connected = [
  {
    id: 0,
    status: ProxyStatusCodes.Failure
  },
  {
    id: 1,
    status: ProxyStatusCodes.Connected
  }
]

describe('Setup display component rendering', () => {
  it('Renders as expected (compared to a snapshot) when passed 2 proxy connections', () => {

    const tree = renderer.create(
      <Connection spdzProxyServerList={twoProxies} spdzProxyStatus={status1Connected}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) when passed no proxy connections', () => {

    const tree = renderer.create(
      <Connection spdzProxyServerList={List()} spdzProxyStatus={[]}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
