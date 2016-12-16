// Care on this import as it must override builtin Node Buffer global for testing.
// TODO look for alternative base64 from hex encoding - to avoid using nodes Buffer 
import {Buffer} from 'buffer/'
import Gfp from './Gfp'

const padHex = hex => (hex.length % 2 !== 0) ? '0'+hex : hex

/**
 * Convert binary into Gfp type
 * @param {spdzBinary} Uint8Array populated from the spdz proxy (little endian)
 * @param {isMontgomery} Expecting montgomery format, true or false
 * @returns Gfp type
 */
const fromSpdzBinary = (spdzBinary, isMontgomery) => {
  if (!(spdzBinary instanceof Uint8Array)) {
    throw new Error('fromSpdzBinary expects a Uint8Array type.')
  }

  const bufAsHexString = spdzBinary.reverse().reduce((hexString, i) => {
    return hexString + padHex(i.toString(16))
  }, '')

  return Gfp.fromHexString(bufAsHexString, isMontgomery)
}

/**
 * Convert a Gfp type into a base64 encoded string, representing a big endian integer.
 */
const base64Encode = (gfp) => {
  if (!(gfp instanceof Gfp)) {
    throw new Error('base64Encode expects a Gfp type.')
  }
  let hexValue = padHex(gfp.val.toString(16))
  const buf = Buffer.from(hexValue, 'hex')
  return buf.toString('base64')
}

export { fromSpdzBinary, base64Encode }
