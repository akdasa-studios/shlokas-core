import { Settings } from '@lib/app/Settings'
import { Language } from '@lib/models'

describe('Settings', () => {
  const settings = new Settings()

  describe('language', () => {
    it('should change language', () => {
      settings.changeLanguage(new Language('rs', 'Serbian'))
      expect(settings.language.code).toEqual('rs')
      expect(settings.language.name).toEqual('Serbian')
    })
  })
})