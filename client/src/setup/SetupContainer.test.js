/**
 * Runs full DOM rendering to allow lifecycle methods to be tested.
 */
import React from 'react'
import SetupContainer from './SetupContainer'
import { mount } from 'enzyme'
import MockResponse from '../rest_support/MockResponse'

describe('Setup controller component behaviour', () => {
  it('Loads the setup config from the /spdzProxyConfig endpoint after the component is loaded', () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(MockResponse(200, null, '{"id":"1234"}')));

    const wrapper = mount(<SetupContainer />)

    // TODO Need to return some config and assert on the displayed messages.

    window.fetch.mockClear()
  })
})
