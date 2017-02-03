import React from 'react'
import renderer from 'react-test-renderer'

import Connection from './Connection'
import { twoProxiesWith1Connected } from '../test_support/ProxyServerList'

describe('Setup display component rendering', () => {
  it('Renders as expected (compared to a snapshot) when passed properties', () => {

    const tree = renderer.create(
      <Connection spdzProxyServerList={twoProxiesWith1Connected} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
