import { List, Map } from 'immutable'
import sodium from 'libsodium-wrappers'
import { createClientPublicKey, createEncryptionKeys, encrypt, decrypt } from './cryptoLib'
import ProxyStatusCodes from '../setup/ProxyStatusCodes'

describe('Check that crypto functions behaving as expected', () => {
  const spdzProxyServerList = List.of(
    Map({
      url: "http://spdzProxy.one:4000",
      publicKey: "a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8",
      status: ProxyStatusCodes.Disconnected
    }),
    Map({
      url: "http://spdzProxy.two:4000",
      publicKey: "a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b9",
      status: ProxyStatusCodes.Disconnected
    })
  )

  it('Generates a client public key on first use', () => {
    const publicKey = createClientPublicKey()
    const publicKeyAgain = createClientPublicKey()

    expect(publicKey.length).toEqual(64)
    expect(publicKey).toEqual(publicKeyAgain)  
  })

  it('Will not generate session keys if the server key is the wrong format', () => {
    const spdzProxyServerListWithError = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        publicKey: "not a public key",
        status: ProxyStatusCodes.Disconnected
      })
    )

    const functionWithThrow = () => createEncryptionKeys(spdzProxyServerListWithError)
    expect(functionWithThrow).toThrowError(
      'Server public key must be a string of 64 hex characters, given <not a public key>')
  })
  
  it('Will generate session keys', () => {
    const sessionKeys = createEncryptionKeys(spdzProxyServerList)
    expect(sessionKeys.size).toEqual(2)
    expect(sessionKeys.get(0)).not.toEqual(sessionKeys.get(1))
  })

  it('Will encrypt and decrypt binary data', () => {
    createEncryptionKeys(spdzProxyServerList)

    const clearText = Uint8Array.of(1,2,3,4,5,6,7,8,9,0)
    const cipherText = encrypt(0, clearText)
    expect(cipherText.length).toEqual(sodium.crypto_secretbox_MACBYTES + clearText.length + sodium.crypto_secretbox_NONCEBYTES)

    const clearTextRecovered = decrypt(0, cipherText)
    expect(clearTextRecovered).toEqual(clearText)

    //Try again with a hex input string
    const clearTextAsHex = 'a1b2c3d4e5f6'
    const cipherTextAsHex = sodium.to_hex(encrypt(1, clearTextAsHex)) 
    expect( sodium.to_hex(decrypt(1, cipherTextAsHex)) ).toEqual(clearTextAsHex)
  })
  
  it('Will fail if a server encryption key does not exist', () => {
    createEncryptionKeys(spdzProxyServerList)

    const encryptWithThrow = () => encrypt(3, 'a1')
    expect(encryptWithThrow).toThrowError(
      'No encryption key has been generated for Spdz Engine 3, run createEncryptionKeys.')

    const decryptWithThrow = () => decrypt(4, 'a1')
    expect(decryptWithThrow).toThrowError(
      'No encryption key has been generated for Spdz Engine 4, run createEncryptionKeys.')
  })

  it('Will fail if a different encryption/decryption key is used', () => {
    createEncryptionKeys(spdzProxyServerList)

    const wrongKeyThrow = () => decrypt(1, encrypt(0, 'a1'))
    expect(wrongKeyThrow).toThrowError('Authentication/decryption failed.')
  })    
})