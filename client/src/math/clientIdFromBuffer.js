// Given a list of Uint8Array buffers, convert each from 8 little endian 4 byte ints => byte array => hex string
// If all are the same then return a single value, otherwise throw an exception
// Probably not the best place for this, need a library of type mappings.

import {binaryToHex} from './binary'

/**
 * Client ids should be supplied as 16 byte numbers so validate length of all spdz engine triples
 */
const checkBufferLength = ( byteBufferList => {
  const wrongLengthMsgs = byteBufferList.map((byteBuffer, index) => {
    return (byteBuffer.length === 32 ? '' :
      `Spdz proxy ${index} provided client id with ${byteBuffer.length} bytes, expected 32.`)
  })
  return wrongLengthMsgs.filter( message => message.length > 0).join('\n')
})

/**
 * Validate byteBufferList and reconstruct hex public key used for client identity.
 * @returns public key as hex string
 */
const clientIdFromBuffer = ( byteBufferList => {

  const chkBufLengthMessage = checkBufferLength(byteBufferList)
  if (chkBufLengthMessage.length > 0) {
    throw new Error(chkBufLengthMessage)
  }

  const hexBufferList = byteBufferList.map( byteBuffer => {
    // Read through buffer, reversing each 4 bytes (little endian integer -> big endian)
    for (let i=0; i<32; i+=4) {
      const revArray = byteBuffer.slice(i, i+4).reverse()
      byteBuffer.set(revArray, i)
    }
    return binaryToHex(byteBuffer)
  })

  // Expect all values to be the same, so check
  const allSame = !!hexBufferList.reduce((a,b) => {return (a===b) ? a : NaN})
  if (!allSame) {
    throw new Error('Not all parties agree on the answer!!')
  }

  return hexBufferList[0]
})

export default clientIdFromBuffer