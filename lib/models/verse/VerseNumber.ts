import { Result, Value } from '@akdasa-studios/framework/domain/models'

/**
 * Verse Number
 */
export class VerseNumber extends Value<'VerseNumber'> {
  /**
   * Initialize a new instance of VerseNumber class with the given sections
   */
  constructor (
    public readonly sections: string[],
  ) {
    super()
    if (sections.length <= 0) { throw new Error('sections must contain at least one section') }
    if (sections.some((section) => !section)) { throw new Error('sections must not contain empty sections') }
  }

  /**
   * Returns the verse number as a string
   * @returns String representation of the verse number
   */
  toString(): string {
    // returns index of the first number in the sections array
    const firstNumberSectionIndex = this.sections.findIndex((section) => !isNaN(Number(section)))

    // get text part and number parts of the verse number
    const textPart = this.sections.slice(0, firstNumberSectionIndex).join(' ')
    const numberPart = this.sections.slice(firstNumberSectionIndex).join('.')

    // return the text part and number part separated by a space
    return (textPart + ' ' + numberPart).trim()
  }
}

export class VerseNumberBuilder  {
  private _sections: string[] = []

  fromString(verseNumber: string): VerseNumberBuilder {
    this._sections = verseNumber.split(/ |\./)
    return this
  }

  build(): Result<VerseNumber, string> {
    return Result.ok(new VerseNumber(this._sections))
  }
}

export const UnknownVerseNumber = new VerseNumber(['??', '??'])