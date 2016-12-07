import { createClientPublicKey, generateSessionKey } from './cryptoLib'

describe('Check that crypto functions behaving as expected', () => {
  it('Generates a client public key on first use', () => {
    const publicKey = createClientPublicKey()
    const publicKeyAgain = createClientPublicKey()

    expect(publicKey.length).toEqual(64)
    expect(publicKey).toEqual(publicKeyAgain)  
  })

  it('Will not generates a session key if the server key is the wrong format', () => {
    const functionWithThrow = () => generateSessionKey("some servier public key")
    expect(functionWithThrow).toThrowError(
      'Server public key must be a string of 64 hex characters, given <some servier public key>')
  })
})