import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Mock out REST call
jest.mock('./rest_support/SpdzApi')
import GetProxyConfig from'./rest_support/SpdzApi'


it('renders without crashing', () => {
  // Mock out componentDidMount ajax calls
  const exampleConfig = 
        {
          "spdzApiRoot": "/spdzapi",
          "spdzProxyList": []
        }
  
  GetProxyConfig.mockImplementation(() => Promise.resolve(exampleConfig))
  
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);

  GetProxyConfig.mockClear()
});
