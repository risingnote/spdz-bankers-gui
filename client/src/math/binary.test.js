import BigInt from 'big-integer'
import {fromSpdzBinary, base64Encode} from './binary'
import {Buffer} from 'buffer/'

describe('Map between types when using binary data', () => {
  it('converts a binary payload deserialized into a typed array into a big int value', () => {
    const spdzBinaryValue = Buffer.from([0x22, 0xa3, 0x66, 0x01])

    expect(fromSpdzBinary(spdzBinaryValue)).toEqual(BigInt('23503650'))
  })

  it('converts a big int value into a base64 encoded string', () => {
    const bigIntValue = BigInt('452367')

    expect(base64Encode(bigIntValue)).toEqual('BucP')
  })

  it('throws an error if the wrong type is passed in', () => {
    const testThrowsFromSpdzBinary = () => fromSpdzBinary('501978443')
    const testThrowsBase64Encode = () => base64Encode('501978443')

    expect(testThrowsFromSpdzBinary).toThrowError('fromSpdzBinary expects a Buffer type.')
    expect(testThrowsBase64Encode).toThrowError('base64Encode expects a BigInt type.')
  })
})
