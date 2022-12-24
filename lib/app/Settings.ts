import { Language } from '@lib/models'


export class Settings {
  private _language: Language = new Language('en', 'English')

  get language() : Language {
    return this._language
  }

  changeLanguage(lang: Language) {
    this._language = lang
  }
}