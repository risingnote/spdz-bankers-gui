import BigInt from 'big-integer'
import {fromSpdzBinary, base64Encode} from './binary'

describe('Map between types when using binary data', () => {
  it('converts a binary payload deserialized into a typed array into a big int value', () => {
    const spdzBinaryValue = new Uint8Array([0x22, 0xa3, 0x66, 0x01])

    expect(fromSpdzBinary(spdzBinaryValue)).toEqual(BigInt('23503650'))
  })

  it('converts a big int value into a base64 encoded string', () => {
    const bigIntValue = BigInt('452367')

    expect(base64Encode(bigIntValue)).toEqual('BucP')
  })
})
