import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Mock out REST call
jest.mock('./lib/guiApi')
import { getProxyConfig } from './lib/guiApi'

it('renders without crashing', () => {
  // Mock out componentDidMount ajax calls
  const exampleConfig = 
        {
          "spdzApiRoot": "/spdzapi",
          "spdzProxyList": []
        }
  
  getProxyConfig.mockImplementation(() => Promise.resolve(exampleConfig))
  // createClientPublicKey.mockImplementation(() => "1234567")
  // createEncryptionKey.mockImplementation(() => "abcdef")
  
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);

  getProxyConfig.mockClear()
});
