import { Value } from '@akdasa-studios/framework'

/**
 * Verse Number
 */
export class VerseNumber extends Value<'VerseNumber'> {
  /**
   * Initialize a new instance of VerseNumber class with the given value
   */
  constructor (
    public readonly value: string,
  ) {
    super()
    if (!value) { throw new Error('Verse number cannot be empty') }
  }

  /**
   * Returns a string representation of the verse number
   * @returns String representation of the verse number
   */
  toString(): string {
    return this.value
  }
}
