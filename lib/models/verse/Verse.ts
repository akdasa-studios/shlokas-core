import { Aggregate, Result, UuidIdentity } from '@akdasa-studios/framework'
import {
  Language, NoText, NoTranslation, Synonym, Text, Translation,
  UnknownLanguage, UnknownVerseNumber, VerseNumber
} from '@lib/models'


/**
 * Verse Identity
 */
export class VerseId extends UuidIdentity<'VerseId'> {}

/**
 * Verse
 */
export class Verse extends Aggregate<VerseId> {
  constructor(
    id: VerseId,
    public readonly number: VerseNumber,
    public readonly language: Language,
    public readonly text: Text,
    public readonly translation: Translation,
    public readonly synonyms: Synonym[],
    public readonly textAudioUri?: string,
    public readonly textImageUri?: string,
  ) {
    super(id)
  }
}

export class VerseBuilder {
  private _id?: VerseId
  private _number: VerseNumber = UnknownVerseNumber
  private _language: Language = UnknownLanguage
  private _text: Text = NoText
  private _translation: Translation = NoTranslation
  private _synonyms: Synonym[] = []
  private _textAudioUri: string
  private _textImageUri: string

  withId(id: VerseId): VerseBuilder {
    this._id = id
    return this
  }

  withNumber(number: VerseNumber): VerseBuilder {
    this._number = number
    return this
  }

  ofLanguage(language: Language): VerseBuilder {
    this._language = language
    return this
  }

  withText(text: Text): VerseBuilder {
    this._text = text
    return this
  }

  withTranslation(translation: Translation): VerseBuilder {
    this._translation = translation
    return this
  }

  withSynonym(word: string, translation: string): VerseBuilder {
    this._synonyms.push(
      new Synonym(word, translation)
    )
    return this
  }

  withTextAudioUri(uri: string): VerseBuilder {
    this._textAudioUri = uri
    return this
  }

  withTextImageUri(uri: string): VerseBuilder {
    this._textImageUri = uri
    return this
  }

  build(): Result<Verse, string> {
    const verse = new Verse(
      this._id || new VerseId(),
      this._number,
      this._language,
      this._text,
      this._translation,
      this._synonyms,
      this._textAudioUri,
      this._textImageUri
    )
    return Result.ok(verse)
  }
}