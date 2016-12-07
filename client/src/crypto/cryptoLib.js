/**
 * Manage crypto functions for a client.
 * See https://download.libsodium.org/libsodium/content/advanced/scalar_multiplication.html
 */
import sodium from 'libsodium-wrappers'
import assert from 'assert'

let clientKeyPair

/**
 * Creates client key pair on first use.
 * @returns client public key as hex string representing 32 bytes
 */
const createClientPublicKey = ( () => {

  if (typeof clientKeyPair === 'undefined' ) {
    const clientSecretKey = sodium.randombytes_buf(sodium.crypto_box_PUBLICKEYBYTES)
    const clientPublicKey = sodium.crypto_scalarmult_base(clientSecretKey);
    clientKeyPair = { clientSecretKey: clientSecretKey, clientPublicKey: clientPublicKey}
  }
  
  return sodium.to_hex(clientKeyPair.clientPublicKey)
})

const generateSessionKey = ( (serverPublicKeyHexString) => {
  assert((typeof serverPublicKeyHexString === String) && (serverPublicKeyHexString.length === sodium.crypto_box_PUBLICKEYBYTES * 2), 
    `Server public key must be a string of 64 hex characters, given <${serverPublicKeyHexString}>`)
  const serverPublicKey = sodium.from_hex(serverPublicKeyHexString)

   // Derive a shared key from this server's secret key and the client's public key
  // shared key = h(q || client_secretkey || server_publickey)

  // crypto_scalarmult(scalarmult_q, client_secretkey, server_publickey)
  // crypto_generichash_init(&h, NULL, 0U, crypto_generichash_BYTES);
  // crypto_generichash_update(&h, scalarmult_q, sizeof scalarmult_q);
  // crypto_generichash_update(&h, client_publickey, sizeof client_publickey);
  // crypto_generichash_update(&h, server_publickey, sizeof server_publickey);
  // crypto_generichash_final(&h, keys[i], crypto_generichash_BYTES);

  const sharedSecret = sodium.crypto_scalarmult(clientKeyPair.clientSecretKey, serverPublicKey)

  let stateAddress = sodium.crypto_generichash_init(null, sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash_update(stateAddress, sharedSecret)

  return stateAddress
})

export { generateSessionKey, createClientPublicKey }