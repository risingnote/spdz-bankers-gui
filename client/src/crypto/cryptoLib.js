/**
 * Manage crypto functions for client.
 * See https://download.libsodium.org/libsodium/content/secret-key_cryptography/authenticated_encryption.html
 */
import sodium from 'libsodium-wrappers'
import assert from 'assert'

let clientKeyPair
let encryptionKeys

/**
 * Creates client key pair on first use.
 * Results are memoized as will have been sent to server and don't want to change.
 * @returns client public key as hex string representing 32 bytes
 */
const createClientPublicKey = ( () => {

  if (clientKeyPair === undefined ) {
    const clientSecretKey = sodium.randombytes_buf(sodium.crypto_box_PUBLICKEYBYTES)
    const clientPublicKey = sodium.crypto_scalarmult_base(clientSecretKey);
    clientKeyPair = { clientSecretKey: clientSecretKey, clientPublicKey: clientPublicKey}
  }
  
  return sodium.to_hex(clientKeyPair.clientPublicKey)
})

/**
 * Derive an encryption shared key from this server's secret key and the client's public key
 *  shared key = hash(q || client_secretkey || server_publickey)
 *  q is scalarmult(client_secretkey, server_publickey)
 */
const generateEncryptionKey = ( (serverPublicKeyHexString) => {
  assert((typeof serverPublicKeyHexString === 'string') && (serverPublicKeyHexString.length === sodium.crypto_box_PUBLICKEYBYTES * 2), 
    `Server public key must be a string of ${sodium.crypto_box_PUBLICKEYBYTES * 2} hex characters, given <${serverPublicKeyHexString}>`)
  const serverPublicKey = sodium.from_hex(serverPublicKeyHexString)

  const sharedSecret = sodium.crypto_scalarmult(clientKeyPair.clientSecretKey, serverPublicKey)

  let stateAddress = sodium.crypto_generichash_init(null, sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash_update(stateAddress, sharedSecret)
  sodium.crypto_generichash_update(stateAddress, clientKeyPair.clientPublicKey)
  sodium.crypto_generichash_update(stateAddress, serverPublicKey)
  return sodium.crypto_generichash_final(stateAddress, sodium.crypto_generichash_BYTES)
})

/**
 * Create encryption keys. Note keys stored in same order as spdzProxyList order.
 * @param {spdzProxyList} Immutable list of Maps with publicKey element (string, 32 bytes hex)
 * @returns Array of Uint8Array encryption keys
 */
const createEncryptionKeys = ( (spdzProxyList) => {
  createClientPublicKey() //Just incase not already run.
  encryptionKeys = spdzProxyList.map( (spdzProxy) => {
    return generateEncryptionKey(spdzProxy.get('publicKey'))
  })
  return encryptionKeys
})

/**
 * Authenticated encryption of message for a spdz server.
 * @param {spdzServerNum} Position of server in list
 * @param {clearMessage} Message bytes to encrypt, can be Uint8Array or hex string
 * @returns ciphermessage as Uint8Array prepended with MAC (16 bytes) and appended with nonce (24 bytes). 
 */
const encrypt = ( (spdzServerNum, clearMessage) => {
  const encryptionKey = encryptionKeys.get(spdzServerNum) 
  assert(encryptionKey !== undefined, 
    `No encryption key has been generated for Spdz Engine ${spdzServerNum}, run createEncryptionKeys.`)

  let message = clearMessage
  if (typeof clearMessage === 'string') {
    message = sodium.from_hex(clearMessage)
  }

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
  const macCipher = sodium.crypto_secretbox_easy(message, nonce, encryptionKey)

  let macCipherNonce = new Uint8Array(macCipher.length + nonce.length)
  macCipherNonce.set(macCipher)
  macCipherNonce.set(nonce, macCipher.length)

  return macCipherNonce
})

/**
 * Authenticated decryption of cipher text.
 * @param {spdzServerNum} Position of server in list
 * @param {cipherMessage} Message comprises, 16 byte mac + cipher text + 24 bytes nonce. Can be Uint8Array or hex string
 * @returns clearMessage as Uint8Array (or throws) 
 */
const decrypt = ( (spdzServerNum, cipherMessage) => {
  const encryptionKey = encryptionKeys.get(spdzServerNum) 
  assert(encryptionKey !== undefined, 
    `No encryption key has been generated for Spdz Engine ${spdzServerNum}, run createEncryptionKeys.`)

  let message = cipherMessage
  if (typeof cipherMessage === 'string') {
    message = sodium.from_hex(cipherMessage)
  }

  assert(message.length >= sodium.crypto_box_NONCEBYTES + sodium.crypto_secretbox_MACBYTES, 
    `The cipher message must be at least ${sodium.crypto_box_NONCEBYTES + sodium.crypto_secretbox_MACBYTES} bytes length.`)

  const nonceStart = message.length - sodium.crypto_box_NONCEBYTES

  try {
    return sodium.crypto_secretbox_open_easy(message.slice(0, nonceStart), message.slice(nonceStart), encryptionKey)
  } catch(err) {
    throw new Error("Authentication/decryption failed.")
  }
})

export { createEncryptionKeys, createClientPublicKey, encrypt, decrypt }