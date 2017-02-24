import React from 'react'
import renderer from 'react-test-renderer'
import { List, Map } from 'immutable'

import Connection from './Connection'
import ProxyStatusCodes from '../rest_support/ProxyStatusCodes'

const twoProxiesWith1Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        status: ProxyStatusCodes.Failure
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Connected
      })
    )


describe('Setup display component rendering', () => {
  it('Renders as expected (compared to a snapshot) when passed 2 proxy connections', () => {

    const tree = renderer.create(
      <Connection proxyStatusForDisplay={twoProxiesWith1Connected} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) when passed no proxy connections', () => {

    const tree = renderer.create(
      <Connection proxyStatusForDisplay={List()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
