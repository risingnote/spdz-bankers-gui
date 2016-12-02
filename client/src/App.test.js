import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MockResponse from './rest_support/MockResponse'

it('renders without crashing', () => {
  // Mock out componentDidMount ajax calls
  const exampleConfig = `
        {
          "spdzApiRoot": "/spdzapi",
          "spdzProxyList": []
        }
  `
  window.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve(MockResponse(200, null, exampleConfig))
  )
  
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);

  window.fetch.mockClear()
});
