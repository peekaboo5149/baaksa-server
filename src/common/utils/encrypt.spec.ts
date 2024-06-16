import { SecurityUtility } from './encrypt'

describe('SecurityUtility', () => {
  it('should hash a string', async () => {
    const plaintext = 'PlainText'
    const hashedText = await SecurityUtility.hash(plaintext)
    expect(hashedText).not.toBe(plaintext)
    expect(hashedText).toMatch(/^\$2[ayb]\$.{56}$/)
  })

  it('should compare a plain string with a hashed string successfully', async () => {
    const plainText = 'mySecretPassword'
    const hashedText = await SecurityUtility.hash(plainText)

    const isMatch = await SecurityUtility.compare(plainText, hashedText)
    expect(isMatch).toBe(true)
  })

  it('should fail to compare a different plain string with a hashed string', async () => {
    const plainText = 'mySecretPassword'
    const hashedText = await SecurityUtility.hash(plainText)

    const isMatch = await SecurityUtility.compare('wrongPassword', hashedText)
    expect(isMatch).toBe(false)
  })

  it('should handle null input for encryption', async () => {
    await expect(SecurityUtility.hash(null)).rejects.toThrow()
  })

  it('should handle empty string input for encryption', async () => {
    const plainText = ''
    const hashedText = await SecurityUtility.hash(plainText)

    expect(hashedText).not.toBe(plainText)
    expect(hashedText).toMatch(/^\$2[ayb]\$.{56}$/)

    const isMatch = await SecurityUtility.compare(plainText, hashedText)
    expect(isMatch).toBe(true)
  })

  //  FIXME: Handle long string
  //   it('should handle comparison of very long strings correctly', async () => {
  //     const plainText = 'a'.repeat(10000) // Very long string
  //     const hashedText = await SecurityUtility.encrypt(plainText)

  //     const isMatch = await SecurityUtility.compare(plainText, hashedText)
  //     expect(isMatch).toBe(true)

  //     const isMatchWrong = await SecurityUtility.compare(
  //       'a'.repeat(9999),
  //       hashedText,
  //     )
  //     expect(isMatchWrong).toBe(false)
  //   })
})
