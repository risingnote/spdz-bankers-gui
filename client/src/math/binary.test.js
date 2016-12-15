import BigInt from 'big-integer'
import Gfp from './Gfp'
import {fromSpdzBinary, base64Encode} from './binary'

describe('Map between types when using binary data', () => {
  it('converts a binary payload deserialized into a typed array into a big int value', () => {
    const spdzBinaryValue = Uint8Array.from([0x22, 0xa3, 0x66, 0x01])

    expect(fromSpdzBinary(spdzBinaryValue)).toEqual(new Gfp(BigInt('23503650'), false))
  })

  it('converts a big int value into a base64 encoded string', () => {
    const gfp = new Gfp(BigInt('452367'))

    expect(base64Encode(gfp)).toEqual('BucP')
  })

  it('throws an error if the wrong type is passed in', () => {
    const testThrowsFromSpdzBinary = () => fromSpdzBinary('501978443')
    const testThrowsBase64Encode = () => base64Encode('501978443')

    expect(testThrowsFromSpdzBinary).toThrowError('fromSpdzBinary expects a Uint8Array type.')
    expect(testThrowsBase64Encode).toThrowError('base64Encode expects a Gfp type.')
  })
})
