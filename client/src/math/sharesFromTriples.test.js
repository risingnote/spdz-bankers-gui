//import BigInt from 'big-integer'
import sharesFromTriples from './sharesFromTriples'

const range = (length) => [...Array(length).keys()]

describe('Byte buffers from SPDZ are validated and converted into a share', () => {
  it('rejects if the buffers are not numinputs * 48 bytes in length', () => {
    const byteBufferList = [
      Uint8Array.from(range(96)),
      Uint8Array.from(range(48)),
      Uint8Array.from(range(96))
    ]
    const testShouldThrow = () => sharesFromTriples(2, byteBufferList)

    expect(testShouldThrow).toThrowError('Spdz proxy 1 provided trple with 48 bytes, expected 96.')
  })
  
  it.only('rejects if the triple relation a*b=c is not correct', () => {
    const byteBufferList = [
      Uint8Array.from(range(96)),
      Uint8Array.from(range(96)),
      Uint8Array.from(range(96))
    ]
    const testShouldThrow = () => sharesFromTriples(2, byteBufferList)

    expect(testShouldThrow).toThrowError('Spdz proxy 1 provided 48 bytes, expected 96.')
  })

  it('should add triples together from more than 1 spdz proxy and return the first value', () => {
    const byteBufferList = [
      Uint8Array.from(range(96)),
      Uint8Array.from(range(48)),
      Uint8Array.from(range(96))
    ]
    const testShouldThrow = () => sharesFromTriples(2, byteBufferList)
    
    expect(testShouldThrow).toThrowError('Spdz proxy 1 provided 48 bytes, expected 96.')
  })
})