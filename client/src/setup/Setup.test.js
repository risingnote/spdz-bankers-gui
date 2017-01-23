import React from 'react'
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
})
